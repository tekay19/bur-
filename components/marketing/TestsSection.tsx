import Link from "next/link";
import { ArrowRight, Brain, Heart, Rabbit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "./Section";
import { Reveal, RevealGroup } from "./Reveal";

const TESTS = [
  {
    href: "/astroprofil",
    badge: "AstroProfil™",
    icon: Brain,
    title: "Dinamik Kişilik Analizi",
    desc: "Burcun ile kişilik tercihlerini birleştiren derin analiz. 12 özellik, 10 soru; karar verme tarzın, ilişki stilin, kariyer eğilimin ve daha fazlası.",
    cta: "Analize Başla",
    featured: true,
    minutes: "~2 dk",
  },
  {
    href: "/uyumluluk",
    badge: "Aşk Testi",
    icon: Heart,
    title: "Burç Uyumu Testi",
    desc: "Senin burcun ve sevdiğinin burcunu seç; aşk, iletişim, güven ve tutku uyumunuzu yüzdeyle anında öğren ve paylaş.",
    cta: "Uyuma Bak",
    featured: false,
    minutes: "~30 sn",
  },
  {
    href: "/test",
    badge: "Eğlenceli Test",
    icon: Sparkles,
    title: "Ruh Burcun Hangisi?",
    desc: "8 kısa, eğlenceli soru. Kişiliğine en çok hangi burç uyuyor? Hızlıca keşfet ve sonucunu arkadaşlarınla paylaş.",
    cta: "Teste Başla",
    featured: false,
    minutes: "~1 dk",
  },
  {
    href: "/cin-burcu",
    badge: "Çin Astrolojisi",
    icon: Rabbit,
    title: "Çin Burcun Ne?",
    desc: "Doğum yılını gir, 12 Çin burcundan (Ejderha, Kaplan, Tavşan…) hangisi olduğunu, özelliklerini ve uyumlu hayvanları anında öğren.",
    cta: "Yılını Gir",
    featured: false,
    minutes: "~15 sn",
  },
];

export function TestsSection({ compact = false }: { compact?: boolean }) {
  return (
    <Section id="testler" className={compact ? "max-w-none px-0 py-10 sm:px-0 sm:py-12" : undefined}>
      <Reveal>
        <SectionHeading
          eyebrow="Ücretsiz Testler"
          title="Kendini keşfet"
          description="Ücretsiz testlerle astrolojik profilini ve uyumunu keşfet. Anında sonuç al, arkadaşlarınla paylaş."
        />
      </Reveal>

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TESTS.map((t) => {
          const Icon = t.icon;
          return (
            <Reveal key={t.href} as="div" className="h-full">
              <Link href={t.href} className="group block h-full">
                <article
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 sm:p-8 ${
                    t.featured
                      ? "border-gold/40 bg-gradient-to-br from-gold/10 via-card/60 to-primary/10 hover:border-gold/60"
                      : "border-primary/20 bg-card/60 hover:border-primary/45"
                  }`}
                >
                  {t.featured && (
                    <span className="absolute right-5 top-5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-gold-foreground">
                      EN KAPSAMLI
                    </span>
                  )}
                  <div
                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                      t.featured
                        ? "bg-gradient-to-br from-gold/30 to-primary/20 text-gold ring-1 ring-gold/30"
                        : "bg-gradient-to-br from-primary/25 to-accent/20 text-primary ring-1 ring-primary/20"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.badge} · {t.minutes}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-bold tracking-tight sm:text-2xl">
                    {t.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {t.desc}
                  </p>

                  <div className="mt-6">
                    <Button
                      variant={t.featured ? "gold" : "outline"}
                      className="w-full"
                    >
                      {t.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </article>
              </Link>
            </Reveal>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
