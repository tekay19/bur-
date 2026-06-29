import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { TestsSection } from "@/components/marketing/TestsSection";
import { ChineseZodiac } from "@/components/chinese/ChineseZodiac";
import { CHINESE, animalForYear } from "@/lib/chinese";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotekai.com";

export function generateMetadata({
  searchParams,
}: {
  searchParams: { yil?: string };
}): Metadata {
  const base: Metadata = {
    title: "Çin Burcu Hesaplama — Çin Burcun Hangi Hayvan? (Ücretsiz)",
    description:
      "Çin burcu hesaplama: doğum yılını gir, Çin burcunu (Fare, Öküz, Kaplan, Tavşan, Ejderha, Yılan, At, Keçi, Maymun, Horoz, Köpek, Domuz) ve özelliklerini öğren. 12 Çin burcu, uyum ve şanslı renk — ücretsiz.",
    keywords: [
      "çin burcu",
      "çin burçları",
      "çin burcu hesaplama",
      "çin astrolojisi",
      "hangi çin burcuyum",
      "ejderha yılı",
      "çin takvimi burç",
    ],
    alternates: { canonical: "/cin-burcu" },
    openGraph: {
      title: "Çin Burcu Hesaplama — Astrotek AI",
      description: "Doğum yılını gir, Çin burcunu ve özelliklerini öğren.",
      type: "website",
      url: `${SITE_URL}/cin-burcu`,
      locale: "tr_TR",
    },
  };

  const y = Number(searchParams.yil);
  if (y >= 1920 && y <= 2030) {
    const a = animalForYear(y);
    const title = `Çin Burcum ${a.name} ${a.emoji} (${y}) — Çin Burcu`;
    const img = `${SITE_URL}/api/og/cin-burcu?yil=${y}`;
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
    q: "Çin burcu nasıl hesaplanır?",
    a: "Çin burcu, Batı astrolojisinin aksine doğum ayına değil doğum YILINA göre belirlenir. 12 yıllık bir döngüde her yıl bir hayvana denk gelir (Fare, Öküz, Kaplan, Tavşan, Ejderha, Yılan, At, Keçi, Maymun, Horoz, Köpek, Domuz). Doğum yılını girerek hangi hayvana ait olduğunu öğrenebilirsin.",
  },
  {
    q: "Ocak veya Şubat başında doğdum, hangi hayvan?",
    a: "Çin yeni yılı Ocak sonu ile Şubat ortası arasında değişen bir tarihte başlar. Bu aralıkta doğanlar bir ÖNCEKİ yılın hayvanına ait olabilir. Kesin sonuç için doğduğun yılki Çin yeni yılı tarihini kontrol etmen önerilir.",
  },
  {
    q: "Çin burcu ile Batı burcu farklı mı?",
    a: "Evet, ikisi farklı sistemlerdir. Batı burcu (Koç, Boğa…) doğum ayına/gününe, Çin burcu doğum yılına dayanır. İkisi birbirini tamamlar; tam bir profil için ikisine de bakabilirsin.",
  },
];

export default function ChinesePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Çin Burcu", item: `${SITE_URL}/cin-burcu` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-foreground">Ana sayfa</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">Çin Burcu</li>
          </ol>
        </nav>

        <header className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
            Eğlenceli Test
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Çin Burcun <span className="gradient-text">Hangi Hayvan?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Çin astrolojisinde burcun doğum yılına göre belirlenir. Yılını gir,
            12 hayvandan hangisi olduğunu ve özelliklerini öğren. 🐉
          </p>
        </header>

        <section aria-label="Çin burcu hesaplama">
          <ChineseZodiac />
        </section>

        {/* 12 hayvan listesi (SEO + tarama) */}
        <section className="mt-12">
          <h2 className="font-display text-lg font-semibold">12 Çin burcu</h2>
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {CHINESE.map((a) => (
              <li key={a.slug} className="flex flex-col items-center gap-1 rounded-xl border border-primary/10 bg-card/50 px-2 py-3 text-center">
                <span className="text-2xl" aria-hidden>{a.emoji}</span>
                <span className="text-xs font-medium">{a.name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* SSS (GEO) */}
        <section className="mt-12" aria-labelledby="cin-sss">
          <h2 id="cin-sss" className="font-display text-2xl font-bold tracking-tight">
            Çin burcu hakkında sık sorulanlar
          </h2>
          <div className="mt-5 grid gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-primary/15 bg-card/70 px-5 py-4 backdrop-blur-md [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-12">
          <TestsSection compact />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
