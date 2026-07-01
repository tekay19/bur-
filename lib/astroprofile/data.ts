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
  emoji: string; // soru kartında büyük rozet (görsel canlılık)
  q: string;
  options: AnswerOption[];
}

// 10 soru × 4 cevap. Her cevap aynı anda birkaç özelliği etkiler.
// Metinler sahne/senaryo bazlı ve samimi tonda — puan mantığı (effects) sabit.
export const QUESTIONS: ProfileQuestion[] = [
  {
    id: "sorun",
    emoji: "🚨",
    q: "Kriz anı! Herkes şaşkın, ortalık karışmış durumda. Sen ne yapıyorsun?",
    options: [
      { text: "🎯 Kolları sıvar, hemen çözüme koşarım.", effects: { liderlik: 8, kararlilik: 6, risk: 2 } },
      { text: "🧠 Bir adım geri çekilip tüm ihtimalleri tartarım.", effects: { mantik: 8, disiplin: 4, sabir: 3 } },
      { text: "💛 Önce 'herkes iyi mi?' diye bakarım.", effects: { empati: 7, duygusallik: 5, sezgisellik: 3 } },
      { text: "😌 Telaşa kapılmam, akışına bırakırım.", effects: { sabir: 5, risk: -4, kararlilik: -2 } },
    ],
  },
  {
    id: "hedef",
    emoji: "🎯",
    q: "Kendine büyük bir hedef koydun. Birkaç hafta sonra durum ne alemde?",
    options: [
      { text: "Bitirmeden peşini bırakmam, inatla giderim.", effects: { disiplin: 7, kararlilik: 6, sabir: 3 } },
      { text: "İlham geldikçe uçarım, plan bazen havada kalır.", effects: { sezgisellik: 6, bagimsizlik: 3, disiplin: -3 } },
      { text: "Yol boyunca rotayı sürekli güncellerim.", effects: { mantik: 4, empati: 3, sabir: 2 } },
      { text: "İlk heyecan geçince valla çabuk sıkılırım 😅", effects: { risk: 4, disiplin: -4, sabir: -4 } },
    ],
  },
  {
    id: "tanisma",
    emoji: "👋",
    q: "Hiç tanımadığın insanların olduğu bir ortamdasın. Sahne senin mi?",
    options: [
      { text: "Evet! İlk lafı genelde ben açarım.", effects: { sosyallik: 8, ozguven: 5, liderlik: 3 } },
      { text: "Önce izlerim, kimin nasıl biri olduğunu çözerim.", effects: { sezgisellik: 6, mantik: 4, sabir: 3 } },
      { text: "Ortama göre şekil alırım, bukalemun gibiyimdir.", effects: { empati: 3, mantik: 2 } },
      { text: "Genelde bir kenarda sessizce dururum.", effects: { bagimsizlik: 4, sosyallik: -5, sezgisellik: 2 } },
    ],
  },
  {
    id: "rahatsiz",
    emoji: "😤",
    q: "Seni gerçekten çileden çıkaran şey hangisi?",
    options: [
      { text: "Haksızlık — biri mağdur oldu mu tepem atar.", effects: { empati: 6, kararlilik: 5, liderlik: 2 } },
      { text: "Başarısızlık — kendimden asla vazgeçmem.", effects: { ozguven: 6, disiplin: 5, kararlilik: 3 } },
      { text: "Yalnızlık — insan sıcaklığı olmadan olmuyor.", effects: { sosyallik: 6, duygusallik: 5, empati: 3 } },
      { text: "Belirsizlik — net bir cevap yoksa huzurum kaçar.", effects: { mantik: 6, disiplin: 4, sabir: -2 } },
    ],
  },
  {
    id: "bos-zaman",
    emoji: "🌤️",
    q: "Elinde bomboş bir Cumartesi var. Ne yapıyorsun?",
    options: [
      { text: "Çantamı toplar, hiç gitmediğim bir yere giderim.", effects: { risk: 6, bagimsizlik: 5, sosyallik: 2 } },
      { text: "Elime bir kitap alır, kafamla baş başa kalırım.", effects: { mantik: 6, sabir: 4, sezgisellik: 2 } },
      { text: "Arkadaşları toplar, günü sohbetle geçiririm.", effects: { sosyallik: 8, empati: 3 } },
      { text: "Evde, pijamayla, hiçbir yere çıkmam.", effects: { bagimsizlik: 4, sabir: 4, sosyallik: -4 } },
    ],
  },
  {
    id: "iliski",
    emoji: "💞",
    q: "Sevdiğin biriyle olduğunda sen nasıl birisin?",
    options: [
      { text: "Fazla sahiplenirim, her şeye ortak olurum.", effects: { duygusallik: 7, empati: 4, bagimsizlik: -4 } },
      { text: "Duygudan çok mantıkla ilerlerim.", effects: { mantik: 7, duygusallik: -3 } },
      { text: "İçim romantizm dolu, küçük detaylara bayılırım.", effects: { duygusallik: 6, sezgisellik: 5 } },
      { text: "Sevsem de kendi alanımdan asla vazgeçmem.", effects: { bagimsizlik: 8, duygusallik: -3 } },
    ],
  },
  {
    id: "tanim",
    emoji: "🗣️",
    q: "Arkadaşların seni anlatırken hangi kelimeyi kullanır?",
    options: [
      { text: "'Lider' derler, işleri hep ben toparlarım.", effects: { liderlik: 8, ozguven: 5 } },
      { text: "'Neşeli' — ortamı ben canlandırırım.", effects: { sosyallik: 7, duygusallik: 2 } },
      { text: "'Güvenilir' — sözümün arkasında dururum.", effects: { disiplin: 5, sabir: 5, kararlilik: 3 } },
      { text: "'Sessiz ama derin' derler.", effects: { bagimsizlik: 4, sosyallik: -4, sezgisellik: 3 } },
    ],
  },
  {
    id: "karar",
    emoji: "🧭",
    q: "Hayatını değiştirecek bir karar anında pusulan ne?",
    options: [
      { text: "Mantığım — rakamlar ve gerçekler konuşur.", effects: { mantik: 8, duygusallik: -2 } },
      { text: "Kalbim — ne hissediyorsam odur.", effects: { duygusallik: 7, empati: 4, mantik: -3 } },
      { text: "İçimden gelen ses — açıklayamam ama bilirim.", effects: { sezgisellik: 8, risk: 3 } },
      { text: "Sevdiklerimin fikri — yalnız karar vermek zor gelir.", effects: { empati: 4, ozguven: -3, bagimsizlik: -4 } },
    ],
  },
  {
    id: "onemli",
    emoji: "✨",
    q: "Her şey bir yana, senin için gerçekten önemli olan ne?",
    options: [
      { text: "Başarı — zirveye tırmanmak beni diri tutar.", effects: { liderlik: 5, disiplin: 5, ozguven: 4 } },
      { text: "Mutluluk — küçük anların tadını çıkarmak.", effects: { duygusallik: 5, empati: 3, sosyallik: 3 } },
      { text: "Özgürlük — kimseye hesap vermeden yaşamak.", effects: { bagimsizlik: 8, risk: 4 } },
      { text: "Sevgi — sevmek ve sevilmek her şeyden değerli.", effects: { duygusallik: 6, empati: 6 } },
    ],
  },
  {
    id: "stres",
    emoji: "😮‍💨",
    q: "Her şey üst üste bindi, resmen stres bastı. Ne yaparsın?",
    options: [
      { text: "Kendimi işe/çalışmaya gömerim, dağılmam.", effects: { disiplin: 6, kararlilik: 4, sabir: 2 } },
      { text: "Kapıyı kapatır, kimseyi görmek istemem.", effects: { bagimsizlik: 6, sezgisellik: 3, sosyallik: -3 } },
      { text: "Birini arar, içimi dökene kadar konuşurum.", effects: { sosyallik: 6, empati: 4 } },
      { text: "Koltuğa gömülürüm, hiçbir şey yapmak istemem.", effects: { sabir: -5, risk: -3, duygusallik: 3 } },
    ],
  },
];
