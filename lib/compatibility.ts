// ============================================================
// Burç Uyumu motoru — AI YOK, deterministik. İki burcun element/nitelik
// ilişkisi + mevcut uyum verisinden bir uyum skoru ve yorum üretir.
// Aynı çift her zaman aynı sonucu verir (paylaşılabilir, tutarlı).
// ============================================================

import { SIGNS, getSign, type Sign } from "./zodiac";

type Element = Sign["element"];

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(n)));

// Birbirini tamamlayan element çiftleri (ateş-hava, toprak-su)
const COMPLEMENT = new Set(["Ateş|Hava", "Hava|Ateş", "Toprak|Su", "Su|Toprak"]);
function elementScore(a: Element, b: Element): number {
  if (a === b) return 85; // aynı element — doğal akış
  if (COMPLEMENT.has(`${a}|${b}`)) return 92; // tamamlayıcı
  return 62; // gerilimli ama gelişim
}

export interface CompatResult {
  a: { slug: string; name: string; glyph: string };
  b: { slug: string; name: string; glyph: string };
  score: number;
  label: string;
  sub: { ask: number; iletisim: number; guven: number; tutku: number };
  verdict: string;
  strengths: string[];
  challenges: string[];
}

function bandLabel(score: number): string {
  if (score >= 85) return "Mükemmel uyum";
  if (score >= 72) return "Güçlü uyum";
  if (score >= 58) return "Dengeli — emek ister";
  return "Zıt kutuplar";
}

function verdictText(s1: Sign, s2: Sign, score: number, same: boolean): string {
  if (same)
    return `İki ${s1.name} bir araya gelince adeta bir ayna ilişkisi doğar: birbirinizi derinden anlarsınız çünkü aynı dili konuşursunuz. Aynı güçlü ve zayıf yönleri paylaştığınız için bağ kuvvetli ama zaman zaman aynı hataları birlikte yapma riski de var.`;
  const elemLine =
    s1.element === s2.element
      ? `İkiniz de ${s1.element} elementinden olduğunuz için enerjiniz doğal olarak uyumlu; birbirinizi sözsüz anlarsınız.`
      : COMPLEMENT.has(`${s1.element}|${s2.element}`)
        ? `${s1.element} ve ${s2.element} birbirini tamamlayan elementler — biriniz diğerinin eksiğini doğal biçimde dengeler.`
        : `${s1.element} ve ${s2.element} farklı dünyalardan gelir; bu da hem çekim hem de zaman zaman sürtüşme yaratır.`;
  if (score >= 85)
    return `${s1.name} ve ${s2.name} arasında akıcı, sıcak bir bağ var. ${elemLine} Aranızdaki uyum çoğu konuda kendiliğinden işliyor; bu ilişkinin uzun soluklu olma potansiyeli yüksek.`;
  if (score >= 72)
    return `${s1.name} ve ${s2.name} güçlü bir uyuma sahip. ${elemLine} Küçük farklılıkları konuşarak aştığınızda, birbirinizi besleyen sağlam bir ilişki kurabilirsiniz.`;
  if (score >= 58)
    return `${s1.name} ve ${s2.name} arasında dengeli ama emek isteyen bir ilişki var. ${elemLine} Farklılıklarınızı bir tehdit değil, öğrenme fırsatı olarak görürseniz bu bağ zamanla derinleşir.`;
  return `${s1.name} ve ${s2.name} zıt kutuplar gibi. ${elemLine} Aranızdaki çekim yoğun olabilir ama sürdürmek sabır ve karşılıklı anlayış ister — birbirinizden en çok öğreneceğiniz eşleşmelerden biri.`;
}

function strengthsFor(s1: Sign, s2: Sign): string[] {
  const out: string[] = [];
  if (s1.element === s2.element) out.push("Aynı element — duygusal dili paylaşırsınız");
  if (COMPLEMENT.has(`${s1.element}|${s2.element}`)) out.push("Tamamlayıcı enerjiler — biriniz diğerini dengeler");
  if (s1.quality !== s2.quality) out.push("Farklı yaklaşımlar birbirini tamamlar");
  if (s1.compatibility.best.includes(s2.name) || s2.compatibility.best.includes(s1.name))
    out.push("Klasik olarak uyumlu kabul edilen bir eşleşme");
  if (out.length === 0) out.push("Birbirinizden öğrenecek çok şey var");
  return out.slice(0, 3);
}
function challengesFor(s1: Sign, s2: Sign): string[] {
  const out: string[] = [];
  if (s1.quality === s2.quality && s1.quality === "Sabit") out.push("İkiniz de inatçı olabilirsiniz; esneklik şart");
  else if (s1.quality === s2.quality) out.push("Benzer mizaç güç savaşına dönüşebilir");
  if (!COMPLEMENT.has(`${s1.element}|${s2.element}`) && s1.element !== s2.element)
    out.push("Farklı elementler iletişimde sabır gerektirir");
  if (out.length === 0) out.push("Rutine düşmemek için ilişkiyi taze tutun");
  return out.slice(0, 3);
}

export function getCompatibility(slug1: string, slug2: string): CompatResult | null {
  const s1 = getSign(slug1);
  const s2 = getSign(slug2);
  if (!s1 || !s2) return null;
  const same = slug1 === slug2;
  const rnd = rng(hashStr([slug1, slug2].sort().join("-")));

  let base = elementScore(s1.element, s2.element);
  base += s1.quality === s2.quality ? -5 : 3;
  if (s1.compatibility.best.includes(s2.name) || s2.compatibility.best.includes(s1.name)) base += 10;
  if (same) base = 80;

  const jit = () => Math.floor(rnd() * 7) - 3;
  const score = clamp(base + jit(), 44, 97);

  const fire = s1.element === "Ateş" || s2.element === "Ateş";
  const water = s1.element === "Su" || s2.element === "Su";
  const air = s1.element === "Hava" || s2.element === "Hava";
  const earth = s1.element === "Toprak" || s2.element === "Toprak";

  return {
    a: { slug: s1.slug, name: s1.name, glyph: s1.glyph },
    b: { slug: s2.slug, name: s2.name, glyph: s2.glyph },
    score,
    label: bandLabel(score),
    sub: {
      ask: clamp(score + (fire || water ? 7 : -4) + jit(), 42, 98),
      iletisim: clamp(score + (air ? 8 : -3) + jit(), 42, 98),
      guven: clamp(score + (earth ? 8 : -2) + jit(), 42, 98),
      tutku: clamp(score + (fire ? 9 : water ? 4 : -3) + jit(), 42, 98),
    },
    verdict: verdictText(s1, s2, score, same),
    strengths: strengthsFor(s1, s2),
    challenges: challengesFor(s1, s2),
  };
}

export function allSignsLite() {
  return SIGNS.map((s) => ({ slug: s.slug, name: s.name, glyph: s.glyph }));
}
