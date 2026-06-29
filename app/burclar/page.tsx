import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { ZodiacExplorer } from "@/components/zodiac/ZodiacExplorer";
import { SignFaqList } from "@/components/zodiac/parts";
import { TestsSection } from "@/components/marketing/TestsSection";
import { getAllSignKeywords, getAllSigns } from "@/lib/zodiac";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotekai.com";

export const metadata: Metadata = {
  title: "Burçlar — 12 Burcun Kadın ve Erkek Özellikleri (Tam Rehber)",
  description:
    "12 burcun kadın ve erkek özellikleri: kişilik, aşk, ilişki, kariyer ve burç uyumu. Burcunu seç, cinsiyetini seç ve en ince ayrıntısına kadar keşfet. Koç'tan Balık'a kapsamlı Türkçe burç rehberi.",
  keywords: [
    "burçlar",
    "burç özellikleri",
    "kadın burçları",
    "erkek burçları",
    "burç uyumu",
    "12 burç",
    ...getAllSignKeywords(),
  ],
  alternates: { canonical: "/burclar" },
  openGraph: {
    title: "Burçlar — 12 Burcun Kadın ve Erkek Özellikleri",
    description:
      "Burcunu ve cinsiyetini seç; kişilik, aşk ve kariyer özelliklerini ayrıntılı keşfet.",
    type: "website",
    url: `${SITE_URL}/burclar`,
    locale: "tr_TR",
  },
};

export default function BurclarPage() {
  const signs = getAllSigns();
  const faqs = signs.map((s) => s.faq[0]).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "12 Burç",
        itemListElement: signs.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${s.name} Burcu`,
          url: `${SITE_URL}/burclar/${s.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Burçlar", item: `${SITE_URL}/burclar` },
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
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">Ana sayfa</Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">Burçlar</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Burç Rehberi
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Burçlar: 12 Burcun{" "}
            <span className="gradient-text">Kadın ve Erkek</span> Özellikleri
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Koç&apos;tan Balık&apos;a 12 burcun kişilik, aşk, ilişki ve kariyer
            özelliklerini hem kadın hem erkek için ayrıntılı ele aldık. Aşağıdan
            <strong className="text-foreground/90"> burcunu seç</strong>, ardından
            <strong className="text-foreground/90"> cinsiyetini seç</strong> ve sana
            özel açıklamayı anında gör.
          </p>
        </header>

        {/* İnteraktif: burç seç → cinsiyet seç → gör */}
        <section className="mt-10" aria-label="Burç ve cinsiyet seçimi">
          <ZodiacExplorer />
        </section>

        {/* Testler — trafik artırıcı çapraz tanıtım */}
        <TestsSection compact />

        {/* Toplu SSS (GEO) */}
        <section className="mt-16" aria-labelledby="burc-sss">
          <h2 id="burc-sss" className="font-display text-2xl font-bold tracking-tight">
            Burçlar hakkında sık sorulan sorular
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            En çok merak edilen burç sorularının kısa ve net cevapları.
          </p>
          <div className="mt-6">
            <SignFaqList faq={faqs} />
          </div>
        </section>

        {/* Tüm burç sayfaları (SEO iç linkleme) */}
        <section className="mt-14">
          <h2 className="font-display text-lg font-semibold">Tüm burçlar</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {signs.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/burclar/${s.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-primary/10 bg-card/50 px-3 py-2.5 text-sm transition-colors hover:border-primary/30 hover:bg-card/80"
                >
                  <span className="text-lg text-primary" aria-hidden>{s.glyph}</span>
                  <span className="font-medium">{s.name} Burcu</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/40 to-gold/10 p-8 text-center backdrop-blur-md sm:p-12">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Sadece güneş burcun değil, tüm haritan
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Yükselen burcun, ay burcun ve gezegenlerinle birlikte kişiye özel
            doğum haritanı ücretsiz çıkar.
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
