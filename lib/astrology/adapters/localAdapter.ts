import { calculateAspects, findTransitAspect } from "../aspects";
import {
  SIGN_ELEMENT,
  SIGN_MODALITY,
  signFromLongitude,
} from "../constants";
import { computeDignity } from "../dignities";
import { plainTransitNote, plainTransitTheme } from "../plainLanguage";
import {
  ALL_PLANETS,
  computeAscMc,
  computePlanets,
  julianDay,
  norm360,
  obliquity,
} from "../ephemeris";
import { buildPlacidusHouses, houseOfLongitude } from "../houses";
import type {
  AstrologyAdapter,
  BirthInput,
  Element,
  Modality,
  NatalChart,
  PlanetName,
  PlanetPosition,
  Strength,
  TransitChart,
  TransitHit,
} from "../types";
import { buildUtcDate } from "@/lib/utils/timezone";

// Yavaş (jenerasyonel/sosyal) gezegenler — transitte daha önemli
const SLOW_PLANETS: PlanetName[] = [
  "Jüpiter",
  "Satürn",
  "Uranüs",
  "Neptün",
  "Plüton",
];

function strengthFromDignity(score: number, aspectSupport: number): Strength {
  const total = score + aspectSupport;
  if (total >= 4) return "Güçlü";
  if (total >= 1) return "Destekleyici";
  if (total <= -3) return "Zayıf";
  return "Karışık";
}

function buildPlanetNote(p: PlanetPosition): string {
  const dig = p.dignity?.status ?? "Nötr";
  const retro = p.retrograde ? " Retro hareketiyle içe dönük çalışıyor." : "";
  const houseText = p.house ? ` ${p.house}. evde etkin.` : "";
  const digText =
    dig === "Yönetici" || dig === "Yücelme"
      ? "Güçlü ve rahat konumda."
      : dig === "Zarar" || dig === "Düşüş"
        ? "Zorlu konumda, çaba ister."
        : "Dengeli konumda.";
  return `${p.sign} burcunda${houseText} ${digText}${retro}`;
}

export class LocalAstrologyAdapter implements AstrologyAdapter {
  readonly name = "local";

