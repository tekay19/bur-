import type { AstrologyAdapter } from "../types";
import { ExternalEphemerisAdapter } from "./externalAdapter";
import { LocalAstrologyAdapter } from "./localAdapter";
import { SwissEphemerisAdapter } from "./swissAdapter";

// ============================================================
// Adapter seçici — ASTRO_ADAPTER ortam değişkenine göre hesaplama
// motorunu seçer. Hata/eksik yapılandırmada güvenli şekilde yerel
// adaptere geri döner. Hesaplama motoru böylece değiştirilebilir.
// ============================================================

let cached: AstrologyAdapter | null = null;

export function getAstrologyAdapter(): AstrologyAdapter {
  if (cached) return cached;

  const choice = (process.env.ASTRO_ADAPTER ?? "local").toLowerCase();

  switch (choice) {
    case "external": {
      const url = process.env.ASTRO_EXTERNAL_API_URL;
      if (url) {
        cached = new ExternalEphemerisAdapter(
          url,
          process.env.ASTRO_EXTERNAL_API_KEY,
        );
        break;
      }
      cached = new LocalAstrologyAdapter();
      break;
    }
    case "swiss":
      // Henüz pasif; yerel adaptere düş
      cached = new LocalAstrologyAdapter();
      break;
    case "local":
    default:
      cached = new LocalAstrologyAdapter();
  }

  return cached;
}
