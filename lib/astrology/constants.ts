import type {
  Element,
  Modality,
  PlanetName,
  ZodiacSign,
} from "./types";

export const SIGNS: ZodiacSign[] = [
  "Koç",
  "Boğa",
  "İkizler",
  "Yengeç",
  "Aslan",
  "Başak",
  "Terazi",
  "Akrep",
  "Yay",
  "Oğlak",
  "Kova",
  "Balık",
];

export const SIGN_GLYPH: Record<ZodiacSign, string> = {
  Koç: "♈",
  Boğa: "♉",
  İkizler: "♊",
  Yengeç: "♋",
  Aslan: "♌",
  Başak: "♍",
  Terazi: "♎",
  Akrep: "♏",
  Yay: "♐",
  Oğlak: "♑",
  Kova: "♒",
  Balık: "♓",
};

export const PLANET_GLYPH: Record<string, string> = {
  Güneş: "☉",
  Ay: "☽",
  Merkür: "☿",
  Venüs: "♀",
  Mars: "♂",
  Jüpiter: "♃",
  Satürn: "♄",
  Uranüs: "♅",
  Neptün: "♆",
  Plüton: "♇",
  Yükselen: "ASC",
  MC: "MC",
};

export const SIGN_ELEMENT: Record<ZodiacSign, Element> = {
  Koç: "Ateş",
  Aslan: "Ateş",
  Yay: "Ateş",
  Boğa: "Toprak",
  Başak: "Toprak",
  Oğlak: "Toprak",
  İkizler: "Hava",
  Terazi: "Hava",
  Kova: "Hava",
  Yengeç: "Su",
  Akrep: "Su",
  Balık: "Su",
};

export const SIGN_MODALITY: Record<ZodiacSign, Modality> = {
  Koç: "Öncü",
  Yengeç: "Öncü",
  Terazi: "Öncü",
  Oğlak: "Öncü",
  Boğa: "Sabit",
  Aslan: "Sabit",
  Akrep: "Sabit",
  Kova: "Sabit",
  İkizler: "Değişken",
  Başak: "Değişken",
  Yay: "Değişken",
  Balık: "Değişken",
};

// Modern + klasik yönetici (ev yöneticisi için)
export const SIGN_RULER: Record<ZodiacSign, PlanetName> = {
  Koç: "Mars",
  Boğa: "Venüs",
  İkizler: "Merkür",
  Yengeç: "Ay",
  Aslan: "Güneş",
  Başak: "Merkür",
  Terazi: "Venüs",
  Akrep: "Plüton",
  Yay: "Jüpiter",
  Oğlak: "Satürn",
  Kova: "Uranüs",
  Balık: "Neptün",
};

export interface HouseMeaning {
  house: number;
  title: string;
  area: string;
  keywords: string[];
}

