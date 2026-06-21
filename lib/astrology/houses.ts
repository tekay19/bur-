import { SIGN_RULER, signFromLongitude } from "./constants";
import { HOUSE_MEANINGS } from "./constants";
import { norm360 } from "./ephemeris";
import type {
  Aspect,
  HouseAnalysis,
  HousePosition,
  PlanetName,
  PlanetPosition,
  Polarity,
} from "./types";

// ============================================================
// Ev sistemi: PLACIDUS (varsayılan)
// astro.com ve çoğu Türkçe astroloji uygulamasının varsayılanı.
// Ev sınırları (cusp) dereceye göre değişir; bir ev birden fazla
// burcu kapsayabilir. Yüksek enlemlerde (>66°) güvenilmez olduğundan
// bu durumda Whole Sign'a geri düşülür.
//
// Whole Sign (Tam Burç) hâlâ `buildWholeSignHouses` ile kullanılabilir.
// ============================================================

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

// --- Placidus ara ev (cusp) hesabı (11, 12, 2, 3) ---
// theta = RAMC (derece), lat = enlem (derece), obl = ekliptik eğimi (derece)
function placidusIntermediate(
  theta: number,
  lat: number,
  obl: number,
  kind: 2 | 3 | 11 | 12,
): number {
  const latR = lat * DEG;
  const oblR = obl * DEG;

  // Başlangıç saat açısı tahmini (derece)
  let H =
    kind === 11 ? -30 : kind === 12 ? -60 : kind === 2 ? -120 : -150;

  for (let i = 0; i < 50; i++) {
    // Saat açısı H = LST - α  =>  α = RAMC - H
    const alpha = norm360(theta - H) * DEG;
    // Ekliptik üzerindeki noktanın deklinasyonu: tan δ = tan ε · sin α
    const decl = Math.atan(Math.tan(oblR) * Math.sin(alpha));
    // Yükseliş farkı (ascensional difference)
    const sinAd = Math.max(-1, Math.min(1, Math.tan(latR) * Math.tan(decl)));
    const ad = Math.asin(sinAd) * RAD; // derece
    // DSA = 90+ad, NSA = 90-ad; cusp'a göre saat açısı:
    let Hnew: number;
    if (kind === 11) Hnew = -(1 / 3) * (90 + ad);
    else if (kind === 12) Hnew = -(2 / 3) * (90 + ad);
    else if (kind === 2) Hnew = -(120 + (2 / 3) * ad); // DSA + 1/3·NSA
    else Hnew = -(150 + (1 / 3) * ad); // DSA + 2/3·NSA

    if (Math.abs(Hnew - H) < 1e-7) {
      H = Hnew;
      break;
    }
    H = Hnew;
  }

  // RA -> ekliptik boylam: tan λ = tan α / cos ε
  const alpha = norm360(theta - H) * DEG;
  const lon =
    Math.atan2(Math.sin(alpha), Math.cos(alpha) * Math.cos(oblR)) * RAD;
  return norm360(lon);
}

function toHousePosition(house: number, cuspLongitude: number): HousePosition {
  const { sign, signDegree } = signFromLongitude(cuspLongitude);
  return {
    house,
    cuspLongitude: Number(cuspLongitude.toFixed(4)),
    sign,
    signDegree: Number(signDegree.toFixed(2)),
  };
}

// Placidus 12 ev sınırı. Açısal evler (1,4,7,10) hassas Asc/MC'den alınır.
export function buildPlacidusHouses(
  ascendant: number,
  midheaven: number,
  ramc: number,
  latitude: number,
  obliquity: number,
): HousePosition[] {
  // Yüksek enlemlerde Placidus tanımsız -> Whole Sign'a düş
  if (Math.abs(latitude) > 66) {
    return buildWholeSignHouses(ascendant);
  }

  const c: number[] = new Array(13).fill(0);
  c[1] = ascendant;
  c[10] = midheaven;
  c[7] = norm360(ascendant + 180);
  c[4] = norm360(midheaven + 180);

  c[11] = placidusIntermediate(ramc, latitude, obliquity, 11);
  c[12] = placidusIntermediate(ramc, latitude, obliquity, 12);
  c[2] = placidusIntermediate(ramc, latitude, obliquity, 2);
  c[3] = placidusIntermediate(ramc, latitude, obliquity, 3);

  // Karşı evler 180° simetrik
  c[5] = norm360(c[11] + 180);
  c[6] = norm360(c[12] + 180);
  c[8] = norm360(c[2] + 180);
  c[9] = norm360(c[3] + 180);

  const houses: HousePosition[] = [];
  for (let h = 1; h <= 12; h++) houses.push(toHousePosition(h, c[h]));
  return houses;
}

