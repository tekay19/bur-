import { cn } from "@/lib/utils";
import { TIMELINE } from "@/lib/marketing";

const toneStyles: Record<string, { dot: string; chip: string; label: string }> = {
  positive: {
    dot: "bg-success",
    chip: "border-success/25 bg-success/10 text-success",
    label: "Fırsat",
  },
  caution: {
    dot: "bg-warning",
    chip: "border-warning/30 bg-warning/12 text-warning",
    label: "Dikkat",
  },
  neutral: {
    dot: "bg-primary",
    chip: "border-primary/25 bg-primary/10 text-primary",
    label: "Nötr",
  },
};

// Önümüzdeki dönemin transit zaman çizelgesi önizlemesi.
export function TimelinePreview() {
  return (
    <div className="rounded-3xl border border-primary/20 bg-card/70 p-6 backdrop-blur-xl sm:p-8">
      <p className="mb-5 text-sm font-semibold text-muted-foreground">
        Önümüzdeki 12 ay · zaman çizelgesi
      </p>
      <ol className="relative space-y-5 border-l border-border pl-5">
        {TIMELINE.map((e) => {
          const t = toneStyles[e.tone];
          return (
            <li key={e.date} className="relative">
              <span
                className={cn(
                  "absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background",
                  t.dot,
                )}
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{e.title}</span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                    t.chip,
                  )}
                >
                  {t.label}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">{e.date}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{e.desc}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
