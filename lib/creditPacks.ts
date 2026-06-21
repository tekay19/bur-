// İstemci-güvenli kredi paketi tanımları (server bağımlılığı yok)
export interface CreditPack {
  id: string;
  credits: number;
  price: number; // TRY
  label: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "pack3", credits: 3, price: 99, label: "3 Analiz" },
  { id: "pack10", credits: 10, price: 249, label: "10 Analiz", popular: true },
];
