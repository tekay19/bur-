import { getAstrologyAdapter } from "./adapters";
import { analyzeHouses } from "./houses";
import type { BirthInput, HouseAnalysis, NatalChart } from "./types";

export interface NatalChartResult {
  chart: NatalChart;
  houseAnalysis: HouseAnalysis[];
}

// Natal harita hesaplama — public API.
// Seçili adapter (local / external / swiss) üzerinden çalışır.
export async function calculateNatalChart(
  input: BirthInput,
): Promise<NatalChartResult> {
  const adapter = getAstrologyAdapter();
  const chart = await adapter.computeNatal(input);

  const houseAnalysis = analyzeHouses(
    chart.planets,
    chart.houses,
    chart.aspects,
    chart.meta.hasHouses,
  );

  return { chart, houseAnalysis };
}
