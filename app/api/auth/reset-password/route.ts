import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  SID_COOKIE,
  SID_COOKIE_OPTS,
  hashPassword,
  setUserPassword,
  signSession,
} from "@/lib/auth";
import { consumeResetToken } from "@/lib/passwordReset";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  token: z.string().min(1, "Bağlantı geçersiz."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı").max(200),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`reset:ip:${ip}`, 20, 15 * 60_000); // 20 / 15dk
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Form hatası." },
      { status: 422 },
    );
  }
  const { token, password } = parsed.data;

  try {
    const userId = await consumeResetToken(token);
    if (!userId) {
      return NextResponse.json(
        {
          error:
            "Bağlantı geçersiz veya süresi dolmuş. Yeni bir sıfırlama isteği gönder.",
          code: "INVALID_TOKEN",
        },
        { status: 400 },
      );
    }

    const ok = await setUserPassword(userId, hashPassword(password));
    if (!ok) {
      return NextResponse.json(
        { error: "Hesap bulunamadı." },
        { status: 400 },
      );
    }

    // Otomatik giriş: yeni oturum çerezi set et (diğer token'lar consume'da iptal).
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SID_COOKIE, signSession(userId), SID_COOKIE_OPTS);
    return res;
  } catch (e) {
    console.error("Şifre sıfırlama hatası:", e);
    return NextResponse.json(
      { error: "Şifre sıfırlanamadı. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
