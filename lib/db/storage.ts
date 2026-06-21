import type { AnalysisResult } from "../analysis";
import { hasDatabase, prisma } from "./prisma";

// ============================================================
// Depolama soyutlaması.
// - DATABASE_URL varsa: Prisma/PostgreSQL kullanılır (kalıcı).
// - Yoksa: süreç-içi bellek kullanılır (geliştirme/demonstrasyon).
//   Not: Serverless'te bellek örnekler arası paylaşılmaz; bu yüzden
//   istemci tarafı sessionStorage önbelleği ile birlikte çalışır.
// ============================================================

// Bellek-içi depo globalThis üzerinde tutulur; böylece Next dev modülü
// yeniden değerlendirse de (HMR) kayıtlar korunur.
const globalForMem = globalThis as unknown as {
  __astroMemory?: Map<string, AnalysisResult>;
};
const memory: Map<string, AnalysisResult> =
  globalForMem.__astroMemory ?? new Map<string, AnalysisResult>();
globalForMem.__astroMemory = memory;

function genId(): string {
  return (
    "c" +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 6)
  );
}

export async function saveAnalysis(
  payload: Omit<AnalysisResult, "id" | "createdAt">,
): Promise<AnalysisResult> {
  const createdAt = new Date().toISOString();

  if (hasDatabase && prisma) {
    const userChart = await prisma.userChart.create({
      data: {
        name: payload.input.name,
        gender: payload.input.gender ?? null,
        birthDate: payload.input.birthDate,
        birthTime: payload.input.birthTime ?? null,
        birthPlace: payload.input.birthPlace,
        latitude: payload.input.latitude,
        longitude: payload.input.longitude,
        timezone: payload.input.timezone,
        birthTimeAccuracy: payload.input.birthTimeAccuracy,
        focusArea: payload.input.focusArea,
      },
    });

    await prisma.chartResult.create({
      data: {
        userChartId: userChart.id,
        // houseAnalysis natalJson içine gömülür (geri okumada kullanılır)
        natalJson: { ...payload.natal, houseAnalysis: payload.houseAnalysis } as object,
        // forecast transitJson içine gömülür
        transitJson: { ...payload.transit, forecast: payload.forecast } as object,
        scoresJson: payload.scores as object,
        aiInterpretationJson: payload.ai as object,
      },
    });

    await prisma.transitSnapshot.create({
      data: {
        userChartId: userChart.id,
        date: new Date().toISOString().slice(0, 10),
        transitJson: payload.transit as object,
      },
    });

    return { ...payload, id: userChart.id, createdAt };
  }

  const id = genId();
  const result: AnalysisResult = { ...payload, id, createdAt };
  memory.set(id, result);
  return result;
}

export async function getAnalysis(id: string): Promise<AnalysisResult | null> {
  if (hasDatabase && prisma) {
    const userChart = await prisma.userChart.findUnique({
      where: { id },
      include: {
        results: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    if (!userChart || userChart.results.length === 0) return null;
    const r = userChart.results[0];
    return {
      id: userChart.id,
      createdAt: r.createdAt.toISOString(),
      input: {
        name: userChart.name,
        gender: userChart.gender,
        birthDate: userChart.birthDate,
        birthTime: userChart.birthTime,
        birthPlace: userChart.birthPlace,
        latitude: userChart.latitude,
        longitude: userChart.longitude,
        timezone: userChart.timezone,
        birthTimeAccuracy: userChart.birthTimeAccuracy as AnalysisResult["input"]["birthTimeAccuracy"],
        focusArea: userChart.focusArea as AnalysisResult["input"]["focusArea"],
      },
      natal: r.natalJson as unknown as AnalysisResult["natal"],
      // houseAnalysis, natalJson içine gömülerek saklanır (saveAnalysis'te).
      houseAnalysis:
        (r.natalJson as unknown as {
          houseAnalysis?: AnalysisResult["houseAnalysis"];
        })?.houseAnalysis ?? [],
      transit: r.transitJson as unknown as AnalysisResult["transit"],
      forecast:
        (r.transitJson as unknown as {
          forecast?: AnalysisResult["forecast"];
        })?.forecast ?? [],
      scores: r.scoresJson as unknown as AnalysisResult["scores"],
      ai: r.aiInterpretationJson as unknown as AnalysisResult["ai"],
    };
  }

  return memory.get(id) ?? null;
}
