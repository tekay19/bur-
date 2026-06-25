import { NextRequest, NextResponse } from "next/server";
import { SID_COOKIE, getUserById, verifySession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/auth/me — oturum açıksa kullanıcıyı döndürür, yoksa null.
// isAdmin: e-posta ADMIN_EMAILS listesindeyse true (header'da Yönetim linki için).
export async function GET(req: NextRequest) {
  const uid = verifySession(req.cookies.get(SID_COOKIE)?.value);
  if (!uid) return NextResponse.json({ user: null });
  try {
    const user = await getUserById(uid);
    return NextResponse.json({
      user,
      isAdmin: user ? isAdminEmail(user.email) : false,
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
