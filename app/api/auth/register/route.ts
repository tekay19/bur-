import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  SID_COOKIE,
  SID_COOKIE_OPTS,
  WELCOME_BONUS,
  createUser,
  findUserByEmail,
  hashPassword,
  signSession,
} from "@/lib/auth";
import { AID_COOKIE, claimAccountCredits } from "@/lib/credits";
import { sendWelcomeEmail } from "@/lib/email";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta gir"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı").max(200),
  name: z.string().max(60).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  // Sahte hesap spam'ine karşı hız sınırı (IP başına). Her hesap ücretsiz
  // kredi aldığı için bu, ücretsiz katman suistimalini de yavaşlatır.
  const ip = getClientIp(req);
  const rl = rateLimit(`register:ip:${ip}`, 6, 60 * 60_000); // 6 / saat
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
  const { email, password, name } = parsed.data;

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı dene." },
        { status: 409 },
      );
    }

    // Misafir kredilerini hesaba TAŞI (kopyalama değil) + hoş geldin hediyesi.
    // claimAccountCredits misafir hesabını atomik olarak 0'a çeker; böylece
    // aynı krediler hem üyede hem misafirde sayılmaz (çift harcama önlenir).
    let guestCredits = 0;
    const aid = req.cookies.get(AID_COOKIE)?.value;
    if (aid) {
      try {
        guestCredits = await claimAccountCredits(aid);
      } catch {
        /* yoksay */
      }
    }

    const user = await createUser(
      email,
      hashPassword(password),
      name || null,
      guestCredits + WELCOME_BONUS,
    );

    // Hoş geldin maili (best-effort; başarısız olsa da kayıt başarılı sayılır).
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (mailErr) {
      console.error("Hoş geldin maili gönderilemedi:", mailErr);
    }

    const res = NextResponse.json({ user });
    res.cookies.set(SID_COOKIE, signSession(user.id), SID_COOKIE_OPTS);
    // Krediler taşındı; eski misafir çerezini sıfırla ki yeniden kullanılmasın
    // (logout sonrası eski hesaptan çift harcama vektörünü kapatır).
    if (aid) res.cookies.set(AID_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  } catch (e) {
    console.error("Kayıt hatası:", e);
    return NextResponse.json(
      { error: "Kayıt yapılamadı. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
