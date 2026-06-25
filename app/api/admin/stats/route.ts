import { NextRequest, NextResponse } from "next/server";
import { adminForbidden, getAdminFromRequest } from "@/lib/admin";
import { adminHasDb, getStats } from "@/lib/adminData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await getAdminFromRequest(req))) return adminForbidden();
  if (!adminHasDb)
    return NextResponse.json({ db: false, stats: null });
  const stats = await getStats();
  return NextResponse.json({ db: true, stats });
}
