import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import { getAllSigns, getSign } from "@/lib/zodiac";
import { getCompatibility, type CompatResult } from "@/lib/compatibility";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotekai.com";

// 12×12 = 144 sıralı çift (her arama varyasyonu için ayrı sayfa).
export function generateStaticParams() {
  const signs = getAllSigns();
  const out: { cift: string }[] = [];
  for (const a of signs) for (const b of signs) out.push({ cift: `${a.slug}-${b.slug}` });
  return out;
}

function parse(cift: string) {
  const i = cift.indexOf("-");
  if (i < 0) return null;
  const s1 = cift.slice(0, i);
  const s2 = cift.slice(i + 1);
  const a = getSign(s1);
  const b = getSign(s2);
  if (!a || !b) return null;
  const r = getCompatibility(s1, s2);
  return r ? { a, b, r } : null;
}

export function generateMetadata({ params }: { params: { cift: string } }): Metadata {
  const p = parse(params.cift);
  if (!p) return { title: "Burç Uyumu — Astrotek AI", robots: { index: false } };
  const { a, b, r } = p;
  const title = `${a.name} ${b.name} Uyumu — %${r.score} Uyumlu`;
  const description = `${a.name} ve ${b.name} burç uyumu %${r.score} (${r.label}). Aşk, iletişim, güven ve tutku uyumları; güçlü ve zorlu yanlar. ${a.name} ${b.name} ilişkisi ne kadar uyumlu, hemen oku.`;
  const img = `${SITE_URL}/api/og/uyumluluk?s1=${a.slug}&s2=${b.slug}`;
  return {
    title,
    description,
    keywords: [
      `${a.name} ${b.name} uyumu`,
      `${a.name} ${b.name} aşk uyumu`,
      `${a.name} ${b.name} ilişki uyumu`,
      `${a.name} kadını ${b.name} erkeği uyumu`,
      `${a.name} erkeği ${b.name} kadını uyumu`,
      "burç uyumu",
    ],
    alternates: { canonical: `/uyumluluk/${a.slug}-${b.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/uyumluluk/${a.slug}-${b.slug}`,
      locale: "tr_TR",
      images: [{ url: img, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, images: [img] },
  };
}

const SUB_LABELS: { key: keyof CompatResult["sub"]; label: string }[] = [
  { key: "ask", label: "Aşk" },
  { key: "iletisim", label: "İletişim" },
  { key: "guven", label: "Güven" },
  { key: "tutku", label: "Tutku" },
];

function ringColor(v: number) {
  return v >= 85 ? "#22c55e" : v >= 65 ? "#f0b24a" : "#a78bfa";
}

export default function PairPage({ params }: { params: { cift: string } }) {
  const p = parse(params.cift);
  if (!p) notFound();
  const { a, b, r } = p;

  const others = getAllSigns();
  const c = 2 * Math.PI * 52;
  const dash = (r.score / 100) * c;

  const faq = [
    {
      q: `${a.name} ${b.name} uyumu kaç?`,
      a: `${a.name} ve ${b.name} burç uyumu yaklaşık %${r.score} (${r.label}). Aşk %${r.sub.ask}, iletişim %${r.sub.iletisim}, güven %${r.sub.guven}, tutku %${r.sub.tutku}.`,
    },
    {
      q: `${a.name} ${b.name} ilişkisi yürür mü?`,
      a: r.verdict,
    },
    {
      q: `${a.name} ${b.name} çift olarak nasıl?`,
      a: `Güçlü yanları: ${r.strengths.join("; ")}. Dikkat edilmesi gerekenler: ${r.challenges.join("; ")}.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Burç Uyumu", item: `${SITE_URL}/uyumluluk` },
          { "@type": "ListItem", position: 3, name: `${a.name} ${b.name}`, item: `${SITE_URL}/uyumluluk/${a.slug}-${b.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-foreground">Ana sayfa</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/uyumluluk" className="hover:text-foreground">Burç Uyumu</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">{a.name} & {b.name}</li>
          </ol>
        </nav>

        <header className="text-center">
          <div className="flex items-center justify-center gap-3 text-4xl">
            <span className="text-primary" aria-hidden>{a.glyph}</span>
            <span className="text-muted-foreground">&</span>
            <span className="text-primary" aria-hidden>{b.glyph}</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {a.name} Burcu – {b.name} Burcu Uyumu
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {a.name} ({a.element}) ve {b.name} ({b.element}) burçlarının aşk, iletişim,
            güven ve tutku uyumu — yüzdeyle, açıklamalı.
          </p>
        </header>

        {/* Skor */}
        <div className="mt-8 flex flex-col items-center gap-6 rounded-3xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md sm:flex-row sm:p-8">
          <div className="relative flex-shrink-0">
            <svg viewBox="0 0 120 120" className="h-32 w-32">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={ringColor(r.score)} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${dash} ${c}`} transform="rotate(-90 60 60)" />
              <text x="60" y="56" textAnchor="middle" className="fill-foreground text-[26px] font-bold">%{r.score}</text>
              <text x="60" y="74" textAnchor="middle" className="fill-current text-[10px] font-medium text-muted-foreground">uyum</text>
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-bold text-foreground">{r.label}</p>
            <div className="mt-4 space-y-2.5">
              {SUB_LABELS.map(({ key, label }) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-foreground/85">{label}</span>
                    <span className="text-muted-foreground">%{r.sub[key]}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${r.sub[key]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Yorum */}
        <section className="mt-6 rounded-3xl border border-primary/15 bg-card/50 p-6 backdrop-blur-md">
          <h2 className="font-display text-lg font-semibold">{a.name} & {b.name} ilişkisi</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{r.verdict}</p>
        </section>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <section className="rounded-3xl border border-success/20 bg-success/5 p-5">
            <h2 className="mb-3 text-sm font-semibold text-success">Güçlü yanlar</h2>
            <ul className="space-y-1.5">
              {r.strengths.map((s) => <li key={s} className="text-sm text-foreground/85">✓ {s}</li>)}
            </ul>
          </section>
          <section className="rounded-3xl border border-warning/20 bg-warning/5 p-5">
            <h2 className="mb-3 text-sm font-semibold text-warning">Dikkat edilecekler</h2>
            <ul className="space-y-1.5">
              {r.challenges.map((s) => <li key={s} className="text-sm text-foreground/85">! {s}</li>)}
            </ul>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/15 via-card/40 to-gold/10 p-6 text-center backdrop-blur-md">
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Bu, güneş burçlarına dayalı genel bir uyum. Gerçek doğum haritalarınızla
            (Venüs, Mars, Ay) çok daha derin bir uyum analizi çıkarabilirsin.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={`/uyumluluk?s1=${a.slug}&s2=${b.slug}`}>
              <Button variant="gold" size="lg">Kendi uyumunu test et <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link href="/kesfet">
              <Button variant="outline" size="lg">Ücretsiz doğum haritam</Button>
            </Link>
          </div>
        </div>

        {/* Çapraz linkler (iç linkleme) */}
        <section className="mt-10">
          <h2 className="font-display text-base font-semibold">{a.name} burcunun diğer uyumları</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.filter((o) => o.slug !== b.slug).map((o) => (
              <Link key={o.slug} href={`/uyumluluk/${a.slug}-${o.slug}`} className="rounded-full border border-primary/15 bg-card/50 px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground">
                {a.name} & {o.name}
              </Link>
            ))}
          </div>
          <h2 className="mt-6 font-display text-base font-semibold">{b.name} burcunun diğer uyumları</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.filter((o) => o.slug !== a.slug).map((o) => (
              <Link key={o.slug} href={`/uyumluluk/${b.slug}-${o.slug}`} className="rounded-full border border-primary/15 bg-card/50 px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground">
                {b.name} & {o.name}
              </Link>
            ))}
          </div>
        </section>

        {/* SSS */}
        <section className="mt-10" aria-labelledby="sss">
          <h2 id="sss" className="font-display text-2xl font-bold tracking-tight">Sık sorulanlar</h2>
          <div className="mt-5 grid gap-3">
            {faq.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-primary/15 bg-card/70 px-5 py-4 backdrop-blur-md [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
