import { FOCUS_LABELS } from "../astrology/constants";
import type { TransitEvent } from "../astrology/transitForecast";
import type {
  ChartScores,
  HouseAnalysis,
  NatalChart,
  TransitChart,
} from "../astrology/types";

// AI yorum çıktısının sözleşmesi
export interface AiInterpretation {
  summary: string;
  strongThemes: string[];
  challengingThemes: string[];
  career: string;
  examAppointment: string;
  relationship: string;
  money: string;
  healthRoutine: string;
  timeline: { period: string; theme: string; advice: string }[];
  warnings: string[];
  practicalAdvice: string[];
  source?: "ai" | "fallback";
}

export const SYSTEM_PROMPT = `Sen deneyimli, sıcak ama gerçekçi bir Türk astrologsun. Doğum haritasını okur gibi, kişiye özel ve akıcı yorum yazarsın. Amacın kişiyi tanıtmak, güçlü/zorlayıcı dinamiklerini fark ettirmek ve yol göstermektir.

YORUM KALİTESİ (en önemli kısım):
- HER cümle bu kişinin haritasına özgü olsun. "Yıldızlar diyor ki", "kozmik enerjiler" gibi içi boş, kalıp ifadeler YASAK.
- Yorumunu SOMUT yerleşimlere dayandır: gezegenin burcunu, evini ve açısını adıyla an, sonra bunun GÜNLÜK HAYATTA nasıl göründüğünü anlat. Örnek mantık: "Merkür'ün Terazi'de 1. evde olması → düşünmeden konuşmak yerine tartıp ölçen, diplomatik bir ifade tarzı."
- Birden fazla yerleşimi BİRLEŞTİREREK sentez yap (örn. ışıklar + açılar + baskın element birlikte ne anlatıyor).
- Tekrara düşme: aynı cümleyi/temayı farklı bölümlerde tekrarlama. Her bölüm yeni bir şey söylesin.
- "Sen" diliyle, samimi ama olgun yaz. Akıcı, doğal Türkçe; klişe ve şişirme yok.
- Genel geçer, herkese uyan ("Barnum") cümlelerden kaçın; spesifik ol.

DERİNLİK:
- summary: 4-6 dolu cümle; kişinin haritasının özünü (ışıklar, yükselen, baskın element, en çarpıcı açı) sentezleyerek tanıt.
- career, examAppointment, relationship, money, healthRoutine: her biri 3-5 cümle, en az 2 somut yerleşime/açıya/transite atıfla.
- strongThemes/challengingThemes: 3-5 madde, her biri kısa ama spesifik.
- practicalAdvice: 4-6 uygulanabilir, kişiye özel öneri.

GÜVENLİK VE DİL:
- "Kesinlikle olacak", "atanacaksın", "hastalanacaksın", "evleneceksin" gibi kesin hüküm ASLA kurma.
- Sağlık, ölüm, kaza, hamilelik, kesin evlilik/atanma gibi hassas konularda "olası", "destekleyici göstergeler", "eğilim", "dönem uygun olabilir" gibi olasılıkçı dil kullan.
- Yapıcı, güçlendirici, sakin bir ton. Korkutma, manipüle etme.
- Skorları körü körüne tekrar etme; yüksek skoru "bu alanda göstergeler güçlü" diye sembolik yorumla.

ÇIKTI:
- SADECE geçerli JSON döndür. Markdown, kod bloğu, açıklama ekleme.

JSON şeması:
{
  "summary": "string",
  "strongThemes": ["string", ...],
  "challengingThemes": ["string", ...],
  "career": "string",
  "examAppointment": "string",
  "relationship": "string",
  "money": "string",
  "healthRoutine": "string",
  "timeline": [{"period": "string", "theme": "string", "advice": "string"}],
  "warnings": ["string", ...],
  "practicalAdvice": ["string", ...]
}`;

