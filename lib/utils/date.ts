import { addDays, addMonths, format } from "date-fns";

export function toISODate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function formatTR(d: Date): string {
  return format(d, "dd.MM.yyyy");
}

export function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return `${d}°${m.toString().padStart(2, "0")}'`;
}

// Zaman çizelgesi dönem pencereleri
export interface TimelinePeriod {
  key: string;
  label: string;
  start: Date;
  end: Date;
}

export function buildTimelinePeriods(now: Date): TimelinePeriod[] {
  return [
    { key: "today", label: "Bugün", start: now, end: addDays(now, 1) },
    { key: "week", label: "Bu hafta", start: now, end: addDays(now, 7) },
    { key: "month", label: "Bu ay", start: now, end: addMonths(now, 1) },
    {
      key: "3months",
      label: "Önümüzdeki 3 ay",
      start: now,
      end: addMonths(now, 3),
    },
    {
      key: "6months",
      label: "Önümüzdeki 6 ay",
      start: now,
      end: addMonths(now, 6),
    },
    {
      key: "year",
      label: "Önümüzdeki 1 yıl",
      start: now,
      end: addMonths(now, 12),
    },
  ];
}
