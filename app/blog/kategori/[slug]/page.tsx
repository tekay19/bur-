import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { CATEGORIES, getArticlesByCategory, getCategory } from "@/lib/blog";

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
      locale: "tr_TR",
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
    "@graph": [
      {
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
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          {
            "@type": "ListItem",
            position: 3,
            name: category.name,
            item: `${SITE_URL}/blog/kategori/${category.slug}`,
          },
        ],
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
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">Ana sayfa</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/blog" className="hover:text-foreground">Blog</Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">{category.name}</li>
          </ol>
        </nav>

        <header className="max-w-2xl">
          <div className="mb-3 text-4xl" aria-hidden>{category.emoji}</div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {category.description}
          </p>
        </header>

        {/* Kategori sekmeleri */}
        <nav aria-label="Kategoriler" className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/blog/kategori/${c.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                c.slug === category.slug
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-primary/15 bg-secondary/40 text-muted-foreground hover:border-primary/40"
              }`}
            >
              <span aria-hidden>{c.emoji}</span> {c.name}
            </Link>
          ))}
        </nav>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} className="group">
              <article className="flex h-full flex-col rounded-3xl border border-primary/15 bg-card/70 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 text-xl">
                  <span aria-hidden>{a.emoji}</span>
                </div>
                <h2 className="font-display text-lg font-semibold leading-snug">
                  {a.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {a.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {a.readMinutes} dk
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
                    Oku <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/harita-olustur">
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
