import { cn } from "@/lib/utils";
import { FEATURES } from "@/lib/marketing";
import { Section, SectionHeading } from "./Section";
import { Reveal, RevealGroup } from "./Reveal";
import { ICONS } from "./iconMap";
import { PanelPreview } from "./PanelPreview";

export function FeatureGrid() {
  return (
    <Section id="ozellikler">
      <Reveal>
        <SectionHeading
          eyebrow="Nasıl görünür"
          title="İşte alacağın analiz paneli"
          description="Doğum haritan, hayat alanı skorların ve kişisel yorumun tek panelde. Astroloji bilmesen de ilk bakışta neyin ne olduğunu anlarsın."
        />
      </Reveal>

      <Reveal className="mt-10">
        <PanelPreview />
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const Icon = ICONS[f.icon];
          return (
            <Reveal
              as="div"
              key={f.title}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border border-primary/15 bg-card/60 p-6 backdrop-blur-md transition-colors hover:border-primary/35",
                f.span === "wide" && "sm:col-span-2 lg:col-span-1",
              )}
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/25 text-primary ring-1 ring-primary/20">
                {Icon ? <Icon className="h-5 w-5" /> : null}
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100 sm:opacity-0" />
            </Reveal>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