export const HOUSE_MEANINGS: HouseMeaning[] = [
  {
    house: 1,
    title: "Kimlik & Beden",
    area: "Kimlik, beden, dış görünüş, ilk izlenim",
    keywords: ["kişilik", "görünüş", "başlangıç"],
  },
  {
    house: 2,
    title: "Para & Öz Değer",
    area: "Para, öz değer, kazanç, sahip olunanlar",
    keywords: ["gelir", "değer", "kaynak"],
  },
  {
    house: 3,
    title: "İletişim & Çevre",
    area: "İletişim, yakın çevre, kardeşler, kısa eğitim",
    keywords: ["iletişim", "öğrenme", "çevre"],
  },
  {
    house: 4,
    title: "Aile & Kökler",
    area: "Aile, kökler, ev, özel hayat",
    keywords: ["aile", "yuva", "geçmiş"],
  },
  {
    house: 5,
    title: "Aşk & Yaratıcılık",
    area: "Aşk, yaratıcılık, çocuklar, hobiler",
    keywords: ["aşk", "yaratıcılık", "keyif"],
  },
  {
    house: 6,
    title: "İş Rutini & Sağlık",
    area: "İş rutini, sağlık, hizmet, günlük düzen",
    keywords: ["rutin", "sağlık", "hizmet"],
  },
  {
    house: 7,
    title: "İlişki & Ortaklık",
    area: "İlişki, evlilik, ortaklık, açık rakipler",
    keywords: ["ilişki", "ortaklık", "evlilik"],
  },
  {
    house: 8,
    title: "Kriz & Dönüşüm",
    area: "Kriz, dönüşüm, ortak para, derinlik",
    keywords: ["dönüşüm", "ortak kaynak", "kriz"],
  },
  {
    house: 9,
    title: "Yüksek Eğitim & İnanç",
    area: "Yüksek eğitim, yurtdışı, inanç, felsefe",
    keywords: ["eğitim", "yurtdışı", "anlam"],
  },
  {
    house: 10,
    title: "Kariyer & Statü",
    area: "Kariyer, statü, atanma, başarı, otorite",
    keywords: ["kariyer", "statü", "atanma"],
  },
  {
    house: 11,
    title: "Sosyal Çevre & Hedefler",
    area: "Sosyal çevre, hedefler, topluluk, gelecek",
    keywords: ["topluluk", "hedef", "destek"],
  },
  {
    house: 12,
    title: "Bilinçaltı & Kapanışlar",
    area: "Bilinçaltı, kapanışlar, gizli konular, geri çekilme",
    keywords: ["bilinçaltı", "kapanış", "ruhsal"],
  },
];

// Esansiyel onurlar (basitleştirilmiş): yönetici / yücelme / zarar / düşüş
// Skor: +5 yönetici, +4 yücelme, -5 zarar, -4 düşüş, 0 nötr
export const RULERSHIP: Partial<Record<PlanetName, ZodiacSign[]>> = {
  Güneş: ["Aslan"],
  Ay: ["Yengeç"],
  Merkür: ["İkizler", "Başak"],
  Venüs: ["Boğa", "Terazi"],
  Mars: ["Koç", "Akrep"],
  Jüpiter: ["Yay", "Balık"],
  Satürn: ["Oğlak", "Kova"],
  Uranüs: ["Kova"],
  Neptün: ["Balık"],
  Plüton: ["Akrep"],
};

export const EXALTATION: Partial<Record<PlanetName, ZodiacSign>> = {
  Güneş: "Koç",
  Ay: "Boğa",
  Merkür: "Başak",
  Venüs: "Balık",
  Mars: "Oğlak",
  Jüpiter: "Yengeç",
  Satürn: "Terazi",
};

export const DETRIMENT: Partial<Record<PlanetName, ZodiacSign[]>> = {
  Güneş: ["Kova"],
  Ay: ["Oğlak"],
  Merkür: ["Yay", "Balık"],
  Venüs: ["Akrep", "Koç"],
  Mars: ["Terazi", "Boğa"],
  Jüpiter: ["İkizler", "Başak"],
  Satürn: ["Yengeç", "Aslan"],
};

export const FALL: Partial<Record<PlanetName, ZodiacSign>> = {
  Güneş: "Terazi",
  Ay: "Akrep",
  Merkür: "Balık",
  Venüs: "Başak",
  Mars: "Yengeç",
  Jüpiter: "Oğlak",
  Satürn: "Koç",
};

// Boylamdan burç + burç-içi derece
export function signFromLongitude(lon: number): {
  sign: ZodiacSign;
  signDegree: number;
} {
  const idx = Math.floor(lon / 30) % 12;
  return { sign: SIGNS[idx], signDegree: lon % 30 };
}

export const FOCUS_LABELS: Record<string, string> = {
  general: "Genel",
  career: "Kariyer",
  exam: "Sınav / Atanma",
  relationship: "İlişki",
  money: "Para",
  education: "Eğitim",
  relocation: "Taşınma",
  spiritual: "Ruhsal Dönem",
};
