import { calculateNatalChart } from "./astrology/calculateNatalChart";
import { calculateTransits } from "./astrology/calculateTransits";
import { calculateScores } from "./astrology/scoring";
import { forecastTransits, type TransitEvent } from "./astrology/transitForecast";
import type {
  BirthInput,
  ChartScores,
  HouseAnalysis,
  NatalChart,
  TransitChart,
} from "./astrology/types";
import { generateAstrologyInterpretation } from "./ai/generateAstrologyInterpretation";
import type { AiInterpretation } from "./ai/prompts";

// Uygulama düzeyinde birleşik analiz çıktısı
export interface AnalysisResult {
  id: string;
  input: {
    name: string;
    gender?: string | null;
    birthDate: string;
    birthTime?: string | null;
    birthPlace: string;
    latitude: number;
    longitude: number;
    timezone: string;
    birthTimeAccuracy: BirthInput["birthTimeAccuracy"];
    focusArea: BirthInput["focusArea"];
  };
  natal: NatalChart;
  houseAnalysis: HouseAnalysis[];
  transit: TransitChart;
  forecast: TransitEvent[];
  scores: ChartScores;
  ai: AiInterpretation;
  createdAt: string;
}

// Tüm hesaplama hattını çalıştır (natal -> transit -> skor -> AI)
export async function runFullAnalysis(
  input: BirthInput,
  transitDate: Date = new Date(),
): Promise<Omit<AnalysisResult, "id" | "createdAt">> {
  const { chart, houseAnalysis } = await calculateNatalChart(input);
  const transit = await calculateTransits(chart, transitDate);
  const forecast = forecastTransits(chart, transitDate, 12);
  const scores = calculateScores(chart, houseAnalysis, transit);
  const ai = await generateAstrologyInterpretation({
    name: input.name,
    focusArea: input.focusArea,
    natal: chart,
    houses: houseAnalysis,
    transit,
    forecast,
    scores,
  });

  return {
    input: {
      name: input.name,
      gender: input.gender,
      birthDate: input.date,
      birthTime: input.time,
      birthPlace: input.place,
      latitude: input.latitude,
      longitude: input.longitude,
      timezone: input.timezone,
      birthTimeAccuracy: input.birthTimeAccuracy,
      focusArea: input.focusArea,
    },
    natal: chart,
    houseAnalysis,
    transit,
    forecast,
    scores,
    ai,
  };
}
