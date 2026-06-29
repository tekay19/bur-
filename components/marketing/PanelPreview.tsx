import { Lock, Sparkles, Star, Table, TrendingDown, TrendingUp } from "lucide-react";

// Gerçek analiz panelinin ("/analiz") sade bir önizleme mockup'ı.
// Amaç: ziyaretçi satın almadan önce "ne alacağını" görsün.
// Statik/temsilî veridir — gerçek panel kişiye özel hesaplanır.

const SCORES = [
  { label: "Aşk & İlişki", value: 86, tone: "high" as const, note: "Venüs–Jüpiter uyumu" },
  { label: "Kariyer & Statü", value: 74, tone: "mid" as const, note: "Güçlü 10. ev" },
  { label: "Para & Bolluk", value: 63, tone: "mid" as const, note: "Dengeli 2. ev" },
  { label: "Sağlık & Enerji", value: 89, tone: "high" as const, note: "Mars desteği" },
];

const ringColor = (v: number) =>
  v >= 80 ? "var(--success, #22c55e)" : v >= 60 ? "var(--gold, #f0b24a)" : "var(--warning, #f59e0b)";

function ScoreRing({ value }: { value: number }) {
  const r = 24;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg viewBox="0 0 60 60" className="h-14 w-14 flex-shrink-0">
      <circle cx="30" cy="30" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-secondary" />
      <circle
        cx="30"
        cy="30"
        r={r}
        fill="none"
        stroke={ringColor(value)}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform="rotate(-90 30 30)"
      />
      <text x="30" y="30" textAnchor="middle" dominantBaseline="central" className="fill-foreground text-[15px] font-bold">
        {value}
      </text>
    </svg>
  );
}

// Sade natal çark (temsilî) — 12 ev çizgisi + birkaç gezegen glifi.
function MiniWheel() {
  const planets = [
    { g: "☉", a: 18 },
    { g: "☽", a: 75 },
    { g: "☿", a: 140 },
    { g: "♀", a: 205 },
    { g: "♂", a: 265 },
    { g: "♃", a: 320 },
  ];
  const pos = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: 100 + radius * Math.cos(rad), y: 100 + radius * Math.sin(rad) };
  };
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="100" r="92" fill="none" stroke="var(--primary, #a78bfa)" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="64" fill="none" stroke="var(--primary, #a78bfa)" strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="100" cy="100" r="22" fill="none" stroke="var(--gold, #f0b24a)" strokeOpacity="0.5" strokeWidth="1" />
      {Array.from({ length: 12 }).map((_, i) => {
        const p1 = pos(i * 30, 64);
        const p2 = pos(i * 30, 92);
        return (
          <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--primary, #a78bfa)" strokeOpacity="0.18" strokeWidth="1" />
        );
      })}
      {planets.map((p) => {
        const { x, y } = pos(p.a, 78);
        return (
          <text key={p.g} x={x} y={y} textAnchor="middle" dominantBaseline="central" className="fill-gold text-[13px]">
            {p.g}
          </text>
        );
      })}
      <text x="100" y="100" textAnchor="middle" dominantBaseline="central" className="fill-foreground text-[18px] font-bold">
        ♌
      </text>
    </svg>
  );
}

export function PanelPreview() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card/70 shadow-2xl shadow-primary/10 backdrop-blur-md">
        {/* Tarayıcı çubuğu */}
        <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/30 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
          <div className="ml-2 flex items-center gap-1.5 rounded-md bg-background/40 px-2.5 py-1 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3" /> astrotekai.com/analiz
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Panel başlığı */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/20 text-lg text-primary ring-1 ring-primary/20">
                ♌
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Aslan · Doğum Haritan</p>
                <p className="text-[11px] text-muted-foreground">Yükselen ♎ Terazi · Ay ♋ Yengeç</p>
              </div>
            </div>
            {/* Sekmeler */}
            <div className="flex gap-1 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 font-medium text-primary">
                <Star className="h-3 w-3" /> Skorlar
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-muted-foreground">
                <Table className="h-3 w-3" /> Natal
              </span>
              <span className="hidden items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-muted-foreground sm:inline-flex">
                <Sparkles className="h-3 w-3" /> Transit
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-5">
            {/* Natal çark */}
            <div className="sm:col-span-2">
              <div className="rounded-2xl border border-border/60 bg-secondary/20 p-3">
                <p className="mb-1 text-[11px] font-medium text-muted-foreground">Natal harita</p>
                <div className="aspect-square w-full">
                  <MiniWheel />
                </div>
              </div>
            </div>

            {/* Hayat alanı skorları */}
            <div className="sm:col-span-3">
              <p className="mb-2 text-[11px] font-medium text-muted-foreground">
                Hayat Alanı Skorları <span className="opacity-60">· 0–100</span>
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {SCORES.map((s) => (
                  <div key={s.label} className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-secondary/20 p-2.5">
                    <ScoreRing value={s.value} />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{s.label}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Yorum parçası */}
          <div className="mt-4 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 to-transparent p-4">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary/80">
              Kişisel yorumun
            </p>
            <p className="text-[13px] leading-relaxed text-foreground/85">
              Aslan güneşin sahne ışığını severken, Terazi yükselenin bunu zarif
              bir denge ile yumuşatıyor. Önümüzdeki dönemde Jüpiter transiti
              ilişkilerinde yeni bir kapı aralıyor…
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                <TrendingUp className="h-3 w-3" /> Venüs–Jüpiter desteği
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
                <TrendingDown className="h-3 w-3" /> Satürn karesi
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Örnek önizleme — gerçek panelin doğum bilgilerine göre kişiye özel hesaplanır.
      </p>
    </div>
  );
}
