import { STEPS } from "@/lib/marketing";
import { Section, SectionHeading } from "./Section";
import { Reveal, RevealGroup } from "./Reveal";
import { ICONS } from "./iconMap";

export function HowItWorks() {
  return (
    <Section id="nasil-calisir">
      <Reveal>
        <SectionHeading
          eyebrow="Nasıl çalışır"
          title="4 adımda haritan hazır"
          description="Karmaşık ayar yok. Birkaç bilgi yeter; gerisini biz hallederiz."
        />
      </Reveal>

      <RevealGroup className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* Bağlantı çizgisi (masaüstü) */}
        <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />
        {STEPS.map((s, i) => {
          const Icon = ICONS[s.icon];
          return (
            <Reveal key={s.title} className="relative z-10 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/30 ring-4 ring-background">
                {Icon ? <Icon className="h-7 w-7" /> : null}
              </div>
              <span className="mt-4 text-xs font-bold tracking-widest text-muted-foreground">
                ADIM {i + 1}
              </span>
              <h3 className="mt-1 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 max-w-[15rem] text-sm text-muted-foreground">
                {s.desc}
              </p>
            </Reveal>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
