import { NextRequest, NextResponse } from "next/server";
import { runFullAnalysis } from "@/lib/analysis";
import type { BirthInput } from "@/lib/astrology/types";
import { getAnalysis, saveAnalysis } from "@/lib/db/storage";
import { geocode } from "@/lib/utils/geocoding";
import { chartRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/chart — natal + transit + skor + AI analizini üretir ve kaydeder
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek gövdesi." },
      { status: 400 },
    );
  }

  const parsed = chartRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Form doğrulaması başarısız.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Koordinat/zaman dilimi yoksa şehirden geocode et
  let { latitude, longitude, timezone } = data;
  if (latitude == null || longitude == null || !timezone) {
    const geo = await geocode(data.birthPlace);
    if (!geo) {
      return NextResponse.json(
        {
          error:
            "Doğum yeri bulunamadı. Lütfen şehir adını kontrol edin veya farklı bir yazım deneyin.",
          code: "GEOCODE_FAILED",
        },
        { status: 422 },
      );
    }
    latitude = geo.latitude;
    longitude = geo.longitude;
    timezone = geo.timezone;
  }

  const birthInput: BirthInput = {
    name: data.name,
    gender: data.gender || null,
    date: data.birthDate,
    time: data.birthTime || null,
    place: data.birthPlace,
    latitude,
    longitude,
    timezone,
    birthTimeAccuracy: data.birthTimeAccuracy,
    focusArea: data.focusArea,
  };

  try {
    const payload = await runFullAnalysis(birthInput);
    const saved = await saveAnalysis(payload);
    return NextResponse.json({ id: saved.id, result: saved });
  } catch (err) {
    console.error("Analiz üretilemedi:", err);
    return NextResponse.json(
      { error: "Analiz oluşturulurken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}

// GET /api/chart?id=... — kayıtlı analizi getir
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id gerekli." }, { status: 400 });
  }
  const result = await getAnalysis(id);
  if (!result) {
    return NextResponse.json(
      { error: "Analiz bulunamadı." },
      { status: 404 },
    );
  }
  return NextResponse.json({ result });
}
