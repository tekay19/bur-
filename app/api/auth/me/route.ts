import { NextRequest, NextResponse } from "next/server";
import { SID_COOKIE, getUserById, verifySession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/auth/me — oturum açıksa kullanıcıyı döndürür, yoksa null
export async function GET(req: NextRequest) {
  const uid = verifySession(req.cookies.get(SID_COOKIE)?.value);
  if (!uid) return NextResponse.json({ user: null });
  try {
    const user = await getUserById(uid);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
