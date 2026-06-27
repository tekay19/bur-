import { getDailyHoroscope, type DailyHoroscope } from "../horoscope";
import { SIGNS } from "../zodiac";

// ============================================================
// AI günlük burç yorumu — ÜYELER için (premium/deneme).
// Kural-tabanlı motor (getDailyHoroscope) temeli verir; AI yalnızca metin
// alanlarını (genel/aşk/kariyer/para/sağlık/tavsiye) zenginleştirir.
// Maliyet/performans: burç+gün başına TEK üretim, bellek içinde cache'lenir
// (12 burç → günde en fazla 12 çağrı). Anahtar yok veya hata olursa kural
// tabanlı içerik döner. API anahtarı yalnızca sunucuda kullanılır.
// ============================================================

const cache = new Map<string, DailyHoroscope>();

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback;
}

export async function getDailyHoroscopeAI(
  signSlug: string,
  date = new Date(),
): Promise<DailyHoroscope | null> {
  const base = getDailyHoroscope(signSlug, date);
  if (!base) return null;

  const key = `${signSlug}:${base.date}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const apiKey = process.env.AI_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) return base; // anahtar yok → kural tabanlı

  const sign = SIGNS.find((s) => s.slug === signSlug);

  try {
    const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
    const model = process.env.AI_MODEL ?? "gpt-4o-mini";

    const system =
      "Sen sıcak, samimi ve profesyonel bir Türk astrologsun. Günlük burç " +
      "yorumu yazıyorsun. SADECE geçerli JSON döndür, başka metin ekleme.";
    const user = `Bugün ${base.dateLabel}. ${sign?.name ?? base.signName} burcu için BUGÜNE özel günlük yorum yaz.
Gerçek gök verisi: Ay ${base.moonSign} burcunda${
      base.retro.length ? `; retro gezegenler: ${base.retro.join(", ")}` : ""
    }. ${sign?.name ?? ""} burcunun elementi ${sign?.element ?? ""}, niteliği ${sign?.quality ?? ""}.
Şu anahtarlarla JSON dön; her alan 1-2 doğal cümle, Türkçe, "sen" diliyle, klişeden uzak, somut ve sıcak. Sağlık/aşk gibi konularda kesin gelecek/teşhis vaadi verme:
{"genel":"...","ask":"...","kariyer":"...","para":"...","saglik":"...","tavsiye":"..."}`;

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.85,
        max_tokens: 2048,
        reasoning_effort: "low",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return base;

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) return base;

    let p: Record<string, unknown> | null = null;
    try {
      p = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          p = JSON.parse(m[0]);
        } catch {
          p = null;
        }
      }
    }
    if (!p) return base;

    const enriched: DailyHoroscope = {
      ...base,
      genel: str(p.genel, base.genel),
      ask: str(p.ask, base.ask),
      kariyer: str(p.kariyer, base.kariyer),
      para: str(p.para, base.para),
      saglik: str(p.saglik, base.saglik),
      gununTavsiyesi: str(p.tavsiye, base.gununTavsiyesi),
    };
    cache.set(key, enriched);
    return enriched;
  } catch {
    return base;
  }
}
