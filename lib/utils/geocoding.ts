// ============================================================
// Geocoding: şehir -> enlem / boylam / zaman dilimi
// MVP'de dahili veritabanı kullanılır (81 il + dünya şehirleri).
// GEOCODING_API_URL tanımlıysa harici servise düşülür (adapter).
// ============================================================

export interface GeoResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  source: "builtin" | "external";
}

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
  tz: string;
  aliases?: string[];
  province?: string; // ilçeler için bağlı olduğu il
}

const TR = "Türkiye";
const IST = "Europe/Istanbul";

// 81 il (yaklaşık il merkezi koordinatları)
const TURKISH_PROVINCES: City[] = [
  { name: "Adana", country: TR, lat: 37.0, lon: 35.3213, tz: IST },
  { name: "Adıyaman", country: TR, lat: 37.7648, lon: 38.2786, tz: IST },
  { name: "Afyonkarahisar", country: TR, lat: 38.7507, lon: 30.5567, tz: IST, aliases: ["afyon"] },
  { name: "Ağrı", country: TR, lat: 39.7191, lon: 43.0503, tz: IST },
  { name: "Amasya", country: TR, lat: 40.6499, lon: 35.8353, tz: IST },
  { name: "Ankara", country: TR, lat: 39.9334, lon: 32.8597, tz: IST },
  { name: "Antalya", country: TR, lat: 36.8969, lon: 30.7133, tz: IST },
  { name: "Artvin", country: TR, lat: 41.1828, lon: 41.8183, tz: IST },
  { name: "Aydın", country: TR, lat: 37.848, lon: 27.8456, tz: IST },
  { name: "Balıkesir", country: TR, lat: 39.6484, lon: 27.8826, tz: IST },
  { name: "Bilecik", country: TR, lat: 40.1426, lon: 29.9793, tz: IST },
  { name: "Bingöl", country: TR, lat: 38.8847, lon: 40.4986, tz: IST },
  { name: "Bitlis", country: TR, lat: 38.4006, lon: 42.1095, tz: IST },
  { name: "Bolu", country: TR, lat: 40.5760, lon: 31.5788, tz: IST },
  { name: "Burdur", country: TR, lat: 37.7203, lon: 30.2908, tz: IST },
  { name: "Bursa", country: TR, lat: 40.1885, lon: 29.061, tz: IST },
  { name: "Çanakkale", country: TR, lat: 40.1553, lon: 26.4142, tz: IST },
  { name: "Çankırı", country: TR, lat: 40.6013, lon: 33.6134, tz: IST },
  { name: "Çorum", country: TR, lat: 40.5506, lon: 34.9556, tz: IST },
  { name: "Denizli", country: TR, lat: 37.7765, lon: 29.0864, tz: IST },
  { name: "Diyarbakır", country: TR, lat: 37.9144, lon: 40.2306, tz: IST },
  { name: "Edirne", country: TR, lat: 41.6818, lon: 26.5623, tz: IST },
  { name: "Elazığ", country: TR, lat: 38.6810, lon: 39.2264, tz: IST },
  { name: "Erzincan", country: TR, lat: 39.75, lon: 39.5, tz: IST },
  { name: "Erzurum", country: TR, lat: 39.9, lon: 41.27, tz: IST },
  { name: "Eskişehir", country: TR, lat: 39.7767, lon: 30.5206, tz: IST },
  { name: "Gaziantep", country: TR, lat: 37.0662, lon: 37.3833, tz: IST, aliases: ["antep"] },
  { name: "Giresun", country: TR, lat: 40.9128, lon: 38.3895, tz: IST },
  { name: "Gümüşhane", country: TR, lat: 40.4603, lon: 39.4814, tz: IST },
  { name: "Hakkari", country: TR, lat: 37.5744, lon: 43.7408, tz: IST },
  { name: "Hatay", country: TR, lat: 36.4018, lon: 36.3498, tz: IST, aliases: ["antakya"] },
  { name: "Isparta", country: TR, lat: 37.7648, lon: 30.5566, tz: IST },
  { name: "Mersin", country: TR, lat: 36.8, lon: 34.6333, tz: IST, aliases: ["içel"] },
  { name: "İstanbul", country: TR, lat: 41.0082, lon: 28.9784, tz: IST, aliases: ["istanbul"] },
  { name: "İzmir", country: TR, lat: 38.4237, lon: 27.1428, tz: IST, aliases: ["izmir"] },
  { name: "Kars", country: TR, lat: 40.6013, lon: 43.0975, tz: IST },
  { name: "Kastamonu", country: TR, lat: 41.3887, lon: 33.7827, tz: IST },
  { name: "Kayseri", country: TR, lat: 38.7312, lon: 35.4787, tz: IST },
  { name: "Kırklareli", country: TR, lat: 41.7333, lon: 27.2167, tz: IST },
  { name: "Kırşehir", country: TR, lat: 39.1425, lon: 34.1709, tz: IST },
  { name: "Kocaeli", country: TR, lat: 40.7654, lon: 29.9408, tz: IST, aliases: ["izmit"] },
  { name: "Konya", country: TR, lat: 37.8714, lon: 32.4847, tz: IST },
  { name: "Kütahya", country: TR, lat: 39.4242, lon: 29.9833, tz: IST },
  { name: "Malatya", country: TR, lat: 38.3552, lon: 38.3095, tz: IST },
  { name: "Manisa", country: TR, lat: 38.6191, lon: 27.4289, tz: IST },
  { name: "Kahramanmaraş", country: TR, lat: 37.5858, lon: 36.9371, tz: IST, aliases: ["maraş"] },
  { name: "Mardin", country: TR, lat: 37.3212, lon: 40.7245, tz: IST },
  { name: "Muğla", country: TR, lat: 37.2153, lon: 28.3636, tz: IST },
  { name: "Muş", country: TR, lat: 38.9462, lon: 41.7539, tz: IST },
  { name: "Nevşehir", country: TR, lat: 38.6939, lon: 34.6857, tz: IST },
  { name: "Niğde", country: TR, lat: 37.9667, lon: 34.6833, tz: IST },
  { name: "Ordu", country: TR, lat: 40.9839, lon: 37.8764, tz: IST },
  { name: "Rize", country: TR, lat: 41.0201, lon: 40.5234, tz: IST },
  { name: "Sakarya", country: TR, lat: 40.7569, lon: 30.3781, tz: IST, aliases: ["adapazarı"] },
  { name: "Samsun", country: TR, lat: 41.2867, lon: 36.33, tz: IST },
  { name: "Siirt", country: TR, lat: 37.9333, lon: 41.95, tz: IST },
  { name: "Sinop", country: TR, lat: 42.0264, lon: 35.1551, tz: IST },
  { name: "Sivas", country: TR, lat: 39.7477, lon: 37.0179, tz: IST },
  { name: "Tekirdağ", country: TR, lat: 40.9833, lon: 27.5167, tz: IST },
  { name: "Tokat", country: TR, lat: 40.3167, lon: 36.5544, tz: IST },
  { name: "Trabzon", country: TR, lat: 41.0015, lon: 39.7178, tz: IST },
  { name: "Tunceli", country: TR, lat: 39.3074, lon: 39.4388, tz: IST },
  { name: "Şanlıurfa", country: TR, lat: 37.1591, lon: 38.7969, tz: IST, aliases: ["urfa"] },
  { name: "Uşak", country: TR, lat: 38.6823, lon: 29.4082, tz: IST },
  { name: "Van", country: TR, lat: 38.4891, lon: 43.4089, tz: IST },
  { name: "Yozgat", country: TR, lat: 39.82, lon: 34.8044, tz: IST },
  { name: "Zonguldak", country: TR, lat: 41.4564, lon: 31.7987, tz: IST },
  { name: "Aksaray", country: TR, lat: 38.3687, lon: 34.037, tz: IST },
  { name: "Bayburt", country: TR, lat: 40.2552, lon: 40.2249, tz: IST },
  { name: "Karaman", country: TR, lat: 37.1759, lon: 33.2287, tz: IST },
  { name: "Kırıkkale", country: TR, lat: 39.8468, lon: 33.5153, tz: IST },
  { name: "Batman", country: TR, lat: 37.8812, lon: 41.1351, tz: IST },
  { name: "Şırnak", country: TR, lat: 37.4187, lon: 42.4918, tz: IST },
  { name: "Bartın", country: TR, lat: 41.5811, lon: 32.4610, tz: IST },
  { name: "Ardahan", country: TR, lat: 41.1105, lon: 42.7022, tz: IST },
  { name: "Iğdır", country: TR, lat: 39.8880, lon: 44.0048, tz: IST },
  { name: "Yalova", country: TR, lat: 40.65, lon: 29.2667, tz: IST },
  { name: "Karabük", country: TR, lat: 41.2061, lon: 32.6204, tz: IST },
  { name: "Kilis", country: TR, lat: 36.7184, lon: 37.1212, tz: IST },
  { name: "Osmaniye", country: TR, lat: 37.0742, lon: 36.2462, tz: IST },
  { name: "Düzce", country: TR, lat: 40.8438, lon: 31.1565, tz: IST },
];

