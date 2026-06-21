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
import { AID_COOKIE, getOrCreateAccount } from "@/lib/credits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta gir"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().max(60).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
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

    // Misafir kredilerini hesaba taşı + hoş geldin hediyesi
    let guestCredits = 0;
    const aid = req.cookies.get(AID_COOKIE)?.value;
    if (aid) {
      try {
        const acc = await getOrCreateAccount(aid);
        guestCredits = acc.credits;
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

    const res = NextResponse.json({ user });
    res.cookies.set(SID_COOKIE, signSession(user.id), SID_COOKIE_OPTS);
    return res;
  } catch (e) {
    console.error("Kayıt hatası:", e);
    return NextResponse.json(
      { error: "Kayıt yapılamadı. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
