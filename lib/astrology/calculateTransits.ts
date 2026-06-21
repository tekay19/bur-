import { getAstrologyAdapter } from "./adapters";
import type { NatalChart, TransitChart, TransitHit } from "./types";

// Transit hesaplama — public API.
export async function calculateTransits(
  natal: NatalChart,
  date: Date = new Date(),
): Promise<TransitChart> {
  const adapter = getAstrologyAdapter();
  return adapter.computeTransit(natal, date);
}

// Transitleri hız sınıfına göre grupla (UI için)
export function groupTransits(transit: TransitChart): {
  slow: TransitHit[];
  fast: TransitHit[];
  moon: TransitHit[];
} {
  return {
    slow: transit.hits.filter((h) => h.speedClass === "slow"),
    fast: transit.hits.filter((h) => h.speedClass === "fast"),
    moon: transit.hits.filter((h) => h.speedClass === "moon"),
  };
}
