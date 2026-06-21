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

const SECRET =
  process.env.SESSION_SECRET ??
  process.env.AUTH_SECRET ??
  "dev-insecure-secret-change-in-production";

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
  const [salt, dk] = stored.split(":");
  if (!salt || !dk) return false;
  const calc = scryptSync(pw, salt, 64);
  const a = Buffer.from(dk, "hex");
  return a.length === calc.length && timingSafeEqual(a, calc);
}

// --- Oturum (JWT HS256) ---
function b64url(s: string): string {
  return Buffer.from(s).toString("base64url");
}

export function signSession(uid: string): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Date.now() + SID_COOKIE_OPTS.maxAge * 1000;
  const body = b64url(JSON.stringify({ uid, exp }));
  const data = `${header}.${body}`;
  const sig = createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifySession(token: string | undefined): string | null {
  if (!token) return null;
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

export async function addUserCredits(
  id: string,
  n: number,
): Promise<number> {
  if (hasDatabase && prisma) {
    const u = await prisma.user.update({
      where: { id },
      data: { credits: { increment: n }, totalPurchased: { increment: n } },
    });
    return u.credits;
  }
  for (const u of memUsers.values())
    if (u.id === id) {
      u.credits += n;
      return u.credits;
    }
  return 0;
}
