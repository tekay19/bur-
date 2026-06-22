import { NextRequest, NextResponse } from "next/server";
import {
  DUMMY_PASSWORD_HASH,
  SID_COOKIE,
  SID_COOKIE_OPTS,
  findUserByEmail,
  getUserById,
  signSession,
  verifyPassword,
} from "@/lib/auth";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Şifre brute-force'a karşı hız sınırı (IP başına).
  const ip = getClientIp(req);
  const ipRl = rateLimit(`login:ip:${ip}`, 15, 15 * 60_000); // 15 / 15 dk
  if (!ipRl.ok) return tooManyRequests(ipRl.retryAfter);

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  if (
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    !body.email ||
    !body.password ||
    body.password.length > 200
  ) {
    return NextResponse.json(
      { error: "E-posta ve şifre gerekli." },
      { status: 400 },
    );
  }

  // Hesap-hedefli brute-force'a karşı e-posta başına daha sıkı sınır.
  const emailKey = body.email.toLowerCase().trim();
  const emailRl = rateLimit(`login:email:${emailKey}`, 6, 15 * 60_000); // 6 / 15 dk
  if (!emailRl.ok) return tooManyRequests(emailRl.retryAfter);

  try {
    const u = await findUserByEmail(body.email);
    // Kullanıcı yoksa bile kukla hash ile doğrula → sabit zaman (enumerasyon yok).
    const ok = verifyPassword(
      body.password,
      u?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );
    if (!u || !ok) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı." },
        { status: 401 },
      );
    }
    const user = await getUserById(u.id);
    const res = NextResponse.json({ user });
    res.cookies.set(SID_COOKIE, signSession(u.id), SID_COOKIE_OPTS);
    return res;
  } catch (e) {
    console.error("Giriş hatası:", e);
    return NextResponse.json(
      { error: "Giriş yapılamadı." },
      { status: 500 },
    );
  }
}
