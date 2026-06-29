import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CreditCard, Orbit, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotekai.com";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Astrotek AI, gerçek astronomik verilerle hesaplanan doğum haritanı sade bir Türkçe yoruma dönüştürür. Gizliliğine saygılı, KVKK uyumlu, dürüst astroloji. Kim olduğumuzu ve neden güvenebileceğini oku.",
  alternates: { canonical: "/hakkimizda" },
  openGraph: {
    title: "Hakkımızda — Astrotek AI",
    description:
      "Gerçek astronomik veri + sade Türkçe AI yorum + gizlilik. Astrotek AI'ın hikayesi ve değerleri.",
    type: "website",
    url: `${SITE_URL}/hakkimizda`,
    locale: "tr_TR",
  },
};

const VALUES = [
  {
    icon: Orbit,
    title: "Gerçek astronomik veri",
    desc: "Yorumlarımız tahminle değil; doğduğun anın gerçek gezegen konumlarıyla (efemeris) hesaplanır. Natal harita, yükselen, evler ve güncel transitler tek tek çıkarılır.",
  },
  {
    icon: Sparkles,
    title: "Sade Türkçe, AI yorum",
    desc: "Karmaşık astroloji terimlerini değil; aşkına, kariyerine ve gününe dokunan net bir dil okursun. Astroloji bilmene hiç gerek yok.",
  },
  {
    icon: ShieldCheck,
    title: "Gizliliğin önce gelir",
    desc: "Şifren geri döndürülemez biçimde saklanır, doğum bilgilerin yalnızca senin analizin için kullanılır ve kimseye satılmaz. Tümüyle KVKK uyumlu.",
  },
  {
    icon: CreditCard,
    title: "Kart bilgin bizde değil",
    desc: "Ödemeler güvenli altyapı üzerinden alınır; kart bilgilerin bize hiç ulaşmaz, saklanmaz. Gizli ücret veya otomatik abonelik yok.",
  },
];

const STEPS = [
  { n: "1", t: "Doğum bilgini gir", d: "Tarih, saat ve doğduğun yer." },
  { n: "2", t: "Haritan hesaplanır", d: "Gerçek natal harita + güncel transitler." },
  { n: "3", t: "Yorumun hazır", d: "Yapay zeka sana özel, sade bir yoruma çevirir." },
];

export default function HakkimizdaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: LEGAL.platformName,
        url: SITE_URL,
        description:
          "Gerçek astronomik verilerle hesaplanan doğum haritası ve sade Türkçe AI astroloji yorumu.",
        founder: { "@type": "Person", name: LEGAL.controller },
        email: LEGAL.contactEmail,
        areaServed: "TR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Hakkımızda", item: `${SITE_URL}/hakkimizda` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-foreground">Ana sayfa</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">Hakkımızda</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
            <Sparkles className="h-3.5 w-3.5" /> Hakkımızda
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Astrolojiyi herkes için <span className="gradient-text">anlaşılır</span> kılıyoruz
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Astrotek AI; gerçek astronomik verilerle hesaplanan doğum haritanı,
            astroloji bilmesen bile anlayabileceğin sade bir Türkçe yoruma
            dönüştürür. Amacımız geleceği “kesin” söylemek değil — kendini daha iyi
            tanıman için bir ayna tutmak.
          </p>
        </header>

        {/* Değerler */}
        <section className="mt-14">
          <h2 className="text-center font-display text-2xl font-bold tracking-tight">
            Neden güvenebilirsin?
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="rounded-3xl border border-primary/15 bg-card/60 p-6 backdrop-blur-md">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 text-primary ring-1 ring-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Nasıl çalışır */}
        <section className="mt-14">
          <h2 className="text-center font-display text-2xl font-bold tracking-tight">Nasıl çalışır?</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-3xl border border-primary/15 bg-card/50 p-6 text-center backdrop-blur-md">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 font-display text-lg font-bold text-gold">
                  {s.n}
                </div>
                <p className="mt-3 font-semibold">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Felsefe */}
        <section className="mt-14 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card/50 to-gold/5 p-8 text-center backdrop-blur-md">
          <h2 className="font-display text-2xl font-bold tracking-tight">Felsefemiz</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/85">
            Astroloji bir kader değil, bir dildir. Yıldızlar yalnızca eğilim
            fısıldar; kararları her zaman sen verirsin. Astrotek AI’ı bir kehanet
            aracı olarak değil, kendini keşfetme ve farkındalık aracı olarak
            tasarladık. Sana sunduğumuz her yorum, kesin bir gelecek vaadi değil;
            üzerine düşünebileceğin bir başlangıç noktasıdır.
          </p>
        </section>

        {/* Kim yönetiyor */}
        <section className="mt-14 text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight">Kim yönetiyor?</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Astrotek AI, <strong className="text-foreground/90">{LEGAL.controller}</strong>{" "}
            tarafından Türkiye’de geliştirilip işletilmektedir. Bağımsız bir
            projedir; soruların, önerilerin ve geri bildirimlerin bizim için çok
            değerli.
          </p>
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {LEGAL.contactEmail}
          </a>
        </section>

        {/* CTA */}
        <section className="mt-14 rounded-3xl border border-primary/20 bg-card/60 p-8 text-center backdrop-blur-md">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Doğum haritanda ne yazıyor, merak ettin mi?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            İlk analizin ücretsiz — kart gerekmez. Birkaç dakikada hazır.
          </p>
          <Link href="/kesfet" className="mt-6 inline-block">
            <Button variant="gold" size="lg">
              Ücretsiz Haritamı Oluştur <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
