import { Plus } from "lucide-react";
import { FAQS } from "@/lib/marketing";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";

export function Faq() {
  return (
    <Section id="sss" className="max-w-3xl">
      <Reveal>
        <SectionHeading eyebrow="SSS" title="Aklındaki sorular" />
      </Reveal>

      <Reveal delay={0.05} className="mt-10 grid gap-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-primary/15 bg-card/60 px-5 py-4 backdrop-blur-md transition-colors hover:border-primary/30 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
              {f.q}
              <Plus className="h-4 w-4 flex-shrink-0 text-primary transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </p>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
