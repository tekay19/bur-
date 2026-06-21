import { FOCUS_LABELS } from "../astrology/constants";
import type { TransitEvent } from "../astrology/transitForecast";
import type {
  ChartScores,
  HouseAnalysis,
  NatalChart,
  TransitChart,
} from "../astrology/types";
import {
  AiInterpretation,
  buildUserPrompt,
  SYSTEM_PROMPT,
} from "./prompts";

interface GenerateParams {
  name: string;
  focusArea: string;
  natal: NatalChart;
  houses: HouseAnalysis[];
  transit: TransitChart;
  forecast?: TransitEvent[];
  scores: ChartScores;
}

// ============================================================
// AI yorum üretimi — OpenAI uyumlu API (server-side).
// API anahtarı yoksa veya hata olursa kural-tabanlı yedek devreye girer.
// API anahtarı ASLA client'a sızmaz; bu modül yalnızca sunucuda çalışır.
// ============================================================

export async function generateAstrologyInterpretation(
  params: GenerateParams,
): Promise<AiInterpretation> {
  // AI_API_KEY veya GEMINI_API_KEY desteklenir (Gemini OpenAI uyumlu endpoint).
  const apiKey = process.env.AI_API_KEY ?? process.env.GEMINI_API_KEY;
  const baseUrl =
    process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    return ruleBasedInterpretation(params);
  }

  try {
    const userPrompt = buildUserPrompt(params);
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.75,
        // Gemini 2.5 "düşünen" modeldir; düşünme token'ları çıktı bütçesini
        // yemesin diye bütçe yüksek tutulur ve düşünme düşük seviyeye çekilir.
        max_tokens: 8192,
        reasoning_effort: "low",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
      // 45 sn üst sınır
      signal: AbortSignal.timeout(45000),
    });

    if (!res.ok) {
      console.error("AI API hata:", res.status, await res.text());
      return ruleBasedInterpretation(params);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    const finishReason = data?.choices?.[0]?.finish_reason;
    if (!content) {
      console.error(
        "AI içerik boş. finish_reason:",
        finishReason,
        "usage:",
        JSON.stringify(data?.usage),
      );
      return ruleBasedInterpretation(params);
    }

    const parsed = extractJson(content);
    if (!parsed) {
      console.error(
        "AI JSON parse edilemedi. finish_reason:",
        finishReason,
        "content uzunluğu:",
        content.length,
        "son 120:",
        content.slice(-120),
      );
      return ruleBasedInterpretation(params);
    }
    return normalizeInterpretation(parsed, "ai");
  } catch (err) {
    console.error("AI yorum üretilemedi, yedek kullanılıyor:", err);
    return ruleBasedInterpretation(params);
  }
}

// Provider-bağımsız JSON çıkarımı.
// Bazı modeller (ör. bazı Gemini sürümleri) yanıtı ```json ... ``` bloğu
// veya açıklayıcı metinle birlikte döndürebilir; bunları toleranslı ayrıştırır.
function extractJson(content: string): Partial<AiInterpretation> | null {
  const text = content.trim();
  // 1) Doğrudan dene
  try {
    return JSON.parse(text);
  } catch {
    /* devam */
  }
  // 2) ```json ... ``` veya ``` ... ``` bloğunu temizle
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {
      /* devam */
    }
  }
  // 3) İlk { ile son } arasını al
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      /* devam */
    }
  }
  return null;
}

// Eksik alanları güvenli varsayılanlarla doldur
function normalizeInterpretation(
  raw: Partial<AiInterpretation>,
  source: "ai" | "fallback",
): AiInterpretation {
  const arr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  return {
    summary: raw.summary ?? "Yorum üretildi.",
    strongThemes: arr(raw.strongThemes),
    challengingThemes: arr(raw.challengingThemes),
    career: raw.career ?? "",
    examAppointment: raw.examAppointment ?? "",
    relationship: raw.relationship ?? "",
    money: raw.money ?? "",
    healthRoutine: raw.healthRoutine ?? "",
    timeline: Array.isArray(raw.timeline)
      ? raw.timeline.filter(
          (t) => t && typeof t.period === "string",
        )
      : [],
    warnings: arr(raw.warnings),
    practicalAdvice: arr(raw.practicalAdvice),
    source,
  };
}

// ============================================================
// Kural-tabanlı yedek yorum üreticisi (API'siz çalışır)
// Skorlardan ve natal verilerden tutarlı Türkçe metin üretir.
// ============================================================

