import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { Polarity, Strength } from "@/lib/astrology/types";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/10 text-primary",
        supportive: "border-success/25 bg-success/10 text-success",
        challenging: "border-warning/30 bg-warning/12 text-warning",
        mixed: "border-accent/25 bg-accent/10 text-accent",
        strong: "border-gold/30 bg-gold/15 text-gold",
        weak: "border-border bg-muted text-muted-foreground",
        neutral: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export function polarityVariant(
  p: Polarity,
): NonNullable<BadgeProps["variant"]> {
  switch (p) {
    case "Destekleyici":
      return "supportive";
    case "Zorlayıcı":
      return "challenging";
    case "Karışık":
      return "mixed";
    default:
      return "weak";
  }
}

export function strengthVariant(
  s: Strength,
): NonNullable<BadgeProps["variant"]> {
  switch (s) {
    case "Güçlü":
      return "strong";
    case "Destekleyici":
      return "supportive";
    case "Zayıf":
      return "weak";
    default:
      return "mixed";
  }
}

export { Badge, badgeVariants };
