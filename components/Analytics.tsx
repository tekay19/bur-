import Script from "next/script";

// Google Analytics 4 (gtag.js). Yalnızca üretimde yüklenir — local/dev
// trafiği analitiği kirletmesin. Measurement ID env'den okunur, yoksa
// varsayılan kullanılır (GA ID gizli değildir).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-K05ECZL1RK";

export function Analytics() {
  if (process.env.NODE_ENV !== "production" || !GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
