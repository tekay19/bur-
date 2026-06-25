"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { AI_SAMPLE } from "@/lib/marketing";
import styles from "./AiPreview.module.css";

// AI yorumunu "yazıyor" gibi gösteren önizleme.
// Performans: metni her karakterde setState yerine requestAnimationFrame ile
// DOM'a doğrudan yazar (React re-render YOK) → typewriter akıcı, kasmaz.
export function AiPreview() {
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      el.textContent = AI_SAMPLE;
      return;
    }

    let raf = 0;
    let startTime = 0;
    const cps = 55; // saniyedeki karakter (yazma hızı)

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const count = Math.min(
        AI_SAMPLE.length,
        Math.floor(((now - startTime) / 1000) * cps),
      );
      // Yalnızca değiştiğinde DOM'a dokun (gereksiz yazım yok).
      if (el.dataset.n !== String(count)) {
        el.textContent = AI_SAMPLE.slice(0, count);
        el.dataset.n = String(count);
        container.dataset.done = count >= AI_SAMPLE.length ? "true" : "false";
      }
      if (count < AI_SAMPLE.length) raf = requestAnimationFrame(tick);
    };

    // Görünüme girince başlat (gereksiz erken animasyon yok).
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(container);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-done="false"
      className={`${styles.card} relative overflow-hidden rounded-3xl border border-primary/20 bg-card/70 p-6 backdrop-blur-xl sm:p-8`}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">Astrotek AI</p>
          <p className="text-xs text-muted-foreground">Kişisel yorum üretiliyor…</p>
        </div>
      </div>

      <p className="min-h-[7.5rem] text-[15px] leading-relaxed text-foreground/90">
        <span ref={textRef} />
        <span className={styles.cursor} aria-hidden />
      </p>

      <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-accent/15 blur-3xl" />
    </div>
  );
}
