import { createHash, randomBytes } from "crypto";
import { hasDatabase, prisma } from "./db/prisma";

// ============================================================
// Şifre sıfırlama token'ları.
// - Ham token (32 bayt hex) yalnızca e-posta linkinde döner.
// - DB'de sha256 HASH saklanır (sızıntıda token kullanılamaz).
// - Tek kullanımlık + 60 dk süreli; tüketince kullanıcının diğer
//   token'ları da iptal edilir.
// - DATABASE_URL yoksa bellek yedeği (geliştirme), auth.ts/credits.ts kalıbı.
// ============================================================

export const RESET_TTL_MS = 60 * 60_000; // 60 dakika

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

interface MemToken {
  tokenHash: string;
  userId: string;
  expiresAt: number; // epoch ms
  usedAt: number | null;
}
const mem = new Map<string, MemToken>(); // key: tokenHash

// Yeni token üret; eski (kullanılmamış) token'ları geçersiz kıl; ham token dön.
export async function createResetToken(userId: string): Promise<string> {
  const raw = randomBytes(32).toString("hex");
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + RESET_TTL_MS);

  if (hasDatabase && prisma) {
    // Aynı kullanıcının önceki token'larını temizle (tek aktif token kalsın).
    await prisma.passwordResetToken.deleteMany({ where: { userId } });
    await prisma.passwordResetToken.create({
      data: { tokenHash, userId, expiresAt },
    });
    return raw;
  }

  for (const [k, t] of mem) if (t.userId === userId) mem.delete(k);
  mem.set(tokenHash, {
    tokenHash,
    userId,
    expiresAt: expiresAt.getTime(),
    usedAt: null,
  });
  return raw;
}

// Token'ı tüket: geçerliyse kullanıldı işaretle ve userId dön; değilse null.
// updateMany'in koşullu güncellemesi tek-kullanımı atomik yapar (yarış yok).
export async function consumeResetToken(raw: string): Promise<string | null> {
  const tokenHash = hashToken(raw);

  if (hasDatabase && prisma) {
    const now = new Date();
    const upd = await prisma.passwordResetToken.updateMany({
      where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });
    if (upd.count === 0) return null; // yok / kullanılmış / süresi dolmuş
    const rec = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
    if (!rec) return null;
    // Bu kullanıcının kalan tüm token'larını iptal et.
    await prisma.passwordResetToken.deleteMany({
      where: { userId: rec.userId, NOT: { id: rec.id } },
    });
    return rec.userId;
  }

  const t = mem.get(tokenHash);
  if (!t || t.usedAt !== null || t.expiresAt <= Date.now()) return null;
  t.usedAt = Date.now();
  for (const [k, other] of mem)
    if (other.userId === t.userId && k !== tokenHash) mem.delete(k);
  return t.userId;
}
