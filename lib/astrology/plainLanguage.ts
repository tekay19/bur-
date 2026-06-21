import type { PlanetName, Polarity } from "./types";

// ============================================================
// Sade dil çevirici — astroloji jargonunu (transit/natal/açı)
// herkesin anlayacağı günlük Türkçeye çevirir. Aynı analiz,
// "haaa demek böyleymiş" dedirten anlatım.
// ============================================================

interface Energy {
  headline: string; // kısa, sade başlık
  good: string; // destekleyici cümle
  hard: string; // zorlayıcı cümle
}

const TRANSIT: Record<PlanetName, Energy> = {
  Jüpiter: {
    headline: "Şans ve fırsat dönemi",
    good: "Yeni kapılar açılabilir, şansın ve özgüvenin artabilir.",
    hard: "Aşırı iyimserlik veya gereğinden fazla yayılma seni yorabilir.",
  },
  Satürn: {
    headline: "Disiplin ve emek dönemi",
    good: "Emeğinin karşılığını alabilir, sağlam ve kalıcı sonuçlar elde edebilirsin.",
    hard: "Sorumluluk yükü, gecikmeler ya da bir tür sınav gündeme gelebilir.",
  },
  Uranüs: {
    headline: "Değişim ve sürpriz dönemi",
    good: "Beklenmedik güzel fırsatlar ve bir özgürleşme hissi gelebilir.",
    hard: "Ani ve sarsıcı değişiklikler dengeni bozabilir.",
  },
  Neptün: {
    headline: "Sezgi ve hayal dönemi",
    good: "İlham, sezgi ve yaratıcılığın güçlenebilir.",
    hard: "Kafa karışıklığı, belirsizlik veya hayal kırıklığı yaşayabilirsin.",
  },
  Plüton: {
    headline: "Derin dönüşüm dönemi",
    good: "Hayatına yön veren güçlü ve kalıcı bir dönüşüm yaşayabilirsin.",
    hard: "Güç/kontrol çekişmeleri ya da bırakman gereken şeyler öne çıkabilir.",
  },
  Mars: {
    headline: "Enerji ve harekete geçme dönemi",
    good: "Motivasyonun ve harekete geçme gücün yüksek olabilir.",
    hard: "Sabırsızlık, gerginlik veya tartışmalara açık bir dönem.",
  },
  Venüs: {
    headline: "İlişki ve keyif dönemi",
    good: "İlişkilerde ve maddi konularda hoş gelişmeler olabilir.",
    hard: "İlişki veya para konusunda küçük dalgalanmalar olabilir.",
  },
  Merkür: {
    headline: "Düşünce ve iletişim dönemi",
    good: "Zihnin açık; iletişim, karar ve planlama için iyi bir zaman.",
    hard: "Yanlış anlaşılmalar veya dağınık bir zihin gündeme gelebilir.",
  },
  Güneş: {
    headline: "Görünürlük ve özgüven dönemi",
    good: "Özgüvenin artabilir, dikkatleri üzerine çekebilirsin.",
    hard: "Odak ya da ego konusunda kendini biraz zorlanmış hissedebilirsin.",
  },
  Ay: {
    headline: "Duygusal dalga",
    good: "Duygusal olarak dengeli ve huzurlu hissedebilirsin.",
    hard: "Duygusal iniş çıkışlar olabilir; ruh halin değişken olabilir.",
  },
};

// Natal noktanın "hangi hayat alanı" olduğunu sade anlatır
const AREA: Record<string, string> = {
  Güneş: "genel gidişatın ve özgüvenin",
  Ay: "duyguların ve iç huzurun",
  Merkür: "düşüncelerin, planların ve iletişimin",
  Venüs: "aşk hayatın ve maddi durumun",
  Mars: "enerjin ve motivasyonun",
  Jüpiter: "şansın ve büyüme alanların",
  Satürn: "sorumlulukların ve kariyerin",
  Uranüs: "özgürlük ve değişim ihtiyacın",
  Neptün: "hayallerin ve sezgilerin",
  Plüton: "derin dönüşüm ve içsel değişim",
  MC: "kariyerin ve toplumdaki yerin",
  Yükselen: "kişiliğin ve hayata bakışın",
};

const HOUSE_AREA: Record<number, string> = {
  1: "kişiliğin ve genel duruşun",
  2: "paran ve maddi güvenliğin",
  3: "iletişimin, yakın çevren ve öğrenmen",
  4: "ailen, evin ve özel hayatın",
  5: "aşkın, keyfin ve yaratıcılığın",
  6: "iş rutinin, sağlığın ve günlük düzenin",
  7: "ilişkilerin ve ortaklıkların",
  8: "ortak kaynaklar, kriz ve dönüşüm",
  9: "eğitimin, yurt dışı ve inançların",
  10: "kariyerin ve toplumdaki yerin",
  11: "arkadaş çevren, hedeflerin ve sosyal hayatın",
  12: "iç dünyan, dinlenmen ve geride bıraktıkların",
};

function areaPhrase(target: string): string {
  const houseMatch = target.match(/^(\d+)\.\s*Ev$/);
  if (houseMatch) return HOUSE_AREA[Number(houseMatch[1])] ?? "bu alan";
  return AREA[target] ?? "bu alan";
}

// Kısa, sade başlık (kart başlığı için)
export function plainTransitTheme(tp: PlanetName): string {
  return TRANSIT[tp]?.headline ?? "Önemli bir dönem";
}

// Tam, herkesin anlayacağı açıklama
export function plainTransitNote(
  tp: PlanetName,
  target: string,
  polarity: Polarity,
): string {
  const e = TRANSIT[tp];
  const area = areaPhrase(target);
  if (!e) return `Bu dönem ${area} öne çıkıyor.`;

  if (polarity === "Destekleyici") {
    return `Bu dönem ${area} konusunda işler senin lehine akabilir. ${e.good} Önüne çıkan fırsatları değerlendirmek için uygun bir zaman.`;
  }
  if (polarity === "Zorlayıcı") {
    return `Bu dönem ${area} konusunda kendini biraz zorlanmış hissedebilirsin. ${e.hard} Telaşa gerek yok; sabırlı ve planlı davranırsan bu süreç seni güçlendirir.`;
  }
  // Karışık / kavuşum
  return `Bu dönem ${area} belirgin şekilde öne çıkıyor. Hem güzel fırsatlar hem de dikkat etmen gereken yanlar bir arada olabilir; dengeyi korumaya çalış.`;
}

// Kısa, sade tek satır (forecast kartı vb. için)
export function plainTransitOneLiner(
  tp: PlanetName,
  target: string,
  polarity: Polarity,
): string {
  const area = areaPhrase(target);
  const tone =
    polarity === "Destekleyici"
      ? "destekleyici bir dönem"
      : polarity === "Zorlayıcı"
        ? "dikkat ve sabır isteyen bir dönem"
        : "yoğun bir vurgu";
  return `${capitalize(area)} için ${tone}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1);
}

// Sade, korkutmayan uyarı metni
export const PLAIN_DISCLAIMER =
  "Bunlar kesin kehanet değil; daha çok “bu aralar şuna dikkat” gibi eğilimlerdir.";
