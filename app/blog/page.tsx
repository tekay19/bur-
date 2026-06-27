import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { TestsSection } from "@/components/marketing/TestsSection";
import {
  getAggregatedFaqs,
  getAllArticles,
  getAllKeywords,
  getCategoriesWithCounts,
} from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai";

// --- SEO: anahtar kelime yoğun, GEO uyumlu meta ---
export const metadata: Metadata = {
  title:
    "Astroloji Blog — Doğum Haritası, Yükselen Burç, Retro ve Transit Rehberleri",
  description:
    "Astroloji rehberleri: yükselen burç hesaplama, doğum haritası okuma, Merkür retrosu, Satürn dönüşü, burç uyumu, astroloji evleri ve transitler. Sade, anlaşılır ve uzman içerikli Türkçe astroloji blogu.",
  keywords: getAllKeywords(),
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Astroloji Blog — Astrotek AI",
    description:
      "Yükselen burç, doğum haritası, retro, transit ve burç uyumu üzerine kapsamlı Türkçe astroloji rehberleri.",
    type: "website",
    url: `${SITE_URL}/blog`,
    locale: "tr_TR",
  },
};

export default function BlogIndexPage() {
  const articles = getAllArticles();
  const categories = getCategoriesWithCounts();
  const faqs = getAggregatedFaqs(8);
  const [featured, ...rest] = articles;

  // GEO + SEO: zengin yapılandırılmış veri (Blog + ItemList + Breadcrumb + FAQ).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/blog#blog`,
        name: "Astrotek AI Astroloji Blog",
        description:
          "Doğum haritası, yükselen burç, retro dönemler, transitler ve burç uyumu üzerine Türkçe astroloji rehberleri.",
        url: `${SITE_URL}/blog`,
        inLanguage: "tr-TR",
        publisher: { "@type": "Organization", name: "Astrotek AI", url: SITE_URL },
      },
      {
        "@type": "ItemList",
        itemListElement: articles.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/blog/${a.slug}`,
          name: a.title,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
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

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Breadcrumb (SEO) */}
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">
                Ana sayfa
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">
              Blog
            </li>
          </ol>
        </nav>

        {/* SEO/GEO başlık + anahtar kelime yoğun giriş */}
        <header className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Astroloji Rehberi
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Astroloji Blog: Doğum Haritası, Burçlar ve{" "}
            <span className="gradient-text">Transit</span> Rehberleri
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Yükselen burç hesaplamadan doğum haritası okumaya; Merkür retrosu,
            Satürn dönüşü ve gezegen transitlerinden burç uyumu ve astroloji
            evlerine kadar her konuyu sade, anlaşılır ve doğru bilgiyle ele
            alıyoruz. Astrolojiye yeni başlayanlar için temellerden, meraklılar
            için ileri konulara uzanan kapsamlı bir Türkçe kaynak.
          </p>
        </header>

        {/* Kategori filtreleri */}
        <nav aria-label="Kategoriler" className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/kategori/${c.slug}`}
              className="rounded-full border border-primary/15 bg-secondary/40 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <span aria-hidden>{c.emoji}</span> {c.name}
              <span className="ml-1 text-xs text-muted-foreground/70">
                {c.count}
              </span>
            </Link>
          ))}
        </nav>

        {/* Öne çıkan makale */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group mt-10 block">
            <article className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/70 p-7 backdrop-blur-md transition-colors hover:border-primary/40 sm:p-9">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                <Sparkles className="h-3.5 w-3.5" /> Öne çıkan
              </span>
              <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                {featured.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
                <time dateTime={featured.date}>{fmtDate(featured.date)}</time>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {featured.readMinutes} dk okuma
                </span>
                <span className="ml-auto inline-flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
                  Oku <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          </Link>
        )}

        {/* Makale ızgarası */}
        <h2 className="mt-12 font-display text-xl font-semibold">Tüm rehberler</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="group">
              <article className="flex h-full flex-col rounded-3xl border border-primary/15 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 text-xl">
                  <span aria-hidden>{a.emoji}</span>
                </div>
                <h3 className="font-display text-lg font-semibold leading-snug">
                  {a.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {a.excerpt}
                </p>
                {/* Görünür anahtar kelimeler (SEO + tarama dostu) */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {a.keywords.slice(0, 3).map((k) => (
                    <span
                      key={k}
                      className="rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <time dateTime={a.date}>{fmtDate(a.date)}</time>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {a.readMinutes} dk
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* GEO: makaleler arası SSS — AI arama motorları için alıntılanabilir Q/A */}
        <section className="mt-16" aria-labelledby="sss-baslik">
          <h2 id="sss-baslik" className="font-display text-2xl font-bold tracking-tight">
            Astroloji hakkında sık sorulan sorular
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            En çok merak edilen astroloji sorularının kısa ve net cevapları.
            Detaylar için ilgili rehbere göz at.
          </p>
          <div className="mt-6 grid gap-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-primary/15 bg-card/70 px-5 py-4 backdrop-blur-md [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
                <Link
                  href={`/blog/${f.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Detaylı oku <ArrowRight className="h-3 w-3" />
                </Link>
              </details>
            ))}
          </div>
        </section>

        {/* Testler — trafik artırıcı çapraz tanıtım */}
        <TestsSection compact />

        {/* CTA */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/40 to-gold/10 p-8 text-center backdrop-blur-md sm:p-12">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Kendi doğum haritanı merak ediyor musun?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Bu rehberlerdeki temaların senin haritanda nasıl göründüğünü
            saniyeler içinde, ücretsiz keşfet.
          </p>
          <Link href="/kesfet" className="mt-7 inline-block">
            <Button variant="gold" size="lg" className="group">
              Ücretsiz Haritamı Oluştur
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
