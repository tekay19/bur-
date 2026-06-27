// İstemci-güvenli kredi paketi tanımları (server bağımlılığı yok).
// NOT: Creem yalnızca USD/EUR kabul ettiği için fiyatlar USD. Müşterinin
// bankası ödeme anında otomatik TL'ye çevirir.
//
// FİYATLANDIRMA / CREEM KOMİSYONU:
// Creem her işlemden %3.9 + $0.40 keser (+ ödeme çekiminde min $7 ya da %1).
// Sabit $0.40, küçük paketlerde oransal olarak yüksek kaldığından giriş paketi
// fiyatı buna göre belirlendi. Tahmini net (komisyon sonrası):
//   - 3 Analiz  @ $5.99  → komisyon ~$0.63 (%10.5) → net ~$5.36 (~$1.79/analiz)
//   - 10 Analiz @ $11.99 → komisyon ~$0.87 (%7.3)  → net ~$11.12 (~$1.11/analiz)
// Her analiz natal + transit + AI yorumu içerir; AI maliyeti analiz başına
// birkaç senttir, günlük yorum AI'ı burç+gün başına tek üretildiğinden ihmal
// edilebilir. Bu fiyatlar her iki özelliği de rahatça karşılar.
//
// ⚠️ `price` yalnızca GÖSTERİM içindir. Gerçek tahsilat Creem ürününde tanımlı;
// bu sayıları değiştirince Creem panelinde ilgili ürün fiyatlarını da eşitle
// (CREEM_PRODUCT_PACK3 / CREEM_PRODUCT_PACK10).
export interface CreditPack {
  id: string;
  credits: number;
  price: number; // USD (gösterim)
  label: string;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "pack3", credits: 3, price: 5.99, label: "3 Analiz" },
  { id: "pack10", credits: 10, price: 11.99, label: "10 Analiz", popular: true },
];

// Premium üyelik (tekrarlayan abonelik) — sınırsız günlük/haftalık/aylık yorum
// + transit içerikleri. Creem fiyatı $4.99/ay → komisyon ~$0.59 → net ~$4.40/ay.
// ⚠️ Creem'de TEKRARLAYAN (subscription) ürün oluştur ve id'sini
// CREEM_PRODUCT_PREMIUM env'ine yaz; fiyatı aşağıdakiyle eşitle.
export const PREMIUM_PLAN = {
  id: "premium" as const,
  price: 4.99, // USD/ay (gösterim)
  period: "ay" as const,
  label: "Premium",
  perks: [
    "Sınırsız günlük burç yorumu",
    "Haftalık & aylık yorum",
    "Güncel transit uyarıları",
    "Şanslı renk, sayı ve e-posta hatırlatma",
  ],
};
