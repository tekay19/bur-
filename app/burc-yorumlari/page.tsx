import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Moon } from "lucide-react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { TestsSection } from "@/components/marketing/TestsSection";
import { TransitBanner } from "@/components/horoscope/TransitBanner";
import { getAllSigns } from "@/lib/zodiac";
import { getDailyHoroscope, getTransitAlerts } from "@/lib/horoscope";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Günlük Burç Yorumları — Bugün Tüm Burçlar",
  description:
    "Bugünün günlük burç yorumları: Koç'tan Balık'a 12 burcun aşk, kariyer ve genel yorumu. Her gün güncellenir, ücretsiz. Burcunu seç, bugün seni ne bekliyor öğren.",
  keywords: [
    "günlük burç yorumu",
    "bugün burç yorumları",
    "günlük burç",
    "burç yorumu bugün",
    "koç günlük yorum",
    "yengeç günlük",
    "astroloji günlük",
  ],
  alternates: { canonical: "/burc-yorumlari" },
  openGraph: {
    title: "Günlük Burç Yorumları — Astrotek AI",
    description: "12 burcun bugünkü yorumu. Her gün güncellenir, ücretsiz.",
    type: "website",
    url: `${SITE_URL}/burc-yorumlari`,
    locale: "tr_TR",
  },
};

export default function HoroscopesHubPage() {
  const today = new Date();
  const signs = getAllSigns();
  const readings = signs
    .map((s) => getDailyHoroscope(s.slug, today))
    .filter((x): x is NonNullable<typeof x> => x !== null);
  const dateLabel = readings[0]?.dateLabel ?? "";
  const moonSign = readings[0]?.moonSign ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Günlük Burç Yorumları",
    url: `${SITE_URL}/burc-yorumlari`,
    inLanguage: "tr-TR",
    dateModified: today.toISOString(),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-foreground">Ana sayfa</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">Günlük Burç Yorumları</li>
          </ol>
        </nav>

        <header className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Günlük <span className="gradient-text">Burç Yorumları</span>
          </h1>
          <p className="mt-3 text-base capitalize text-muted-foreground sm:text-lg">
            {dateLabel}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Moon className="h-4 w-4 text-gold" /> Bugün Ay <strong className="text-foreground/90">{moonSign}</strong> burcunda
          </p>
        </header>

        {getTransitAlerts().length > 0 && (
          <div className="mt-6">
            <TransitBanner alerts={getTransitAlerts()} />
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {readings.map((h) => (
            <Link key={h.signSlug} href={`/burc-yorumlari/${h.signSlug}`} className="group">
              <article className="flex h-full flex-col rounded-3xl border border-primary/15 bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 text-2xl text-primary">
                    <span aria-hidden>{h.glyph}</span>
                  </span>
                  <h2 className="font-display text-lg font-semibold">{h.signName}</h2>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-4">
                  {h.genel}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
                  Devamını oku <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <TestsSection compact />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
