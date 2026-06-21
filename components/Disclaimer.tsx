import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_TEXT =
  "Bu yorumlar astrolojik sembolizm ve eğlence/kişisel farkındalık amaçlıdır. Kesin gelecek tahmini değildir.";

export function Disclaimer({
  className,
  text = DEFAULT_TEXT,
  compact = false,
}: {
  className?: string;
  text?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-gold/25 bg-gold/[0.07] px-4 py-3 text-gold/90",
        compact ? "text-xs" : "text-sm",
        className,
      )}
    >
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
