// ============================================================
// AstroProfil™ — karar motoru + dinamik paragraf üretici (AI YOK).
// Burç başlangıç matrisi + cevap etkileri → 12 özellik puanı →
// kurallara göre 10 bölümlük kişiye özel analiz.
// ============================================================

import { getSign, SIGNS } from "../zodiac";
import {
  QUESTIONS,
  SIGN_BASE,
  TRAIT_KEYS,
  TRAIT_LABELS,
  type Scores,
  type TraitKey,
} from "./data";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

// Burç tabanı + seçilen cevapların etkileri → final puanlar.
export function computeScores(signSlug: string, answers: number[]): Scores {
  const base = SIGN_BASE[signSlug] ?? SIGN_BASE.koc;
  const out = { ...base };
  answers.forEach((optIdx, qIdx) => {
    const opt = QUESTIONS[qIdx]?.options[optIdx];
    if (!opt) return;
    for (const [k, v] of Object.entries(opt.effects)) {
      out[k as TraitKey] = (out[k as TraitKey] ?? 0) + (v as number);
    }
  });
  for (const k of TRAIT_KEYS) out[k] = clamp(out[k]);
  return out;
}

export interface ProfileSection {
  id: string;
  title: string;
  paragraphs: string[];
  tags?: string[];
}

export interface TraitScore {
  key: TraitKey;
  label: string;
  value: number;
}

export interface ProfileResult {
  signSlug: string;
  signName: string;
  glyph: string;
  scores: Scores;
  ordered: TraitScore[];
  top: TraitScore[];
  low: TraitScore[];
  bestSigns: string[];
  challengingSigns: string[];
  sections: ProfileSection[];
}

// --- İçerik havuzları (özellik bazlı) ---
const STRENGTH: Record<TraitKey, string> = {
  liderlik: "İnisiyatif almaktan çekinmiyorsun; bir grup yön ararken öne çıkan kişi sen oluyorsun.",
  mantik: "Olayları duygulara kapılmadan, mantık süzgecinden geçirerek değerlendiriyorsun.",
  empati: "Karşındakinin ne hissettiğini çoğu zaman söylemesine gerek kalmadan anlıyorsun.",
  duygusallik: "Duygularınla güçlü bir bağın var; sevgini ve tutkunu derinden yaşıyorsun.",
  ozguven: "Kendine olan güvenin yüksek; zorluklar karşısında kolay kolay yılmıyorsun.",
  sabir: "Sabırlısın; acele etmeden doğru zamanı beklemeyi biliyorsun.",
  risk: "Risk almaktan korkmuyorsun; konfor alanının dışına çıkabiliyorsun.",
  disiplin: "Disiplinli ve düzenlisin; başladığın işi sonuna kadar götürüyorsun.",
  bagimsizlik: "Bağımsızlığına değer veriyorsun; kendi yolunu kendin çizmeyi seviyorsun.",
  sosyallik: "İnsanlarla kolayca bağ kuruyorsun; sosyal ortamlarda enerjin yükseliyor.",
  sezgisellik: "Sezgilerin güçlü; bir şeyin doğru ya da yanlış olduğunu çoğu zaman önceden hissediyorsun.",
  kararlilik: "Kararlısın; bir hedefe kilitlendiğinde kolay kolay vazgeçmiyorsun.",
};

const GROWTH: Record<TraitKey, string> = {
  liderlik: "Sorumluluk almaktan bazen çekinebiliyorsun; oysa fikirlerin sandığından daha değerli.",
  mantik: "Kararlarında bazen duygular öne geçebiliyor; bir adım geri çekilip mantığı dinlemek işine yarar.",
  empati: "Karşındakinin duygularını fark etmek zaman zaman ikinci planda kalabiliyor.",
  duygusallik: "Duygularını ifade etmek sana zor gelebiliyor; hislerini paylaşmak bağlarını güçlendirir.",
  ozguven: "Kendine olan güvenin zaman zaman sarsılabiliyor; küçük başarılarını fark etmek bunu besler.",
  sabir: "Sonuçları hızlı görmek istiyorsun; uzun bekleyişler motivasyonunu düşürebilir.",
  risk: "Riskten kaçınma eğilimin bazı fırsatları kaçırmana yol açabilir.",
  disiplin: "Rutin ve düzen sana zor gelebiliyor; küçük alışkanlıklar zamanla büyük fark yaratır.",
  bagimsizlik: "Başkalarının onayına zaman zaman fazla ihtiyaç duyabiliyorsun.",
  sosyallik: "Kalabalık ortamlar seni yorabiliyor; bu bir kusur değil, enerjini farklı topluyorsun.",
  sezgisellik: "Her şeyi mantıkla çözmeye çalışmak bazen iç sesini bastırabiliyor.",
  kararlilik: "Karar verdikten sonra bile ikircikli kalabiliyorsun; ilk içgüdüne güvenmek rahatlatır.",
};

