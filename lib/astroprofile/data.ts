// ============================================================
// AstroProfil™ — veri katmanı (AI YOK, tamamen deterministik).
// 12 özellik · 12 burç başlangıç matrisi · 10 soru × 4 cevap.
// ============================================================

export const TRAIT_KEYS = [
  "liderlik",
  "mantik",
  "empati",
  "duygusallik",
  "ozguven",
  "sabir",
  "risk",
  "disiplin",
  "bagimsizlik",
  "sosyallik",
  "sezgisellik",
  "kararlilik",
] as const;

export type TraitKey = (typeof TRAIT_KEYS)[number];
export type Scores = Record<TraitKey, number>;

export const TRAIT_LABELS: Record<TraitKey, string> = {
  liderlik: "Liderlik",
  mantik: "Mantık",
  empati: "Empati",
  duygusallik: "Duygusallık",
  ozguven: "Özgüven",
  sabir: "Sabır",
  risk: "Risk Alma",
  disiplin: "Disiplin",
  bagimsizlik: "Bağımsızlık",
  sosyallik: "Sosyallik",
  sezgisellik: "Sezgisellik",
  kararlilik: "Kararlılık",
};

// Burç başlangıç matrisi — her burç farklı bir noktadan başlar.
export const SIGN_BASE: Record<string, Scores> = {
  koc:     { liderlik: 80, mantik: 50, empati: 45, duygusallik: 50, ozguven: 82, sabir: 35, risk: 85, disiplin: 50, bagimsizlik: 75, sosyallik: 65, sezgisellik: 50, kararlilik: 80 },
  boga:    { liderlik: 50, mantik: 62, empati: 60, duygusallik: 60, ozguven: 60, sabir: 85, risk: 35, disiplin: 75, bagimsizlik: 55, sosyallik: 55, sezgisellik: 50, kararlilik: 78 },
  ikizler: { liderlik: 55, mantik: 70, empati: 55, duygusallik: 50, ozguven: 60, sabir: 40, risk: 60, disiplin: 45, bagimsizlik: 65, sosyallik: 82, sezgisellik: 60, kararlilik: 45 },
  yengec:  { liderlik: 55, mantik: 50, empati: 85, duygusallik: 85, ozguven: 52, sabir: 60, risk: 38, disiplin: 55, bagimsizlik: 45, sosyallik: 55, sezgisellik: 78, kararlilik: 55 },
  aslan:   { liderlik: 85, mantik: 55, empati: 55, duygusallik: 58, ozguven: 88, sabir: 50, risk: 65, disiplin: 58, bagimsizlik: 65, sosyallik: 78, sezgisellik: 52, kararlilik: 75 },
  basak:   { liderlik: 48, mantik: 82, empati: 60, duygusallik: 50, ozguven: 55, sabir: 70, risk: 35, disiplin: 85, bagimsizlik: 55, sosyallik: 50, sezgisellik: 58, kararlilik: 65 },
  terazi:  { liderlik: 55, mantik: 60, empati: 80, duygusallik: 70, ozguven: 58, sabir: 62, risk: 45, disiplin: 52, bagimsizlik: 60, sosyallik: 75, sezgisellik: 68, kararlilik: 40 },
  akrep:   { liderlik: 70, mantik: 65, empati: 70, duygusallik: 80, ozguven: 75, sabir: 60, risk: 70, disiplin: 70, bagimsizlik: 75, sosyallik: 50, sezgisellik: 85, kararlilik: 85 },
  yay:     { liderlik: 65, mantik: 58, empati: 58, duygusallik: 50, ozguven: 78, sabir: 40, risk: 82, disiplin: 45, bagimsizlik: 85, sosyallik: 75, sezgisellik: 60, kararlilik: 55 },
  oglak:   { liderlik: 75, mantik: 75, empati: 50, duygusallik: 45, ozguven: 68, sabir: 80, risk: 40, disiplin: 88, bagimsizlik: 65, sosyallik: 50, sezgisellik: 50, kararlilik: 85 },
  kova:    { liderlik: 60, mantik: 75, empati: 60, duygusallik: 48, ozguven: 65, sabir: 55, risk: 65, disiplin: 55, bagimsizlik: 88, sosyallik: 70, sezgisellik: 70, kararlilik: 65 },
  balik:   { liderlik: 45, mantik: 48, empati: 88, duygusallik: 88, ozguven: 50, sabir: 62, risk: 42, disiplin: 45, bagimsizlik: 50, sosyallik: 58, sezgisellik: 88, kararlilik: 45 },
};

export interface AnswerOption {
  text: string;
  effects: Partial<Scores>;
}

export interface ProfileQuestion {
  id: string;
  q: string;
  options: AnswerOption[];
}

