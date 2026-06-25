// ============================================================
// Burç Kişilik Testi — "Ruh burcun hangisi?"
// Sorular iki eksen ölçer: ELEMENT (Ateş/Toprak/Hava/Su) ve
// NİTELİK (Öncü/Sabit/Değişken). Baskın element × baskın nitelik
// 12 burçtan TAM BİRİNE denk gelir → her burç sonucu mümkündür.
// ============================================================

import { SIGNS, type Sign } from "./zodiac";

export type Element = Sign["element"];
export type Quality = Sign["quality"];

export interface QuizOption {
  text: string;
  element?: Element;
  quality?: Quality;
}

export interface QuizQuestion {
  id: string;
  q: string;
  options: QuizOption[];
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "hafta-sonu",
    q: "İdeal bir hafta sonu senin için nedir?",
    options: [
      { text: "Spontane bir macera — yola çık, sonu belli olmasın!", element: "Ateş" },
      { text: "Doğada huzurlu bir kaçamak ve güzel bir yemek", element: "Toprak" },
      { text: "Arkadaşlarla buluşma, yeni insanlar ve sohbet", element: "Hava" },
      { text: "Evde, sevdiğinle film, müzik ve sakin bir gün", element: "Su" },
    ],
  },
  {
    id: "karar",
    q: "Bir kararı nasıl verirsin?",
    options: [
      { text: "İçgüdüyle, hızlıca — fazla düşünmek zaman kaybı", element: "Ateş" },
      { text: "Adım adım, mantıkla; riski hesaplarım", element: "Toprak" },
      { text: "Herkesle konuşur, farklı açıları tartarım", element: "Hava" },
      { text: "Kalbim ne diyorsa; hislerim yol gösterir", element: "Su" },
    ],
  },
  {
    id: "ceken",
    q: "Bir insanda seni en çok ne çeker?",
    options: [
      { text: "Tutku, cesaret ve enerji", element: "Ateş" },
      { text: "Güven, istikrar ve sadakat", element: "Toprak" },
      { text: "Zekâ, mizah ve iyi sohbet", element: "Hava" },
      { text: "Derinlik, duygu ve gizem", element: "Su" },
    ],
  },
  {
    id: "stres",
    q: "Stresli olduğunda ne yaparsın?",
    options: [
      { text: "Hareket ederim — spor, yürüyüş, bir şeyleri değiştiririm", element: "Ateş" },
      { text: "Rutinime tutunur, pratik çözümler bulurum", element: "Toprak" },
      { text: "Konuşur, yazar, zihnimi dağıtırım", element: "Hava" },
      { text: "İçime çekilir, hislerimi sindiririm", element: "Su" },
    ],
  },
  {
    id: "tanim",
    q: "Arkadaşların seni nasıl tanımlar?",
    options: [
      { text: "Cesur, enerjik, lider", element: "Ateş" },
      { text: "Güvenilir, sakin, ayakları yere basan", element: "Toprak" },
      { text: "Sosyal, esprili, meraklı", element: "Hava" },
      { text: "Şefkatli, sezgisel, derin", element: "Su" },
    ],
  },
  {
    id: "rol",
    q: "Yeni bir projede rolün ne olur?",
    options: [
      { text: "Başlatan — fikri ortaya atan, harekete geçiren", quality: "Öncü" },
      { text: "Sürdüren — işi sonuna götüren, istikrarı sağlayan", quality: "Sabit" },
      { text: "Uyarlayan — değişime ayak uyduran, esneklik katan", quality: "Değişken" },
    ],
  },
  {
    id: "degisim",
    q: "Değişime yaklaşımın nedir?",
    options: [
      { text: "Değişimi ben yaratmayı severim", quality: "Öncü" },
      { text: "Temkinliyim; istikrarı korumayı tercih ederim", quality: "Sabit" },
      { text: "Akışına bırakırım; değişim benim doğal halim", quality: "Değişken" },
    ],
  },
  {
    id: "grup",
    q: "Bir grupta genelde sen…",
    options: [
      { text: "Öncülük eder, yön veririm", quality: "Öncü" },
      { text: "Sağlam dururum, güven veririm", quality: "Sabit" },
      { text: "Köprü kurar, ortamı yumuşatırım", quality: "Değişken" },
    ],
  },
];

const ELEMENT_ORDER: Element[] = ["Ateş", "Toprak", "Hava", "Su"];
const QUALITY_ORDER: Quality[] = ["Öncü", "Sabit", "Değişken"];

// Seçilen seçeneklerden baskın element + nitelik → eşleşen burç.
export function computeResult(options: QuizOption[]): Sign {
  const eCount: Record<string, number> = {};
  const qCount: Record<string, number> = {};
  for (const o of options) {
    if (o.element) eCount[o.element] = (eCount[o.element] ?? 0) + 1;
    if (o.quality) qCount[o.quality] = (qCount[o.quality] ?? 0) + 1;
  }
  const topElement =
    ELEMENT_ORDER.slice().sort((a, b) => (eCount[b] ?? 0) - (eCount[a] ?? 0))[0];
  const topQuality =
    QUALITY_ORDER.slice().sort((a, b) => (qCount[b] ?? 0) - (qCount[a] ?? 0))[0];

  const match = SIGNS.find(
    (s) => s.element === topElement && s.quality === topQuality,
  );
  // Eşleşme her zaman vardır (element×nitelik tek burca denk gelir),
  // ama güvenli tarafta kalmak için yedek döndür.
  return match ?? SIGNS[0];
}

export const TOTAL_QUESTIONS = QUIZ.length;
