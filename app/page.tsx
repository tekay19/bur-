import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarRange,
  Compass,
  Moon,
  Orbit,
  PenLine,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/Disclaimer";
import { HeroChart } from "@/components/HeroChart";
import { BrandLogo } from "@/components/BrandLogo";
import { FeatureCard, type Feature } from "@/components/FeatureCard";
import { FeatureCarousel } from "@/components/FeatureCarousel";

const features: Feature[] = [
  {
    icon: Star,
    title: "Doğum Haritan",
    desc: "Gezegenlerin, evlerin ve açıların görsel çark ve sade tabloyla.",
    gradient: "from-violet-700/55 via-purple-800/40 to-indigo-950/60",
    planet: "hsl(270 70% 60%)",
  },
  {
    icon: Orbit,
    title: "Güncel Etkiler",
    desc: "Bugünün gökyüzü senin haritana ne söylüyor — günlük dille.",
    gradient: "from-fuchsia-700/50 via-pink-800/40 to-purple-950/60",
    planet: "hsl(330 75% 64%)",
  },
  {
    icon: CalendarRange,
    title: "Önemli Tarihler",
    desc: "Önümüzdeki 12 ay için tarihli bir takvim: ne zaman, ne olur.",
    gradient: "from-blue-700/50 via-indigo-800/40 to-slate-950/60",
    planet: "hsl(220 75% 64%)",
  },
  {
    icon: Compass,
    title: "Hayat Alanların",
    desc: "Kariyer, aşk, para, sınav... her biri için net bir gösterge.",
    gradient: "from-amber-600/45 via-orange-800/40 to-rose-950/60",
    planet: "hsl(38 85% 60%)",
  },
  {
    icon: Sparkles,
    title: "AI Yorum",
    desc: "Haritana özel, anlaşılır ve yapıcı Türkçe yorum.",
    gradient: "from-cyan-700/45 via-teal-800/40 to-indigo-950/60",
    planet: "hsl(180 65% 58%)",
  },
  {
    icon: ShieldCheck,
    title: "Gizli & Ücretsiz",
    desc: "Kayıt yok, ücret yok. Bilgilerin senin kontrolünde.",
    gradient: "from-emerald-700/45 via-green-800/40 to-slate-950/60",
    planet: "hsl(150 60% 56%)",
  },
];

const faqs = [
  {
    q: "Doğum haritası nedir?",
    a: "Doğum haritası, doğduğun an gökyüzündeki gezegenlerin konumunu gösteren bir haritadır. Güneş, Ay ve yükselen burcunun yanı sıra tüm gezegenlerin hangi burç ve evde olduğunu, aralarındaki açıları içerir. Astrotek AI bu haritayı doğum tarihin, saatin ve yerinle saniyeler içinde hesaplar.",
  },
  {
    q: "Astrotek AI ücretsiz mi?",
    a: "Evet, doğum haritası hesaplama ve AI yorumu tamamen ücretsizdir. Üyelik veya kredi kartı gerekmez; sadece doğum bilgilerini girmen yeterli.",
  },
  {
    q: "Doğum saatimi bilmiyorsam harita çıkar mı?",
    a: "Evet. Doğum saatin yoksa gezegen burçların ve genel açıların yine hesaplanır. Ancak yükselen burç ve ev yorumları doğum saatine bağlı olduğu için bu durumda gösterilmez.",
  },
  {
    q: "Yükselen burç nasıl hesaplanır?",
    a: "Yükselen burç, doğduğun anda doğu ufkunda yükselen burçtur ve doğum saati ile doğum yerinin enlem/boylamına göre hesaplanır. Bu yüzden kesin yükselen için doğum saatinin mümkün olduğunca doğru olması gerekir.",
  },
  {
    q: "AI yorumları ne kadar güvenilir?",
    a: "Yorumlar, gerçek astronomik konumlara dayanır ve yapay zeka ile sade Türkçeye çevrilir. Astroloji bilimsel bir kesinlik değildir; yorumlar sembolik eğilimler ve kişisel farkındalık amaçlıdır, kesin gelecek tahmini değildir.",
  },
  {
    q: "Transit nedir ve neden önemli?",
    a: "Transit, gezegenlerin bugünkü konumlarının senin doğum haritandaki noktalara yaptığı etkidir. Astrotek AI önümüzdeki 12 ay için önemli transitlerin tarihlerini ve hayat alanlarına etkisini gösterir.",
  },
];

