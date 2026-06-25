import { TRAIT_KEYS, TRAIT_LABELS, type Scores } from "@/lib/astroprofile/data";

// 12 özellikli radar (örümcek) grafiği — özel SVG, bağımlılıksız.
// Kişiye özel "profil" hissini güçlendirir.
const SIZE = 320;
const C = SIZE / 2;
const R = 120;
const LEVELS = 4;

function point(i: number, value: number) {
  const angle = (-90 + i * (360 / TRAIT_KEYS.length)) * (Math.PI / 180);
  const r = (value / 100) * R;
  return { x: C + r * Math.cos(angle), y: C + r * Math.sin(angle) };
}

export function Radar({ scores }: { scores: Scores }) {
  const axes = TRAIT_KEYS.map((k, i) => ({
    key: k,
    label: TRAIT_LABELS[k],
    outer: point(i, 100),
    value: scores[k],
    pt: point(i, scores[k]),
  }));
  const polygon = axes.map((a) => `${a.pt.x},${a.pt.y}`).join(" ");

  return (
    <svg
      viewBox={`-40 -4 ${SIZE + 80} ${SIZE + 8}`}
      className="mx-auto h-auto w-full max-w-[360px]"
      role="img"
      aria-label="Kişilik özellikleri radar grafiği"
    >
      {/* Seviye halkaları */}
      {Array.from({ length: LEVELS }, (_, l) => {
        const rr = (R * (l + 1)) / LEVELS;
        const pts = TRAIT_KEYS.map((_, i) => {
          const a = (-90 + i * (360 / TRAIT_KEYS.length)) * (Math.PI / 180);
          return `${C + rr * Math.cos(a)},${C + rr * Math.sin(a)}`;
        }).join(" ");
        return (
          <polygon
            key={l}
            points={pts}
            fill="none"
            stroke="hsl(255 40% 60% / 0.14)"
            strokeWidth="1"
          />
        );
      })}

      {/* Eksenler + etiketler */}
      {axes.map((a, i) => {
        const lp = point(i, 118);
        const anchor =
          Math.abs(lp.x - C) < 14 ? "middle" : lp.x > C ? "start" : "end";
        return (
          <g key={a.key}>
            <line
              x1={C}
              y1={C}
              x2={a.outer.x}
              y2={a.outer.y}
              stroke="hsl(255 40% 60% / 0.12)"
              strokeWidth="1"
            />
            <text
              x={lp.x}
              y={lp.y}
              fontSize="8.5"
              fill="hsl(272 14% 64%)"
              textAnchor={anchor}
              dominantBaseline="middle"
            >
              {a.label}
            </text>
          </g>
        );
      })}

      {/* Değer alanı */}
      <polygon
        points={polygon}
        fill="hsl(270 75% 66% / 0.28)"
        stroke="hsl(270 80% 70%)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {axes.map((a) => (
        <circle key={a.key} cx={a.pt.x} cy={a.pt.y} r="2.6" fill="hsl(42 92% 64%)" />
      ))}
    </svg>
  );
}
