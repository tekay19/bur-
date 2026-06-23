import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import { hasDatabase, prisma } from "./db/prisma";

// ============================================================
// Hafif e-posta+şifre kimlik doğrulama (Google yok, harici servis yok).
// - Şifre: scrypt + tuz (Node crypto)
// - Oturum: HS256 imzalı JWT, httpOnly çerez (sid)
// DATABASE_URL yoksa bellek yedeği kullanılır (geliştirme).
// ============================================================

const RAW_SECRET = process.env.SESSION_SECRET ?? process.env.AUTH_SECRET;
const IS_PROD = process.env.NODE_ENV === "production";

// Üretimde oturum sırrı ZORUNLU. Build'i kırmamak için import anında değil,
// ilk oturum üretimi/doğrulamasında sert şekilde devreye girer (fail-fast):
// - signSession: sır yoksa istisna fırlatır (login/register başarısız olur).
// - verifySession: sır yoksa tüm oturumları reddeder (forge'a karşı güvenli).
if (!RAW_SECRET && IS_PROD) {
  console.error(
    "KRİTİK GÜVENLİK: SESSION_SECRET (veya AUTH_SECRET) üretimde tanımlı değil. " +
      "Oturum imzalama güvensiz; tüm oturumlar reddedilecek. Ortam değişkenini ayarla.",
  );
}

const SECRET = RAW_SECRET ?? "dev-insecure-secret-change-in-production";
// Üretimde gerçek bir sır yoksa oturumlar güvenilmez sayılır.
const SECRET_OK = Boolean(RAW_SECRET) || !IS_PROD;

export const SID_COOKIE = "sid";
export const SID_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 gün
};

export const WELCOME_BONUS = 1; // üye olunca hediye analiz

export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
}

// --- Şifre ---
export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const dk = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${dk}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
  // Aşırı uzun parolayla scrypt-DoS'a karşı savunma (gerçek parolalar <=200).
  if (pw.length > 1024) return false;
  const [salt, dk] = stored.split(":");
  if (!salt || !dk) return false;
  const calc = scryptSync(pw, salt, 64);
  const a = Buffer.from(dk, "hex");
  return a.length === calc.length && timingSafeEqual(a, calc);
}

// Kullanıcı bulunamadığında bile scrypt çalıştırıp SABİT-ZAMANLI davranmak
// için kukla hash. Login'de "kullanıcı var mı?" timing sızıntısını kapatır.
export const DUMMY_PASSWORD_HASH = hashPassword(randomBytes(16).toString("hex"));

// --- Oturum (JWT HS256) ---
function b64url(s: string): string {
  return Buffer.from(s).toString("base64url");
}

export function signSession(uid: string): string {
  if (!SECRET_OK) {
    throw new Error(
      "SESSION_SECRET tanımlı değil — güvenli oturum üretilemiyor.",
    );
  }
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Date.now() + SID_COOKIE_OPTS.maxAge * 1000;
  const body = b64url(JSON.stringify({ uid, exp }));
  const data = `${header}.${body}`;
  const sig = createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifySession(token: string | undefined): string | null {
  // Üretimde gerçek sır yoksa hiçbir oturuma güvenme (forge edilmiş olabilir).
  if (!token || !SECRET_OK) return null;
  try {
    const [h, b, s] = token.split(".");
    if (!h || !b || !s) return null;
    const expected = createHmac("sha256", SECRET)
      .update(`${h}.${b}`)
      .digest("base64url");
    if (s !== expected) return null;
    const payload = JSON.parse(Buffer.from(b, "base64url").toString());
    if (!payload.uid || (payload.exp && Date.now() > payload.exp)) return null;
    return payload.uid as string;
  } catch {
    return null;
  }
}

// --- Kullanıcı deposu (Prisma + bellek yedeği) ---
interface MemUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  credits: number;
  plan: string;
}
const memUsers = new Map<string, MemUser>(); // key: email

const toPublic = (u: {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
}): PublicUser => ({
  id: u.id,
  email: u.email,
  name: u.name,
  credits: u.credits,
  plan: u.plan,
});

export async function findUserByEmail(email: string): Promise<MemUser | null> {
  const e = email.toLowerCase().trim();
  if (hasDatabase && prisma) {
    const u = await prisma.user.findUnique({ where: { email: e } });
    return u
      ? {
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash,
          name: u.name,
          credits: u.credits,
          plan: u.plan,
        }
      : null;
  }
  return memUsers.get(e) ?? null;
}

export async function getUserById(id: string): Promise<PublicUser | null> {
  if (hasDatabase && prisma) {
    const u = await prisma.user.findUnique({ where: { id } });
    return u ? toPublic(u) : null;
  }
  for (const u of memUsers.values()) if (u.id === id) return toPublic(u);
  return null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  name: string | null,
  startingCredits: number,
): Promise<PublicUser> {
  const e = email.toLowerCase().trim();
  if (hasDatabase && prisma) {
    const u = await prisma.user.create({
      data: { email: e, passwordHash, name, credits: startingCredits },
    });
    return toPublic(u);
  }
  const u: MemUser = {
    id: "u" + randomBytes(8).toString("hex"),
    email: e,
    passwordHash,
    name,
    credits: startingCredits,
    plan: "free",
  };
  memUsers.set(e, u);
  return toPublic(u);
}

// Şifreyi güncelle (şifre sıfırlama akışı). updateMany: kullanıcı yoksa
// fırlatmaz (spend/refund/addCredits ile tutarlı davranış).
export async function setUserPassword(
  id: string,
  passwordHash: string,
): Promise<boolean> {
  if (hasDatabase && prisma) {
    const res = await prisma.user.updateMany({
      where: { id },
      data: { passwordHash },
    });
    return res.count > 0;
  }
  for (const u of memUsers.values())
    if (u.id === id) {
      u.passwordHash = passwordHash;
      return true;
    }
  return false;
}

export async function spendUserCredit(id: string): Promise<boolean> {
  if (hasDatabase && prisma) {
    const res = await prisma.user.updateMany({
      where: { id, credits: { gt: 0 } },
      data: { credits: { decrement: 1 }, totalSpent: { increment: 1 } },
    });
    return res.count > 0;
  }
  for (const u of memUsers.values())
    if (u.id === id && u.credits > 0) {
      u.credits -= 1;
      return true;
    }
  return false;
}

// Analiz başarısız olursa harcanan krediyi geri ver (totalSpent de geri alınır).
export async function refundUserCredit(id: string): Promise<void> {
  if (hasDatabase && prisma) {
    await prisma.user.updateMany({
      where: { id },
      data: { credits: { increment: 1 }, totalSpent: { decrement: 1 } },
    });
    return;
  }
  for (const u of memUsers.values())
    if (u.id === id) {
      u.credits += 1;
      return;
    }
}

export async function addUserCredits(
  id: string,
  n: number,
): Promise<number> {
  if (hasDatabase && prisma) {
    // updateMany: kullanıcı yoksa fırlatmaz (spend/refund ile tutarlı davranır).
    const res = await prisma.user.updateMany({
      where: { id },
      data: { credits: { increment: n }, totalPurchased: { increment: n } },
    });
    if (res.count === 0) return 0;
    const u = await prisma.user.findUnique({ where: { id } });
    return u?.credits ?? 0;
  }
  for (const u of memUsers.values())
    if (u.id === id) {
      u.credits += n;
      return u.credits;
    }
  return 0;
}
