import Link from "next/link";
import { ArrowRight, ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { getAllArticles, getCategoriesWithCounts } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai";

export const metadata = {
  title: "Astroloji Blog — Doğum Haritası, Burçlar ve Transitler",
  description:
    "Yükselen burç, doğum haritası okuma, Merkür retrosu, Satürn dönüşü, burç uyumu ve transitler üzerine sade ve anlaşılır astroloji rehberleri.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Astroloji Blog — Astrotek AI",
    description:
      "Astroloji rehberleri: yükselen burç, doğum haritası, retro, transit ve daha fazlası.",
    type: "website",
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogIndexPage() {
  const articles = getAllArticles();
  const categories = getCategoriesWithCounts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Astrotek AI Astroloji Blog",
    url: `${SITE_URL}/blog`,
    inLanguage: "tr-TR",
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.excerpt,
      datePublished: a.date,
      url: `${SITE_URL}/blog/${a.slug}`,
    })),
  };

  return (
    <main className="container max-w-5xl py-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Ana sayfa
        </Link>
        <BrandLogo size="sm" />
      </div>

      <header className="mb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          Astroloji Blog
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Yıldızları <span className="gradient-text">anlamak</span> için rehberler
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Doğum haritası, yükselen burç, retro dönemler ve transitler — hepsi
          sade, anlaşılır bir dille.
        </p>
      </header>

      {/* Kategoriler */}
      <nav className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/blog/kategori/${c.slug}`}
            className="rounded-full border border-border bg-secondary/30 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {c.emoji} {c.name}{" "}
            <span className="text-xs text-muted-foreground/60">({c.count})</span>
          </Link>
        ))}
      </nav>

      <div className="grid gap-5 sm:grid-cols-2">
        {articles.map((a) => (
          <Link key={a.slug} href={`/blog/${a.slug}`} className="group">
            <article className="flex h-full flex-col rounded-3xl border border-primary/15 bg-card/80 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 text-xl">
                {a.emoji}
              </div>
              <h2 className="font-display text-lg font-semibold leading-snug">
                {a.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {a.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {a.readMinutes} dk okuma
                </span>
                <span className="flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
                  Oku <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/15 via-card/40 to-gold/10 p-8 text-center backdrop-blur-md">
        <h2 className="font-display text-xl font-semibold sm:text-2xl">
          Kendi haritanı merak ediyor musun?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Doğum bilgini gir, haritan ve kişisel yorumun saniyeler içinde hazır.
        </p>
        <Link href="/harita-olustur" className="mt-6 inline-block">
          <Button variant="gold" size="lg" className="group">
            Ücretsiz Haritamı Oluştur
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
