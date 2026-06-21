// ============================================================
// Düşük-hassasiyetli efemeris (native binary GEREKTİRMEZ)
// Paul Schlyter'in basitleştirilmiş Kepler yörünge öğelerine
// dayanır. Astrolojik sembolik analiz için yeterli doğruluktadır
// (gezegen burçları güvenilir; konum hatası genelde < birkaç ay dk).
//
// Daha yüksek doğruluk için bu modül Swiss Ephemeris adapteri ile
// değiştirilebilir — sözleşme PlanetRaw döndürmektir.
// ============================================================

import type { PlanetName } from "./types";

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export function norm360(x: number): number {
  let r = x % 360;
  if (r < 0) r += 360;
  return r;
}

function sind(x: number) {
  return Math.sin(x * DEG);
}
function cosd(x: number) {
  return Math.cos(x * DEG);
}
function tand(x: number) {
  return Math.tan(x * DEG);
}

// Takvim tarihinden Jülyen Günü (UT)
export function julianDay(date: Date): number {
  const Y = date.getUTCFullYear();
  const M = date.getUTCMonth() + 1;
  const D = date.getUTCDate();
  const H =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;

  let y = Y;
  let m = M;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    D +
    B -
    1524.5 +
    H / 24;
  return jd;
}

// Schlyter'in zaman ölçeği: 2000 Ocak 0.0 (JD 2451543.5)
function dayNumber(jd: number): number {
  return jd - 2451543.5;
}

export interface EclipticCoord {
  lon: number; // jeosentrik ekliptik boylam (derece, 0-360)
  lat: number; // jeosentrik ekliptik enlem
  r: number; // mesafe (AU veya Ay için Dünya yarıçapı)
}

interface OrbitalElements {
  N: number; // yükselen düğüm boylamı
  i: number; // eğim
  w: number; // periapsis argümanı
  a: number; // yarı-büyük eksen
  e: number; // dış merkezlik
  M: number; // ortalama anomali
}

type ElementFn = (d: number) => OrbitalElements;

const elements: Record<Exclude<PlanetName, "Plüton">, ElementFn> = {
  Güneş: (d) => ({
    N: 0,
    i: 0,
    w: 282.9404 + 4.70935e-5 * d,
    a: 1.0,
    e: 0.016709 - 1.151e-9 * d,
    M: 356.047 + 0.9856002585 * d,
  }),
  Ay: (d) => ({
    N: 125.1228 - 0.0529538083 * d,
    i: 5.1454,
    w: 318.0634 + 0.1643573223 * d,
    a: 60.2666,
    e: 0.0549,
    M: 115.3654 + 13.0649929509 * d,
  }),
  Merkür: (d) => ({
    N: 48.3313 + 3.24587e-5 * d,
    i: 7.0047 + 5.0e-8 * d,
    w: 29.1241 + 1.01444e-5 * d,
    a: 0.387098,
    e: 0.205635 + 5.59e-10 * d,
    M: 168.6562 + 4.0923344368 * d,
  }),
  Venüs: (d) => ({
    N: 76.6799 + 2.4659e-5 * d,
    i: 3.3946 + 2.75e-8 * d,
    w: 54.891 + 1.38374e-5 * d,
    a: 0.72333,
    e: 0.006773 - 1.302e-9 * d,
    M: 48.0052 + 1.6021302244 * d,
  }),
  Mars: (d) => ({
    N: 49.5574 + 2.11081e-5 * d,
    i: 1.8497 - 1.78e-8 * d,
    w: 286.5016 + 2.92961e-5 * d,
    a: 1.523688,
    e: 0.093405 + 2.516e-9 * d,
    M: 18.6021 + 0.5240207766 * d,
  }),
  Jüpiter: (d) => ({
    N: 100.4542 + 2.76854e-5 * d,
    i: 1.303 - 1.557e-7 * d,
    w: 273.8777 + 1.64505e-5 * d,
    a: 5.20256,
    e: 0.048498 + 4.469e-9 * d,
    M: 19.895 + 0.0830853001 * d,
  }),
  Satürn: (d) => ({
    N: 113.6634 + 2.3898e-5 * d,
    i: 2.4886 - 1.081e-7 * d,
    w: 339.3939 + 2.97661e-5 * d,
    a: 9.55475,
    e: 0.055546 - 9.499e-9 * d,
    M: 316.967 + 0.0334442282 * d,
  }),
  Uranüs: (d) => ({
    N: 74.0005 + 1.3978e-5 * d,
    i: 0.7733 + 1.9e-8 * d,
    w: 96.6612 + 3.0565e-5 * d,
    a: 19.18171 - 1.55e-8 * d,
    e: 0.047318 + 7.45e-9 * d,
    M: 142.5905 + 0.011725806 * d,
  }),
  Neptün: (d) => ({
    N: 131.7806 + 3.0173e-5 * d,
    i: 1.77 - 2.55e-7 * d,
    w: 272.8461 - 6.027e-6 * d,
    a: 30.05826 + 3.313e-8 * d,
    e: 0.008606 + 2.15e-9 * d,
    M: 260.2471 + 0.005995147 * d,
  }),
};

