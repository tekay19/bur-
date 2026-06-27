import { NextRequest, NextResponse } from "next/server";
import {
  grantCheckoutCredits,
  grantPremium,
  revokePremium,
  verifyWebhookSignature,
} from "@/lib/creem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Creem webhook'u — ödeme onayında kredi yükler (dönüş URL'ine ek, güvenilir
// sunucu-sunucu kanal). İmza: creem-signature = HMAC-SHA256(ham gövde, secret).
// CREEM_WEBHOOK_SECRET ayarlı değilse webhook devre dışı (dönüş URL'i yeterli).
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("creem-signature");

  if (!verifyWebhookSignature(raw, sig)) {
    return NextResponse.json({ error: "İmza geçersiz." }, { status: 401 });
  }

  let evt: {
    eventType?: string;
    object?: {
      id?: string;
      status?: string;
      order?: { id?: string } | string | null;
      metadata?: Record<string, string> | null;
    };
  };
  try {
    evt = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const type = evt.eventType ?? "";
  const obj = evt.object ?? {};
  const meta = obj.metadata ?? {};
  const pack = meta.pack;
  const recipientType = meta.recipient_type as "user" | "guest" | undefined;
  const recipientId = meta.recipient_id;

  // --- Premium abonelik yaşam döngüsü ---
  // Aktif/ödendi → premium ver; iptal/süre dolumu/ödenmedi → premium kaldır.
  const premiumOn =
    type === "subscription.active" ||
    type === "subscription.paid" ||
    type === "subscription.trialing";
  const premiumOff =
    type === "subscription.canceled" ||
    type === "subscription.expired" ||
    type === "subscription.unpaid" ||
    type === "subscription.past_due";
  if (premiumOn || premiumOff) {
    if (recipientType === "user" && recipientId) {
      if (premiumOn) await grantPremium(recipientId);
      else await revokePremium(recipientId);
    }
    return NextResponse.json({ ok: true });
  }

  // --- Tek seferlik ödeme (kredi paketi veya premium ilk satın alma) ---
  const interesting =
    type === "checkout.completed" ||
    type === "checkout.paid" ||
    type === "order.paid";
  if (!interesting) return NextResponse.json({ ok: true, ignored: type });

  const orderId =
    (typeof obj.order === "string" ? obj.order : obj.order?.id) ||
    obj.id ||
    "";

  if (!pack || !recipientType || !recipientId) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Premium checkout → plan premium (kredi yükleme yok).
  if (pack === "premium") {
    if (recipientType === "user") await grantPremium(recipientId);
    return NextResponse.json({ ok: true, premium: true });
  }

  if (!orderId) return NextResponse.json({ ok: true, skipped: true });

  await grantCheckoutCredits({ orderKey: orderId, pack, recipientType, recipientId });
  return NextResponse.json({ ok: true });
}
