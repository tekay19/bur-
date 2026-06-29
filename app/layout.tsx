import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpaceBackground } from "@/components/SpaceBackground";
import { IntroOverlay } from "@/components/IntroOverlay";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotekai.com";
const SITE_NAME = "Astrotek AI";
const DESCRIPTION =
  "Astrotek AI ile ücretsiz doğum haritanı hesapla. Natal harita, yükselen burç, evler, açılar ve güncel transitlerin hayatındaki etkilerini yapay zeka ile sade Türkçe yorumla. Kariyer, sınav, ilişki ve para için kişisel astroloji analizi.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Astrotek AI — Ücretsiz Doğum Haritası & AI Astroloji Yorumu",
    template: "%s — Astrotek AI",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  category: "lifestyle",
  keywords: [
    "doğum haritası",
    "doğum haritası hesaplama",
    "ücretsiz doğum haritası",
    "natal harita",
    "yükselen burç hesaplama",
    "astroloji",
    "AI astroloji",
    "yapay zeka astroloji",
    "transit yorumu",
    "burç yorumu",
    "astroloji analizi",
    "kişisel astroloji",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Astrotek AI — Ücretsiz Doğum Haritası & AI Astroloji Yorumu",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrotek AI — Ücretsiz Doğum Haritası & AI Astroloji Yorumu",
    description: DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

// Site geneli yapılandırılmış veri (SEO + GEO / AI arama motorları için)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "tr-TR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      inLanguage: "tr-TR",
      description: DESCRIPTION,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "TRY",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="min-h-screen overflow-x-hidden bg-background font-sans">
        <SpaceBackground />
        <IntroOverlay />
        <div className="relative min-h-screen">{children}</div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
