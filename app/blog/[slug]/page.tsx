import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock, ListTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { getAllArticles, getArticle, getCategory, slugifyTr } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotekai.com";

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
      locale: "tr_TR",
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
  const category = getCategory(a.category);

  // İçindekiler (TOC) — bölüm başlıklarından + SSS.
  const toc = [
    ...a.sections.map((s) => ({ id: slugifyTr(s.h), label: s.h })),
    { id: "sss", label: "Sıkça sorulanlar" },
  ];

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

  const related = getAllArticles()
    .filter((x) => x.slug !== a.slug && x.category === a.category)
    .slice(0, 3);
  const relatedFallback = getAllArticles()
    .filter((x) => x.slug !== a.slug)
    .slice(0, 3);
  const relatedList = related.length > 0 ? related : relatedFallback;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">Ana sayfa</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/blog" className="hover:text-foreground">Blog</Link>
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={`/blog/kategori/${category.slug}`}
                    className="hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Başlık */}
        <header className="max-w-3xl">
          {category && (
            <Link
              href={`/blog/kategori/${category.slug}`}
              className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              <span aria-hidden>{category.emoji}</span> {category.name}
            </Link>
          )}
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {a.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={a.date}>{fmtDate(a.date)}</time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {a.readMinutes} dk okuma
            </span>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {a.excerpt}
          </p>
        </header>

        <div className="mt-10 gap-10 lg:grid lg:grid-cols-[1fr_15rem]">
          {/* Makale gövdesi */}
          <article className="min-w-0 max-w-2xl">
            <div className="space-y-10">
              {a.sections.map((s) => (
                <section
                  key={s.h}
                  id={slugifyTr(s.h)}
                  className="scroll-mt-24"
                >
                  <h2 className="font-display text-xl font-semibold sm:text-2xl">
                    {s.h}
                  </h2>
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
                          <span className="mt-0.5 text-gold" aria-hidden>✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* SSS */}
            <section id="sss" className="mt-12 scroll-mt-24">
              <h2 className="font-display text-xl font-semibold sm:text-2xl">
                Sıkça sorulanlar
              </h2>
              <div className="mt-4 space-y-3">
                {a.faq.map((f) => (
                  <details
                    key={f.q}
                    className="rounded-2xl border border-primary/15 bg-card/70 p-4 backdrop-blur-md [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
                      {f.q}
                      <span className="text-gold" aria-hidden>+</span>
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </article>

          {/* İçindekiler (TOC) — masaüstünde sticky, mobilde üstte açılır */}
          <aside className="order-first mb-8 lg:order-none lg:mb-0">
            <div className="rounded-2xl border border-primary/15 bg-card/60 p-4 backdrop-blur-md lg:sticky lg:top-24">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <ListTree className="h-4 w-4" /> İçindekiler
              </p>
              <nav aria-label="İçindekiler">
                <ol className="space-y-1.5 text-sm">
                  {toc.map((t, i) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className="flex gap-2 rounded-lg px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <span className="text-primary/60">{i + 1}.</span>
                        <span className="line-clamp-2">{t.label}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>
        </div>

        {/* CTA */}
        <div className="mt-14 max-w-2xl overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/40 to-gold/10 p-8 text-center backdrop-blur-md">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">
            Bunu kendi haritanda gör
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Doğum bilgini gir, bu temaların senin haritanda nasıl göründüğünü
            ücretsiz keşfet.
          </p>
          <Link href="/kesfet" className="mt-6 inline-block">
            <Button variant="gold" size="lg" className="group">
              Haritamı Oluştur
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* İlgili yazılar */}
        <div className="mt-12">
          <h2 className="mb-4 font-display text-lg font-semibold">İlgili yazılar</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {relatedList.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="rounded-2xl border border-primary/15 bg-card/70 p-4 text-sm font-medium backdrop-blur-md transition-colors hover:border-primary/40"
              >
                <span className="mr-2" aria-hidden>{r.emoji}</span>
                {r.title}
              </Link>
            ))}
          </div>
        </div>

        <Disclaimer
          className="mt-10 max-w-2xl"
          text="Bu içerikler astrolojik sembolizm ve eğlence/kişisel farkındalık amaçlıdır. Kesin gelecek tahmini değildir."
        />
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
