import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

// CSS-hover tabanlı basit ipucu (ek bağımlılık gerektirmez)
export function Tooltip({
  content,
  children,
  className,
}: {
  content: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("group/tt relative inline-flex items-center", className)}>
      {children ?? (
        <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
      )}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-normal leading-relaxed text-foreground opacity-0 shadow-xl transition-opacity duration-150 group-hover/tt:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
