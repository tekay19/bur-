// Dekoratif uzay arka planı — nebula + yıldızlar + gezegenler (CSS/SVG, hafif)
export function SpaceBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Nebula gradyanı */}
      <div className="nebula absolute inset-0" />

      {/* Yıldız katmanları (farklı hız/parlaklık ile derinlik) */}
      <div className="starfield absolute inset-0 animate-twinkle opacity-80" />
      <div
        className="starfield absolute inset-0 opacity-50"
        style={{ backgroundSize: "640px 640px", animationDelay: "1.5s" }}
      />

      {/* Halkalı gezegen (sağ üst) */}
      <div className="absolute -right-10 top-16 h-56 w-56 animate-float opacity-80 sm:right-10">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <radialGradient id="planetA" cx="38%" cy="35%" r="75%">
              <stop offset="0%" stopColor="hsl(330 80% 78%)" />
              <stop offset="55%" stopColor="hsl(290 65% 55%)" />
              <stop offset="100%" stopColor="hsl(265 70% 32%)" />
            </radialGradient>
            <linearGradient id="ringA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(42 90% 70%)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(330 70% 65%)" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <ellipse
            cx="100"
            cy="100"
            rx="92"
            ry="26"
            fill="none"
            stroke="url(#ringA)"
            strokeWidth="6"
            transform="rotate(-22 100 100)"
          />
          <circle cx="100" cy="100" r="46" fill="url(#planetA)" />
          <ellipse
            cx="100"
            cy="100"
            rx="92"
            ry="26"
            fill="none"
            stroke="url(#ringA)"
            strokeWidth="6"
            strokeDasharray="180 400"
            transform="rotate(-22 100 100)"
          />
        </svg>
      </div>

      {/* Küçük parlayan gezegen (sol alt) */}
      <div
        className="absolute -left-8 bottom-24 h-32 w-32 animate-float opacity-70"
        style={{ animationDelay: "2s" }}
      >
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <defs>
            <radialGradient id="planetB" cx="36%" cy="32%" r="75%">
              <stop offset="0%" stopColor="hsl(45 95% 78%)" />
              <stop offset="60%" stopColor="hsl(38 80% 56%)" />
              <stop offset="100%" stopColor="hsl(28 70% 36%)" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="40" fill="hsl(38 80% 60%)" opacity="0.18" />
          <circle cx="60" cy="60" r="28" fill="url(#planetB)" />
        </svg>
      </div>

      {/* Uzak mor gezegen (orta sağ, çok soluk) */}
      <div
        className="absolute right-1/4 top-1/2 h-20 w-20 animate-float opacity-40"
        style={{ animationDelay: "3.5s" }}
      >
        <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-accent blur-[1px]" />
      </div>

      {/* Mistik göz (her şeyi gören göz) — sol üst */}
      <MysticEye className="absolute left-6 top-1/3 h-24 w-36 animate-twinkle opacity-[0.18] sm:left-16" />
      {/* Mistik göz — sağ alt, daha küçük */}
      <MysticEye
        className="absolute bottom-24 right-8 h-16 w-24 animate-twinkle opacity-[0.13]"
        style={{ animationDelay: "2.5s" }}
      />

      {/* Hilal ay — üst orta */}
      <svg
        viewBox="0 0 60 60"
        className="absolute left-1/2 top-12 h-12 w-12 animate-float opacity-50"
        style={{ animationDelay: "1s" }}
      >
        <defs>
          <radialGradient id="moonG" cx="40%" cy="38%" r="70%">
            <stop offset="0%" stopColor="hsl(45 90% 82%)" />
            <stop offset="100%" stopColor="hsl(40 70% 60%)" />
          </radialGradient>
          <mask id="crescent">
            <rect width="60" height="60" fill="white" />
            <circle cx="38" cy="26" r="22" fill="black" />
          </mask>
        </defs>
        <circle cx="28" cy="30" r="22" fill="url(#moonG)" mask="url(#crescent)" />
      </svg>

      {/* Takımyıldız — sağ üst */}
      <svg
        viewBox="0 0 160 120"
        className="absolute right-6 top-24 h-28 w-36 opacity-30 sm:right-24"
      >
        <polyline
          points="10,90 45,60 80,75 110,30 145,45"
          fill="none"
          stroke="hsl(280 60% 80%)"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
        {[
          [10, 90],
          [45, 60],
          [80, 75],
          [110, 30],
          [145, 45],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 3 ? 2.6 : 1.8} fill="hsl(45 90% 80%)" />
        ))}
      </svg>
    </div>
  );
}

// Mistik göz (line-art, ışın saçan iris) — dekoratif
function MysticEye({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const rays = Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180);
  return (
    <svg viewBox="0 0 120 80" className={className} style={style}>
      {/* ışınlar */}
      {rays.map((t, i) => (
        <line
          key={i}
          x1={60 + 26 * Math.cos(t)}
          y1={40 + 26 * Math.sin(t)}
          x2={60 + 34 * Math.cos(t)}
          y2={40 + 34 * Math.sin(t)}
          stroke="hsl(42 85% 66%)"
          strokeWidth="1"
        />
      ))}
      {/* göz dış hatları */}
      <path
        d="M8 40 Q60 6 112 40 Q60 74 8 40 Z"
        fill="none"
        stroke="hsl(42 85% 68%)"
        strokeWidth="1.4"
      />
      {/* iris */}
      <circle cx="60" cy="40" r="17" fill="none" stroke="hsl(280 65% 78%)" strokeWidth="1.2" />
      <circle cx="60" cy="40" r="9" fill="none" stroke="hsl(330 75% 72%)" strokeWidth="1" />
      {/* göz bebeği — yıldız */}
      <circle cx="60" cy="40" r="3.4" fill="hsl(45 90% 78%)" />
    </svg>
  );
}
