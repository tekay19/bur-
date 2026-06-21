"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: React.ReactNode;
}

export function SimpleTabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex w-full gap-1 rounded-2xl border border-border bg-secondary/40 p-1.5 sm:w-auto",
        className,
      )}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium transition-all sm:flex-none",
            active === t.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
