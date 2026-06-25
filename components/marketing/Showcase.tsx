import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { AiPreview } from "./AiPreview";
import { TimelinePreview } from "./TimelinePreview";

// AI yorumu + zaman çizelgesi önizlemelerini yan yana gösteren vitrin.
export function Showcase() {
  return (
    <Section>
      <Reveal>
        <SectionHeading
          eyebrow="Önizleme"
          title="Yıldız haritası değil, net bir yol haritası"
          description="Soyut açıları, hayatına dair somut ve okunabilir içgörülere çeviririz."
        />
      </Reveal>

      <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-2">
        <Reveal>
          <AiPreview />
        </Reveal>
        <Reveal delay={0.08}>
          <TimelinePreview />
        </Reveal>
      </div>
    </Section>
  );
}
