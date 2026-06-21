"use client";

import { useEffect, useState } from "react";
import { Moon } from "lucide-react";

// Siteye girişte "başka bir evrene geçiş" sinematik intro'su.
// Oturum başına bir kez oynar (sessionStorage).
export function IntroOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("introSeen") === "1";
    } catch {
      /* yoksay */
    }
    if (seen) return;
    setShow(true);
    const t = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem("introSeen", "1");
      } catch {
        /* yoksay */
      }
    }, 2550);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="intro-root fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[hsl(252_55%_4%)]">
      {/* Yıldızlar viewer'a doğru akıyor (warp) */}
      <div className="intro-warp starfield absolute inset-0 origin-center" />
      <div
        className="intro-warp starfield absolute inset-0 origin-center"
        style={{ backgroundSize: "260px 260px", animationDelay: "0.15s" }}
      />

      {/* Portal halkaları */}
      <div className="intro-portal absolute h-72 w-72 rounded-full border border-primary/40" />
      <div className="absolute h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute h-24 w-24 rounded-full bg-accent/30 blur-2xl" />

      {/* Marka */}
      <div className="intro-brand relative flex flex-col items-center gap-3 text-center">
        <Moon className="h-12 w-12 text-gold" />
        <span className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Astrotek<span className="gold-text"> AI</span>
        </span>
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Evrenin kapısı açılıyor
        </span>
      </div>
    </div>
  );
}
