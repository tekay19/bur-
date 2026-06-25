import { NextRequest, NextResponse } from "next/server";
import { adminForbidden, getAdminFromRequest } from "@/lib/admin";
import { adminHasDb, listSales } from "@/lib/adminData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await getAdminFromRequest(req))) return adminForbidden();
  const sp = req.nextUrl.searchParams;
  const data = await listSales({ page: Number(sp.get("page") ?? 1) || 1 });
  return NextResponse.json({ db: adminHasDb, ...data });
}
