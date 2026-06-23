import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findUserByEmail } from "@/lib/auth";
import { createResetToken } from "@/lib/passwordReset";
import { sendPasswordResetEmail } from "@/lib/email";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta gir"),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const ipRl = rateLimit(`forgot:ip:${ip}`, 5, 15 * 60_000); // 5 / 15dk
  if (!ipRl.ok) return tooManyRequests(ipRl.retryAfter);

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
  const email = parsed.data.email.toLowerCase().trim();

  // E-posta başına da sınır (spam/mail bombardımanı önleme).
  const emailRl = rateLimit(`forgot:email:${email}`, 3, 60 * 60_000); // 3 / saat
  if (!emailRl.ok) return tooManyRequests(emailRl.retryAfter);

  try {
    const user = await findUserByEmail(email);
    if (user) {
      const raw = await createResetToken(user.id);
      const resetUrl = `${SITE_URL}/sifre-sifirla?token=${raw}`;
      await sendPasswordResetEmail(user.email, resetUrl, user.name);
    }
  } catch (e) {
    // Hata olsa bile kullanıcıya genel başarı dön (enumerasyon + UX).
    console.error("Şifre sıfırlama isteği hatası:", e);
  }

  // Enumerasyonu önlemek için yanıt her zaman aynı (kullanıcı var/yok belli olmaz).
  return NextResponse.json({ ok: true });
}
