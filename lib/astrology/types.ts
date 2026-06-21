// ============================================================
// Astroloji çekirdek tipleri
// Tüm hesaplama katmanı (local / external / swiss adapter) bu
// tiplere uymak zorundadır. Böylece hesaplama motoru
// değiştirilebilir (swappable) kalır.
// ============================================================

export type PlanetName =
  | "Güneş"
  | "Ay"
  | "Merkür"
  | "Venüs"
  | "Mars"
  | "Jüpiter"
  | "Satürn"
  | "Uranüs"
  | "Neptün"
  | "Plüton";

export type PointName = PlanetName | "Yükselen" | "MC";

export type ZodiacSign =
  | "Koç"
  | "Boğa"
  | "İkizler"
  | "Yengeç"
  | "Aslan"
  | "Başak"
  | "Terazi"
  | "Akrep"
  | "Yay"
  | "Oğlak"
  | "Kova"
  | "Balık";

export type Element = "Ateş" | "Toprak" | "Hava" | "Su";
export type Modality = "Öncü" | "Sabit" | "Değişken";

export type AspectType =
  | "Kavuşum"
  | "Altmışlık"
  | "Kare"
  | "Üçgen"
  | "Karşıt";

export type Polarity = "Destekleyici" | "Zorlayıcı" | "Karışık" | "Belirsiz";

export type Strength = "Güçlü" | "Destekleyici" | "Karışık" | "Zayıf";

export type FocusArea =
  | "general"
  | "career"
  | "exam"
  | "relationship"
  | "money"
  | "education"
  | "relocation"
  | "spiritual";

export type BirthTimeAccuracy = "exact" | "approx" | "unknown";

// Bir gezegenin/noktanın konumu
export interface PlanetPosition {
  name: PointName;
  longitude: number; // 0-360 ekliptik boylam
  sign: ZodiacSign;
  signDegree: number; // burç içi derece 0-30
  house: number | null; // 1-12 (doğum saati yoksa null)
  retrograde: boolean;
  speed: number; // günlük derece hızı (retro tespiti için)
  dignity?: DignityInfo;
  strength?: Strength;
}

export interface DignityInfo {
  score: number; // -5 .. +5 ağırlıklı esansiyel onur skoru
  status: string; // "Yönetici", "Yücelme", "Düşüş", "Zarar", "Nötr"
}

export interface HousePosition {
  house: number; // 1-12
  cuspLongitude: number;
  sign: ZodiacSign;
  signDegree: number;
}

export interface HouseAnalysis {
  house: number;
  lifeArea: string;
  ruler: PlanetName;
  rulerSign: ZodiacSign | null;
  planetsInHouse: PlanetName[];
  polarity: Polarity;
  active: boolean; // ev "çalışıyor" mu (içinde gezegen / güçlü açı var mı)
  score: number; // 0-100
  shortNote: string;
}

export interface Aspect {
  planet1: PointName;
  planet2: PointName;
  type: AspectType;
  angle: number; // ideal açı
  orb: number; // sapma derecesi
  polarity: Polarity;
  strength: number; // 0-100, orb'a göre
  lifeAreaNote: string;
}

export interface NatalChart {
  meta: {
    adapter: string;
    julianDay: number;
    hasHouses: boolean;
    birthTimeAccuracy: BirthTimeAccuracy;
    computedAt: string;
  };
  planets: PlanetPosition[];
  houses: HousePosition[];
  aspects: Aspect[];
  ascendant: number | null;
  midheaven: number | null;
  dominants: {
    element: Element;
    modality: Modality;
    elementBreakdown: Record<Element, number>;
    modalityBreakdown: Record<Modality, number>;
    strongest: PlanetName[];
    challenging: PlanetName[];
  };
}

// Transit etkisi (transit gezegen -> natal nokta/ev)
export interface TransitHit {
  transitPlanet: PlanetName;
  targetType: "planet" | "house";
  target: PointName | string; // natal gezegen adı veya "10. Ev"
  aspect: AspectType | "Geçiş";
  orb: number;
  polarity: Polarity;
  score: number; // 0-100 etki gücü
  speedClass: "slow" | "fast" | "moon"; // yavaş/hızlı/Ay
  theme: string;
  note: string;
  window: {
    start: string; // ISO tarih
    peak: string;
    end: string;
  };
}

export interface TransitChart {
  meta: {
    adapter: string;
    date: string;
    julianDay: number;
  };
  positions: PlanetPosition[];
  hits: TransitHit[];
}

// Skorlama çıktısı
export interface ScoreDetail {
  value: number; // 0-100
  category: string;
  label: string;
  explanation: string;
  supporting: string[];
  challenging: string[];
}

export interface ChartScores {
  overall: ScoreDetail;
  career: ScoreDetail;
  examAppointment: ScoreDetail;
  relationship: ScoreDetail;
  money: ScoreDetail;
  healthRoutine: ScoreDetail;
  education: ScoreDetail;
}

// Doğum girdisi (adapter'a gelen)
export interface BirthInput {
  name: string;
  gender?: string | null;
  date: string; // yyyy-MM-dd
  time?: string | null; // HH:mm
  place: string;
  latitude: number;
  longitude: number;
  timezone: string; // örn "Europe/Istanbul" veya UTC offset stringi
  birthTimeAccuracy: BirthTimeAccuracy;
  focusArea: FocusArea;
}

// Hesaplama motoru sözleşmesi (adapter pattern)
export interface AstrologyAdapter {
  readonly name: string;
  computeNatal(input: BirthInput): Promise<NatalChart>;
  computeTransit(natal: NatalChart, date: Date): Promise<TransitChart>;
}
