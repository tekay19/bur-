import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { AstroProfile } from "@/components/astroprofile/AstroProfile";
import { TestsSection } from "@/components/marketing/TestsSection";
import { getAllSigns, getSign } from "@/lib/zodiac";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotekai.com";

export function generateMetadata({
  searchParams,
}: {
  searchParams: { b?: string; c?: string };
}): Metadata {
  const base: Metadata = {
    title: "AstroProfil™ — Astrolojik Kişilik Analizi (Ücretsiz Test)",
    description:
      "AstroProfil™: burcunu ve kişilik tercihlerini birleştiren dinamik astrolojik kişilik analizi. 12 özellik, 10 soru ile karar verme tarzın, ilişki stilin, kariyer eğilimin ve daha fazlası. Aynı burçtan herkes farklı sonuç alır — tamamen sana özel.",
    keywords: [
      "astrolojik kişilik analizi",
      "burç kişilik testi",
      "kişilik analizi testi",
      "astroprofil",
      "karakter analizi",
      "burç karakter testi",
      "kişilik testi ücretsiz",
      "astroloji kişilik",
    ],
    alternates: { canonical: "/astroprofil" },
    openGraph: {
      title: "AstroProfil™ — Astrolojik Kişilik Analizi",
      description:
        "Burcun + kişiliğin = sana özel astrolojik profil. 10 soruda keşfet ve paylaş.",
      type: "website",
      url: `${SITE_URL}/astroprofil`,
      locale: "tr_TR",
    },
  };

  const { b, c } = searchParams;
  if (b && c && getSign(b) && /^[0-3]{10}$/.test(c)) {
    const title = `AstroProfilim: ${getSign(b)!.name} — kişiliğimin tam haritası`;
    const img = `${SITE_URL}/api/og/astroprofil?b=${b}&c=${c}`;
    return {
      ...base,
      title,
      openGraph: { ...base.openGraph, title, images: [{ url: img, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", title, images: [img] },
    };
  }
  return base;
}

const FAQ = [
  {
    q: "AstroProfil™ nedir, normal burç testinden farkı ne?",
    a: "AstroProfil™, yalnızca güneş burcuna bakan klasik testlerin aksine; burcunun başlangıç profili ile 10 soruya verdiğin yanıtları birleştirir. 12 kişilik özelliğini puanlayıp, kurallara dayalı dinamik bir analiz üretir. Böylece aynı burçtan iki kişi farklı yanıt verdiğinde tamamen farklı sonuç alır.",
  },
  {
    q: "Yapay zeka mı kullanıyor?",
    a: "Hayır. AstroProfil tamamen kural tabanlı, deterministik bir sistemdir. Burç başlangıç matrisi, test puanları ve karar motoru ile çalışır; sonuçlar hızlı, tutarlı ve tekrarlanabilirdir.",
  },
  {
    q: "Analiz ne kadar kişisel?",
    a: "Çok kişisel. Sonuç; karar verme tarzın, ilişki stilin, kariyer eğilimin, stres altındaki davranışın, güçlü ve gelişime açık yönlerin ile sana uygun meslek ve burç enerjilerini içerir. Hepsi senin puan kombinasyonuna göre oluşturulur.",
  },
  {
    q: "Ücretsiz mi?",
    a: "Evet, AstroProfil tamamen ücretsizdir ve üyelik gerektirmez. Sonucunu bağlantıyla paylaşabilirsin.",
  },
];

export default function AstroProfilPage() {
  const signs = getAllSigns();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "AstroProfil", item: `${SITE_URL}/astroprofil` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">Ana sayfa</Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">AstroProfil</li>
          </ol>
        </nav>

        <header className="mb-8 max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            AstroProfil™ — Astrolojik{" "}
            <span className="gradient-text">Kişilik Analizi</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Burcun seni nasıl etkiliyor? Kişilik tercihlerin bu enerjiyi nasıl
            şekillendiriyor? AstroProfil, burcunu ve karakterini birleştirerek
            karar verme tarzından ilişki stiline, kariyer eğiliminden stres
            yönetimine kadar sana özel bir profil çıkarır.
          </p>
        </header>

        <section aria-label="AstroProfil kişilik analizi">
          <AstroProfile />
        </section>

        {/* Tüm testler — trafik artırıcı çapraz tanıtım */}
        <TestsSection compact />

        {/* SSS (GEO) */}
        <section className="mt-16" aria-labelledby="ap-sss">
          <h2 id="ap-sss" className="font-display text-2xl font-bold tracking-tight">
            AstroProfil hakkında sık sorulanlar
          </h2>
          <div className="mt-5 grid gap-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-primary/15 bg-card/70 px-5 py-4 backdrop-blur-md [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* İç linkleme */}
        <section className="mt-12">
          <h2 className="font-display text-lg font-semibold">12 burcun özelliklerini keşfet</h2>
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {signs.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/burclar/${s.slug}`}
                  className="flex flex-col items-center gap-1 rounded-xl border border-primary/10 bg-card/50 px-2 py-3 text-center transition-colors hover:border-primary/30 hover:bg-card/80"
                >
                  <span className="text-xl text-primary" aria-hidden>{s.glyph}</span>
                  <span className="text-xs font-medium">{s.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
