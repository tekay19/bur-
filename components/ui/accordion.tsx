import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// <details>/<summary> tabanlı erişilebilir akordiyon (ek bağımlılık yok)
export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  badge,
  className,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group rounded-xl border border-border bg-secondary/30 [&_summary::-webkit-details-marker]:hidden",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium">
        <span className="flex items-center gap-2">{title}</span>
        <span className="flex items-center gap-2">
          {badge}
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
        {children}
      </div>
    </details>
  );
}
