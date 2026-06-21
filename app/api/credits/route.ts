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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/credits — bakiye + kurtarma kodu (yeni ziyaretçiye çerez atar)
export async function GET(req: NextRequest) {
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
  });
  if (setCookie) res.cookies.set(AID_COOKIE, aid, AID_COOKIE_OPTS);
  return res;
}

// POST /api/credits — { action: "redeem" | "purchase", code?, pack? }
export async function POST(req: NextRequest) {
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

  // --- Satın alma (ŞİMDİLİK TEST: gerçek ödeme yok) ---
  // TODO: Iyzico checkout + webhook ile değiştir; kredi yalnızca ödeme
  // onayından sonra eklenmeli. Şu an doğrudan ekliyor (yalnızca geliştirme).
  if (body.action === "purchase") {
    const pack = CREDIT_PACKS.find((p) => p.id === body.pack);
    if (!pack)
      return NextResponse.json({ error: "Paket bulunamadı." }, { status: 400 });
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

  return NextResponse.json({ error: "Bilinmeyen işlem." }, { status: 400 });
}
