import type {
  Aspect,
  AspectType,
  PlanetPosition,
  PointName,
  Polarity,
} from "./types";

interface AspectDef {
  type: AspectType;
  angle: number;
  orb: number; // izin verilen maksimum sapma
  polarity: Polarity;
}

// Ana (major) açılar ve orb toleransları
export const ASPECT_DEFS: AspectDef[] = [
  { type: "Kavuşum", angle: 0, orb: 8, polarity: "Karışık" },
  { type: "Altmışlık", angle: 60, orb: 5, polarity: "Destekleyici" },
  { type: "Kare", angle: 90, orb: 7, polarity: "Zorlayıcı" },
  { type: "Üçgen", angle: 120, orb: 7, polarity: "Destekleyici" },
  { type: "Karşıt", angle: 180, orb: 8, polarity: "Zorlayıcı" },
];

// İki gezegen kombinasyonuna göre kısa hayat-alanı yorumu
function lifeAreaNote(
  p1: PointName,
  p2: PointName,
  type: AspectType,
  polarity: Polarity,
): string {
  const pair = [p1, p2].sort().join("-");
  const supportive = polarity === "Destekleyici";

  const themes: Record<string, string> = {
    "Güneş-Jüpiter": supportive
      ? "Özgüven, büyüme ve fırsatlar destekleniyor."
      : "Aşırı iyimserlik veya abartıya dikkat.",
    "Güneş-Satürn": supportive
      ? "Disiplin ve sorumlulukla kalıcı başarı."
      : "Sorumluluk yükü, otoriteyle gerilim olabilir.",
    "Merkür-Satürn": supportive
      ? "Odaklı, disiplinli zihin; sınav ve çalışmaya uygun."
      : "Zihinsel baskı, öz eleştiri yoğunlaşabilir.",
    "Jüpiter-Merkür": supportive
      ? "Öğrenme, sınav ve iletişimde şans."
      : "Detayları atlama eğilimi.",
    "Mars-Satürn": supportive
      ? "Kontrollü, dayanıklı çalışma enerjisi."
      : "Engellenmiş motivasyon, sabırsızlık.",
    "Ay-Satürn": supportive
      ? "Duygusal olgunluk ve sağlamlık."
      : "Duygusal yük, içe kapanma eğilimi.",
    "Venüs-Mars": supportive
      ? "İlişki ve çekim alanında akış."
      : "İlişkilerde tutku-gerilim dengesi.",
    "Venüs-Jüpiter": supportive
      ? "İlişki, para ve keyifte bolluk."
      : "Savurganlık veya abartıya açık.",
  };

  if (themes[pair]) return themes[pair];

  return supportive
    ? `${p1} ve ${p2} enerjileri uyumlu akıyor.`
    : polarity === "Zorlayıcı"
      ? `${p1} ve ${p2} arasında gerilim, gelişim için fırsat.`
      : `${p1} ve ${p2} enerjileri yoğun şekilde birleşiyor.`;
}

function angleBetween(a: number, b: number): number {
  let diff = Math.abs(a - b) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

// Kavuşum polaritesini gezegen doğasına göre incelt
function refineConjunction(p1: PointName, p2: PointName): Polarity {
  const malefics: PointName[] = ["Satürn", "Mars", "Plüton"];
  const benefics: PointName[] = ["Venüs", "Jüpiter"];
  const hard = [p1, p2].filter((p) => malefics.includes(p)).length;
  const soft = [p1, p2].filter((p) => benefics.includes(p)).length;
  if (soft >= 1 && hard === 0) return "Destekleyici";
  if (hard >= 1 && soft === 0) return "Zorlayıcı";
  return "Karışık";
}

// Bir gezegen kümesi için tüm major açıları hesapla
export function calculateAspects(positions: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const a = positions[i];
      const b = positions[j];
      const sep = angleBetween(a.longitude, b.longitude);

      for (const def of ASPECT_DEFS) {
        const orb = Math.abs(sep - def.angle);
        if (orb <= def.orb) {
          let polarity = def.polarity;
          if (def.type === "Kavuşum") {
            polarity = refineConjunction(a.name, b.name);
          }
          // Orb ne kadar darsa açı o kadar güçlü
          const strength = Math.round(
            Math.max(0, 100 - (orb / def.orb) * 100),
          );
          aspects.push({
            planet1: a.name,
            planet2: b.name,
            type: def.type,
            angle: def.angle,
            orb: Number(orb.toFixed(2)),
            polarity,
            strength,
            lifeAreaNote: lifeAreaNote(a.name, b.name, def.type, polarity),
          });
          break; // bir çift için tek (en yakın) açı
        }
      }
    }
  }
  // Güce göre sırala
  return aspects.sort((x, y) => y.strength - x.strength);
}

// Transit gezegen ile natal nokta arasındaki açıyı bul (varsa)
export function findTransitAspect(
  transitLon: number,
  natalLon: number,
): { type: AspectType; orb: number; polarity: Polarity } | null {
  const sep = angleBetween(transitLon, natalLon);
  for (const def of ASPECT_DEFS) {
    // transitlerde daha dar orb kullan
    const transitOrb = Math.min(def.orb, 5);
    const orb = Math.abs(sep - def.angle);
    if (orb <= transitOrb) {
      return { type: def.type, orb: Number(orb.toFixed(2)), polarity: def.polarity };
    }
  }
  return null;
}
