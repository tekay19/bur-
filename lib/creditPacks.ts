// İstemci-güvenli kredi paketi tanımları (server bağımlılığı yok).
// NOT: Creem yalnızca USD/EUR kabul ettiği için fiyatlar USD. Müşterinin
// bankası ödeme anında otomatik TL'ye çevirir.
export interface CreditPack {
  id: string;
  credits: number;
  price: number; // USD (gösterim)
  label: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "pack3", credits: 3, price: 4.99, label: "3 Analiz" },
  { id: "pack10", credits: 10, price: 9.99, label: "10 Analiz", popular: true },
];
