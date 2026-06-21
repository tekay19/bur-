import { NextRequest, NextResponse } from "next/server";
import { geocode } from "@/lib/utils/geocoding";

export const runtime = "nodejs";

// GET /api/geocode?q=İstanbul — şehir doğrulama / koordinat ön kontrolü
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) {
    return NextResponse.json({ error: "Sorgu çok kısa." }, { status: 400 });
  }
  const result = await geocode(q);
  if (!result) {
    return NextResponse.json({ found: false }, { status: 200 });
  }
  return NextResponse.json({ found: true, result });
}
