import type {
  AstrologyAdapter,
  BirthInput,
  NatalChart,
  TransitChart,
} from "../types";

// ============================================================
// Swiss Ephemeris adapteri (GELECEK — şu an pasif)
// Vercel serverless ortamı native binary kısıtlaması nedeniyle
// dikkat gerektirir. WASM tabanlı bir Swiss Ephemeris derlemesi
// (ör. swisseph-wasm) ile burada gerçeklenebilir.
//
// Mimari, hesaplama motorunu değiştirmeye uygun tasarlandığı için
// bu sınıfın doldurulması uygulamanın geri kalanını etkilemez.
// ============================================================

export class SwissEphemerisAdapter implements AstrologyAdapter {
  readonly name = "swiss";

  async computeNatal(_input: BirthInput): Promise<NatalChart> {
    throw new Error(
      "SwissEphemerisAdapter henüz uygulanmadı (WASM entegrasyonu bekleniyor).",
    );
  }

  async computeTransit(
    _natal: NatalChart,
    _date: Date,
  ): Promise<TransitChart> {
    throw new Error("SwissEphemerisAdapter henüz uygulanmadı.");
  }
}
