// ============================================================
// Yasal metinler için TEK kaynak. Buradaki değerleri düzenlemen
// yeterli — tüm yasal sayfalar ve formlar bunu kullanır.
//
// ÖNEMLİ (doldur/güncelle):
//  - controller: KVKK "veri sorumlusu". Şirketin yoksa gerçek kişi
//    ad-soyadını ya da işletme/marka adını yaz.
//  - contactEmail / kvkkEmail: gerçekten ulaşılabilen kutular olmalı
//    (KVKK başvuruları buraya gelir). Şu an placeholder.
//  - effectiveDate: metni her güncellediğinde değiştir.
// ============================================================

export const LEGAL = {
  platformName: "Astrotek AI",
  // KVKK veri sorumlusu (gerçek kişi ad-soyad veya işletme/marka adı)
  controller: "Astrotek AI",
  domain: "astrotekai.com",
  contactEmail: "astrotekai@protonmail.com",
  kvkkEmail: "astrotekai@protonmail.com",
  // Ödeme altyapısı — Merchant of Record (yasal satıcı)
  paymentProcessor: "Creem.io",
  effectiveDate: "29 Haziran 2026",
} as const;

// Yasal sayfalar (footer + sayfa-içi gezinme + sitemap tek listeden)
export const LEGAL_PAGES = [
  { href: "/kullanim-kosullari", label: "Üyelik Sözleşmesi & Kullanım Koşulları" },
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
] as const;