const WORLD_CITIES: City[] = [
  { name: "Londra", country: "İngiltere", lat: 51.5074, lon: -0.1278, tz: "Europe/London", aliases: ["london"] },
  { name: "Paris", country: "Fransa", lat: 48.8566, lon: 2.3522, tz: "Europe/Paris" },
  { name: "Berlin", country: "Almanya", lat: 52.52, lon: 13.405, tz: "Europe/Berlin" },
  { name: "Amsterdam", country: "Hollanda", lat: 52.3676, lon: 4.9041, tz: "Europe/Amsterdam" },
  { name: "Roma", country: "İtalya", lat: 41.9028, lon: 12.4964, tz: "Europe/Rome", aliases: ["rome", "rom"] },
  { name: "Madrid", country: "İspanya", lat: 40.4168, lon: -3.7038, tz: "Europe/Madrid" },
  { name: "Viyana", country: "Avusturya", lat: 48.2082, lon: 16.3738, tz: "Europe/Vienna", aliases: ["vienna", "wien"] },
  { name: "Brüksel", country: "Belçika", lat: 50.8503, lon: 4.3517, tz: "Europe/Brussels", aliases: ["brussels"] },
  { name: "Moskova", country: "Rusya", lat: 55.7558, lon: 37.6173, tz: "Europe/Moscow", aliases: ["moscow"] },
  { name: "Atina", country: "Yunanistan", lat: 37.9838, lon: 23.7275, tz: "Europe/Athens", aliases: ["athens"] },
  { name: "Bakü", country: "Azerbaycan", lat: 40.4093, lon: 49.8671, tz: "Asia/Baku", aliases: ["baku"] },
  { name: "Lefkoşa", country: "KKTC", lat: 35.1856, lon: 33.3823, tz: "Asia/Nicosia", aliases: ["nicosia"] },
  { name: "Tahran", country: "İran", lat: 35.6892, lon: 51.389, tz: "Asia/Tehran", aliases: ["tehran"] },
  { name: "Bağdat", country: "Irak", lat: 33.3152, lon: 44.3661, tz: "Asia/Baghdad", aliases: ["baghdad"] },
  { name: "Dubai", country: "BAE", lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai" },
  { name: "Doha", country: "Katar", lat: 25.2854, lon: 51.531, tz: "Asia/Qatar" },
  { name: "Riyad", country: "Suudi Arabistan", lat: 24.7136, lon: 46.6753, tz: "Asia/Riyadh", aliases: ["riyadh"] },
  { name: "Kahire", country: "Mısır", lat: 30.0444, lon: 31.2357, tz: "Africa/Cairo", aliases: ["cairo"] },
  { name: "New York", country: "ABD", lat: 40.7128, lon: -74.006, tz: "America/New_York" },
  { name: "Los Angeles", country: "ABD", lat: 34.0522, lon: -118.2437, tz: "America/Los_Angeles" },
  { name: "Washington", country: "ABD", lat: 38.9072, lon: -77.0369, tz: "America/New_York" },
  { name: "Toronto", country: "Kanada", lat: 43.6532, lon: -79.3832, tz: "America/Toronto" },
  { name: "Tokyo", country: "Japonya", lat: 35.6762, lon: 139.6503, tz: "Asia/Tokyo" },
  { name: "Pekin", country: "Çin", lat: 39.9042, lon: 116.4074, tz: "Asia/Shanghai", aliases: ["beijing"] },
  { name: "Şanghay", country: "Çin", lat: 31.2304, lon: 121.4737, tz: "Asia/Shanghai", aliases: ["shanghai"] },
  { name: "Delhi", country: "Hindistan", lat: 28.6139, lon: 77.209, tz: "Asia/Kolkata" },
  { name: "Sidney", country: "Avustralya", lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney", aliases: ["sydney"] },
];

const ALL_CITIES = [...TURKISH_PROVINCES, ...WORLD_CITIES];

function normalize(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .replace(/i̇/g, "i") // birleşik nokta (İ -> i + combining dot)
    .replace(/ı/g, "i") // noktasız ı -> i (ASCII "Istanbul" girdisini eşle)
    .trim();
}

// İl/şehir listesini autocomplete için dışa aktar
export function listCities(): { label: string; value: string }[] {
  return ALL_CITIES.map((c) => ({
    label: `${c.name}${c.country !== TR ? `, ${c.country}` : ""}`,
    value: c.name,
  }));
}

// Sorguyu "İlçe, İl" / "İlçe/İl" gibi parçalara ayır
function splitQuery(query: string): { name: string; hint: string } {
  const parts = query
    .split(/[,/]|\s-\s/)
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    name: parts[0] || query.trim(),
    hint: parts.slice(1).join(" "),
  };
}

// Dahili (offline) eşleşme — il ve eklenmiş ilçeler. Token token dener.
function findBuiltin(query: string): GeoResult | null {
  const tokens = query
    .split(/[,/]|\s-\s/)
    .map((t) => normalize(t))
    .filter(Boolean);
  if (tokens.length === 0) return null;

  const match = (q: string) =>
    ALL_CITIES.find(
      (c) =>
        normalize(c.name) === q || c.aliases?.some((a) => normalize(a) === q),
    ) ??
    ALL_CITIES.find(
      (c) =>
        normalize(c.name).startsWith(q) ||
        c.aliases?.some((a) => normalize(a).startsWith(q)),
    ) ??
    (q.length >= 3
      ? ALL_CITIES.find((c) => normalize(c.name).includes(q))
      : undefined);

  // En spesifik (ilk) token önce; bulunamazsa il token'ı
  for (const t of tokens) {
    const m = match(t);
    if (m) {
      return {
        name: m.province ? `${m.name}, ${m.province}` : m.name,
        country: m.country,
        latitude: m.lat,
        longitude: m.lon,
        timezone: m.tz,
        source: "builtin",
      };
    }
  }
  return null;
}

// Nominatim / OpenStreetMap (ücretsiz, ANAHTAR GEREKTİRMEZ) — Türkiye'ye kısıtlı.
// TÜM Türkiye ilçe/kasaba/mahallelerini doğru koordinatla bulur.
// (Büyük şehir ilçeleri Open-Meteo'da eksik olduğu için TR'de bu kullanılır.)
async function findNominatimTR(query: string): Promise<GeoResult | null> {
  const { name, hint } = splitQuery(query);
  const q = hint ? `${name}, ${hint}, Türkiye` : `${name}, Türkiye`;
  try {
    const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      q,
    )}&format=json&limit=1&countrycodes=tr&addressdetails=1&accept-language=tr`;
    const res = await fetch(endpoint, {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
      headers: {
        // Nominatim kullanım politikası gereği tanımlayıcı User-Agent.
        // NOT: HTTP başlık değeri Latin-1 olmalı; Türkçe karakter KULLANMA.
        "User-Agent": "AstrotekAI/1.0 (astrology analysis app)",
      },
    });
    if (!res.ok) return null;
    const data: Array<{
      lat: string;
      lon: string;
      name?: string;
      display_name?: string;
      address?: Record<string, string>;
    }> = await res.json();
    if (!data || data.length === 0) return null;
    const first = data[0];
    const a = first.address ?? {};
    const place =
      a.town ||
      a.city_district ||
      a.suburb ||
      a.municipality ||
      a.village ||
      a.county ||
      a.city ||
      first.name ||
      name;
    const prov = a.province || a.state || a.city || "";
    const la = Number(first.lat);
    const lo = Number(first.lon);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return null; // bozuk koordinat
    return {
      name: prov && prov !== place ? `${place}, ${prov}` : place,
      country: "Türkiye",
      latitude: la,
      longitude: lo,
      timezone: "Europe/Istanbul", // Türkiye tek zaman dilimi
      source: "external",
    };
  } catch {
    return null;
  }
}

// Open-Meteo Geocoding (ücretsiz, ANAHTAR GEREKTİRMEZ) — dünya şehirleri için.
// admin1 = il; timezone yanıtta gelir.
async function findOpenMeteo(query: string): Promise<GeoResult | null> {
  const { name, hint } = splitQuery(query);
  try {
    const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      name,
    )}&count=10&language=tr&format=json`;
    const res = await fetch(endpoint, {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results: Array<{
      name: string;
      country?: string;
      country_code?: string;
      admin1?: string;
      admin2?: string;
      latitude: number;
      longitude: number;
      timezone?: string;
    }> = data?.results ?? [];
    if (results.length === 0) return null;

    // Türkiye sonuçlarına öncelik
    const tr = results.filter(
      (r) => r.country_code === "TR" || /türkiye/i.test(r.country ?? ""),
    );
    const pool = tr.length ? tr : results;

    // İl ipucu (ör. "Tekirdağ") varsa admin1/admin2 ile eşleştir
    let pick = pool[0];
    if (hint) {
      const h = normalize(hint);
      const m = pool.find(
        (r) =>
          normalize(r.admin1 ?? "").includes(h) ||
          normalize(r.admin2 ?? "").includes(h),
      );
      if (m) pick = m;
    }

    return {
      name: pick.admin1 ? `${pick.name}, ${pick.admin1}` : pick.name,
      country: pick.country ?? "",
      latitude: pick.latitude,
      longitude: pick.longitude,
      timezone: pick.timezone ?? "Europe/Istanbul",
      source: "external",
    };
  } catch {
    return null;
  }
}

// OpenCage uyumlu adapter (yalnızca GEOCODING_API_URL tanımlıysa — override)
async function findOpenCage(query: string): Promise<GeoResult | null> {
  const url = process.env.GEOCODING_API_URL;
  if (!url) return null;
  try {
    const key = process.env.GEOCODING_API_KEY ?? "";
    const endpoint = `${url}?q=${encodeURIComponent(query)}&key=${key}&limit=1&language=tr`;
    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const first = data?.results?.[0];
    if (!first) return null;
    const la = Number(first.geometry?.lat);
    const lo = Number(first.geometry?.lng);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return null; // bozuk/eksik koordinat
    return {
      name: first.formatted ?? query,
      country: first.components?.country ?? "",
      latitude: la,
      longitude: lo,
      timezone: first.annotations?.timezone?.name ?? "Europe/Istanbul",
      source: "external",
    };
  } catch {
    return null;
  }
}

// Ana geocoding (öncelik sırası):
//  1) GEOCODING_API_URL tanımlıysa OpenCage (override — dünya + tz)
//  2) Türkiye için Nominatim (tüm ilçe/kasaba/mahalle, hassas)
//  3) Dahili liste (81 il + dünya şehirleri — offline/hızlı)
//  4) Open-Meteo (diğer dünya yerleri + timezone)
// Hiçbiri anahtar gerektirmez.
export async function geocode(query: string): Promise<GeoResult | null> {
  if (process.env.GEOCODING_API_URL) {
    const oc = await findOpenCage(query);
    if (oc) return oc;
  }

  const tr = await findNominatimTR(query);
  if (tr) return tr;

  const builtin = findBuiltin(query);
  if (builtin) return builtin;

  return findOpenMeteo(query);
}
