import { NextRequest, NextResponse } from "next/server";
import { adminForbidden, getAdminFromRequest } from "@/lib/admin";
import { adminHasDb, listAnalyses } from "@/lib/adminData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await getAdminFromRequest(req))) return adminForbidden();
  const sp = req.nextUrl.searchParams;
  const data = await listAnalyses({
    q: sp.get("q") ?? undefined,
    focusArea: sp.get("focusArea") ?? undefined,
    page: Number(sp.get("page") ?? 1) || 1,
  });
  return NextResponse.json({ db: adminHasDb, ...data });
}