function ruleBasedInterpretation(params: GenerateParams): AiInterpretation {
  const { name, focusArea, natal, scores, transit } = params;
  const focus = FOCUS_LABELS[focusArea] ?? "Genel";

  const sun = natal.planets.find((p) => p.name === "Güneş");
  const moon = natal.planets.find((p) => p.name === "Ay");
  const asc = natal.ascendant !== null;

  const strong = natal.dominants.strongest.join(", ");
  const dominantEl = natal.dominants.element;

  const summary = `${name} için harita ${dominantEl} elementi ağırlıklı bir tablo gösteriyor. ${
    sun ? `Güneş ${sun.sign} burcunda, ` : ""
  }${moon ? `Ay ${moon.sign} burcunda. ` : ""}${
    asc
      ? "Yükselen ve evler hesaplandığı için kişisel temalar daha belirgin yorumlanabiliyor."
      : "Doğum saati kesin olmadığından ev ve yükselen yorumları sınırlı tutuldu."
  } Genel enerji skoru ${scores.overall.value}/100 (${scores.overall.label}). En güçlü görünen enerjiler: ${strong}. Bu analiz "${focus}" odağıyla hazırlandı.`;

  const strongThemes = [
    ...scores.overall.supporting,
    ...scores.career.supporting.slice(0, 1),
  ].slice(0, 5);

  const challengingThemes = [
    ...scores.overall.challenging,
    ...scores.career.challenging.slice(0, 1),
  ].slice(0, 5);

  const sectionText = (label: string, s: { value: number; label: string; supporting: string[]; challenging: string[] }) => {
    const sup = s.supporting[0] ? ` Destekleyen göstergeler: ${s.supporting[0].toLowerCase()}.` : "";
    const ch = s.challenging[0] ? ` Dikkat edilebilecek nokta: ${s.challenging[0].toLowerCase()}.` : "";
    return `${label} alanında skor ${s.value}/100 (${s.label}).${sup}${ch} Bu sembolik bir eğilimdir, kesin sonuç değildir.`;
  };

  const examText = `Sınav/atanma göstergeleri ${scores.examAppointment.value}/100 (${scores.examAppointment.label}). ${
    scores.examAppointment.value >= 56
      ? "Bu dönem kariyer ve resmi süreçlerde daha destekleyici göstergeler var; başvuru, sınav, mülakat ve disiplinli çalışma için uygun bir dönem olabilir."
      : scores.examAppointment.value >= 31
        ? "Karışık bir dönem; istikrarlı çalışma ve sağlam planlama farkı yaratabilir. Acele kararlardan kaçınıp süreci adım adım yürütmek faydalı olabilir."
        : "Şu an destek göstergeleri daha sınırlı görünüyor; bu, çalışmanın sonuçsuz kalacağı anlamına gelmez. Temkinli planlama ve sabırlı hazırlık önerilir."
  } Bu yorum kesin atanma/başarı garantisi değildir.`;

  const topTransits = transit.hits.slice(0, 3).map((t) => t.theme);

  const timeline = [
    {
      period: "Bu ay",
      theme: topTransits[0] ?? "Günlük ritim ve kısa vadeli temalar",
      advice:
        "Kısa vadeli fırsatları değerlendirin, küçük ama düzenli adımlar atın.",
    },
    {
      period: "Önümüzdeki 3 ay",
      theme: topTransits[1] ?? "Orta vadeli gelişim alanları",
      advice:
        "Planlarınızı somutlaştırın; destekleyici dönemlerde inisiyatif alın.",
    },
    {
      period: "Önümüzdeki 6 ay",
      theme: topTransits[2] ?? "Daha geniş döngülerin etkisi",
      advice:
        "Sabır gerektiren süreçlerde tutarlılığı koruyun, esnek kalın.",
    },
    {
      period: "Önümüzdeki 1 yıl",
      theme: "Yavaş gezegenlerin uzun vadeli temaları",
      advice:
        "Büyük kararları acele etmeden, farkındalıkla ve planlı şekilde verin.",
    },
  ];

  const warnings = [
    "Bu yorumlar astrolojik sembolizm ve eğlence/kişisel farkındalık amaçlıdır. Kesin gelecek tahmini değildir.",
    "Sağlık, hukuki ve finansal kararlarda uzman görüşü alınız.",
  ];
  if (!asc) {
    warnings.push(
      "Doğum saati bilinmediği için ev ve yükselen yorumları kesin değildir.",
    );
  }

  const practicalAdvice = [
    "Güçlü göstergeleri eyleme dönüştürün; destekleyici dönemlerde inisiyatif alın.",
    "Zorlayıcı temaları tehdit değil, gelişim alanı olarak görün.",
    `${focus} odağınız için düzenli ve ölçülebilir küçük hedefler belirleyin.`,
    "Önemli kararları yalnızca astrolojiye değil, somut verilere de dayandırın.",
  ];

  return {
    summary,
    strongThemes: strongThemes.length ? strongThemes : ["Haritada dengeli enerjiler"],
    challengingThemes: challengingThemes.length
      ? challengingThemes
      : ["Belirgin zorlayıcı tema öne çıkmıyor"],
    career: sectionText("Kariyer", scores.career),
    examAppointment: examText,
    relationship: sectionText("İlişki", scores.relationship),
    money: sectionText("Para", scores.money),
    healthRoutine: sectionText("Sağlık & Rutin", scores.healthRoutine),
    timeline,
    warnings,
    practicalAdvice,
    source: "fallback",
  };
}