  async computeNatal(input: BirthInput): Promise<NatalChart> {
    const { utc, usedTime } = buildUtcDate(
      input.date,
      input.time,
      input.timezone,
    );
    const hasHouses = usedTime && input.birthTimeAccuracy !== "unknown";
    const jd = julianDay(utc);

    const raw = computePlanets(jd);

    let ascendant: number | null = null;
    let midheaven: number | null = null;
    let houses: ReturnType<typeof buildPlacidusHouses> = [];
    if (hasHouses) {
      const am = computeAscMc(jd, input.latitude, input.longitude);
      ascendant = am.ascendant;
      midheaven = am.midheaven;
      houses = buildPlacidusHouses(
        ascendant,
        midheaven,
        am.ramc,
        input.latitude,
        obliquity(jd),
      );
    }

    // Gezegen konumları
    const planets: PlanetPosition[] = raw.map((r) => {
      const { sign, signDegree } = signFromLongitude(r.lon);
      const dignity = computeDignity(r.name, sign);
      const house = houseOfLongitude(r.lon, hasHouses ? houses : null);
      const pos: PlanetPosition = {
        name: r.name,
        longitude: Number(r.lon.toFixed(4)),
        sign,
        signDegree: Number(signDegree.toFixed(2)),
        house,
        retrograde: r.retrograde && r.name !== "Güneş" && r.name !== "Ay",
        speed: Number(r.speed.toFixed(4)),
        dignity,
      };
      return pos;
    });

    // Yükselen ve MC'yi nokta olarak ekle
    const points: PlanetPosition[] = [...planets];
    if (ascendant !== null && midheaven !== null) {
      const asc = signFromLongitude(ascendant);
      const mc = signFromLongitude(midheaven);
      points.push({
        name: "Yükselen",
        longitude: Number(ascendant.toFixed(4)),
        sign: asc.sign,
        signDegree: Number(asc.signDegree.toFixed(2)),
        house: 1,
        retrograde: false,
        speed: 0,
      });
      points.push({
        name: "MC",
        longitude: Number(midheaven.toFixed(4)),
        sign: mc.sign,
        signDegree: Number(mc.signDegree.toFixed(2)),
        house: 10,
        retrograde: false,
        speed: 0,
      });
    }

    // Açılar (Yükselen/MC dahil)
    const aspects = calculateAspects(points);

    // Güç durumu (dignity + açı desteği)
    for (const p of planets) {
      let aspectSupport = 0;
      for (const a of aspects) {
        if (a.planet1 === p.name || a.planet2 === p.name) {
          if (a.polarity === "Destekleyici") aspectSupport += 0.5;
          if (a.polarity === "Zorlayıcı") aspectSupport -= 0.5;
        }
      }
      p.strength = strengthFromDignity(p.dignity?.score ?? 0, aspectSupport);
    }

    // Baskınlıklar
    const elementBreakdown: Record<Element, number> = {
      Ateş: 0,
      Toprak: 0,
      Hava: 0,
      Su: 0,
    };
    const modalityBreakdown: Record<Modality, number> = {
      Öncü: 0,
      Sabit: 0,
      Değişken: 0,
    };
    // Ağırlıklar: kişisel gezegenler + ışıklar daha baskın
    const weights: Partial<Record<PlanetName, number>> = {
      Güneş: 3,
      Ay: 3,
      Merkür: 2,
      Venüs: 2,
      Mars: 2,
      Jüpiter: 1,
      Satürn: 1,
      Uranüs: 1,
      Neptün: 1,
      Plüton: 1,
    };
    for (const p of planets) {
      const w = weights[p.name as PlanetName] ?? 1;
      elementBreakdown[SIGN_ELEMENT[p.sign]] += w;
      modalityBreakdown[SIGN_MODALITY[p.sign]] += w;
    }
    // Yükselen de elemente katkı verir
    if (ascendant !== null) {
      const ascSign = signFromLongitude(ascendant).sign;
      elementBreakdown[SIGN_ELEMENT[ascSign]] += 2;
      modalityBreakdown[SIGN_MODALITY[ascSign]] += 2;
    }

    const dominantElement = (Object.entries(elementBreakdown).sort(
      (a, b) => b[1] - a[1],
    )[0][0] as Element);
    const dominantModality = (Object.entries(modalityBreakdown).sort(
      (a, b) => b[1] - a[1],
    )[0][0] as Modality);

    const ranked = [...planets].sort(
      (a, b) =>
        (b.dignity?.score ?? 0) - (a.dignity?.score ?? 0),
    );
    const strongest = ranked
      .filter((p) => (p.dignity?.score ?? 0) > 0 || p.strength === "Güçlü")
      .slice(0, 3)
      .map((p) => p.name as PlanetName);
    const challenging = ranked
      .filter((p) => (p.dignity?.score ?? 0) < 0 || p.strength === "Zayıf")
      .slice(-3)
      .map((p) => p.name as PlanetName);

    return {
      meta: {
        adapter: this.name,
        julianDay: Number(jd.toFixed(5)),
        hasHouses,
        birthTimeAccuracy: input.birthTimeAccuracy,
        computedAt: new Date().toISOString(),
      },
      planets,
      houses,
      aspects,
      ascendant,
      midheaven,
      dominants: {
        element: dominantElement,
        modality: dominantModality,
        elementBreakdown,
        modalityBreakdown,
        strongest:
          strongest.length > 0 ? strongest : [planets[0].name as PlanetName],
        challenging,
      },
    };
  }

