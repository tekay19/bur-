import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================================
// Hafif, bağımlılıksız hız sınırlayıcı (in-memory, sabit pencere).
//
// NOT: Serverless'te (Vercel) bellek örnekler arasında PAYLAŞILMAZ ve
// cold-start'ta sıfırlanır. Bu yüzden bu sınırlayıcı tek-instance koruması
// ve naif saldırıları yavaşlatma seviyesindedir. Çok-instance üretimde
// aynı arayüzü koruyarak Upstash Redis (@upstash/ratelimit) ile değiştir.
// ============================================================

interface Bucket {
  count: number;
  resetAt: number; // epoch ms
}

// HMR'de (dev) haritanın sıfırlanmaması için globalThis üzerinde tut.
const g = globalThis as unknown as {
  __rateLimitStore?: Map<string, Bucket>;
  __rateLimitSweep?: number;
};
const store: Map<string, Bucket> = g.__rateLimitStore ?? new Map();
g.__rateLimitStore = store;

// Bellek sızıntısını önlemek için süresi dolmuş kovaları ara sıra temizle.
function sweep(now: number) {
  if (now - (g.__rateLimitSweep ?? 0) < 60_000) return;
  g.__rateLimitSweep = now;
  for (const [k, b] of store) if (b.resetAt <= now) store.delete(k);
}

export interface RateResult {
  ok: boolean;
  remaining: number;
  retryAfter: number; // saniye
}

// key başına `limit` isteğe `windowMs` içinde izin ver.
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateResult {
  const now = Date.now();
  sweep(now);

  const b = store.get(key);
  if (!b || b.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (b.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
    };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count, retryAfter: 0 };
}

// İstemci IP'sini GÜVENİLİR kaynaktan çıkar.
// ÖNEMLİ: x-forwarded-for'un SOL (ilk) değeri istemci tarafından sahte
// doldurulabilir; her istekte rastgele göndererek rate-limit kovasından
// kaçılır. Bu yüzden güven sırası:
//   1) req.ip — Vercel/altyapı tarafından set edilir, sahte yapılamaz.
//   2) x-real-ip — Vercel'in set ettiği gerçek istemci IP'si.
//   3) XFF'in SON (en sağ) hop'u — güvenilir proxy'nin eklediği değer;
//      ilk (sol) değer DEĞİL.
export function getClientIp(req: NextRequest): string {
  const direct = (req as { ip?: string }).ip;
  if (direct) return direct;

  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();

  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length) return parts[parts.length - 1]; // son (güvenilir) hop
  }
  return "unknown";
}

// Standart 429 yanıtı (Retry-After başlığıyla).
export function tooManyRequests(retryAfter: number): NextResponse {
  return NextResponse.json(
    {
      error: "Çok fazla deneme yaptın. Lütfen biraz bekleyip tekrar dene.",
      code: "RATE_LIMITED",
    },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
