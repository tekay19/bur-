import * as React from "react";
import { cn } from "@/lib/utils";

// Skor rengini değere göre belirle
export function scoreColor(value: number): string {
  if (value >= 76) return "hsl(var(--success))";
  if (value >= 56) return "hsl(152 50% 55%)";
  if (value >= 31) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: scoreColor(value),
        }}
      />
    </div>
  );
}

// Dairesel skor göstergesi
export function ScoreRing({
  value,
  size = 120,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = scoreColor(value);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {value}
        </span>
        {label && (
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