// Whole Sign (Tam Burç) — yedek / alternatif
export function buildWholeSignHouses(ascendant: number): HousePosition[] {
  const ascSignIndex = Math.floor(ascendant / 30) % 12;
  const houses: HousePosition[] = [];
  for (let h = 0; h < 12; h++) {
    const signIndex = (ascSignIndex + h) % 12;
    houses.push(toHousePosition(h + 1, signIndex * 30));
  }
  return houses;
}

// Bir boylamın hangi ev kavisinde olduğunu bul (cusp tabanlı, Placidus uyumlu)
export function houseOfLongitude(
  lon: number,
  houses: HousePosition[] | null,
): number | null {
  if (!houses || houses.length !== 12) return null;
  const x = norm360(lon);
  for (let i = 0; i < 12; i++) {
    const start = houses[i].cuspLongitude;
    const end = houses[(i + 1) % 12].cuspLongitude;
    if (inArc(x, start, end)) return houses[i].house;
  }
  return null;
}

function inArc(x: number, a: number, b: number): boolean {
  const A = norm360(a);
  const B = norm360(b);
  if (A <= B) return x >= A && x < B;
  return x >= A || x < B; // 0° sarması
}

// Ev başına çalışma durumu ve polarite analizi
export function analyzeHouses(
  planets: PlanetPosition[],
  houses: HousePosition[],
  aspects: Aspect[],
  hasHouses: boolean,
): HouseAnalysis[] {
  if (!hasHouses) {
    // Doğum saati yoksa ev analizi yapılamaz
    return [];
  }

  const malefics: PlanetName[] = ["Satürn", "Mars", "Plüton", "Neptün"];
  const benefics: PlanetName[] = ["Venüs", "Jüpiter", "Güneş"];

  return houses.map((house) => {
    const meaning = HOUSE_MEANINGS[house.house - 1];
    const ruler = SIGN_RULER[house.sign];
    const rulerPos = planets.find((p) => p.name === ruler);

    const planetsInHouse = planets
      .filter(
        (p) =>
          p.house === house.house &&
          p.name !== "Yükselen" &&
          p.name !== "MC",
      )
      .map((p) => p.name as PlanetName);

    // Polarite puanlaması
    let polScore = 0;
    for (const p of planetsInHouse) {
      if (benefics.includes(p)) polScore += 2;
      if (malefics.includes(p)) polScore -= 1.5;
    }

    // Yöneticinin onuru evin gücünü etkiler
    if (rulerPos?.dignity) {
      polScore += rulerPos.dignity.score * 0.4;
    }

    // Evdeki gezegenlere gelen açılar
    let aspectSupport = 0;
    for (const p of planetsInHouse) {
      for (const a of aspects) {
        if (a.planet1 === p || a.planet2 === p) {
          if (a.polarity === "Destekleyici") aspectSupport += 1;
          if (a.polarity === "Zorlayıcı") aspectSupport -= 1;
        }
      }
    }
    polScore += aspectSupport * 0.5;

    let polarity: Polarity;
    if (planetsInHouse.length === 0 && Math.abs(polScore) < 0.5) {
      polarity = "Belirsiz";
    } else if (polScore >= 1.5) {
      polarity = "Destekleyici";
    } else if (polScore <= -1.5) {
      polarity = "Zorlayıcı";
    } else {
      polarity = "Karışık";
    }

    const active = planetsInHouse.length > 0;

    // 0-100 skor
    const score = Math.max(
      5,
      Math.min(100, Math.round(50 + polScore * 10 + (active ? 8 : 0))),
    );

    const rulerSign = rulerPos
      ? signFromLongitude(rulerPos.longitude).sign
      : null;

    return {
      house: house.house,
      lifeArea: meaning.area,
      ruler,
      rulerSign,
      planetsInHouse,
      polarity,
      active,
      score,
      shortNote: buildHouseNote(
        house.house,
        meaning.title,
        planetsInHouse,
        polarity,
        active,
        ruler,
        rulerSign,
      ),
    };
  });
}

function buildHouseNote(
  houseNum: number,
  title: string,
  planets: PlanetName[],
  polarity: Polarity,
  active: boolean,
  ruler: PlanetName,
  rulerSign: string | null,
): string {
  const planetText =
    planets.length > 0
      ? `${planets.join(", ")} bu alanda etkin.`
      : "Bu evde gezegen yok; konu yöneticisi üzerinden çalışıyor.";

  const polText =
    polarity === "Destekleyici"
      ? "Genel olarak akışkan ve destekleyici."
      : polarity === "Zorlayıcı"
        ? "Çaba ve farkındalık isteyen, gelişime açık bir alan."
        : polarity === "Karışık"
          ? "Hem fırsat hem zorluk içeren karışık bir tablo."
          : "Sakin, arka planda çalışan bir alan.";

  const rulerText = rulerSign
    ? ` Ev yöneticisi ${ruler}, ${rulerSign} burcunda.`
    : "";

  return `${title}: ${planetText} ${polText}${rulerText}`;
}
