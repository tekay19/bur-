import {
  PLANET_GLYPH,
  SIGNS,
  SIGN_ELEMENT,
  SIGN_GLYPH,
} from "@/lib/astrology/constants";
import type { Element, NatalChart } from "@/lib/astrology/types";

// ============================================================
// Natal harita çarkı (SVG) — bürçlar, 12 ev, gezegenler, açılar.
// Yükselen sol (9 yön) konumda; zodyak saat yönünün tersine artar.
// Doğum saati yoksa Koç 0° sola alınır, evler çizilmez.
// ============================================================

const SIZE = 460;
const C = SIZE / 2;

// Yarıçaplar
const R_ZODIAC_OUT = 218;
const R_ZODIAC_IN = 182;
const R_HOUSE = 152; // ev cusp halkası
const R_PLANET = 128; // gezegen halkası
const R_ASPECT = 112; // açı çizgileri bu yarıçaptan

const ELEMENT_COLOR: Record<Element, string> = {
  Ateş: "#f0734b",
  Toprak: "#9b8b5e",
  Hava: "#7aa7e6",
  Su: "#5ec4c0",
};

function polar(lonFromAsc: number, r: number): { x: number; y: number } {
  // Yükselen solda (180°), zodyak CCW artar, aşağı doğru
  const t = (180 + lonFromAsc) * (Math.PI / 180);
  return { x: C + r * Math.cos(t), y: C - r * Math.sin(t) };
}

interface PlacedPlanet {
  name: string;
  glyph: string;
  lon: number; // ekliptik boylam
  rel: number; // yükselene göre
  signDegree: number;
  retro: boolean;
  rOffset: number; // çakışma için yarıçap kaydırması
}

