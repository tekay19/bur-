import Script from "next/script";

// Çerez onayı (Usercentrics CMP) + Google Analytics 4 + Google Consent Mode v2.
// Yalnızca üretimde yüklenir (local/dev analitiği kirletmez).
//
// KVKK/GDPR: Consent Mode varsayılanı "denied" → GA, kullanıcı onayı gelene
// kadar çerez yazmaz/kişisel veri işlemez. Usercentrics, kullanıcı kabul edince
// gtag('consent','update',...) ile izni günceller.
//   ⚠️ Usercentrics panelinde "Google Consent Mode v2" etkin olmalı ve GA4
//   (G-K05ECZL1RK) bir hizmet olarak tanımlanmalı; aksi halde izin güncellenmez.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-K05ECZL1RK";
const UC_SETTINGS_ID = "g0QN-YKFNexAQ1";

export function Analytics() {
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;
  return (
    <>
      {/* Çerez onay yöneticisi (Usercentrics CMP) */}
      <Script
        id="usercentrics-cmp"
        src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
        data-settings-id={UC_SETTINGS_ID}
        strategy="afterInteractive"
      />

      {/* Google Analytics 4 kütüphanesi */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      {/* Consent Mode v2 (varsayılan: denied) + GA başlatma — tek script, doğru sıra */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
