import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SID_COOKIE, verifySession } from "@/lib/auth";
import { FAQS } from "@/lib/marketing";
import { getAllSigns } from "@/lib/zodiac";
import { getDailyHoroscope } from "@/lib/horoscope";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { Hero } from "@/components/marketing/Hero";
import {
  DailyHoroscopeHook,
  type DayData,
} from "@/components/marketing/DailyHoroscopeHook";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { TestsSection } from "@/components/marketing/TestsSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Showcase } from "@/components/marketing/Showcase";
import { CosmicBand } from "@/components/marketing/CosmicBand";
import { Pricing } from "@/components/marketing/Pricing";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Faq } from "@/components/marketing/Faq";
import { CtaSection } from "@/components/marketing/CtaSection";
import { SiteFooter } from "@/components/marketing/SiteFooter";

// FAQ yapılandırılmış verisi (SEO/GEO için korunur).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const dynamic = "force-dynamic";

export default function LandingPage() {
  // Giriş yapmış kullanıcı landing'i görmesin → doğrudan panele.
  if (verifySession(cookies().get(SID_COOKIE)?.value)) redirect("/hesap");

  // 12 burcun bugünkü yorumu (sunucuda hesaplanır — deterministik, ucuz).
  const daily: DayData[] = getAllSigns().map((s) => {
    const h = getDailyHoroscope(s.slug)!;
    return {
      slug: s.slug,
      name: s.name,
      glyph: s.glyph,
      dateLabel: h.dateLabel,
      genel: h.genel,
      genelEnerji: h.genelEnerji,
      tema: h.tema,
      ayEvresi: h.ayEvresi.name,
      gununTavsiyesi: h.gununTavsiyesi,
      uyumluBurc: h.uyumluBurc,
      enerji: h.enerji,
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />
      <main className="relative overflow-hidden">
        <Hero />

        {/* Günlük yorum — alışkanlık + abonelik motoru */}
        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Bugünün Yorumu
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Burcun bugün ne diyor?
            </h2>
          </div>
          <DailyHoroscopeHook data={daily} />
        </section>

        <FeatureGrid />
        <TestsSection />
        <HowItWorks />
        <Showcase />
        <CosmicBand />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