// Eksantrik anomaliyi (E) Kepler denklemiyle çöz
function solveEccentric(M: number, e: number): number {
  let E = M + RAD * e * sind(M) * (1 + e * cosd(M));
  for (let iter = 0; iter < 8; iter++) {
    const dE =
      (E - RAD * e * sind(E) - M) / (1 - e * cosd(E));
    E -= dE;
    if (Math.abs(dE) < 1e-6) break;
  }
  return E;
}

// Bir cismin kendi yörünge düzlemindeki konumundan
// ekliptik (heliosentrik gezegen / jeosentrik Ay) koordinatları
function orbitToEcliptic(el: OrbitalElements): {
  x: number;
  y: number;
  z: number;
  r: number;
} {
  const E = solveEccentric(norm360(el.M), el.e);
  const xv = el.a * (cosd(E) - el.e);
  const yv = el.a * Math.sqrt(1 - el.e * el.e) * sind(E);
  const r = Math.sqrt(xv * xv + yv * yv);
  const v = Math.atan2(yv, xv) * RAD;

  const vw = v + el.w;
  const x =
    r *
    (cosd(el.N) * cosd(vw) - sind(el.N) * sind(vw) * cosd(el.i));
  const y =
    r *
    (sind(el.N) * cosd(vw) + cosd(el.N) * sind(vw) * cosd(el.i));
  const z = r * (sind(vw) * sind(el.i));
  return { x, y, z, r };
}

function sunRect(d: number): { x: number; y: number; lon: number; r: number } {
  const el = elements.Güneş(d);
  const E = solveEccentric(norm360(el.M), el.e);
  const xv = cosd(E) - el.e;
  const yv = Math.sqrt(1 - el.e * el.e) * sind(E);
  const r = Math.sqrt(xv * xv + yv * yv);
  const v = Math.atan2(yv, xv) * RAD;
  const lon = norm360(v + el.w);
  return { x: r * cosd(lon), y: r * sind(lon), lon, r };
}

// Plüton — Schlyter'in özel serisi (1885-2099 arası geçerli)
function plutoHelio(d: number): { x: number; y: number; z: number } {
  const S = 50.03 + 0.033459652 * d;
  const P = 238.95 + 0.003968789 * d;
  const lon =
    238.9508 +
    0.00400703 * d -
    19.799 * sind(P) +
    19.848 * cosd(P) +
    0.897 * sind(2 * P) -
    4.956 * cosd(2 * P) +
    0.61 * sind(3 * P) +
    1.211 * cosd(3 * P) -
    0.341 * sind(4 * P) -
    0.19 * cosd(4 * P) +
    0.128 * sind(5 * P) -
    0.034 * cosd(5 * P) -
    0.038 * sind(6 * P) +
    0.031 * cosd(6 * P) +
    0.02 * sind(S - P) -
    0.01 * cosd(S - P);
  const lat =
    -3.9082 -
    5.453 * sind(P) -
    14.975 * cosd(P) +
    3.527 * sind(2 * P) +
    1.673 * cosd(2 * P) -
    1.051 * sind(3 * P) +
    0.328 * cosd(3 * P) +
    0.179 * sind(4 * P) -
    0.292 * cosd(4 * P) +
    0.019 * sind(5 * P) +
    0.1 * cosd(5 * P) -
    0.031 * sind(6 * P) -
    0.026 * cosd(6 * P) +
    0.011 * cosd(S - P);
  const r =
    40.72 +
    6.68 * sind(P) +
    6.9 * cosd(P) -
    1.18 * sind(2 * P) -
    0.03 * cosd(2 * P) +
    0.15 * sind(3 * P) -
    0.14 * cosd(3 * P);
  const x = r * cosd(lon) * cosd(lat);
  const y = r * sind(lon) * cosd(lat);
  const z = r * sind(lat);
  return { x, y, z };
}

