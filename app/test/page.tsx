import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { ZodiacQuiz } from "@/components/quiz/ZodiacQuiz";
import { TestsSection } from "@/components/marketing/TestsSection";
import { getAllSigns, getSign } from "@/lib/zodiac";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai";

export function generateMetadata({
  searchParams,
}: {
  searchParams: { sonuc?: string };
}): Metadata {
  const base: Metadata = {
    title: "Burç Kişilik Testi — Ruh Burcun Hangisi? (Ücretsiz Test)",
    description:
      "Eğlenceli burç kişilik testi: 8 kısa soruyla ruh burcunu keşfet. Hangi burca benziyorsun? Element ve karakter analizine dayalı ücretsiz burç testi — sonucunu paylaş!",
    keywords: [
      "burç testi",
      "burç kişilik testi",
      "hangi burçsun testi",
      "ruh burcun",
      "kişilik testi",
      "burç bulma testi",
      "astroloji testi",
      "eğlenceli test",
    ],
    alternates: { canonical: "/test" },
    openGraph: {
      title: "Burç Kişilik Testi — Ruh Burcun Hangisi?",
      description:
        "8 kısa soruyla ruh burcunu keşfet ve sonucunu arkadaşlarınla paylaş!",
      type: "website",
      url: `${SITE_URL}/test`,
      locale: "tr_TR",
    },
  };

  const s = searchParams.sonuc ? getSign(searchParams.sonuc) : undefined;
  if (s) {
    const title = `Ruh burcum ${s.name} çıktı! Sen de keşfet`;
    const img = `${SITE_URL}/api/og/test?sonuc=${s.slug}`;
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
    q: "Burç kişilik testi nasıl çalışır?",
    a: "Test, 8 kısa soruyla seçimlerini element (ateş, toprak, hava, su) ve karakter niteliği (öncü, sabit, değişken) açısından değerlendirir. Baskın eğilimlerin 12 burçtan birine denk gelir ve ruh burcun olarak sana gösterilir.",
  },
  {
    q: "Test sonucu gerçek burcumdan farklı çıkabilir mi?",
    a: "Evet. Bu test güneş burcuna dayalı eğlenceli bir kişilik tahminidir; doğum tarihine değil, kişilik eğilimlerine bakar. Gerçek burcunu ve tüm haritanı öğrenmek için doğum bilgilerinle ücretsiz doğum haritanı oluşturabilirsin.",
  },
  {
    q: "Burç testi ücretsiz mi?",
    a: "Evet, burç kişilik testi tamamen ücretsizdir ve üyelik gerektirmez. Sonucunu dilediğin gibi paylaşabilirsin.",
  },
];

export default function TestPage() {
  const signs = getAllSigns();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Burç Testi", item: `${SITE_URL}/test` },
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

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">Ana sayfa</Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">Burç Testi</li>
          </ol>
        </nav>

        <header className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
            <Sparkles className="h-3.5 w-3.5" /> Eğlenceli Test
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Ruh Burcun <span className="gradient-text">Hangisi?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Sadece 8 kısa soru. Kişiliğine en çok hangi burç uyuyor? Cevapla,
            keşfet ve sonucunu arkadaşlarınla paylaş. 🔮
          </p>
        </header>

        <section className="mt-8" aria-label="Burç kişilik testi">
          <ZodiacQuiz />
        </section>

        {/* Tüm testler — trafik artırıcı çapraz tanıtım */}
        <TestsSection compact />

        {/* SSS (GEO) */}
        <section className="mt-14" aria-labelledby="test-sss">
          <h2 id="test-sss" className="font-display text-2xl font-bold tracking-tight">
            Test hakkında sık sorulanlar
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

        {/* Tüm burçlar (SEO iç linkleme) */}
        <section className="mt-12">
          <h2 className="font-display text-lg font-semibold">12 burcun tümünü keşfet</h2>
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