  async computeTransit(
    natal: NatalChart,
    date: Date,
  ): Promise<TransitChart> {
    const jd = julianDay(date);
    const raw = computePlanets(jd);

    const positions: PlanetPosition[] = raw.map((r) => {
      const { sign, signDegree } = signFromLongitude(r.lon);
      return {
        name: r.name,
        longitude: Number(r.lon.toFixed(4)),
        sign,
        signDegree: Number(signDegree.toFixed(2)),
        house: houseOfLongitude(
          r.lon,
          natal.meta.hasHouses ? natal.houses : null,
        ),
        retrograde: r.retrograde && r.name !== "Güneş" && r.name !== "Ay",
        speed: Number(r.speed.toFixed(4)),
      };
    });

    const hits: TransitHit[] = [];

    for (const tp of positions) {
      const speedClass: TransitHit["speedClass"] =
        tp.name === "Ay"
          ? "moon"
          : SLOW_PLANETS.includes(tp.name as PlanetName)
            ? "slow"
            : "fast";

      // 1) Natal gezegenlere açılar
      for (const np of natal.planets) {
        const asp = findTransitAspect(tp.longitude, np.longitude);
        if (!asp) continue;
        // Sadece anlamlı transitler: yavaşlar her şey, hızlılar sadece ışıklar+kişiseller
        const score = transitScore(
          tp.name as PlanetName,
          asp.polarity,
          asp.orb,
          speedClass,
        );
        const window = transitWindow(date, tp.speed, asp.orb, speedClass);
        hits.push({
          transitPlanet: tp.name as PlanetName,
          targetType: "planet",
          target: np.name,
          aspect: asp.type,
          orb: asp.orb,
          polarity: asp.polarity,
          score,
          speedClass,
          theme: plainTransitTheme(tp.name as PlanetName),
          note: plainTransitNote(tp.name as PlanetName, np.name, asp.polarity),
          window,
        });
      }

      // 2) Yavaş gezegenlerin ev geçişleri (natal evlerde)
      if (speedClass === "slow" && tp.house && natal.meta.hasHouses) {
        hits.push({
          transitPlanet: tp.name as PlanetName,
          targetType: "house",
          target: `${tp.house}. Ev`,
          aspect: "Geçiş",
          orb: 0,
          polarity: housePolarity(tp.name as PlanetName),
          score: 60,
          speedClass,
          theme: plainTransitTheme(tp.name as PlanetName),
          note: plainTransitNote(
            tp.name as PlanetName,
            `${tp.house}. Ev`,
            housePolarity(tp.name as PlanetName),
          ),
          window: {
            start: new Date(date.getTime()).toISOString(),
            peak: new Date(date.getTime()).toISOString(),
            end: new Date(date.getTime()).toISOString(),
          },
        });
      }
    }

    // En etkili transitler önce
    hits.sort((a, b) => b.score - a.score);

    return {
      meta: {
        adapter: this.name,
        date: date.toISOString(),
        julianDay: Number(jd.toFixed(5)),
      },
      positions,
      hits,
    };
  }
}

function transitScore(
  planet: PlanetName,
  polarity: string,
  orb: number,
  speedClass: TransitHit["speedClass"],
): number {
  const base =
    speedClass === "slow" ? 70 : speedClass === "moon" ? 35 : 50;
  const orbFactor = Math.max(0, 1 - orb / 5);
  let score = base * (0.6 + 0.4 * orbFactor);
  if (polarity === "Destekleyici") score += 8;
  if (polarity === "Zorlayıcı") score += 5; // zorlayıcı da güçlü etkidir
  return Math.round(Math.min(100, score));
}

// Etki penceresi tahmini (yaklaşık): gezegen hızına göre orb'un kapanma süresi
function transitWindow(
  date: Date,
  speed: number,
  orb: number,
  speedClass: TransitHit["speedClass"],
) {
  const dayMs = 86400000;
  // orb derecesini geçmek için gereken gün sayısı (yaklaşık)
  const spd = Math.max(Math.abs(speed), 0.001);
  const daysToClose = Math.min(orb / spd, speedClass === "slow" ? 120 : 30);
  const half = daysToClose * dayMs;
  return {
    start: new Date(date.getTime() - half).toISOString(),
    peak: new Date(date.getTime()).toISOString(),
    end: new Date(date.getTime() + half).toISOString(),
  };
}

function housePolarity(planet: PlanetName) {
  if (planet === "Jüpiter") return "Destekleyici" as const;
  if (["Satürn", "Plüton", "Neptün"].includes(planet))
    return "Zorlayıcı" as const;
  return "Karışık" as const;
}

