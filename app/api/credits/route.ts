import { NextRequest, NextResponse } from "next/server";
import {
  AID_COOKIE,
  AID_COOKIE_OPTS,
  CREDIT_PACKS,
  addCredits,
  findByRecoveryCode,
  getOrCreateAccount,
  newAnonId,
} from "@/lib/credits";
import {
  SID_COOKIE,
  addUserCredits,
  getUserById,
  verifySession,
} from "@/lib/auth";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";
import {
  createCheckout,
  isCreemConfigured,
  isPremiumConfigured,
} from "@/lib/creem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/credits — bakiye (üye ise hesap kredisi, değilse misafir)
export async function GET(req: NextRequest) {
  // Üye?
  const uid = verifySession(req.cookies.get(SID_COOKIE)?.value);
  if (uid) {
    try {
      const user = await getUserById(uid);
      if (user)
        return NextResponse.json({
          credits: user.credits,
          plan: user.plan,
          loggedIn: true,
        });
    } catch {
      /* misafire düş */
    }
  }

  let aid = req.cookies.get(AID_COOKIE)?.value;
  let setCookie = false;
  if (!aid) {
    aid = newAnonId();
    setCookie = true;
  }
  const acc = await getOrCreateAccount(aid);
  const res = NextResponse.json({
    credits: acc.credits,
    recoveryCode: acc.recoveryCode,
    loggedIn: false,
  });
  if (setCookie) res.cookies.set(AID_COOKIE, aid, AID_COOKIE_OPTS);
  return res;
}

// POST /api/credits — { action: "redeem" | "purchase", code?, pack? }
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  // Genel POST sınırı (IP başına).
  const rl = rateLimit(`credits:ip:${ip}`, 30, 15 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  let body: { action?: string; code?: string; pack?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  // --- Kurtarma kodu ile geri yükleme ---
  if (body.action === "redeem") {
    if (!body.code)
      return NextResponse.json({ error: "Kod gerekli." }, { status: 400 });
    // Kurtarma kodu brute-force'una karşı sıkı sınır (IP başına).
    const codeRl = rateLimit(`redeem:ip:${ip}`, 10, 15 * 60_000);
    if (!codeRl.ok) return tooManyRequests(codeRl.retryAfter);
    const acc = await findByRecoveryCode(body.code);
    if (!acc)
      return NextResponse.json(
        { error: "Kod bulunamadı." },
        { status: 404 },
      );
    // Çerezi kurtarılan hesaba bağla
    const res = NextResponse.json({
      credits: acc.credits,
      recoveryCode: acc.recoveryCode,
    });
    res.cookies.set(AID_COOKIE, acc.id, AID_COOKIE_OPTS);
    return res;
  }

  // --- Satın alma → Creem hosted checkout'a yönlendir ---
  if (body.action === "purchase") {
    const pack = CREDIT_PACKS.find((p) => p.id === body.pack);
    if (!pack)
      return NextResponse.json({ error: "Paket bulunamadı." }, { status: 400 });

    const uid = verifySession(req.cookies.get(SID_COOKIE)?.value);

    // Creem yapılandırılmışsa: ödeme sayfası oluştur, URL döndür.
    if (isCreemConfigured()) {
      let recipient: { type: "user" | "guest"; id: string };
      let aid = req.cookies.get(AID_COOKIE)?.value;
      let setCookie = false;
      if (uid) {
        recipient = { type: "user", id: uid };
      } else {
        if (!aid) {
          aid = newAnonId();
          setCookie = true;
        }
        await getOrCreateAccount(aid);
        recipient = { type: "guest", id: aid };
      }
      const checkout = await createCheckout(pack.id, recipient);
      if (!checkout) {
        return NextResponse.json(
          { error: "Ödeme başlatılamadı. Lütfen tekrar deneyin." },
          { status: 502 },
        );
      }
      const res = NextResponse.json({ checkout_url: checkout.checkoutUrl });
      // Misafir çerezini şimdi sabitle ki dönüşte aynı hesap bulunur.
      if (setCookie && aid) res.cookies.set(AID_COOKIE, aid, AID_COOKIE_OPTS);
      return res;
    }

    // Creem yok: lokal/test ortamında doğrudan kredi ekle; üretimde kapalı.
    const testAllowed =
      process.env.NODE_ENV !== "production" ||
      process.env.CREDITS_TEST_MODE === "1";
    if (!testAllowed) {
      return NextResponse.json(
        {
          error: "Ödeme sistemi şu an hazır değil. Lütfen daha sonra dene.",
          code: "PAYMENT_NOT_READY",
        },
        { status: 503 },
      );
    }
    if (uid) {
      const credits = await addUserCredits(uid, pack.credits);
      return NextResponse.json({ credits, test: true });
    }
    let aid = req.cookies.get(AID_COOKIE)?.value;
    let setCookie = false;
    if (!aid) {
      aid = newAnonId();
      setCookie = true;
    }
    await getOrCreateAccount(aid);
    const credits = await addCredits(aid, pack.credits);
    const res = NextResponse.json({ credits, test: true });
    if (setCookie) res.cookies.set(AID_COOKIE, aid, AID_COOKIE_OPTS);
    return res;
  }

  // --- Premium aboneliği başlat (yalnızca üye) → Creem subscription checkout ---
  if (body.action === "subscribe") {
    const uid = verifySession(req.cookies.get(SID_COOKIE)?.value);
    if (!uid) {
      return NextResponse.json(
        { error: "Önce giriş yap.", code: "AUTH_REQUIRED" },
        { status: 401 },
      );
    }
    if (!isPremiumConfigured()) {
      return NextResponse.json(
        {
          error: "Premium üyelik şu an hazır değil. Lütfen daha sonra dene.",
          code: "PREMIUM_NOT_READY",
        },
        { status: 503 },
      );
    }
    const checkout = await createCheckout("premium", { type: "user", id: uid });
    if (!checkout) {
      return NextResponse.json(
        { error: "Abonelik başlatılamadı. Lütfen tekrar deneyin." },
        { status: 502 },
      );
    }
    return NextResponse.json({ checkout_url: checkout.checkoutUrl });
  }

  return NextResponse.json({ error: "Bilinmeyen işlem." }, { status: 400 });
}