// Ay için ana pertürbasyonlar (en büyük terimler) — burç doğruluğu için
function moonPerturbations(d: number, lon: number): number {
  const Ms = norm360(elements.Güneş(d).M);
  const Mm = norm360(elements.Ay(d).M);
  const Nm = elements.Ay(d).N;
  const ws = elements.Güneş(d).w;
  const wm = elements.Ay(d).w;
  const Ls = norm360(Ms + ws); // Güneş ortalama boylam
  const Lm = norm360(Mm + wm + Nm); // Ay ortalama boylam
  const D = norm360(Lm - Ls); // ortalama uzaklık
  const F = norm360(Lm - Nm); // enlem argümanı

  let dlon = 0;
  dlon += -1.274 * sind(Mm - 2 * D); // evection
  dlon += 0.658 * sind(2 * D); // variation
  dlon += -0.186 * sind(Ms); // yıllık eşitsizlik
  dlon += -0.059 * sind(2 * Mm - 2 * D);
  dlon += -0.057 * sind(Mm - 2 * D + Ms);
  dlon += 0.053 * sind(Mm + 2 * D);
  dlon += 0.046 * sind(2 * D - Ms);
  dlon += 0.041 * sind(Mm - Ms);
  dlon += -0.035 * sind(D);
  dlon += -0.031 * sind(Mm + Ms);
  dlon += -0.015 * sind(2 * F - 2 * D);
  dlon += 0.011 * sind(Mm - 4 * D);
  return lon + dlon;
}

function geoEcliptic(planet: PlanetName, d: number): EclipticCoord {
  if (planet === "Güneş") {
    const s = sunRect(d);
    return { lon: s.lon, lat: 0, r: s.r };
  }
  if (planet === "Ay") {
    const moon = orbitToEcliptic(elements.Ay(d));
    let lon = norm360(Math.atan2(moon.y, moon.x) * RAD);
    const lat =
      Math.atan2(moon.z, Math.sqrt(moon.x * moon.x + moon.y * moon.y)) * RAD;
    lon = norm360(moonPerturbations(d, lon));
    return { lon, lat, r: moon.r };
  }

  // Diğer gezegenler: heliosentrik -> jeosentrik
  let xh: number, yh: number, zh: number;
  if (planet === "Plüton") {
    const p = plutoHelio(d);
    xh = p.x;
    yh = p.y;
    zh = p.z;
  } else {
    const helio = orbitToEcliptic(
      elements[planet as Exclude<PlanetName, "Plüton" | "Ay">](d),
    );
    xh = helio.x;
    yh = helio.y;
    zh = helio.z;
  }
  const s = sunRect(d);
  const xg = xh + s.x;
  const yg = yh + s.y;
  const zg = zh;
  const lon = norm360(Math.atan2(yg, xg) * RAD);
  const lat = Math.atan2(zg, Math.sqrt(xg * xg + yg * yg)) * RAD;
  const r = Math.sqrt(xg * xg + yg * yg + zg * zg);
  return { lon, lat, r };
}

export interface PlanetRaw {
  name: PlanetName;
  lon: number;
  lat: number;
  speed: number; // günlük boylam değişimi (retro tespiti)
  retrograde: boolean;
}

export const ALL_PLANETS: PlanetName[] = [
  "Güneş",
  "Ay",
  "Merkür",
  "Venüs",
  "Mars",
  "Jüpiter",
  "Satürn",
  "Uranüs",
  "Neptün",
  "Plüton",
];

// Belirli bir tarih için tüm gezegen konumlarını hesapla
export function computePlanets(jd: number): PlanetRaw[] {
  const d = dayNumber(jd);
  const dPrev = dayNumber(jd - 1);
  return ALL_PLANETS.map((name) => {
    const now = geoEcliptic(name, d);
    const prev = geoEcliptic(name, dPrev);
    let speed = now.lon - prev.lon;
    if (speed > 180) speed -= 360;
    if (speed < -180) speed += 360;
    return {
      name,
      lon: now.lon,
      lat: now.lat,
      speed,
      retrograde: speed < 0,
    };
  });
}

// Ekliptik eğimi (derece)
export function obliquity(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
}

// Greenwich ortalama yıldız zamanı (derece)
export function gmst(jd: number): number {
  return norm360(280.46061837 + 360.98564736629 * (jd - 2451545.0));
}

// Yükselen (ASC) ve Tepe Noktası (MC) ekliptik boylamları
export function computeAscMc(
  jd: number,
  latitude: number,
  longitudeEast: number,
): { ascendant: number; midheaven: number; ramc: number } {
  const eps = obliquity(jd);
  const lst = norm360(gmst(jd) + longitudeEast); // yerel yıldız zamanı
  const ramc = lst;

  const mc = norm360(Math.atan2(sind(ramc), cosd(ramc) * cosd(eps)) * RAD);

  const ascRad = Math.atan2(
    cosd(ramc),
    -(sind(ramc) * cosd(eps) + tand(latitude) * sind(eps)),
  );
  let asc = norm360(ascRad * RAD);

  // ASC, MC'den sonraki yarım dairede olmalı (doğu ufku düzeltmesi)
  if (norm360(asc - mc) > 180) {
    asc = norm360(asc + 180);
  }

  return { ascendant: asc, midheaven: mc, ramc };
}
