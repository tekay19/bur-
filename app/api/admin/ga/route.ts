import { NextRequest, NextResponse } from "next/server";
import { adminForbidden, getAdminFromRequest } from "@/lib/admin";
import { getGaStats } from "@/lib/ga";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const acting = await getAdminFromRequest(req);
  if (!acting) return adminForbidden();
  // GA4 Data API kotasını korumak için (admin başına).
  const rl = rateLimit(`admin-ga:${acting.id}`, 20, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);
  const stats = await getGaStats();
  return NextResponse.json(stats);
}