export function NatalWheel({ natal }: { natal: NatalChart }) {
  const hasHouses = natal.meta.hasHouses && natal.ascendant !== null;
  const asc = natal.ascendant ?? 0;

  // Gezegenleri yerleştir (Yükselen/MC hariç — onlar eksen)
  const planets: PlacedPlanet[] = natal.planets
    .filter((p) => p.name !== "Yükselen" && p.name !== "MC")
    .map((p) => ({
      name: p.name,
      glyph: PLANET_GLYPH[p.name] ?? "?",
      lon: p.longitude,
      rel: ((p.longitude - asc) % 360 + 360) % 360,
      signDegree: p.signDegree,
      retro: p.retrograde,
      rOffset: 0,
    }))
    .sort((a, b) => a.rel - b.rel);

  // Çakışma önleme: ardışık gezegenler 9°'den yakınsa yarıçapı kaydır
  for (let i = 1; i < planets.length; i++) {
    if (Math.abs(planets[i].rel - planets[i - 1].rel) < 9) {
      planets[i].rOffset = planets[i - 1].rOffset + 16;
      if (planets[i].rOffset > 32) planets[i].rOffset = 0;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto h-auto w-full max-w-[460px]"
      role="img"
      aria-label="Natal harita çarkı"
    >
      {/* Dış çerçeve */}
      <circle cx={C} cy={C} r={R_ZODIAC_OUT} fill="hsl(256 38% 10%)" stroke="hsl(255 28% 26%)" strokeWidth="1" />
      <circle cx={C} cy={C} r={R_ZODIAC_IN} fill="none" stroke="hsl(255 28% 26%)" strokeWidth="1" />
      <circle cx={C} cy={C} r={R_HOUSE} fill="none" stroke="hsl(255 28% 22%)" strokeWidth="1" />
      <circle cx={C} cy={C} r={R_ASPECT} fill="hsl(256 38% 12%)" stroke="hsl(255 28% 22%)" strokeWidth="1" />

      {/* Zodyak dilimleri */}
      {SIGNS.map((sign, i) => {
        const startLon = i * 30;
        const relStart = ((startLon - asc) % 360 + 360) % 360;
        const a = polar(relStart, R_ZODIAC_IN);
        const b = polar(relStart, R_ZODIAC_OUT);
        const mid = polar(((startLon + 15 - asc) % 360 + 360) % 360, (R_ZODIAC_IN + R_ZODIAC_OUT) / 2);
        const el = SIGN_ELEMENT[sign];
        return (
          <g key={sign}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="hsl(255 28% 26%)" strokeWidth="1" />
            <text
              x={mid.x}
              y={mid.y}
              fill={ELEMENT_COLOR[el]}
              fontSize="17"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {SIGN_GLYPH[sign]}
            </text>
          </g>
        );
      })}

      {/* Ev cuspları */}
      {hasHouses &&
        natal.houses.map((h) => {
          const rel = ((h.cuspLongitude - asc) % 360 + 360) % 360;
          const inner = polar(rel, R_ASPECT);
          const outer = polar(rel, R_HOUSE);
          const isAngular = [1, 4, 7, 10].includes(h.house);
          // Ev numarası: cusp'tan biraz sonra, ev ortasına yakın
          const numRel = ((h.cuspLongitude + 6 - asc) % 360 + 360) % 360;
          const numPos = polar(numRel, R_ASPECT + 12);
          return (
            <g key={h.house}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={isAngular ? "hsl(42 85% 64%)" : "hsl(255 25% 30%)"}
                strokeWidth={isAngular ? 1.6 : 0.8}
              />
              <text
                x={numPos.x}
                y={numPos.y}
                fill="hsl(272 14% 64%)"
                fontSize="9"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {h.house}
              </text>
            </g>
          );
        })}

      {/* Açı çizgileri (merkez) */}
      {natal.aspects
        .filter(
          (a) =>
            a.planet1 !== "Yükselen" &&
            a.planet1 !== "MC" &&
            a.planet2 !== "Yükselen" &&
            a.planet2 !== "MC",
        )
        .map((asp, i) => {
          const p1 = natal.planets.find((p) => p.name === asp.planet1);
          const p2 = natal.planets.find((p) => p.name === asp.planet2);
          if (!p1 || !p2) return null;
          const a = polar(((p1.longitude - asc) % 360 + 360) % 360, R_ASPECT);
          const b = polar(((p2.longitude - asc) % 360 + 360) % 360, R_ASPECT);
          const color =
            asp.polarity === "Destekleyici"
              ? "hsl(152 50% 50%)"
              : asp.polarity === "Zorlayıcı"
                ? "hsl(28 80% 58%)"
                : "hsl(270 75% 70%)";
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={color}
              strokeWidth="0.9"
              strokeOpacity={0.35 + (asp.strength / 100) * 0.4}
            />
          );
        })}

      {/* ASC / MC eksenleri */}
      {hasHouses && (
        <>
          <AxisLabel asc={asc} lon={asc} label="ASC" />
          {natal.midheaven !== null && (
            <AxisLabel asc={asc} lon={natal.midheaven} label="MC" />
          )}
        </>
      )}

      {/* Gezegenler */}
      {planets.map((p) => {
        const pos = polar(p.rel, R_PLANET - p.rOffset);
        const tick = polar(p.rel, R_HOUSE);
        const tickIn = polar(p.rel, R_HOUSE - 6);
        return (
          <g key={p.name}>
            <line x1={tick.x} y1={tick.y} x2={tickIn.x} y2={tickIn.y} stroke="hsl(330 78% 68%)" strokeWidth="1" />
            <text
              x={pos.x}
              y={pos.y}
              fill="hsl(44 90% 72%)"
              fontSize="16"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {p.glyph}
            </text>
            <text
              x={pos.x}
              y={pos.y + 13}
              fill="hsl(272 14% 64%)"
              fontSize="7.5"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {Math.floor(p.signDegree)}°{p.retro ? "℞" : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function AxisLabel({
  asc,
  lon,
  label,
}: {
  asc: number;
  lon: number;
  label: string;
}) {
  const rel = ((lon - asc) % 360 + 360) % 360;
  const pos = polar(rel, R_ZODIAC_OUT - 8);
  return (
    <text
      x={pos.x}
      y={pos.y}
      fill="hsl(42 88% 66%)"
      fontSize="10"
      fontWeight="700"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {label}
    </text>
  );
}
