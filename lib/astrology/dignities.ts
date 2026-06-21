import {
  DETRIMENT,
  EXALTATION,
  FALL,
  RULERSHIP,
} from "./constants";
import type { DignityInfo, PlanetName, ZodiacSign } from "./types";

// Bir gezegenin bulunduğu burçtaki esansiyel onur durumu
export function computeDignity(
  planet: PlanetName,
  sign: ZodiacSign,
): DignityInfo {
  if (RULERSHIP[planet]?.includes(sign)) {
    return { score: 5, status: "Yönetici" };
  }
  if (EXALTATION[planet] === sign) {
    return { score: 4, status: "Yücelme" };
  }
  if (DETRIMENT[planet]?.includes(sign)) {
    return { score: -5, status: "Zarar" };
  }
  if (FALL[planet] === sign) {
    return { score: -4, status: "Düşüş" };
  }
  return { score: 0, status: "Nötr" };
}
