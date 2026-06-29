import { NextRequest, NextResponse } from "next/server";
import { adminForbidden, getAdminFromRequest } from "@/lib/admin";
import { getSystemStatus } from "@/lib/adminStatus";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const acting = await getAdminFromRequest(req);
  if (!acting) return adminForbidden();
  // Harici canlı kontroller (AI/SMTP ping) — stolen-session ile hammer'lamaya karşı.
  const rl = rateLimit(`admin-status:${acting.id}`, 20, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);
  const status = await getSystemStatus();
  return NextResponse.json(status);
}
