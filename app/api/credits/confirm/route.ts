import { NextRequest, NextResponse } from "next/server";
import { AID_COOKIE, AID_COOKIE_OPTS } from "@/lib/credits";
import {
  fetchCheckout,
  grantCheckoutCredits,
  verifyRedirectSignature,
} from "@/lib/creem";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ödeme dönüş sayfası (success_url) bu endpoint'i çağırır.
// 1) Dönüş URL imzasını doğrula (Creem'den geldiğini kanıtlar).
// 2) Checkout'u Creem API'den çek → ödendi mi + metadata (alıcı/paket).
// 3) Krediyi idempotent yükle (order_id başına bir kez).
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`confirm:ip:${ip}`, 30, 15 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  let body: { search?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  if (typeof body.search !== "string") {
    return NextResponse.json({ error: "Eksik parametre." }, { status: 400 });
  }

  // Dönüş parametrelerini düz nesneye çevir.
  const sp = new URLSearchParams(
    body.search.startsWith("?") ? body.search.slice(1) : body.search,
  );
  const params: Record<string, string> = {};
  sp.forEach((v, k) => (params[k] = v));

  if (!verifyRedirectSignature(params)) {
    return NextResponse.json(
      { error: "İmza doğrulanamadı." },
      { status: 400 },
    );
  }

  const checkoutId = params.checkout_id;
  const orderId = params.order_id || checkoutId;
  if (!checkoutId) {
    return NextResponse.json({ error: "Checkout yok." }, { status: 400 });
  }

  // Creem'den doğrula: ödendi mi + metadata (URL'e güvenme).
  const co = await fetchCheckout(checkoutId);
  if (!co) {
    return NextResponse.json(
      { error: "Ödeme doğrulanamadı.", status: "unknown" },
      { status: 502 },
    );
  }
  const paid = ["completed", "paid"].includes(co.status.toLowerCase());
  if (!paid) {
    // Henüz tamamlanmadıysa (ör. kullanıcı vazgeçti) kredi yükleme.
    return NextResponse.json({ ok: false, status: co.status });
  }

  const meta = co.metadata ?? {};
  const pack = meta.pack;
  const recipientType = meta.recipient_type as "user" | "guest" | undefined;
  const recipientId = meta.recipient_id;
  if (!pack || !recipientType || !recipientId) {
    return NextResponse.json(
      { error: "Sipariş bilgisi eksik." },
      { status: 422 },
    );
  }

  const result = await grantCheckoutCredits({
    orderKey: orderId,
    pack,
    recipientType,
    recipientId,
  });

  const res = NextResponse.json({
    ok: true,
    credits: result.credits,
    alreadyProcessed: result.alreadyProcessed,
  });
  // Misafir alıcıysa çerezi bu hesaba bağla ki bakiyesi görünsün.
  if (recipientType === "guest") {
    res.cookies.set(AID_COOKIE, recipientId, AID_COOKIE_OPTS);
  }
  return res;
}