// 10 soru × 4 cevap. Her cevap aynı anda birkaç özelliği etkiler.
export const QUESTIONS: ProfileQuestion[] = [
  {
    id: "sorun",
    q: "Bir sorun çıktığında ilk yaptığın şey nedir?",
    options: [
      { text: "Hemen çözmeye çalışırım.", effects: { liderlik: 8, kararlilik: 6, risk: 2 } },
      { text: "Önce tüm ihtimalleri analiz ederim.", effects: { mantik: 8, disiplin: 4, sabir: 3 } },
      { text: "İnsanların ne hissettiğini düşünürüm.", effects: { empati: 7, duygusallik: 5, sezgisellik: 3 } },
      { text: "Biraz beklerim, acele etmem.", effects: { sabir: 5, risk: -4, kararlilik: -2 } },
    ],
  },
  {
    id: "hedef",
    q: "Bir hedef koyduğunda…",
    options: [
      { text: "Bitirmeden bırakmam.", effects: { disiplin: 7, kararlilik: 6, sabir: 3 } },
      { text: "İlham geldikçe devam ederim.", effects: { sezgisellik: 6, bagimsizlik: 3, disiplin: -3 } },
      { text: "Koşullara göre yolumu değiştiririm.", effects: { mantik: 4, empati: 3, sabir: 2 } },
      { text: "Çabuk sıkılırım.", effects: { risk: 4, disiplin: -4, sabir: -4 } },
    ],
  },
  {
    id: "tanisma",
    q: "Yeni biriyle tanışırken…",
    options: [
      { text: "İlk ben konuşurum.", effects: { sosyallik: 8, ozguven: 5, liderlik: 3 } },
      { text: "Önce karşı tarafı gözlemlerim.", effects: { sezgisellik: 6, mantik: 4, sabir: 3 } },
      { text: "Duruma göre davranırım.", effects: { empati: 3, mantik: 2 } },
      { text: "Genelde sessiz kalırım.", effects: { bagimsizlik: 4, sosyallik: -5, sezgisellik: 2 } },
    ],
  },
  {
    id: "rahatsiz",
    q: "Seni en çok ne rahatsız eder?",
    options: [
      { text: "Haksızlık", effects: { empati: 6, kararlilik: 5, liderlik: 2 } },
      { text: "Başarısızlık", effects: { ozguven: 6, disiplin: 5, kararlilik: 3 } },
      { text: "Yalnızlık", effects: { sosyallik: 6, duygusallik: 5, empati: 3 } },
      { text: "Belirsizlik", effects: { mantik: 6, disiplin: 4, sabir: -2 } },
    ],
  },
  {
    id: "bos-zaman",
    q: "Boş zamanında ne yaparsın?",
    options: [
      { text: "Seyahat eder, yeni yerler keşfederim.", effects: { risk: 6, bagimsizlik: 5, sosyallik: 2 } },
      { text: "Kitap okur, kendimle baş başa kalırım.", effects: { mantik: 6, sabir: 4, sezgisellik: 2 } },
      { text: "Arkadaşlarımla vakit geçiririm.", effects: { sosyallik: 8, empati: 3 } },
      { text: "Evde dinlenirim.", effects: { bagimsizlik: 4, sabir: 4, sosyallik: -4 } },
    ],
  },
  {
    id: "iliski",
    q: "İlişkilerde nasılsın?",
    options: [
      { text: "Çok sahiplenirim.", effects: { duygusallik: 7, empati: 4, bagimsizlik: -4 } },
      { text: "Mantıklı davranırım.", effects: { mantik: 7, duygusallik: -3 } },
      { text: "Romantik olurum.", effects: { duygusallik: 6, sezgisellik: 5 } },
      { text: "Özgürlüğümü korurum.", effects: { bagimsizlik: 8, duygusallik: -3 } },
    ],
  },
  {
    id: "tanim",
    q: "İnsanlar seni nasıl tanımlar?",
    options: [
      { text: "Lider", effects: { liderlik: 8, ozguven: 5 } },
      { text: "Neşeli", effects: { sosyallik: 7, duygusallik: 2 } },
      { text: "Güvenilir", effects: { disiplin: 5, sabir: 5, kararlilik: 3 } },
      { text: "Sessiz", effects: { bagimsizlik: 4, sosyallik: -4, sezgisellik: 3 } },
    ],
  },
  {
    id: "karar",
    q: "Karar verirken neye güvenirsin?",
    options: [
      { text: "Mantığıma", effects: { mantik: 8, duygusallik: -2 } },
      { text: "Kalbime", effects: { duygusallik: 7, empati: 4, mantik: -3 } },
      { text: "İçgüdülerime", effects: { sezgisellik: 8, risk: 3 } },
      { text: "Başkalarının fikrine", effects: { empati: 4, ozguven: -3, bagimsizlik: -4 } },
    ],
  },
  {
    id: "onemli",
    q: "Hayatta senin için en önemli şey?",
    options: [
      { text: "Başarı", effects: { liderlik: 5, disiplin: 5, ozguven: 4 } },
      { text: "Mutluluk", effects: { duygusallik: 5, empati: 3, sosyallik: 3 } },
      { text: "Özgürlük", effects: { bagimsizlik: 8, risk: 4 } },
      { text: "Sevgi", effects: { duygusallik: 6, empati: 6 } },
    ],
  },
  {
    id: "stres",
    q: "Stresliyken ne yaparsın?",
    options: [
      { text: "Daha çok çalışırım.", effects: { disiplin: 6, kararlilik: 4, sabir: 2 } },
      { text: "Yalnız kalırım.", effects: { bagimsizlik: 6, sezgisellik: 3, sosyallik: -3 } },
      { text: "Konuşur, içimi dökerim.", effects: { sosyallik: 6, empati: 4 } },
      { text: "Hiçbir şey yapmak istemem.", effects: { sabir: -5, risk: -3, duygusallik: 3 } },
    ],
  },
];
