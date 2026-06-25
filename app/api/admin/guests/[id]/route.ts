import { NextRequest, NextResponse } from "next/server";
import { adminForbidden, getAdminFromRequest } from "@/lib/admin";
import { adjustGuestCredits } from "@/lib/adminData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await getAdminFromRequest(req))) return adminForbidden();

  let body: { creditsDelta?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (typeof body.creditsDelta !== "number" || body.creditsDelta === 0)
    return NextResponse.json({ error: "creditsDelta gerekli." }, { status: 422 });
  if (Math.abs(body.creditsDelta) > 100000)
    return NextResponse.json({ error: "Delta çok büyük." }, { status: 422 });

  const credits = await adjustGuestCredits(params.id, body.creditsDelta);
  if (credits === null)
    return NextResponse.json({ error: "Hesap bulunamadı." }, { status: 404 });
  return NextResponse.json({ ok: true, credits });
}
