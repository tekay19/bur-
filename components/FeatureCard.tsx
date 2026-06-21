import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  gradient: string; // tailwind gradient renk durakları
  planet: string; // gezegen rengi (hsl)
}

// Otomatik kayan şerit için büyük, görselli özellik kartı
export function FeatureCard({ f }: { f: Feature }) {
  const Icon = f.icon;
  return (
    <article className="relative h-[380px] w-[290px] shrink-0 overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-black/40 sm:w-[340px]">
      {/* Renkli kozmik zemin (resim yerine) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient}`} />
      <div className="absolute inset-0 bg-[hsl(252_50%_6%)]/30" />

      {/* Dekoratif gökyüzü */}
      <svg
        viewBox="0 0 340 380"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`pl-${f.title}`} cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="45%" stopColor={f.planet} stopOpacity="0.95" />
            <stop offset="100%" stopColor={f.planet} stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {/* yıldızlar */}
        {[
          [30, 60],
          [90, 40],
          [160, 80],
          [240, 50],
          [300, 100],
          [60, 150],
          [280, 180],
          [200, 130],
          [120, 110],
          [320, 230],
          [40, 250],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill="white" opacity={0.5 + (i % 3) * 0.15} />
        ))}
        {/* yörünge + gezegen (sağ üst) */}
        <circle cx="250" cy="95" r="62" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="1" />
        <circle cx="250" cy="95" r="44" fill={`url(#pl-${f.title})`} />
        <ellipse cx="250" cy="95" rx="70" ry="18" fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="2" transform="rotate(-20 250 95)" />
      </svg>

      {/* Alt karartma (metin okunurluğu) */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[hsl(252_55%_5%)] via-[hsl(252_55%_5%)]/70 to-transparent" />

      {/* İçerik (altta, poster gibi) */}
      <div className="relative flex h-full flex-col justify-end p-7">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-sm">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-white">
          {f.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/75">{f.desc}</p>
      </div>
    </article>
  );
}
