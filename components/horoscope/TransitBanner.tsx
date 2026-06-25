import { AlertTriangle } from "lucide-react";
import type { TransitAlert } from "@/lib/horoscope";

// Gerçek efemeris verisinden gelen aktif transit/retro uyarıları.
export function TransitBanner({ alerts }: { alerts: TransitAlert[] }) {
  if (!alerts.length) return null;
  return (
    <div className="space-y-2">
      {alerts.map((a) => (
        <div
          key={a.planet}
          className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
          <p className="text-sm leading-relaxed">
            <strong className="text-warning">{a.title}</strong>{" "}
            <span className="text-foreground/80">{a.text}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
