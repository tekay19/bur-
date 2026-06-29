// İstemci-güvenli kredi paketi tanımları (server bağımlılığı yok).
// NOT: Creem yalnızca USD/EUR kabul ettiği için fiyatlar USD. Müşterinin
// bankası ödeme anında otomatik TL'ye çevirir.
//
// FİYATLANDIRMA (1 analiz = $2.50 baz, paketlerde indirim):
// Creem her işlemden ~%3.9 + $0.40 keser. Tahmini net (komisyon sonrası):
//   - 1 Analiz  @ $2.50  → komisyon ~$0.50 → net ~$2.00 (~$2.00/analiz)
//   - 5 Analiz  @ $9.99  → komisyon ~$0.79 → net ~$9.20 (~$1.84/analiz)
//   - 10 Analiz @ $17.99 → komisyon ~$1.10 → net ~$16.89 (~$1.69/analiz)
// Her analiz natal + transit + AI yorumu içerir; AI maliyeti analiz başına
// birkaç senttir. Tüm paketler kârlıdır.
//
// ⚠️ `price` yalnızca GÖSTERİM içindir. Gerçek tahsilat Creem ürününde tanımlı;
// bu sayıları değiştirince Creem panelinde ürünleri AYNI fiyatla oluştur ve
// id'lerini env'e yaz: CREEM_PRODUCT_PACK1 / CREEM_PRODUCT_PACK5 / CREEM_PRODUCT_PACK10.
export interface CreditPack {
  id: string;
  credits: number;
  price: number; // USD (gösterim)
  label: string;
  popular?: boolean;
  perUnit?: string; // "%X indirim" rozeti için (gösterim)
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "pack1", credits: 1, price: 2.5, label: "1 Analiz" },
  { id: "pack5", credits: 5, price: 9.99, label: "5 Analiz", perUnit: "%20 indirim" },
  {
    id: "pack10",
    credits: 10,
    price: 17.99,
    label: "10 Analiz",
    popular: true,
    perUnit: "%28 indirim",
  },
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