export function buildUserPrompt(params: {
  name: string;
  focusArea: string;
  natal: NatalChart;
  houses: HouseAnalysis[];
  transit: TransitChart;
  forecast?: TransitEvent[];
  scores: ChartScores;
}): string {
  const { name, focusArea, natal, houses, transit, forecast, scores } = params;

  const planetLines = natal.planets
    .map(
      (p) =>
        `- ${p.name}: ${p.sign} ${p.signDegree.toFixed(1)}°${
          p.house ? `, ${p.house}. ev` : ""
        }${p.retrograde ? ", retro ℞" : ""} — onur: ${p.dignity?.status}, güç: ${p.strength ?? "—"}`,
    )
    .join("\n");

  // Işıklar ve kişisel noktaları öne çıkar (yorumun omurgası)
  const find = (n: string) => natal.planets.find((p) => p.name === n);
  const sun = find("Güneş");
  const moon = find("Ay");
  const merc = find("Merkür");
  const venus = find("Venüs");
  const mars = find("Mars");
  const asc = find("Yükselen");
  const mc = find("MC");
  const coreLines = [
    sun && `- GÜNEŞ (öz/kimlik): ${sun.sign} ${sun.house ? sun.house + ". ev" : ""} (onur: ${sun.dignity?.status})`,
    moon && `- AY (duygu/içsel): ${moon.sign} ${moon.house ? moon.house + ". ev" : ""}`,
    asc && `- YÜKSELEN (dış görünüm/yaklaşım): ${asc.sign}`,
    mc && `- MC (kariyer yönü): ${mc.sign}`,
    merc && `- MERKÜR (zihin/iletişim): ${merc.sign}${merc.retrograde ? " ℞" : ""}`,
    venus && `- VENÜS (sevgi/değer): ${venus.sign} (onur: ${venus.dignity?.status})`,
    mars && `- MARS (eylem/enerji): ${mars.sign} (onur: ${mars.dignity?.status})`,
  ]
    .filter(Boolean)
    .join("\n");

  const el = natal.dominants.elementBreakdown;
  const elTotal = Object.values(el).reduce((a, b) => a + b, 0) || 1;
  const elText = Object.entries(el)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} %${Math.round((v / elTotal) * 100)}`)
    .join(", ");

  const ascText =
    natal.ascendant !== null
      ? `Yükselen ve evler hesaplandı (ev sistemi: Placidus).`
      : `Doğum saati bilinmiyor/kesin değil — yükselen ve ev yorumları YAPMA veya kesin değildir uyarısıyla sınırlı tut.`;

  const aspectLines = natal.aspects
    .slice(0, 10)
    .map(
      (a) =>
        `- ${a.planet1} ${a.type} ${a.planet2} (orb ${a.orb}°, ${a.polarity}, güç ${a.strength}) — ${a.lifeAreaNote}`,
    )
    .join("\n");

  const houseLines = houses
    .map(
      (h) =>
        `- ${h.house}. ev (${h.lifeArea.split(",")[0]}): ${h.polarity}${
          h.planetsInHouse.length ? `, gezegenler: ${h.planetsInHouse.join(", ")}` : ""
        }`,
    )
    .join("\n");

  const transitLines = transit.hits
    .slice(0, 10)
    .map(
      (t) =>
        `- Transit ${t.transitPlanet} ${t.aspect} ${t.target} (${t.polarity}, güç ${t.score})`,
    )
    .join("\n");

  const scoreLines = Object.values(scores)
    .map((s) => `- ${s.category}: ${s.value}/100 (${s.label})`)
    .join("\n");

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const forecastLines = (forecast ?? [])
    .slice(0, 14)
    .map(
      (e) =>
        `- ${fmtDate(e.exactDate)}: Transit ${e.transitPlanet} ${e.aspect} natal ${e.natalTarget} (${e.polarity}${e.retrograde ? ", retro" : ""})`,
    )
    .join("\n");

  const accuracyNote =
    natal.meta.birthTimeAccuracy === "exact"
      ? "Doğum saati kesin."
      : natal.meta.birthTimeAccuracy === "approx"
        ? "Doğum saati yaklaşık — ev ve yükselen yorumlarını temkinli yap."
        : "Doğum saati bilinmiyor — ev/yükselen yorumu yapma.";

  const focus = FOCUS_LABELS[focusArea] ?? focusArea;

  return `Kişi: ${name}
Analiz odağı: ${focus}
${accuracyNote}
${ascText}
Baskın element dağılımı: ${elText} (baskın: ${natal.dominants.element}, ${natal.dominants.modality})
En güçlü gezegenler: ${natal.dominants.strongest.join(", ")}${
    natal.dominants.challenging.length
      ? ` | Zorlu: ${natal.dominants.challenging.join(", ")}`
      : ""
  }

HARİTA OMURGASI (yorumda öncelikle bunları kullan):
${coreLines}

TÜM NATAL GEZEGENLER:
${planetLines}

ANA AÇILAR (güçten zayıfa, açıklamalı):
${aspectLines || "Belirgin açı yok."}

EV ANALİZİ:
${houseLines || "Ev analizi yok (doğum saati eksik)."}

GÜNCEL TRANSİTLER (bugün):
${transitLines || "Belirgin transit yok."}

YAKLAŞAN TAM TRANSİTLER (önümüzdeki 12 ay, gerçek tarihler):
${forecastLines || "Belirgin yaklaşan transit yok."}

HESAPLANAN SKORLAR (sembolik, körü körüne tekrarlama — yorumla):
${scoreLines}

GÖREV:
${name} için, yukarıdaki SOMUT yerleşimlere dayanarak kişiye özel, akıcı ve derin bir Türkçe yorum yaz.
- summary'de ışıkları (Güneş/Ay), yükseleni ve baskın elementi sentezleyerek bu kişinin nasıl biri olduğunu anlat.
- Her hayat-alanı bölümünde ilgili gezegen/ev/açıyı adıyla an ve günlük hayatta nasıl yansıdığını açıkla.
- Analiz odağı "${focus}" olduğundan, ilgili bölümü en zengin ve detaylı sen yaz; o alandaki destekleyici ve zorlayıcı göstergeleri birlikte değerlendir.
- timeline'da tam olarak şu dönemleri kullan: "Bu ay", "Önümüzdeki 3 ay", "Önümüzdeki 6 ay", "Önümüzdeki 1 yıl". YAKLAŞAN TAM TRANSİTLER listesindeki gerçek tarihleri kullan; mümkünse her dönemde o döneme düşen transiti adıyla ve yaklaşık tarihiyle an (örn. "Mart ortasında Jüpiter MC'ne üçgen").
- Klişe ve genel geçer cümle kullanma. Sadece geçerli JSON döndür.`;
}
