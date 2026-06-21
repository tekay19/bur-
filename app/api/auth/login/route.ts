import { NextRequest, NextResponse } from "next/server";
import {
  SID_COOKIE,
  SID_COOKIE_OPTS,
  findUserByEmail,
  getUserById,
  signSession,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "E-posta ve şifre gerekli." },
      { status: 400 },
    );
  }

  try {
    const u = await findUserByEmail(body.email);
    if (!u || !verifyPassword(body.password, u.passwordHash)) {
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
