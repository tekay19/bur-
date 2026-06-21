import type {
  ChartScores,
  HouseAnalysis,
  NatalChart,
  PlanetName,
  ScoreDetail,
  TransitChart,
} from "./types";

// ============================================================
// Skorlama sistemi (deterministik DEĞİL — ağırlıklı sembolik yorum)
// Her skor 0-100 arası; yanında açıklama, destekleyen ve zorlayan
// göstergeler döner. Skorlar kesin sonuç değil, eğilim gösterir.
// ============================================================

const DISCLAIMER =
  "Bu skor astrolojik sembollerin ağırlıklandırılmış yorumudur; kesin sonuç değil eğilim gösterir.";

function labelFor(value: number): string {
  if (value <= 30) return "Düşük destek";
  if (value <= 55) return "Karışık dönem";
  if (value <= 75) return "Destekleyici dönem";
  return "Güçlü fırsat dönemi";
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

function planet(natal: NatalChart, name: PlanetName) {
  return natal.planets.find((p) => p.name === name);
}

function house(houses: HouseAnalysis[], num: number) {
  return houses.find((h) => h.house === num);
}

// Belirli natal noktalara/evlere GELEN transit etkilerini topla.
// NOT: Sadece transitin HEDEFİ (natal nokta veya ev) eşleşirse sayılır.
// (Eskiden transit gezegenin kendisi de eşleştiriliyordu; bu, yavaş
//  gezegenlerin tüm açılarını sayarak skoru 100'e doyuruyordu — düzeltildi.)
function transitImpact(
  transit: TransitChart,
  targets: string[],
): { support: number; challenge: number; hits: typeof transit.hits } {
  let support = 0;
  let challenge = 0;
  const relevant = transit.hits.filter((h) =>
    targets.includes(String(h.target)),
  );
  for (const h of relevant) {
    const w = h.score / 100;
    if (h.polarity === "Destekleyici") support += w * 1.2;
    else if (h.polarity === "Zorlayıcı") challenge += w;
    else support += w * 0.4;
  }
  return { support, challenge, hits: relevant };
}

// Transit katkısını sınırlı bir banda sıkıştır (doymayı önler).
function transitContribution(
  t: { support: number; challenge: number },
  scale = 6,
  cap = 16,
): number {
  const net = t.support - t.challenge * 0.8;
  return Math.max(-cap, Math.min(cap, net * scale));
}

interface ScoreBuild {
  base: number;
  supporting: string[];
  challenging: string[];
}

function finalize(
  category: string,
  build: ScoreBuild,
  explanation: string,
): ScoreDetail {
  const value = clamp(build.base);
  return {
    value,
    category,
    label: labelFor(value),
    explanation: `${explanation} ${DISCLAIMER}`,
    supporting: build.supporting.slice(0, 5),
    challenging: build.challenging.slice(0, 5),
  };
}

export function calculateScores(
  natal: NatalChart,
  houses: HouseAnalysis[],
  transit: TransitChart,
): ChartScores {
  const hasHouses = natal.meta.hasHouses;

  // ---- Genel skor ----
  const overall = buildOverall(natal, houses, transit);

  // ---- Kariyer ----
  const career = buildCareer(natal, houses, transit, hasHouses);

  // ---- Sınav / Atanma ----
  const examAppointment = buildExam(natal, houses, transit, hasHouses);

  // ---- İlişki ----
  const relationship = buildRelationship(natal, houses, transit, hasHouses);

  // ---- Para ----
  const money = buildMoney(natal, houses, transit, hasHouses);

  // ---- Sağlık & Rutin ----
  const healthRoutine = buildHealth(natal, houses, transit, hasHouses);

  // ---- Eğitim ----
  const education = buildEducation(natal, houses, transit, hasHouses);

  return {
    overall,
    career,
    examAppointment,
    relationship,
    money,
    healthRoutine,
    education,
  };
}

function buildOverall(
  natal: NatalChart,
  houses: HouseAnalysis[],
  transit: TransitChart,
): ScoreDetail {
  const supporting: string[] = [];
  const challenging: string[] = [];
  let base = 50;

  // Açı uyumu
  const harmonious = natal.aspects.filter(
    (a) => a.polarity === "Destekleyici",
  ).length;
  const tense = natal.aspects.filter((a) => a.polarity === "Zorlayıcı").length;
  base += (harmonious - tense) * 2;
  if (harmonious > tense)
    supporting.push(`${harmonious} destekleyici açı haritada akış sağlıyor`);
  if (tense > harmonious)
    challenging.push(`${tense} zorlayıcı açı gelişim alanı yaratıyor`);

  // Dignity dengesi
  const dignSum = natal.planets.reduce(
    (s, p) => s + (p.dignity?.score ?? 0),
    0,
  );
  base += dignSum * 0.8;
  const strong = natal.planets.filter((p) => (p.dignity?.score ?? 0) >= 4);
  if (strong.length)
    supporting.push(
      `${strong.map((p) => p.name).join(", ")} güçlü konumda`,
    );

  // Güncel transit dengesi (en güçlü 6)
  const top = transit.hits.slice(0, 8);
  const tSupport = top.filter((h) => h.polarity === "Destekleyici").length;
  const tChallenge = top.filter((h) => h.polarity === "Zorlayıcı").length;
  base += (tSupport - tChallenge) * 2;
  if (tSupport) supporting.push(`Güncel transitlerde ${tSupport} destekleyici etki`);
  if (tChallenge)
    challenging.push(`Güncel transitlerde ${tChallenge} zorlayıcı etki`);

  return finalize(
    "Genel Enerji",
    { base, supporting, challenging },
    "Natal denge ve güncel transitlerin bütünsel görünümü.",
  );
}

function buildCareer(
  natal: NatalChart,
  houses: HouseAnalysis[],
  transit: TransitChart,
  hasHouses: boolean,
): ScoreDetail {
  const supporting: string[] = [];
  const challenging: string[] = [];
  let base = 48;

  if (hasHouses) {
    const h10 = house(houses, 10);
    if (h10) {
      base += (h10.score - 50) * 0.4;
      if (h10.polarity === "Destekleyici") {
        supporting.push("10. ev (kariyer) destekleyici çalışıyor");
        base += 6;
      } else if (h10.polarity === "Zorlayıcı") {
        challenging.push("10. ev (kariyer) çaba isteyen bir alanda");
      }
    }
  } else {
    challenging.push(
      "Doğum saati bilinmediği için kariyer (10. ev) analizi sınırlı",
    );
  }

  // Satürn (kariyer omurgası) + Jüpiter (fırsat)
  const saturn = planet(natal, "Satürn");
  const jupiter = planet(natal, "Jüpiter");
  if (saturn && (saturn.dignity?.score ?? 0) >= 0) {
    supporting.push("Satürn dengeli — disiplinli ilerleme");
    base += 4;
  } else if (saturn) {
    challenging.push("Satürn zorlu konumda — sabır gerektirir");
  }
  if (jupiter && (jupiter.dignity?.score ?? 0) > 0) {
    supporting.push("Jüpiter fırsatları destekliyor");
    base += 5;
  }

  // MC / 10. ev / Satürn / Jüpiter transitleri
  const t = transitImpact(transit, ["MC", "Satürn", "Jüpiter", "Güneş", "10. Ev"]);
  base += transitContribution(t);
  collectTransit(t.hits, supporting, challenging);

  return finalize(
    "Kariyer",
    { base, supporting, challenging },
    "10. ev, Satürn/Jüpiter dengesi ve kariyer noktalarına gelen transitler.",
  );
}

function buildExam(
  natal: NatalChart,
  houses: HouseAnalysis[],
  transit: TransitChart,
  hasHouses: boolean,
): ScoreDetail {
  const supporting: string[] = [];
  const challenging: string[] = [];
  let base = 47;

  // Merkür (öğrenme/sınav), Mars (motivasyon)
  const mercury = planet(natal, "Merkür");
  const mars = planet(natal, "Mars");
  if (mercury && (mercury.dignity?.score ?? 0) >= 0) {
    supporting.push("Merkür güçlü — öğrenme ve sınav zihni destekli");
    base += 6;
  } else if (mercury) {
    challenging.push("Merkür zorlu — odak için ekstra çalışma gerekebilir");
  }
  if (mars && (mars.dignity?.score ?? 0) >= 0) {
    supporting.push("Mars motivasyon ve disiplin için elverişli");
    base += 4;
  }

  if (hasHouses) {
    for (const num of [10, 6, 9]) {
      const h = house(houses, num);
      if (!h) continue;
      if (h.polarity === "Destekleyici") {
        supporting.push(`${num}. ev destekleyici`);
        base += 4;
      } else if (h.polarity === "Zorlayıcı") {
        challenging.push(`${num}. ev çaba istiyor`);
        base -= 1;
      }
    }
  } else {
    challenging.push("Doğum saati yok — ev temelli sınav analizi sınırlı");
  }

  // Jüpiter & Satürn transitleri belirleyici
  const t = transitImpact(transit, [
    "Jüpiter",
    "Satürn",
    "Merkür",
    "MC",
    "Güneş",
    "10. Ev",
    "9. Ev",
    "6. Ev",
  ]);
  base += transitContribution(t, 7, 20); // sınav/atanma: transit ağırlığı biraz daha yüksek
  collectTransit(t.hits, supporting, challenging);

  return finalize(
    "Sınav / Atanma",
    { base, supporting, challenging },
    "10/6/9. evler, Merkür-Mars durumu ve Jüpiter-Satürn transitleri bir arada değerlendirildi.",
  );
}

function buildRelationship(
  natal: NatalChart,
  houses: HouseAnalysis[],
  transit: TransitChart,
  hasHouses: boolean,
): ScoreDetail {
  const supporting: string[] = [];
  const challenging: string[] = [];
  let base = 50;

  const venus = planet(natal, "Venüs");
  if (venus && (venus.dignity?.score ?? 0) >= 0) {
    supporting.push("Venüs uyumlu — ilişki ve çekim destekli");
    base += 6;
  } else if (venus) {
    challenging.push("Venüs zorlu — ilişkide farkındalık gerekebilir");
  }

  if (hasHouses) {
    for (const num of [7, 5]) {
      const h = house(houses, num);
      if (!h) continue;
      if (h.polarity === "Destekleyici") {
        supporting.push(`${num}. ev destekleyici`);
        base += 4;
      } else if (h.polarity === "Zorlayıcı")
        challenging.push(`${num}. ev gerilimli`);
    }
  }

  const t = transitImpact(transit, ["Venüs", "Ay", "7. Ev", "5. Ev"]);
  base += transitContribution(t);
  collectTransit(t.hits, supporting, challenging);

  return finalize(
    "İlişki",
    { base, supporting, challenging },
    "Venüs durumu, 7/5. evler ve ilişki noktalarına gelen transitler.",
  );
}

function buildMoney(
  natal: NatalChart,
  houses: HouseAnalysis[],
  transit: TransitChart,
  hasHouses: boolean,
): ScoreDetail {
  const supporting: string[] = [];
  const challenging: string[] = [];
  let base = 49;

  const jupiter = planet(natal, "Jüpiter");
  const venus = planet(natal, "Venüs");
  if (jupiter && (jupiter.dignity?.score ?? 0) > 0) {
    supporting.push("Jüpiter — bolluk ve fırsat eğilimi");
    base += 5;
  }
  if (venus && (venus.dignity?.score ?? 0) >= 0) {
    supporting.push("Venüs — değer ve kazanç desteği");
    base += 3;
  }

  if (hasHouses) {
    for (const num of [2, 8]) {
      const h = house(houses, num);
      if (!h) continue;
      if (h.polarity === "Destekleyici") {
        supporting.push(`${num}. ev destekleyici`);
        base += 4;
      } else if (h.polarity === "Zorlayıcı")
        challenging.push(`${num}. ev dikkat istiyor`);
    }
  }

  const t = transitImpact(transit, ["Jüpiter", "Venüs", "2. Ev", "8. Ev"]);
  base += transitContribution(t);
  collectTransit(t.hits, supporting, challenging);

  return finalize(
    "Para",
    { base, supporting, challenging },
    "Jüpiter-Venüs, 2/8. evler ve maddi alanlara gelen transitler.",
  );
}

function buildHealth(
  natal: NatalChart,
  houses: HouseAnalysis[],
  transit: TransitChart,
  hasHouses: boolean,
): ScoreDetail {
  const supporting: string[] = [];
  const challenging: string[] = [];
  let base = 52;

  if (hasHouses) {
    const h6 = house(houses, 6);
    if (h6) {
      if (h6.polarity === "Destekleyici") {
        supporting.push("6. ev (rutin/sağlık) dengeli");
        base += 5;
      } else if (h6.polarity === "Zorlayıcı") {
        challenging.push("6. ev — rutin ve dinlenmeye özen gerekebilir");
        base -= 2;
      }
    }
  } else {
    challenging.push("Doğum saati yok — 6. ev (sağlık rutini) analizi sınırlı");
  }

  const t = transitImpact(transit, ["Satürn", "Mars", "6. Ev"]);
  base += transitContribution(t, 5, 14);
  collectTransit(t.hits, supporting, challenging);

  return finalize(
    "Sağlık & Rutin",
    { base, supporting, challenging },
    "6. ev, Mars-Satürn dengesi ve rutin alanına gelen transitler. Tıbbi tavsiye değildir.",
  );
}

function buildEducation(
  natal: NatalChart,
  houses: HouseAnalysis[],
  transit: TransitChart,
  hasHouses: boolean,
): ScoreDetail {
  const supporting: string[] = [];
  const challenging: string[] = [];
  let base = 50;

  const mercury = planet(natal, "Merkür");
  const jupiter = planet(natal, "Jüpiter");
  if (mercury && (mercury.dignity?.score ?? 0) >= 0) {
    supporting.push("Merkür — öğrenme ve kavrama desteği");
    base += 5;
  }
  if (jupiter && (jupiter.dignity?.score ?? 0) > 0) {
    supporting.push("Jüpiter — yüksek eğitim ve genişleme");
    base += 4;
  }

  if (hasHouses) {
    for (const num of [3, 9]) {
      const h = house(houses, num);
      if (!h) continue;
      if (h.polarity === "Destekleyici") {
        supporting.push(`${num}. ev destekleyici`);
        base += 4;
      } else if (h.polarity === "Zorlayıcı")
        challenging.push(`${num}. ev çaba istiyor`);
    }
  }

  const t = transitImpact(transit, ["Merkür", "Jüpiter", "3. Ev", "9. Ev"]);
  base += transitContribution(t);
  collectTransit(t.hits, supporting, challenging);

  return finalize(
    "Eğitim",
    { base, supporting, challenging },
    "Merkür-Jüpiter, 3/9. evler ve öğrenme alanına gelen transitler.",
  );
}

function collectTransit(
  hits: TransitChart["hits"],
  supporting: string[],
  challenging: string[],
) {
  for (const h of hits.slice(0, 3)) {
    const text = `Transit ${h.transitPlanet} → ${h.target} (${h.aspect})`;
    if (h.polarity === "Destekleyici" && supporting.length < 5)
      supporting.push(text);
    else if (h.polarity === "Zorlayıcı" && challenging.length < 5)
      challenging.push(text);
  }
}
