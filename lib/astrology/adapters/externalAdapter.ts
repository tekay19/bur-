import type {
  AstrologyAdapter,
  BirthInput,
  NatalChart,
  TransitChart,
} from "../types";

// ============================================================
// Harici Efemeris API adapteri (iskelet)
// ASTRO_EXTERNAL_API_URL tanımlandığında devreye girer.
// Beklenen sözleşme: gezegen boylamlarını döndüren bir REST uç noktası.
// Üretimde gerçek bir efemeris servisine bağlanması için doldurulmalı.
// ============================================================

export class ExternalEphemerisAdapter implements AstrologyAdapter {
  readonly name = "external";

  constructor(
    private readonly apiUrl: string,
    private readonly apiKey?: string,
  ) {}

  async computeNatal(_input: BirthInput): Promise<NatalChart> {
    // TODO: Harici efemeris servisine istek atıp yanıtı NatalChart'a map et.
    // Şimdilik yapılandırma eksikse yerel adaptere geri dönülmesi
    // için hata fırlatır (adapter index bunu yakalar).
    throw new Error(
      "ExternalEphemerisAdapter henüz uygulanmadı. ASTRO_ADAPTER=local kullanın.",
    );
  }

  async computeTransit(
    _natal: NatalChart,
    _date: Date,
  ): Promise<TransitChart> {
    throw new Error("ExternalEphemerisAdapter henüz uygulanmadı.");
  }
}
