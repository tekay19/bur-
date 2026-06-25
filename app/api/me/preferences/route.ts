import { NextRequest, NextResponse } from "next/server";
import { SID_COOKIE, verifySession } from "@/lib/auth";
import { setUserPrefs } from "@/lib/account";
import { getSign } from "@/lib/zodiac";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH /api/me/preferences — { sign?, dailyEmail? }
// Kayıtlı burç ve günlük e-posta hatırlatma tercihini günceller.
export async function PATCH(req: NextRequest) {
  const uid = verifySession(req.cookies.get(SID_COOKIE)?.value);
  if (!uid)
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });

  let body: { sign?: string | null; dailyEmail?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data: { sign?: string | null; dailyEmail?: boolean } = {};

  if (body.sign !== undefined) {
    if (body.sign !== null && !getSign(body.sign))
      return NextResponse.json({ error: "Geçersiz burç." }, { status: 422 });
    data.sign = body.sign;
  }
  if (typeof body.dailyEmail === "boolean") data.dailyEmail = body.dailyEmail;

  if (Object.keys(data).length === 0)
    return NextResponse.json({ error: "Güncellenecek alan yok." }, { status: 422 });

  const ok = await setUserPrefs(uid, data);
  return ok
    ? NextResponse.json({ ok: true, ...data })
    : NextResponse.json({ error: "Kaydedilemedi." }, { status: 500 });
}
