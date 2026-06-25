import { NextRequest, NextResponse } from "next/server";
import { adminForbidden, getAdminFromRequest } from "@/lib/admin";
import {
  adjustMemberCredits,
  deleteMember,
  getMemberDetail,
  setMemberPlan,
} from "@/lib/adminData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await getAdminFromRequest(req))) return adminForbidden();
  const detail = await getMemberDetail(params.id);
  if (!detail)
    return NextResponse.json({ error: "Üye bulunamadı." }, { status: 404 });
  return NextResponse.json(detail);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await getAdminFromRequest(req))) return adminForbidden();

  let body: { creditsDelta?: number; plan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const out: { credits?: number; plan?: string } = {};

  if (typeof body.creditsDelta === "number" && body.creditsDelta !== 0) {
    if (Math.abs(body.creditsDelta) > 100000)
      return NextResponse.json({ error: "Delta çok büyük." }, { status: 422 });
    const credits = await adjustMemberCredits(params.id, body.creditsDelta);
    if (credits === null)
      return NextResponse.json({ error: "Üye bulunamadı." }, { status: 404 });
    out.credits = credits;
  }

  if (body.plan === "free" || body.plan === "premium") {
    const ok = await setMemberPlan(params.id, body.plan);
    if (!ok)
      return NextResponse.json({ error: "Üye bulunamadı." }, { status: 404 });
    out.plan = body.plan;
  }

  return NextResponse.json({ ok: true, ...out });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await getAdminFromRequest(req))) return adminForbidden();
  const ok = await deleteMember(params.id);
  if (!ok)
    return NextResponse.json({ error: "Silinemedi." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