const ADVICE: Record<TraitKey, string> = {
  liderlik: "Küçük kararlarda inisiyatifi ele almayı dene; liderlik bir kas gibidir, kullandıkça güçlenir.",
  mantik: "Önemli kararlardan önce artıları ve eksileri yazıya dökmek netliğini artırır.",
  empati: "Karşındakine 'sen ne hissediyorsun?' diye sormak ilişkilerinde fark yaratır.",
  duygusallik: "Hislerini bastırmak yerine güvendiğin biriyle paylaşmak yükünü hafifletir.",
  ozguven: "Günün sonunda iyi yaptığın üç şeyi not almak özgüvenini zamanla besler.",
  sabir: "Büyük hedefleri küçük adımlara bölmek sabırsızlığını yönetmene yardımcı olur.",
  risk: "Küçük ve kontrollü riskler almaya başlamak konfor alanını nazikçe genişletir.",
  disiplin: "Tek bir küçük günlük alışkanlık (örneğin sabah rutini) disiplinini büyütür.",
  bagimsizlik: "Kendi başına küçük kararlar vermek bağımsızlık kasını güçlendirir.",
  sosyallik: "Kalabalık yerine birebir, anlamlı sohbetler senin için daha besleyici olabilir.",
  sezgisellik: "Bazen 'mantıklı' olanı değil, içinden geleni dinlemeyi dene.",
  kararlilik: "Bir karar verdiğinde 24 saat onu sorgulamamayı dene; netlik kendiliğinden gelir.",
};

const TENSION: Record<string, string> = {
  Ateş: "Su",
  Su: "Ateş",
  Toprak: "Hava",
  Hava: "Toprak",
};

function fire(rules: { when: boolean; text: string }[], fallback: string): string[] {
  const hits = rules.filter((r) => r.when).map((r) => r.text);
  return hits.length ? hits : [fallback];
}

