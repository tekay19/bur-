// Soyut yörünge / gezegen animasyonu (saf CSS/SVG, performanslı)
export function OrbitAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative h-[520px] w-[520px] max-w-[90vw] opacity-70">
        {/* Merkez ışık */}
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/70 blur-xl" />
        <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-amber-200 to-gold" />

        {[
          { size: 220, dur: "animate-spin-slow", planet: "bg-primary" },
          { size: 340, dur: "animate-spin-slower", planet: "bg-accent" },
          { size: 470, dur: "animate-spin-slow", planet: "bg-gold" },
        ].map((o, i) => (
          <div
            key={i}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 ${o.dur}`}
            style={{ width: o.size, height: o.size }}
          >
            <div
              className={`absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${o.planet} shadow-lg`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
