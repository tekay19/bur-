import { createHash, createHmac, timingSafeEqual } from "crypto";
import { CREDIT_PACKS } from "./creditPacks";
import { hasDatabase, prisma } from "./db/prisma";
import { addUserCredits, setUserPlan } from "./auth";
import { addCredits, getOrCreateAccount } from "./credits";

// ============================================================
// Creem.io ödeme entegrasyonu (merchant of record).
// - Tek seferlik kredi paketleri (USD). TRY desteklenmiyor.
// - Checkout: hosted ödeme sayfasına yönlendirir.
// - Onay: (a) dönüş URL imzası (sha256 + salt=apiKey) + checkout API'den
//   metadata doğrulaması, (b) webhook (HMAC-SHA256, opsiyonel ek güvence).
// - Kredi yükleme idempotent: order_id başına bir kez (çift yükleme yok).
// ============================================================

const API_KEY = process.env.CREEM_API_KEY ?? "";

// Test anahtarları "creem_test_" ile başlar → test endpoint'i kullan.
function apiBase(): string {
  if (process.env.CREEM_API_URL) return process.env.CREEM_API_URL.replace(/\/$/, "");
  return API_KEY.startsWith("creem_test_")
    ? "https://test-api.creem.io"
    : "https://api.creem.io";
}

export function isCreemConfigured(): boolean {
  return Boolean(API_KEY);
}

// pack id -> Creem product_id (env ile override edilebilir; varsayılan test ürünleri).
// "premium" tekrarlayan (subscription) bir Creem ürünüdür.
function productIdFor(pack: string): string | null {
  if (pack === "pack3")
    return process.env.CREEM_PRODUCT_PACK3 ?? "prod_3fdwc7zcj7NrNnydPgz1n6";
  if (pack === "pack10")
    return process.env.CREEM_PRODUCT_PACK10 ?? "prod_32ER2p2Ghq3dPdLUa9ZCAF";
  if (pack === "premium") return process.env.CREEM_PRODUCT_PREMIUM ?? null;
  return null;
}

export function isPremiumConfigured(): boolean {
  return isCreemConfigured() && Boolean(process.env.CREEM_PRODUCT_PREMIUM);
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotekai.com").replace(
    /\/$/,
    "",
  );
}

export interface CheckoutRecipient {
  type: "user" | "guest";
  id: string;
}

// Hosted checkout oluştur → ödeme sayfası URL'i döndür.
export async function createCheckout(
  pack: string,
  recipient: CheckoutRecipient,
): Promise<{ checkoutUrl: string; checkoutId: string } | null> {
  const productId = productIdFor(pack);
  if (!productId || !isCreemConfigured()) return null;

  const res = await fetch(`${apiBase()}/v1/checkouts`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      success_url: `${siteUrl()}/odeme/sonuc`,
      // Krediyi kimin alacağı + hangi paket. Onayda buradan okunur (URL'de değil).
      metadata: { pack, recipient_type: recipient.type, recipient_id: recipient.id },
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("Creem checkout oluşturulamadı:", res.status, txt.slice(0, 300));
    return null;
  }
  const data = (await res.json()) as { id?: string; checkout_url?: string };
  if (!data.checkout_url) return null;
  return { checkoutUrl: data.checkout_url, checkoutId: data.id ?? "" };
}

// Checkout'u Creem'den çek (durum + metadata doğrulaması için — URL'e güvenme).
export async function fetchCheckout(checkoutId: string): Promise<{
  status: string;
  orderId: string | null;
  metadata: Record<string, string> | null;
  productId: string | null;
} | null> {
  if (!isCreemConfigured() || !checkoutId) return null;
  const url = `${apiBase()}/v1/checkouts?checkout_id=${encodeURIComponent(checkoutId)}`;
  const res = await fetch(url, { headers: { "x-api-key": API_KEY } });
  if (!res.ok) return null;
  const d = (await res.json()) as {
    status?: string;
    order?: { id?: string } | string | null;
    metadata?: Record<string, string> | null;
    product?: { id?: string } | string | null;
  };
  const orderId =
    typeof d.order === "string" ? d.order : (d.order?.id ?? null);
  const productId =
    typeof d.product === "string" ? d.product : (d.product?.id ?? null);
  return {
    status: d.status ?? "",
    orderId,
    metadata: d.metadata ?? null,
    productId,
  };
}

// Dönüş URL imzası: signature hariç tüm parametreler "k=v", sona "salt=apiKey",
// "|" ile birleştirilir, sha256(hex). (Creem checkout-api dokümanı.)
export function verifyRedirectSignature(
  params: Record<string, string>,
): boolean {
  if (!isCreemConfigured()) return false;
  const signature = params.signature;
  if (!signature) return false;
  const data = Object.entries(params)
    .filter(
      ([k, v]) =>
        k !== "signature" && v !== null && v !== undefined && v !== "",
    )
    .map(([k, v]) => `${k}=${v}`)
    .concat(`salt=${API_KEY}`)
    .join("|");
  const expected = createHash("sha256").update(data).digest("hex");
  return safeEqualHex(expected, signature);
}

// Webhook imzası: creem-signature = HMAC-SHA256(ham gövde, webhook secret).
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}

function safeEqualHex(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    return ba.length === bb.length && timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

// --- Premium üyelik (abonelik) ---
// Plan ayarı doğası gereği idempotent (aynı değeri yazmak güvenli).
export async function grantPremium(recipientId: string): Promise<boolean> {
  if (!recipientId) return false;
  return setUserPlan(recipientId, "premium");
}
export async function revokePremium(recipientId: string): Promise<boolean> {
  if (!recipientId) return false;
  return setUserPlan(recipientId, "free");
}

// --- İdempotent kredi yükleme (order_id başına bir kez) ---
const memProcessed = new Set<string>(); // DB yoksa yedek

export async function grantCheckoutCredits(opts: {
  orderKey: string; // order_id (yoksa checkout_id) — idempotent anahtar
  pack: string;
  recipientType: "user" | "guest";
  recipientId: string;
}): Promise<{ granted: boolean; alreadyProcessed: boolean; credits: number }> {
  const packDef = CREDIT_PACKS.find((p) => p.id === opts.pack);
  if (!packDef || !opts.orderKey || !opts.recipientId)
    return { granted: false, alreadyProcessed: false, credits: 0 };

  // İdempotensi: aynı order tekrar gelirse (webhook + dönüş URL) çift yükleme yok.
  if (hasDatabase && prisma) {
    try {
      await prisma.processedPayment.create({
        data: {
          id: opts.orderKey,
          credits: packDef.credits,
          recipient: `${opts.recipientType}:${opts.recipientId}`,
        },
      });
    } catch {
      return { granted: false, alreadyProcessed: true, credits: 0 }; // benzersiz id ihlali = işlenmiş
    }
  } else {
    if (memProcessed.has(opts.orderKey))
      return { granted: false, alreadyProcessed: true, credits: 0 };
    memProcessed.add(opts.orderKey);
  }

  let credits = 0;
  if (opts.recipientType === "user") {
    credits = await addUserCredits(opts.recipientId, packDef.credits);
  } else {
    await getOrCreateAccount(opts.recipientId);
    credits = await addCredits(opts.recipientId, packDef.credits);
  }
  return { granted: true, alreadyProcessed: false, credits };
}
