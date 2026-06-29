import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SID_COOKIE, verifySession } from "@/lib/auth";
import { FAQS } from "@/lib/marketing";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { Hero } from "@/components/marketing/Hero";
import { HoroscopeStrip } from "@/components/marketing/HoroscopeStrip";
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />
      <main className="relative overflow-hidden">
        <Hero />

        {/* Günlük burç şeridi */}
        <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Bugünün gökyüzü
          </p>
          <HoroscopeStrip />
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
