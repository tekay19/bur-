// Dekoratif natal harita çarkı — landing hero (zarif, kozmik, font bağımsız)
export function HeroChart() {
  const C = 200;
  const ticks = Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180);

  // Gezegen noktaları (dekoratif, dengeli dağılım)
  const pts = [
    { deg: 14, r: 110 },
    { deg: 52, r: 74 },
    { deg: 88, r: 102 },
    { deg: 126, r: 62 },
    { deg: 162, r: 96 },
    { deg: 200, r: 112 },
    { deg: 240, r: 78 },
    { deg: 286, r: 104 },
    { deg: 326, r: 68 },
  ].map((p) => {
    const t = (p.deg * Math.PI) / 180;
    return { x: C + p.r * Math.cos(t), y: C + p.r * Math.sin(t) };
  });
  const colors = [
    "hsl(280 60% 92%)",
    "hsl(330 80% 74%)",
    "hsl(42 90% 70%)",
    "hsl(270 80% 78%)",
  ];
  const aspects = [
    [0, 4],
    [1, 5],
    [2, 7],
    [3, 8],
    [4, 8],
    [1, 6],
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[430px]">
      {/* Merkez ışıması (yumuşak, küçük) */}
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-2xl" />
      <svg viewBox="0 0 400 400" className="relative h-full w-full">
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(44 95% 80%)" />
            <stop offset="55%" stopColor="hsl(38 90% 62%)" />
            <stop offset="100%" stopColor="hsl(28 80% 48%)" />
          </radialGradient>
          <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(270 70% 30% / 0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* İç hafif ışıma (dolu disk yok) */}
        <circle cx={C} cy={C} r="120" fill="url(#innerGlow)" />

        {/* Dönen zodyak halkası */}
        <g className="origin-center animate-spin-slower">
          <circle cx={C} cy={C} r="162" fill="none" stroke="hsl(42 80% 60% / 0.5)" strokeWidth="1" />
          <circle cx={C} cy={C} r="150" fill="none" stroke="hsl(270 50% 70% / 0.45)" strokeWidth="1" />
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={C + 150 * Math.cos(t)}
                y1={C + 150 * Math.sin(t)}
                x2={C + 162 * Math.cos(t)}
                y2={C + 162 * Math.sin(t)}
                stroke="hsl(42 85% 64%)"
                strokeWidth={i % 3 === 0 ? 1.4 : 0.7}
                strokeOpacity={i % 3 === 0 ? 0.85 : 0.4}
              />
              <circle
                cx={C + 156 * Math.cos(t)}
                cy={C + 156 * Math.sin(t)}
                r="1.5"
                fill="hsl(330 80% 74%)"
                opacity="0.8"
              />
            </g>
          ))}
        </g>

        {/* Kesik iç çember (derinlik) */}
        <circle
          cx={C}
          cy={C}
          r="122"
          fill="none"
          stroke="hsl(270 50% 70% / 0.25)"
          strokeWidth="1"
          strokeDasharray="2 7"
        />

        {/* Açı çizgileri (zarif ağ) */}
        {aspects.map(([a, b], i) => (
          <line
            key={i}
            x1={pts[a].x}
            y1={pts[a].y}
            x2={pts[b].x}
            y2={pts[b].y}
            stroke={
              i % 3 === 0
                ? "hsl(42 85% 66%)"
                : i % 3 === 1
                  ? "hsl(330 80% 72%)"
                  : "hsl(270 75% 76%)"
            }
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
        ))}

        {/* Gezegen noktaları */}
        {pts.map((p, i) => (
          <g
            key={i}
            className="animate-twinkle"
            style={{ animationDelay: `${i * 0.35}s` }}
          >
            <circle cx={p.x} cy={p.y} r="6" fill={colors[i % 4]} opacity="0.22" />
            <circle cx={p.x} cy={p.y} r="2.6" fill={colors[i % 4]} />
          </g>
        ))}

        {/* Merkez güneş + ışınlar */}
        {Array.from({ length: 8 }, (_, i) => {
          const t = (i * 45 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={C + 20 * Math.cos(t)}
              y1={C + 20 * Math.sin(t)}
              x2={C + 28 * Math.cos(t)}
              y2={C + 28 * Math.sin(t)}
              stroke="hsl(42 90% 66%)"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
          );
        })}
        <circle cx={C} cy={C} r="13" fill="url(#core)" />
        <circle
          cx={C}
          cy={C}
          r="13"
          fill="none"
          stroke="hsl(44 95% 82%)"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
}
