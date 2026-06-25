import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Sayfa genelinde tutarlı dikey ritim + maksimum genişlik için kapsayıcı.
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24", className)}
    >
      {children}
    </section>
  );
}

// Bölüm başlığı: küçük etiket (eyebrow) + büyük başlık + isteğe bağlı açıklama.
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

// İnce, yeniden kullanılabilir "pill" rozet (eyebrow / trust göstergeleri için).
export function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/40 px-3.5 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
