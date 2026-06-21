import { NextRequest, NextResponse } from "next/server";
import { generateAstrologyInterpretation } from "@/lib/ai/generateAstrologyInterpretation";
import type {
  ChartScores,
  HouseAnalysis,
  NatalChart,
  TransitChart,
} from "@/lib/astrology/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/ai-interpretation — hesaplanmış veriden AI yorumunu (yeniden) üretir.
// AI çağrısı yalnızca sunucuda yapılır; API anahtarı client'a sızmaz.
export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    focusArea?: string;
    natal?: NatalChart;
    houses?: HouseAnalysis[];
    transit?: TransitChart;
    scores?: ChartScores;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (!body.natal || !body.transit || !body.scores) {
    return NextResponse.json(
      { error: "natal, transit ve scores alanları zorunlu." },
      { status: 422 },
    );
  }

  try {
    const ai = await generateAstrologyInterpretation({
      name: body.name ?? "Kullanıcı",
      focusArea: body.focusArea ?? "general",
      natal: body.natal,
      houses: body.houses ?? [],
      transit: body.transit,
      scores: body.scores,
    });
    return NextResponse.json({ ai });
  } catch (err) {
    console.error("AI yorum hatası:", err);
    return NextResponse.json(
      { error: "AI yorumu üretilemedi." },
      { status: 500 },
    );
  }
}