const steps = [
  {
    icon: PenLine,
    t: "Doğum bilgini gir",
    d: "Tarih, saat ve doğum yerin — o kadar.",
  },
  {
    icon: Orbit,
    t: "Harita hesaplansın",
    d: "Çark, açılar ve transitler saniyeler içinde.",
  },
  {
    icon: BookOpen,
    t: "Yorumunu oku",
    d: "Sade dille, hayat alanlarına göre.",
  },
];

export default function LandingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Header */}
      <header className="container grid grid-cols-3 items-center py-6">
        <div className="flex justify-start">
          <BrandLogo />
        </div>
        <nav className="flex justify-center">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="px-6 text-base">
              Blog
            </Button>
          </Link>
        </nav>
        <div className="flex justify-end">
          <Link href="/harita-olustur">
            <Button variant="gold" size="sm">
              Haritamı Oluştur
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="container grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            AI destekli astroloji · Türkçe · Anlaşılır
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Yıldızların{" "}
            <span className="gradient-text">senin için</span> ne dediğini öğren
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-muted-foreground sm:text-lg lg:mx-0">
            Doğum bilgini gir; haritan, güncel etkilerin ve hayatındaki olası
            temalar herkesin anlayacağı sade bir dille karşında olsun.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Link href="/harita-olustur" className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="group w-full sm:w-auto">
                Ücretsiz Haritamı Oluştur
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Kayıt gerektirmez · 1 dakika · Tamamen ücretsiz
          </p>
        </div>

        <div className="relative">
          <HeroChart />
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section className="container py-14 sm:py-20">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Nasıl çalışır
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            3 adımda haritan hazır
          </h2>
        </div>

        <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
          {/* Akış çizgisi (masaüstü) */}
          <div className="absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent sm:block" />
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/30 ring-4 ring-background">
                <s.icon className="h-7 w-7" />
              </div>
              <div className="mt-4 text-xs font-bold tracking-wide text-gold">
                ADIM {i + 1}
              </div>
              <h3 className="mt-1 font-display text-lg font-semibold">{s.t}</h3>
              <p className="mt-1.5 max-w-[15rem] text-sm text-muted-foreground">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Özellikler — otomatik kayan şerit */}
      <section className="py-12 sm:py-16">
        <div className="container mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Neler sunuyor
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Karmaşık değil, anlaşılır
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Astrolojiden anlamasan da okuyunca “haaa, demek böyleymiş”
            diyeceksin.
          </p>
        </div>

        <FeatureCarousel>
          {features.map((f) => (
            <div key={f.title} className="shrink-0 snap-center">
              <FeatureCard f={f} />
            </div>
          ))}
        </FeatureCarousel>
      </section>

      {/* SSS (SEO + GEO) */}
      <section className="container py-12 sm:py-16">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Sıkça sorulanlar
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            Aklındaki sorular
          </h2>
        </div>
        <div className="mx-auto grid max-w-3xl gap-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-primary/15 bg-card/70 p-5 backdrop-blur-md [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium">
                {f.q}
                <span className="text-gold transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-12 sm:py-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/15 via-card/40 to-gold/10 p-10 text-center backdrop-blur-md sm:p-16">
          <Moon className="mx-auto mb-5 h-10 w-10 text-gold" />
          <h2 className="mx-auto max-w-xl font-display text-2xl font-semibold sm:text-3xl">
            Bugün gökyüzü senin için ne hazırladı?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Birkaç bilgiyle başla, gerisini biz hallederiz.
          </p>
          <Link href="/harita-olustur" className="mt-8 inline-block">
            <Button variant="gold" size="lg" className="group">
              Hemen Başla
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Disclaimer
            className="mx-auto mt-8 max-w-xl text-left"
            text="Bu yorumlar astrolojik sembolizm ve eğlence/kişisel farkındalık amaçlıdır. Kesin gelecek tahmini değildir."
          />
        </div>
      </section>

      <footer className="container border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Astrotek AI · Sembolik analiz, kesin
        kehanet değildir.
      </footer>
    </main>
  );
}
