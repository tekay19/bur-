"use client";

import { useEffect, useRef } from "react";

// Hem otomatik kayan hem de elle (parmak/fare) kaydırılabilen kart şeridi.
// Kartlar server'da render edilip children olarak geçilir (fonksiyon prop sorununu önler).
// Kullanıcı dokununca/scroll edince otomatik kayma durur, biraz sonra devam eder.
export function FeatureCarousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pause = (ms = 4000) => {
    paused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      paused.current = false;
    }, ms);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const step = () => {
      if (paused.current) return;
      const card = el.querySelector("article") as HTMLElement | null;
      const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.85;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: amount, behavior: "smooth" });
      }
    };

    const id = setInterval(step, 3500);
    return () => {
      clearInterval(id);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  return (
    <div className="relative [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
      <div
        ref={ref}
        onPointerDown={() => pause()}
        onMouseEnter={() => pause(100000)}
        onMouseLeave={() => pause(1500)}
        onTouchStart={() => pause()}
        onWheel={() => pause()}
        className="flex snap-x snap-proximity gap-5 overflow-x-auto overscroll-x-contain px-4 pb-4 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <p className="mt-1 text-center text-xs text-muted-foreground/70">
        ← Kaydırarak gez →
      </p>
    </div>
  );
}
