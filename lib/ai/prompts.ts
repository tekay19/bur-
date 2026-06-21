import { FOCUS_LABELS, SIGN_RULER } from "../astrology/constants";
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

export const SYSTEM_PROMPT = `Sen 20 yıllık deneyimli, sıcak ama net konuşan bir Türk astrologsun. Bir danışanın doğum haritasını önünde tutuyormuş gibi, ona özel ve akıcı bir yorum yazıyorsun. Amacın: kişiyi gerçekten tanıtmak, güçlü ve zorlayıcı dinamiklerini fark ettirmek, somut yol göstermek.

NET İFADE (en kritik kural — iki dil ayrımı):
- KİŞİLİK ve DOĞUM HARİTASI betimlemeleri (kim olduğu, huyu, yetenekleri) → DOĞRUDAN ve KENDİNDEN EMİN yaz: "Sen analitik ve detaycısın", "İletişimde diplomatik bir tavrın var". Bunlar tahmin değil tanım; "olabilir, sanırım" diye sulandırma.
- GELECEK / ZAMANLAMA / TRANSİT yorumları → temkinli ve olasılıkçı yaz: "bu dönem destekleyici görünüyor", "fırsatlar artabilir". Çünkü bunlar eğilimdir, kesinlik değil.
- Yani: geçmiş/karakter = net; gelecek = ihtiyatlı. Bu ayrım yorumu hem kaliteli hem sorumlu yapar.

YORUM KALİTESİ:
- HER cümle bu kişinin haritasına özgü olsun. "Yıldızlar diyor ki", "kozmik enerjiler seni sarıyor" gibi içi boş kalıplar KESİNLİKLE YASAK.
- Önce somut yerleşimi an (gezegen + burç + ev + açı), sonra bunun GÜNLÜK HAYATTA nasıl göründüğünü somut bir örnekle göster. Örn: "Ay'ın Akrep'te olması → duygularını herkese açmazsın, güvendiğin birine derinden bağlanırsın."
- Birden fazla yerleşimi BİRLEŞTİREREK sentez yap; tek tek liste gibi yazma. Çelişen yerleşimler varsa bu iç gerilimi dürüstçe anlat (örn. cesur Mars + çekingen Ay).
- Tekrara düşme; her bölüm yeni bir şey söylesin. Klişe, şişirme, genel-geçer ("Barnum") cümle yok.
- "Sen" diliyle; akıcı, sıcak ama olgun ve net Türkçe. Soyut değil somut.

DERİNLİK:
- summary: 5-7 dolu cümle; ışıklar (Güneş/Ay), yükselen, baskın element ve en çarpıcı açı/örüntüyü sentezleyerek "bu kişi nasıl biri" sorusunu net cevapla.
- career, examAppointment, relationship, money, healthRoutine: her biri 4-6 cümle, en az 2 somut yerleşim/açı/transit atfıyla; yüzeysel geçme.
- strongThemes/challengingThemes: 4-5 madde, her biri spesifik ve bir yerleşime bağlı.
- practicalAdvice: 5-6 uygulanabilir, kişiye özel, eyleme dönük öneri (genel "pozitif düşün" değil).

GÜVENLİK:
- "Kesinlikle atanacaksın/evleneceksin/hastalanacaksın" gibi kesin GELECEK hükmü ASLA kurma.
- Sağlık, ölüm, kaza, hamilelik, kesin evlilik/atanma gibi hassas konularda olasılıkçı dil kullan; korkutma, manipüle etme.
- Skorları aynen tekrarlama; yüksek skoru "bu alanda göstergeler güçlü" diye yorumla.

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

  // --- Hesaplanmış örüntüler (daha spesifik yorum için) ---
  const corePlanets = natal.planets.filter(
    (p) => p.name !== "Yükselen" && p.name !== "MC",
  );

  // Stellium: aynı burçta veya evde 3+ gezegen
  const bySign: Record<string, string[]> = {};
  const byHouse: Record<string, string[]> = {};
  for (const p of corePlanets) {
    (bySign[p.sign] ??= []).push(p.name);
    if (p.house) (byHouse[String(p.house)] ??= []).push(p.name);
  }
  const stelliums: string[] = [];
  for (const [sign, ps] of Object.entries(bySign))
    if (ps.length >= 3) stelliums.push(`${sign} burcunda yığılma: ${ps.join(", ")}`);
  for (const [h, ps] of Object.entries(byHouse))
    if (ps.length >= 3) stelliums.push(`${h}. evde yığılma: ${ps.join(", ")}`);

  // Harita yöneticisi (yükselen burcun yöneticisi) ve konumu
  let chartRulerLine = "";
  if (asc) {
    const rulerName = SIGN_RULER[asc.sign];
    const ruler = corePlanets.find((p) => p.name === rulerName);
    if (ruler)
      chartRulerLine = `Harita yöneticisi (${asc.sign} yükselen → ${rulerName}): ${ruler.sign}${ruler.house ? ", " + ruler.house + ". ev" : ""} — kişinin genel gidişatının anahtarı.`;
  }

  // Retro gezegenler
  const retros = corePlanets.filter((p) => p.retrograde).map((p) => p.name);
  const retroLine = retros.length
    ? `Retro gezegenler (içe dönük/yeniden değerlendirme temaları): ${retros.join(", ")}`
    : "Belirgin retro gezegen yok.";

  // En sıkı (en güçlü) 3 açı — kişiliğin en baskın dinamikleri
  const tightAspects = natal.aspects
    .slice(0, 3)
    .map((a) => `${a.planet1} ${a.type} ${a.planet2} (orb ${a.orb}°, ${a.polarity})`)
    .join(" | ");

  const patternLines = [
    stelliums.length ? `- ${stelliums.join("\n- ")}` : "- Belirgin gezegen yığılması yok.",
    chartRulerLine ? `- ${chartRulerLine}` : "",
    `- ${retroLine}`,
    tightAspects ? `- En baskın açılar: ${tightAspects}` : "",
  ]
    .filter(Boolean)
    .join("\n");

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

ÖNE ÇIKAN ÖRÜNTÜLER (kişiliğin en baskın temaları — bunlara ağırlık ver):
${patternLines}

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