export function generateProfile(signSlug: string, scores: Scores): ProfileResult {
  const sign = getSign(signSlug) ?? getSign("koc")!;
  const s = scores;

  const ordered: TraitScore[] = TRAIT_KEYS.map((k) => ({
    key: k,
    label: TRAIT_LABELS[k],
    value: s[k],
  })).sort((a, b) => b.value - a.value);
  const top = ordered.slice(0, 4);
  const low = ordered.slice(-3).reverse();

  // 1) Genel AstroProfil
  const balance =
    s.mantik - s.duygusallik > 12
      ? "Karar anlarında aklın sesi, duygularından bir adım önde."
      : s.duygusallik - s.mantik > 12
        ? "Dünyayı önce kalbinle okuyor, sonra aklınla yorumluyorsun."
        : "Mantık ile duygu arasında, çoğu insanda görülmeyen dengeli bir köprü kuruyorsun.";
  const energy =
    s.risk > 70 && s.sabir < 45
      ? "Hareketli ve cesur bir doğan var; beklemek senin için en zor şeylerden biri."
      : s.sabir > 70 && s.risk < 45
        ? "Acele etmeyen, sağlam ve ölçülü bir iç dünyan var."
        : "Enerjini ne tamamen frenliyor ne de kontrolsüz bırakıyorsun; duruma göre ayarlıyorsun.";

  const genel: ProfileSection = {
    id: "genel",
    title: "Genel AstroProfilin",
    paragraphs: [
      `Bir ${sign.name} olarak güçlü bir ${sign.element} enerjisiyle yola çıkıyorsun. Ama verdiğin yanıtlar seni burcunun ötesine taşıyor: profilinde ${top[0].label} ve ${top[1].label} en baskın iki yönün olarak öne çıkıyor.`,
      balance,
      energy,
    ],
  };

  // 4) Karar verme tarzı
  const karar: ProfileSection = {
    id: "karar",
    title: "Karar Verme Tarzın",
    paragraphs: fire(
      [
        { when: s.mantik >= 70 && s.empati < 65, text: "Analitik düşüncen güçlü; karar verirken duygulardan çok verilere ve mantığa güveniyorsun." },
        { when: s.risk >= 70 && s.kararlilik >= 68, text: "Cesur kararlar almaktan çekinmiyorsun; belirsizlik seni korkutmak yerine harekete geçiriyor." },
        { when: s.sezgisellik >= 72 && s.mantik < 62, text: "Kararlarında içgüdülerin başrolde; bir şeyin doğru olduğunu çoğu zaman anlatmadan 'biliyorsun'." },
        { when: s.risk < 42, text: "Aceleci değilsin; riskleri tartmadan, aklına yatmadan adım atmıyorsun." },
        { when: s.kararlilik < 42, text: "Karar verdikten sonra bile zaman zaman geri dönüp aynı kararı sorguluyorsun." },
      ],
      "Kararlarını mantık ve sezgi arasında dengeleyerek, duruma göre esnek bir biçimde veriyorsun.",
    ),
  };

  // 5) İlişki tarzı
  const iliski: ProfileSection = {
    id: "iliski",
    title: "İlişki Tarzın",
    paragraphs: fire(
      [
        { when: s.empati >= 72 && s.duygusallik >= 68, text: "İlişkilerinde derin ve şefkatlisin; sevdiklerinin duygularını neredeyse kendi duygun gibi hissediyorsun." },
        { when: s.bagimsizlik >= 75, text: "Bir ilişkide bile kendi alanına önem veriyorsun; sürekli ne yapacağını söyleyen biri seni yorabilir." },
        { when: s.duygusallik < 48, text: "Duygularını göstermek yerine korumayı tercih ediyorsun; bu mesafe yakınlık kurmanı bazen zorlayabilir." },
        { when: s.empati < 50, text: "İlişkilerde mantığın duygularının önüne geçebiliyor; bazen 'haklı olmak' yerine 'anlamak' daha çok yaklaştırır." },
      ],
      "İlişkilerde hem sevgine hem özgürlüğüne yer açan, dengeli bir tarzın var.",
    ),
  };

  // 6) Kariyer eğilimi
  const kariyer: ProfileSection = {
    id: "kariyer",
    title: "Kariyer Eğilimin",
    paragraphs: fire(
      [
        { when: s.liderlik >= 72 && s.ozguven >= 68, text: "Yönetmek, karar almak ve sorumluluk üstlenmek sana doğal geliyor; bir ekibin önünde parlıyorsun." },
        { when: s.disiplin >= 72 && s.mantik >= 66, text: "Düzen, sistem ve uzmanlık isteyen işlerde fark yaratıyorsun; detaylar senin elinde sağlama alınıyor." },
        { when: s.mantik >= 74, text: "Analiz, strateji ve problem çözme gerektiren alanlar tam sana göre." },
        { when: s.bagimsizlik >= 78, text: "Sana en uygun ortam; kendi kararlarını verebildiğin, özgürce çalışabildiğin bir alan." },
        { when: s.sezgisellik >= 74 || s.duygusallik >= 74, text: "Yaratıcılık ve sezgi isteyen işlerde içindeki cevheri ortaya koyuyorsun." },
      ],
      "Hem ekip çalışmasına hem bireysel üretime uyum sağlayabilen, esnek bir kariyer profilin var.",
    ),
  };

  // 7) Stres altındaki davranış
  const stres: ProfileSection = {
    id: "stres",
    title: "Stres Altındaki Davranışın",
    paragraphs: fire(
      [
        { when: s.sabir < 45 && s.risk >= 65, text: "Stres altında harekete geçme ihtiyacı duyuyorsun; durup beklemek seni daha çok geriyor." },
        { when: s.empati >= 70, text: "Zorlandığında çevrendekilerin yükünü de sırtlanma eğilimin var; önce kendine alan açmak sana iyi gelir." },
        { when: s.duygusallik >= 72, text: "Stres seni duygusal olarak yıpratabiliyor; hislerini bastırmak yerine ifade etmek toparlanmanı hızlandırır." },
        { when: s.disiplin >= 70 && s.sabir >= 58, text: "Baskı altında soğukkanlılığını koruyor, sisteme ve plana tutunarak ilerliyorsun." },
      ],
      "Stresle baş ederken duruma göre bazen geri çekiliyor, bazen harekete geçiyorsun.",
    ),
  };

  // 8) Meslek önerileri
  const clusters: { when: boolean; items: string[] }[] = [
    { when: s.liderlik >= 68 && s.ozguven >= 65, items: ["Yöneticilik", "Girişimcilik", "Proje liderliği"] },
    { when: s.mantik >= 68 && s.disiplin >= 62, items: ["Mühendislik", "Finans / Analiz", "Hukuk", "Yazılım"] },
    { when: s.empati >= 70 && s.sosyallik >= 58, items: ["Psikoloji", "Eğitim", "Sağlık", "Danışmanlık", "İnsan Kaynakları"] },
    { when: s.sezgisellik >= 70 || s.duygusallik >= 72, items: ["Sanat", "Tasarım", "Yazarlık", "Müzik"] },
    { when: s.bagimsizlik >= 75 && s.risk >= 58, items: ["Serbest meslek", "Girişimcilik", "Yaratıcı yönetmenlik"] },
    { when: s.sosyallik >= 72, items: ["Satış", "Pazarlama", "Halkla İlişkiler", "Etkinlik yönetimi"] },
  ];
  const profSet = new Set<string>();
  clusters.filter((c) => c.when).forEach((c) => c.items.forEach((i) => profSet.add(i)));
  if (profSet.size === 0)
    ["Eğitim", "Danışmanlık", "İletişim", "Proje yönetimi"].forEach((i) => profSet.add(i));
  const meslekler: ProfileSection = {
    id: "meslekler",
    title: "Sana Uygun Meslek Alanları",
    paragraphs: ["Özellik profiline göre potansiyelini en iyi gösterebileceğin alanlar:"],
    tags: [...profSet].slice(0, 8),
  };

  // 9) Burç enerjileri
  const tensionEl = TENSION[sign.element];
  const challengingSigns = SIGNS.filter((x) => x.element === tensionEl)
    .map((x) => x.name)
    .slice(0, 3);
  const burcEnerji: ProfileSection = {
    id: "burc-enerji",
    title: "Sana Uygun Burç Enerjileri",
    paragraphs: [
      `${sign.compatibility.best.slice(0, 3).join(", ")} burçları senin enerjini yükseltir; onlarla doğal, akıcı bir uyum yakalarsın.`,
      `${challengingSigns.join(", ")} gibi ${tensionEl} burçları ise seni zorlayabilir — ama çoğu zaman en çok onlardan öğrenir, onların yanında gelişirsin.`,
    ],
  };

  // 2) Güçlü yönler · 3) Gelişim alanları
  const guclu: ProfileSection = {
    id: "guclu",
    title: "Güçlü Yönlerin",
    paragraphs: top.map((t) => STRENGTH[t.key]),
  };
  const gelisim: ProfileSection = {
    id: "gelisim",
    title: "Gelişim Alanların",
    paragraphs: low.map((t) => GROWTH[t.key]),
  };

  // 10) Kişisel gelişim tavsiyesi
  const lowest = low[0];
  const second = low[1];
  const tavsiyeParas = [ADVICE[lowest.key]];
  if (second && second.value < 50) tavsiyeParas.push(ADVICE[second.key]);
  const tavsiye: ProfileSection = {
    id: "tavsiye",
    title: "Sana Özel Gelişim Tavsiyesi",
    paragraphs: tavsiyeParas,
  };

  return {
    signSlug: sign.slug,
    signName: sign.name,
    glyph: sign.glyph,
    scores: s,
    ordered,
    top,
    low,
    bestSigns: sign.compatibility.best.slice(0, 3),
    challengingSigns,
    sections: [genel, guclu, gelisim, karar, iliski, kariyer, stres, meslekler, burcEnerji, tavsiye],
  };
}
