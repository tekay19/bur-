"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Natal haritan hesaplanıyor",
  "Transit etkiler inceleniyor",
  "AI yorumun hazırlanıyor",
];

export function LoadingState() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setActive(1), 1400),
      setTimeout(() => setActive(2), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="relative">
        <Moon className="h-14 w-14 animate-float text-gold" />
        <div className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
      </div>

      <div className="w-full max-w-sm space-y-3">
        {STEPS.map((step, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all",
                done && "border-success/30 bg-success/10 text-success",
                current && "border-primary/40 bg-primary/10 text-foreground",
                !done && !current && "border-border bg-secondary/30 text-muted-foreground",
              )}
            >
              {done ? (
                <Check className="h-4 w-4 shrink-0" />
              ) : current ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border border-current" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>

      <p className="max-w-sm text-center text-xs text-muted-foreground">
        Gezegenler hizalanıyor… Bu işlem birkaç saniye sürebilir.
      </p>
    </div>
  );
}
