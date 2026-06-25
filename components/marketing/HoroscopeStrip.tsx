import { ZODIAC } from "@/lib/marketing";
import { Marquee } from "./Marquee";

// Günlük burç önizleme şeridi — sürekli kayan kartlar.
export function HoroscopeStrip() {
  return (
    <div className="space-y-4">
      <Marquee duration={50}>
        {ZODIAC.map((z) => (
          <article
            key={z.name}
            className="flex w-64 shrink-0 flex-col rounded-2xl border border-primary/15 bg-card/60 p-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-xl text-primary">
                {z.glyph}
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{z.name}</p>
                <p className="text-[11px] text-muted-foreground">{z.dates}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {z.blurb}
            </p>
          </article>
        ))}
      </Marquee>
    </div>
  );
}
