"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DayData {
  slug: string;
  name: string;
  glyph: string;
  dateLabel: string;
  genel: string;
  genelEnerji: number;
  tema: string;
  ayEvresi: string;
  gununTavsiyesi: string;
  uyumluBurc: string;
  enerji: { ask: number; kariyer: number; para: number; saglik: number };
}

const SIGN_KEY = "astro_daily_sign";
const DEEP = [
  { key: "ask", label: "Aşk & İlişkiler", emoji: "❤️" },
  { key: "kariyer", label: "Kariyer & Başarı", emoji: "💼" },
  { key: "para", label: "Para & Bolluk", emoji: "💰" },
  { key: "saglik", label: "Sağlık & Enerji", emoji: "🌿" },
] as const;

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < n ? "fill-gold text-gold" : "text-muted-foreground/30"}`}
        />
      ))}
    </span>
  );
}

export function DailyHoroscopeHook({ data }: { data: DayData[] }) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>(data[0]?.slug ?? "koc");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIGN_KEY);
      if (saved && data.some((d) => d.slug === saved)) setSlug(saved);
    } catch {
      /* yoksay */
    }
  }, [data]);

  function pick(s: string) {
    setSlug(s);
    try {
      localStorage.setItem(SIGN_KEY, s);
    } catch {
      /* yoksay */
    }
  }

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
    setBusy(true);
    // E-posta + burç ile kayda yönlendir (günlük yorum e-postası açık gelir).
    const q = new URLSearchParams({
      mode: "register",
      email,
      daily: "1",
      sign: slug,
    });
    router.push(`/giris?${q.toString()}`);
  }

  const d = data.find((x) => x.slug === slug) ?? data[0];
  if (!d) return null;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Burç seçici */}
      <div className="mb-4 grid grid-cols-6 gap-1.5 sm:gap-2">
        {data.map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => pick(s.slug)}
            aria-pressed={s.slug === slug}
            className={`flex flex-col items-center gap-0.5 rounded-xl border px-1 py-2 transition-all ${
              s.slug === slug
                ? "border-gold/50 bg-gold/10 text-gold"
                : "border-primary/10 bg-card/50 text-foreground/70 hover:border-primary/30 hover:text-foreground"
            }`}
          >
            <span className="text-lg" aria-hidden>{s.glyph}</span>
            <span className="text-[9px] font-medium leading-none sm:text-[10px]">{s.name}</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-md">
        {/* Başlık */}
        <div className="flex items-center justify-between gap-3 border-b border-border/50 bg-secondary/20 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 text-2xl text-primary ring-1 ring-primary/20">
              {d.glyph}
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-tight">{d.name}</p>
              <p className="text-[11px] text-muted-foreground">{d.dateLabel}</p>
            </div>
          </div>
          <div className="text-right">
            <Stars n={d.genelEnerji} />
            <p className="mt-0.5 text-[10px] text-muted-foreground">günün enerjisi</p>
          </div>
        </div>

        <div className="p-5">
          {/* Ücretsiz genel yorum */}
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            <Sparkles className="h-3 w-3" /> {d.tema}
          </span>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{d.genel}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-border/60 bg-secondary/30 px-2.5 py-1 text-muted-foreground">
              🌙 {d.ayEvresi}
            </span>
            <span className="rounded-full border border-border/60 bg-secondary/30 px-2.5 py-1 text-muted-foreground">
              ✨ Bugün uyumlu: {d.uyumluBurc}
            </span>
          </div>
          <p className="mt-3 rounded-xl bg-gold/5 px-3 py-2 text-sm text-foreground/85">
            💡 {d.gununTavsiyesi}
          </p>

          {/* Kilitli derin kısım */}
          <div className="relative mt-5 rounded-2xl border border-primary/15 bg-secondary/20 p-4">
            <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gold">
              <Lock className="h-4 w-4" /> Sana özel derin yorum
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {DEEP.map((c) => (
                <div key={c.key} className="flex items-center justify-between gap-2 rounded-xl bg-background/40 px-3 py-2">
                  <span className="text-sm">{c.emoji} {c.label}</span>
                  <Stars n={d.enerji[c.key]} />
                </div>
              ))}
            </div>
            {/* Blur teaser */}
            <p className="mt-3 select-none text-sm leading-relaxed text-foreground/70 blur-[5px]">
              Bugün aşk hayatında beklenmedik bir gelişme kapını çalabilir; Venüs’ün
              konumu sana cesaret veriyor ve kariyer cephesinde önemli bir kapı…
            </p>
            <div className="mt-4 text-center">
              <Link href={`/giris?mode=register&sign=${slug}&daily=1`}>
                <Button variant="gold" size="sm">
                  Üye ol, tam yorumu oku <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="mt-1.5 text-[11px] text-muted-foreground">Ücretsiz · aşk, kariyer, para, sağlık — her gün</p>
            </div>
          </div>

          {/* E-posta yakalama */}
          <form onSubmit={subscribe} className="mt-5 rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <Mail className="h-4 w-4 text-gold" /> Her sabah {d.name} yorumun e-postana gelsin
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresin"
                className="h-11 flex-1 rounded-xl border border-input bg-secondary/40 px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [color-scheme:dark]"
              />
              <Button type="submit" variant="gold" size="lg" disabled={busy} className="flex-shrink-0">
                {busy ? "…" : "Ücretsiz Abone Ol"}
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Spam yok · istediğin an çıkabilirsin</p>
          </form>
        </div>
      </div>
    </div>
  );
}
