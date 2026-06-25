import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/marketing";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { Marquee } from "./Marquee";

export function Testimonials() {
  return (
    <Section className="max-w-none px-0 sm:px-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Kullanıcılar"
            title="Binlerce kişi yıldızlarını okudu"
            description="Astrolojiye yeni başlayanlardan meraklılara kadar herkes için."
          />
        </Reveal>
      </div>

      <div className="mt-12">
        <Marquee duration={45}>
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex w-80 shrink-0 flex-col rounded-3xl border border-primary/15 bg-card/60 p-6 backdrop-blur-md"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground/85">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
