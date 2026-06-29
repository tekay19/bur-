import { NextRequest, NextResponse } from "next/server";
import { adminForbidden, getAdminFromRequest } from "@/lib/admin";
import {
  adjustMemberCredits,
  deleteMember,
  getMemberDetail,
  setMemberPassword,
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
  const acting = await getAdminFromRequest(req);
  if (!acting) return adminForbidden();

  let body: { creditsDelta?: number; plan?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const out: { credits?: number; plan?: string; passwordChanged?: boolean } = {};

  if (typeof body.creditsDelta === "number" && body.creditsDelta !== 0) {
    if (Math.abs(body.creditsDelta) > 100000)
      return NextResponse.json({ error: "Delta çok büyük." }, { status: 422 });
    const credits = await adjustMemberCredits(params.id, body.creditsDelta);
    if (credits === null)
      return NextResponse.json({ error: "Üye bulunamadı." }, { status: 404 });
    out.credits = credits;
    console.info(
      `[admin-audit] ${acting.email} credits ${body.creditsDelta > 0 ? "+" : ""}${body.creditsDelta} → ${params.id} (=${credits})`,
    );
  }

  if (body.plan === "free" || body.plan === "premium") {
    const ok = await setMemberPlan(params.id, body.plan);
    if (!ok)
      return NextResponse.json({ error: "Üye bulunamadı." }, { status: 404 });
    out.plan = body.plan;
    console.info(`[admin-audit] ${acting.email} plan=${body.plan} → ${params.id}`);
  }

  if (typeof body.newPassword === "string") {
    const pw = body.newPassword;
    if (pw.length < 8 || pw.length > 200)
      return NextResponse.json(
        { error: "Şifre 8-200 karakter olmalı." },
        { status: 422 },
      );
    const ok = await setMemberPassword(params.id, pw);
    if (!ok)
      return NextResponse.json({ error: "Üye bulunamadı." }, { status: 404 });
    out.passwordChanged = true;
    console.info(`[admin-audit] ${acting.email} reset password → ${params.id}`);
  }

  return NextResponse.json({ ok: true, ...out });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const acting = await getAdminFromRequest(req);
  if (!acting) return adminForbidden();
  const res = await deleteMember(params.id, acting.id);
  if (!res.ok)
    return NextResponse.json(
      { error: res.error ?? "Silinemedi." },
      { status: 400 },
    );
  console.info(`[admin-audit] ${acting.email} deleted user ${params.id}`);
  return NextResponse.json({ ok: true });
}
