import { ASPECT_DEFS } from "./aspects";
import { computePlanets, julianDay } from "./ephemeris";
import { plainTransitNote, plainTransitTheme } from "./plainLanguage";
import type {
  AspectType,
  NatalChart,
  PlanetName,
  Polarity,
} from "./types";

// ============================================================
// Transit tahmini (zaman çizelgesi)
// Önümüzdeki N ayda yavaş transit gezegenlerinin natal noktalara
// TAM açı yaptığı tarihleri tarayarak bulur. "Bugün" anlık görüntüsü
// yerine gerçek, tarihli zamanlama sağlar (sınav/atanma için kritik).
// ============================================================

// Zamanlama açısından anlamlı (yavaş) transit gezegenleri
const TRANSIT_PLANETS: PlanetName[] = [
  "Jüpiter",
  "Satürn",
  "Uranüs",
  "Neptün",
  "Plüton",
];

// Her açı tipi için hedef "işaretli açısal fark" (delta = tLon - natalLon)
const ASPECT_DELTAS: Record<AspectType, number[]> = {
  Kavuşum: [0],
  Altmışlık: [60, -60],
  Kare: [90, -90],
  Üçgen: [120, -120],
  Karşıt: [180],
};

export interface TransitEvent {
  transitPlanet: PlanetName;
  natalTarget: string; // natal gezegen adı veya "MC" / "Yükselen"
  aspect: AspectType;
  exactDate: string; // ISO tarih
  polarity: Polarity;
  retrograde: boolean; // transit gezegen o an retro mu
  theme: string;
  note: string;
}

function wrap180(x: number): number {
  return ((((x + 180) % 360) + 360) % 360) - 180;
}

const BENEFIC: PlanetName[] = ["Venüs", "Jüpiter"];
const MALEFIC: PlanetName[] = ["Satürn", "Mars", "Plüton"];

function polarityFor(
  type: AspectType,
  tp: PlanetName,
  target: string,
): Polarity {
  const def = ASPECT_DEFS.find((d) => d.type === type)!;
  if (type !== "Kavuşum") return def.polarity;
  // Kavuşumu gezegen doğasına göre incelt
  const pts = [tp, target as PlanetName];
  const hard = pts.filter((p) => MALEFIC.includes(p)).length;
  const soft = pts.filter((p) => BENEFIC.includes(p)).length;
  if (soft >= 1 && hard === 0) return "Destekleyici";
  if (hard >= 1 && soft === 0) return "Zorlayıcı";
  return "Karışık";
}

// Önümüzdeki `months` ay için tarihli transit olayları
export function forecastTransits(
  natal: NatalChart,
  from: Date = new Date(),
  months = 12,
): TransitEvent[] {
  const days = Math.round(months * 30.44);

  // Natal hedefler: 10 gezegen + (varsa) MC ve Yükselen
  const targets: { name: string; lon: number }[] = natal.planets
    .filter((p) => p.name !== "Yükselen" && p.name !== "MC")
    .map((p) => ({ name: p.name, lon: p.longitude }));
  if (natal.midheaven !== null)
    targets.push({ name: "MC", lon: natal.midheaven });
  if (natal.ascendant !== null)
    targets.push({ name: "Yükselen", lon: natal.ascendant });

  // Günlük transit gezegen boylam/hız serisi (tek seferde hesapla)
  const series: { date: Date; lon: Record<string, number>; spd: Record<string, number> }[] = [];
  for (let d = 0; d <= days; d++) {
    const date = new Date(from.getTime() + d * 86400000);
    const pos = computePlanets(julianDay(date));
    const lon: Record<string, number> = {};
    const spd: Record<string, number> = {};
    for (const p of pos) {
      if (TRANSIT_PLANETS.includes(p.name)) {
        lon[p.name] = p.lon;
        spd[p.name] = p.speed;
      }
    }
    series.push({ date, lon, spd });
  }

  const events: TransitEvent[] = [];

  for (const tp of TRANSIT_PLANETS) {
    for (const tgt of targets) {
      for (const def of ASPECT_DEFS) {
        for (const v of ASPECT_DELTAS[def.type]) {
          let prevG: number | null = null;
          for (let d = 0; d < series.length; d++) {
            const delta = wrap180(series[d].lon[tp] - tgt.lon);
            const g = wrap180(delta - v);
            if (prevG !== null && prevG * g < 0 && Math.abs(prevG - g) < 30) {
              // prevG -> g arası sıfır geçişi: tam açı tarihi (lineer interpolasyon)
              const frac = prevG / (prevG - g);
              const t0 = series[d - 1].date.getTime();
              const t1 = series[d].date.getTime();
              const exact = new Date(t0 + frac * (t1 - t0));
              const retro = (series[d].spd[tp] ?? 0) < 0;
              const polarity = polarityFor(def.type, tp, tgt.name);
              events.push({
                transitPlanet: tp,
                natalTarget: tgt.name,
                aspect: def.type,
                exactDate: exact.toISOString(),
                polarity,
                retrograde: retro,
                theme: plainTransitTheme(tp),
                note:
                  plainTransitNote(tp, tgt.name, polarity) +
                  (retro
                    ? " (Bu konu geri hareket nedeniyle birkaç kez gündeme gelebilir.)"
                    : ""),
              });
            }
            prevG = g;
          }
        }
      }
    }
  }

  events.sort((a, b) => a.exactDate.localeCompare(b.exactDate));
  return events;
}

// Olayları takvim dönemlerine grupla (UI ve AI için)
export interface ForecastPeriod {
  key: string;
  label: string;
  events: TransitEvent[];
}

export function groupForecastByPeriod(
  events: TransitEvent[],
  from: Date = new Date(),
): ForecastPeriod[] {
  const day = 86400000;
  const buckets: { key: string; label: string; end: number }[] = [
    { key: "month", label: "Bu ay", end: from.getTime() + 31 * day },
    { key: "3months", label: "Önümüzdeki 3 ay", end: from.getTime() + 92 * day },
    { key: "6months", label: "Önümüzdeki 6 ay", end: from.getTime() + 183 * day },
    { key: "year", label: "Önümüzdeki 1 yıl", end: from.getTime() + 366 * day },
  ];
  const result: ForecastPeriod[] = buckets.map((b) => ({
    key: b.key,
    label: b.label,
    events: [],
  }));
  for (const e of events) {
    const t = new Date(e.exactDate).getTime();
    const idx = buckets.findIndex((b) => t <= b.end);
    if (idx >= 0) result[idx].events.push(e);
  }
  return result;
}
