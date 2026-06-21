import Link from "next/link";
import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

// Tutarlı marka logosu — tüm sayfalarda aynı görünüm
export function BrandLogo({
  size = "md",
  href = "/",
  className,
}: {
  size?: "sm" | "md";
  href?: string | null;
  className?: string;
}) {
  const text = size === "sm" ? "text-sm" : "text-lg";
  const icon = size === "sm" ? "h-5 w-5" : "h-6 w-6";

  const inner = (
    <span className={cn("flex items-center gap-2", className)}>
      <Moon className={cn(icon, "text-gold")} />
      <span className={cn("font-display font-semibold tracking-tight", text)}>
        Astrotek<span className="gold-text"> AI</span>
      </span>
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} className="transition-opacity hover:opacity-80">
      {inner}
    </Link>
  );
}
