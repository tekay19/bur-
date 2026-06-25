import { NextRequest, NextResponse } from "next/server";
import { adminForbidden, getAdminFromRequest } from "@/lib/admin";
import { deleteAnalysis, getAnalysisAdmin } from "@/lib/adminData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await getAdminFromRequest(req))) return adminForbidden();
  const data = await getAnalysisAdmin(params.id);
  if (!data)
    return NextResponse.json({ error: "Analiz bulunamadı." }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await getAdminFromRequest(req))) return adminForbidden();
  const ok = await deleteAnalysis(params.id);
  if (!ok)
    return NextResponse.json({ error: "Silinemedi." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
