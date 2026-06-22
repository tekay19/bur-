import { randomBytes, randomUUID } from "crypto";
import { hasDatabase, prisma } from "./db/prisma";
import { CREDIT_PACKS } from "./creditPacks";

export { CREDIT_PACKS };

// ============================================================
// Üyeliksiz kredi sistemi (anonim çerez "aid" ile).
// - Yeni ziyaretçi FREE_CREDITS kadar ücretsiz analiz hakkı alır.
// - Her analiz 1 kredi harcar.
// - DATABASE_URL yoksa bellek-içi yedek kullanılır (geliştirme).
// - Kurtarma kodu: çerez silinirse krediyi geri yüklemek için.
// ============================================================

export const FREE_CREDITS = 1;

export const AID_COOKIE = "aid";
export const AID_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 yıl
};


export interface Account {
  id: string;
  credits: number;
  recoveryCode: string;
}

// Bellek yedeği (DB yoksa)
const mem = new Map<string, Account>();

export function newAnonId(): string {
  return randomUUID();
}

function newRecoveryCode(): string {
  // ~80 bit entropi (20 hex). Kurtarma kodu, krediyi taşıyan bir "bearer"
  // sırrıdır: kısa/okunaklı tutmak enumerasyonla kredi çalınmasına yol açar.
  // Kod makinede saklanıp kopyalandığı için uzunluk sorun değil.
  return `ASTRO-${randomBytes(10).toString("hex").toUpperCase()}`;
}

export async function getOrCreateAccount(aid: string): Promise<Account> {
  if (hasDatabase && prisma) {
    const existing = await prisma.creditAccount.findUnique({ where: { id: aid } });
    if (existing) {
      return {
        id: existing.id,
        credits: existing.credits,
        recoveryCode: existing.recoveryCode,
      };
    }
    const created = await prisma.creditAccount.create({
      data: { id: aid, credits: FREE_CREDITS, recoveryCode: newRecoveryCode() },
    });
    return {
      id: created.id,
      credits: created.credits,
      recoveryCode: created.recoveryCode,
    };
  }

  let acc = mem.get(aid);
  if (!acc) {
    acc = { id: aid, credits: FREE_CREDITS, recoveryCode: newRecoveryCode() };
    mem.set(aid, acc);
  }
  return acc;
}

// Misafir hesabının kredisini ATOMİK olarak al ve hesabı 0'a çek.
// Üyeliğe geçişte krediyi "kopyala" değil "taşı": aynı kredi hem üyede hem
// misafirde sayılmaz (logout sonrası çift harcama vektörünü kapatır).
// Transaction sayesinde eşzamanlı çift-kopyalama penceresi de kapanır.
export async function claimAccountCredits(aid: string): Promise<number> {
  if (hasDatabase && prisma) {
    return prisma.$transaction(async (tx) => {
      const acc = await tx.creditAccount.findUnique({ where: { id: aid } });
      if (!acc || acc.credits <= 0) return 0;
      await tx.creditAccount.update({
        where: { id: aid },
        data: { credits: 0 },
      });
      return acc.credits;
    });
  }
  const acc = mem.get(aid);
  if (!acc || acc.credits <= 0) return 0;
  const c = acc.credits;
  acc.credits = 0;
  return c;
}

// 1 kredi harca (yeterli değilse false)
export async function spendOne(aid: string): Promise<boolean> {
  if (hasDatabase && prisma) {
    // Atomik: yalnızca credits > 0 ise düş
    const res = await prisma.creditAccount.updateMany({
      where: { id: aid, credits: { gt: 0 } },
      data: { credits: { decrement: 1 }, totalSpent: { increment: 1 } },
    });
    return res.count > 0;
  }
  const acc = mem.get(aid);
  if (!acc || acc.credits <= 0) return false;
  acc.credits -= 1;
  return true;
}

// Analiz başarısız olursa harcanan krediyi geri ver (totalSpent de geri alınır).
export async function refundOne(aid: string): Promise<void> {
  if (hasDatabase && prisma) {
    await prisma.creditAccount.updateMany({
      where: { id: aid },
      data: { credits: { increment: 1 }, totalSpent: { decrement: 1 } },
    });
    return;
  }
  const acc = mem.get(aid);
  if (acc) acc.credits += 1;
}

export async function addCredits(aid: string, n: number): Promise<number> {
  if (hasDatabase && prisma) {
    const updated = await prisma.creditAccount.update({
      where: { id: aid },
      data: { credits: { increment: n }, totalPurchased: { increment: n } },
    });
    return updated.credits;
  }
  const acc = await getOrCreateAccount(aid);
  acc.credits += n;
  return acc.credits;
}

// Kurtarma kodundan hesabı bul (çerez geri yükleme)
export async function findByRecoveryCode(code: string): Promise<Account | null> {
  const c = code.trim().toUpperCase();
  if (hasDatabase && prisma) {
    const acc = await prisma.creditAccount.findUnique({
      where: { recoveryCode: c },
    });
    return acc
      ? { id: acc.id, credits: acc.credits, recoveryCode: acc.recoveryCode }
      : null;
  }
  for (const acc of mem.values()) if (acc.recoveryCode === c) return acc;
  return null;
}
