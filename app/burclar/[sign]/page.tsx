import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import {
  Compatibility,
  GenderBlock,
  SignFaqList,
  SignGeneral,
  SignHero,
  TraitColumns,
} from "@/components/zodiac/parts";
import { TestsSection } from "@/components/marketing/TestsSection";
import { getAllSigns, getSign } from "@/lib/zodiac";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai";

export function generateStaticParams() {
  return getAllSigns().map((s) => ({ sign: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { sign: string };
}): Metadata {
  const s = getSign(params.sign);
  if (!s) return { title: "Burç bulunamadı" };
  const title = `${s.name} Burcu Kadını ve Erkeği — Özellikleri, Aşk ve Kariyer`;
  const description = `${s.name} burcu (${s.dates}) kadın ve erkek özellikleri: kişilik, aşk, ilişki, kariyer ve burç uyumu. ${s.summary}`;
  return {
    title,
    description,
    keywords: s.keywords,
    alternates: { canonical: `/burclar/${s.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/burclar/${s.slug}`,
      locale: "tr_TR",
    },
  };
}

export default function SignPage({ params }: { params: { sign: string } }) {
  const sign = getSign(params.sign);
  if (!sign) notFound();

  const url = `${SITE_URL}/burclar/${sign.slug}`;
  const others = getAllSigns().filter((s) => s.slug !== sign.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${sign.name} Burcu Kadını ve Erkeği Özellikleri`,
        description: sign.summary,
        inLanguage: "tr-TR",
        author: { "@type": "Organization", name: "Astrotek AI" },
        publisher: { "@type": "Organization", name: "Astrotek AI" },
        mainEntityOfPage: url,
        keywords: sign.keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Burçlar", item: `${SITE_URL}/burclar` },
          { "@type": "ListItem", position: 3, name: `${sign.name} Burcu`, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: sign.faq.map((f) => ({
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
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">Ana sayfa</Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/burclar" className="hover:text-foreground">Burçlar</Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">{sign.name} Burcu</li>
          </ol>
        </nav>

        <article className="space-y-8">
          <header>
            <h1 className="sr-only">
              {sign.name} Burcu Kadını ve Erkeği Özellikleri
            </h1>
            <SignHero sign={sign} />
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {sign.summary}
            </p>
          </header>

          <section aria-labelledby="genel">
            <h2 id="genel" className="font-display text-2xl font-bold tracking-tight">
              {sign.name} Burcu Genel Özellikleri
            </h2>
            <div className="mt-4">
              <SignGeneral sign={sign} />
            </div>
          </section>

          <section aria-labelledby="kadin">
            <h2 id="kadin" className="mb-4 font-display text-2xl font-bold tracking-tight">
              {sign.name} Burcu Kadını
            </h2>
            <GenderBlock title={`${sign.name} Burcu Kadını`} profile={sign.woman} />
          </section>

          <section aria-labelledby="erkek">
            <h2 id="erkek" className="mb-4 font-display text-2xl font-bold tracking-tight">
              {sign.name} Burcu Erkeği
            </h2>
            <GenderBlock title={`${sign.name} Burcu Erkeği`} profile={sign.man} />
          </section>

          <section aria-labelledby="yonler">
            <h2 id="yonler" className="mb-4 font-display text-2xl font-bold tracking-tight">
              Güçlü ve Zayıf Yönleri
            </h2>
            <TraitColumns sign={sign} />
          </section>

          <section aria-labelledby="uyum">
            <h2 id="uyum" className="mb-4 font-display text-2xl font-bold tracking-tight">
              {sign.name} Burcu Uyumu
            </h2>
            <Compatibility sign={sign} />
          </section>

          <section aria-labelledby="sss">
            <h2 id="sss" className="mb-4 font-display text-2xl font-bold tracking-tight">
              {sign.name} Burcu — Sıkça Sorulanlar
            </h2>
            <SignFaqList faq={sign.faq} />
          </section>
        </article>

        {/* CTA */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/40 to-gold/10 p-8 text-center backdrop-blur-md">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">
            {sign.name} burcu musun? Tüm haritanı keşfet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Güneş burcunun ötesinde; yükselen, ay ve gezegenlerinle kişiye özel
            doğum haritanı ücretsiz çıkar.
          </p>
          <Link href="/kesfet" className="mt-6 inline-block">
            <Button variant="gold" size="lg" className="group">
              Ücretsiz Haritamı Oluştur
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Testler — trafik artırıcı: burcunu okuyanı teste yönlendir */}
        <TestsSection compact />

        {/* Diğer burçlar */}
        <nav aria-label="Diğer burçlar" className="mt-12">
          <h2 className="mb-4 font-display text-lg font-semibold">Diğer burçlar</h2>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {others.map((s) => (
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
        </nav>

        <Disclaimer
          className="mt-10"
          text="Bu içerikler güneş burcuna dayalı genel astrolojik sembolizmdir ve kişisel farkındalık amaçlıdır. Kesin kişilik analizi için tüm doğum haritası değerlendirilmelidir."
        />
      </main>

      <SiteFooter />
    </>
  );
}
