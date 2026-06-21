import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { Disclaimer } from "@/components/Disclaimer";
import { getAllArticles, getArticle, getCategory } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const a = getArticle(params.slug);
  if (!a) return { title: "Bulunamadı" };
  const url = `${SITE_URL}/blog/${a.slug}`;
  return {
    title: a.title,
    description: a.excerpt,
    keywords: a.keywords,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.excerpt,
      type: "article",
      url,
      publishedTime: a.date,
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.excerpt,
    },
  };
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const a = getArticle(params.slug);
  if (!a) notFound();

  const url = `${SITE_URL}/blog/${a.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: a.title,
        description: a.excerpt,
        datePublished: a.date,
        dateModified: a.date,
        inLanguage: "tr-TR",
        author: { "@type": "Organization", name: "Astrotek AI" },
        publisher: { "@type": "Organization", name: "Astrotek AI" },
        mainEntityOfPage: url,
        keywords: a.keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: a.title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: a.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const category = getCategory(a.category);
  const related = getAllArticles()
    .filter((x) => x.slug !== a.slug && x.category === a.category)
    .slice(0, 2);
  const relatedFallback = getAllArticles()
    .filter((x) => x.slug !== a.slug)
    .slice(0, 2);
  const relatedList = related.length > 0 ? related : relatedFallback;

  return (
    <main className="container max-w-2xl py-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Blog
        </Link>
        <BrandLogo size="sm" />
      </div>

      <article>
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {a.readMinutes} dk okuma
          </span>
          <span>·</span>
          <time dateTime={a.date}>
            {new Date(a.date).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>

        {category && (
          <Link
            href={`/blog/kategori/${category.slug}`}
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            {category.emoji} {category.name}
          </Link>
        )}
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {a.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {a.excerpt}
        </p>

        <div className="mt-8 space-y-8">
          {a.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-xl font-semibold">{s.h}</h2>
              <div className="mt-3 space-y-3">
                {s.body.map((p, i) => (
                  <p key={i} className="leading-relaxed text-foreground/85">
                    {p}
                  </p>
                ))}
              </div>
              {s.list && (
                <ul className="mt-4 space-y-2">
                  {s.list.map((item, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 rounded-xl border border-primary/10 bg-secondary/30 px-4 py-2.5 text-sm text-foreground/85"
                    >
                      <span className="mt-0.5 text-gold">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* SSS */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Sıkça sorulanlar</h2>
          <div className="mt-4 space-y-3">
            {a.faq.map((f) => (
              <details
                key={f.q}
                className="rounded-2xl border border-primary/15 bg-card/50 p-4 backdrop-blur-md [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
                  {f.q}
                  <span className="text-gold">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </article>

      {/* CTA */}
      <div className="mt-12 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/15 via-card/40 to-gold/10 p-8 text-center backdrop-blur-md">
        <h2 className="font-display text-xl font-semibold">
          Bunu kendi haritanda gör
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Doğum bilgini gir, bu temaların senin haritanda nasıl göründüğünü
          ücretsiz keşfet.
        </p>
        <Link href="/harita-olustur" className="mt-6 inline-block">
          <Button variant="gold" size="lg" className="group">
            Haritamı Oluştur
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* İlgili yazılar */}
      <div className="mt-12">
        <h2 className="mb-4 font-display text-lg font-semibold">
          İlgili yazılar
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {relatedList.map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              className="rounded-2xl border border-primary/15 bg-card/50 p-4 text-sm font-medium backdrop-blur-md transition-colors hover:border-primary/40"
            >
              <span className="mr-2">{r.emoji}</span>
              {r.title}
            </Link>
          ))}
        </div>
      </div>

      <Disclaimer
        className="mt-10"
        text="Bu içerikler astrolojik sembolizm ve eğlence/kişisel farkındalık amaçlıdır. Kesin gelecek tahmini değildir."
      />
    </main>
  );
}
