// ============================================================
// Zaman dilimi yardımcıları (harici kütüphane gerektirmez)
// Intl API üzerinden IANA zaman dilimi ofsetini hesaplar; DST
// dahil yerel doğum saatini UTC'ye çevirir.
// ============================================================

// Belirli bir UTC anında verilen zaman diliminin ofsetini (ms) döndürür
function tzOffsetMs(timeZone: string, date: Date): number {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = dtf.formatToParts(date);
    const map: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== "literal") map[p.type] = Number(p.value);
    }
    const asUTC = Date.UTC(
      map.year,
      map.month - 1,
      map.day,
      map.hour === 24 ? 0 : map.hour,
      map.minute,
      map.second,
    );
    return asUTC - date.getTime();
  } catch {
    return 0; // bilinmeyen zaman dilimi -> UTC kabul et
  }
}

// Yerel duvar saatini (verilen zaman diliminde) gerçek UTC Date'e çevir
export function zonedTimeToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const wallAsUTC = Date.UTC(year, month - 1, day, hour, minute);
  let offset = tzOffsetMs(timeZone, new Date(wallAsUTC));
  let utc = wallAsUTC - offset;
  // DST sınırları için tek seferlik düzeltme
  offset = tzOffsetMs(timeZone, new Date(utc));
  utc = wallAsUTC - offset;
  return new Date(utc);
}

// IANA zaman dilimi geçerli mi? (ör. "UTC+3"/"GMT+3"/yazım hatası geçersizdir)
export function isValidTimeZone(tz: string | null | undefined): boolean {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// "yyyy-MM-dd" + "HH:mm" -> UTC Date
export function buildUtcDate(
  dateStr: string,
  timeStr: string | null | undefined,
  timeZone: string,
): { utc: Date; usedTime: boolean } {
  const [y, mo, d] = dateStr.split("-").map(Number);
  // Saat 00-23 / dakika 00-59 sınırlı; taşan değer saatsiz kabul edilir.
  if (timeStr && /^([01]?\d|2[0-3]):[0-5]\d$/.test(timeStr)) {
    const [h, mi] = timeStr.split(":").map(Number);
    return { utc: zonedTimeToUtc(y, mo, d, h, mi, timeZone), usedTime: true };
  }
  // Saat yoksa yerel öğlen 12:00 varsayılır (gezegen burçları için yeterli)
  return { utc: zonedTimeToUtc(y, mo, d, 12, 0, timeZone), usedTime: false };
}
