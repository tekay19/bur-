import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { TestsSection } from "@/components/marketing/TestsSection";
import { CompatibilityTest } from "@/components/compatibility/CompatibilityTest";
import { getAllSigns } from "@/lib/zodiac";
import { getCompatibility } from "@/lib/compatibility";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai";

// Paylaşılan link (?s1=koc&s2=boga) için sonuç-özel başlık + OG görseli.
// Böylece WhatsApp/Instagram/X'te "%X Koç & Boğa" görseli çıkar (viral).
export function generateMetadata({
  searchParams,
}: {
  searchParams: { s1?: string; s2?: string };
}): Metadata {
  const base: Metadata = {
    title: "Burç Uyumu Testi — İki Burç Ne Kadar Uyumlu? (Ücretsiz)",
    description:
      "Burç uyumu testi: senin burcun ve sevdiğinin burcunu seç, aşk, iletişim, güven ve tutku uyumunuzu yüzdeyle öğren. 12 burcun aşk uyumu — ücretsiz, anında, paylaşılabilir.",
    keywords: [
      "burç uyumu",
      "burç uyumu testi",
      "aşk uyumu",
      "burç uyumu hesaplama",
      "hangi burç hangi burçla uyumlu",
      "sevgili burç uyumu",
      "ilişki uyumu testi",
    ],
    alternates: { canonical: "/uyumluluk" },
    openGraph: {
      title: "Burç Uyumu Testi — Astrotek AI",
      description: "İki burcu seç, aşk uyumunuzu yüzdeyle öğren ve paylaş.",
      type: "website",
      url: `${SITE_URL}/uyumluluk`,
      locale: "tr_TR",
    },
  };

  const { s1, s2 } = searchParams;
  if (s1 && s2) {
    const r = getCompatibility(s1, s2);
    if (r) {
      const title = `${r.a.name} & ${r.b.name} Uyumu — %${r.score} (${r.label})`;
      const img = `${SITE_URL}/api/og/uyumluluk?s1=${s1}&s2=${s2}`;
      return {
        ...base,
        title,
        openGraph: {
          ...base.openGraph,
          title,
          images: [{ url: img, width: 1200, height: 630 }],
        },
        twitter: { card: "summary_large_image", title, images: [img] },
      };
    }
  }
  return base;
}

const FAQ = [
  {
    q: "Burç uyumu nasıl hesaplanır?",
    a: "Uyum; iki burcun element (ateş, toprak, hava, su) ve nitelik (öncü, sabit, değişken) ilişkisine dayanır. Aynı veya birbirini tamamlayan elementler (ateş-hava, toprak-su) yüksek uyum verir; zıt elementler çekim yaratsa da daha çok emek ister. Test bunları birleştirerek aşk, iletişim, güven ve tutku için ayrı puanlar üretir.",
  },
  {
    q: "Hangi burçlar birbiriyle en uyumlu?",
    a: "Genel olarak aynı elementten burçlar (örn. Koç-Aslan-Yay) ve birbirini tamamlayan element grupları (ateş-hava, toprak-su) yüksek uyum gösterir. Ancak gerçek uyum yalnızca güneş burcuna değil, tüm doğum haritasına bağlıdır.",
  },
  {
    q: "Güneş burcu uyumu yeterli mi?",
    a: "Eğlenceli ve yol gösterici bir başlangıçtır, ama tam değildir. Gerçek ilişki uyumu için her iki kişinin yükselen, ay ve Venüs konumları gibi tüm harita değerlendirilmelidir. Ücretsiz doğum haritasıyla bunları görebilirsin.",
  },
];

export default function CompatibilityPage() {
  const signs = getAllSigns();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Burç Uyumu", item: `${SITE_URL}/uyumluluk` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
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
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-foreground">Ana sayfa</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">Burç Uyumu</li>
          </ol>
        </nav>

        <header className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
            Eğlenceli Test
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Burç Uyumu <span className="gradient-text">Testi</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Senin burcun ve sevdiğinin burcunu seç; aşk, iletişim, güven ve tutku
            uyumunuzu anında öğren. 💕
          </p>
        </header>

        <section aria-label="Burç uyumu testi">
          <CompatibilityTest />
        </section>

        {/* SSS (GEO) */}
        <section className="mt-14" aria-labelledby="uyum-sss">
          <h2 id="uyum-sss" className="font-display text-2xl font-bold tracking-tight">
            Burç uyumu hakkında sık sorulanlar
          </h2>
          <div className="mt-5 grid gap-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-primary/15 bg-card/70 px-5 py-4 backdrop-blur-md [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-lg font-semibold">12 burcun özelliklerini keşfet</h2>
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {signs.map((s) => (
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
        </section>

        <div className="mt-12">
          <TestsSection compact />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
