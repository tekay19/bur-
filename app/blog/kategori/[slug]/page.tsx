import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import {
  CATEGORIES,
  getArticlesByCategory,
  getCategory,
} from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const c = getCategory(params.slug);
  if (!c) return { title: "Kategori bulunamadı" };
  return {
    title: `${c.name} — Astroloji Yazıları`,
    description: c.description,
    alternates: { canonical: `/blog/kategori/${c.slug}` },
    openGraph: {
      title: `${c.name} — Astrotek AI Blog`,
      description: c.description,
      type: "website",
      url: `${SITE_URL}/blog/kategori/${c.slug}`,
    },
  };
}

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = getCategory(params.slug);
  if (!category) notFound();
  const articles = getArticlesByCategory(category.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} — Astroloji Yazıları`,
    description: category.description,
    url: `${SITE_URL}/blog/kategori/${category.slug}`,
    inLanguage: "tr-TR",
    hasPart: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
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
          href="/blog"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-sm font-medium text-foreground/85 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Tüm yazılar
        </Link>
        <BrandLogo size="sm" />
      </div>

      <header className="mb-8 text-center">
        <div className="mb-3 text-4xl">{category.emoji}</div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {category.name}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {category.description}
        </p>
      </header>

      {/* Kategori sekmeleri */}
      <nav className="mb-10 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/blog/kategori/${c.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              c.slug === category.slug
                ? "border-primary bg-primary/15 text-foreground"
                : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
            }`}
          >
            {c.emoji} {c.name}
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

      <div className="mt-12 text-center">
        <Link href="/harita-olustur">
          <Button variant="gold" size="lg" className="group">
            Ücretsiz Haritamı Oluştur
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
