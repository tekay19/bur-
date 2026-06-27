"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { allSignsLite, getCompatibility, type CompatResult } from "@/lib/compatibility";

const SIGNS = allSignsLite();

function SignPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (slug: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-center text-sm font-medium text-muted-foreground">{label}</p>
      <div className="grid grid-cols-6 gap-1.5">
        {SIGNS.map((s) => {
          const active = s.slug === value;
          return (
            <button
              key={s.slug}
              onClick={() => onChange(s.slug)}
              title={s.name}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl border px-1 py-2 transition-all",
                active
                  ? "border-primary/50 bg-primary/15"
                  : "border-primary/10 bg-card/50 hover:border-primary/30",
              )}
            >
              <span className={cn("text-lg", active ? "text-primary" : "text-foreground/70")} aria-hidden>
                {s.glyph}
              </span>
              <span className="text-[9px] font-medium leading-none">{s.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const off = C * (1 - score / 100);
  const color = score >= 85 ? "hsl(150 55% 52%)" : score >= 65 ? "hsl(270 75% 66%)" : "hsl(30 85% 62%)";
  return (
    <svg viewBox="0 0 130 130" className="h-36 w-36">
      <circle cx="65" cy="65" r={R} fill="none" stroke="hsl(255 25% 22%)" strokeWidth="10" />
      <motion.circle
        cx="65" cy="65" r={R} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        transform="rotate(-90 65 65)"
        strokeDasharray={C}
        initial={{ strokeDashoffset: C }}
        animate={{ strokeDashoffset: off }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <text x="65" y="60" textAnchor="middle" className="fill-foreground font-display" style={{ fontSize: 30, fontWeight: 700 }}>
        %{score}
      </text>
      <text x="65" y="82" textAnchor="middle" style={{ fontSize: 10, fill: "hsl(272 14% 64%)" }}>
        uyum
      </text>
    </svg>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-foreground/85">{label}</span>
        <span className="text-muted-foreground">%{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function CompatibilityTest() {
  const [s1, setS1] = useState<string | null>(null);
  const [s2, setS2] = useState<string | null>(null);
  const [result, setResult] = useState<CompatResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Paylaşılan link (?s1=koc&s2=boga)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const a = p.get("s1");
    const b = p.get("s2");
    if (a && b) {
      const r = getCompatibility(a, b);
      if (r) {
        setS1(a);
        setS2(b);
        setResult(r);
      }
    }
  }, []);

  useEffect(() => {
    if (s1 && s2) {
      const r = getCompatibility(s1, s2);
      setResult(r);
      const url = new URL(window.location.href);
      url.searchParams.set("s1", s1);
      url.searchParams.set("s2", s2);
      window.history.replaceState({}, "", url.toString());
    }
  }, [s1, s2]);

  async function share() {
    const url = window.location.href;
    const text = result
      ? `${result.a.name} & ${result.b.name} uyumu %${result.score} çıktı! Sen de bak:`
      : "Burç uyumuna bak:";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Burç Uyumu", text, url });
        return;
      } catch {
        /* iptal → kopyala */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* yoksay */
    }
  }

  function reset() {
    setS1(null);
    setS2(null);
    setResult(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("s1");
    url.searchParams.delete("s2");
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-primary/15 bg-card/50 p-6 backdrop-blur-md sm:p-8">
        <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
          <SignPicker label="Senin burcun" value={s1} onChange={setS1} />
          <div className="hidden items-center justify-center pt-10 sm:flex">
            <Heart className="h-6 w-6 text-accent" />
          </div>
          <SignPicker label="Sevdiğinin burcu" value={s2} onChange={setS2} />
        </div>
      </div>

      {result && (
        <motion.div
          key={`${result.a.slug}-${result.b.slug}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-primary/25 bg-card/60 p-6 backdrop-blur-md sm:p-8"
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <span className="text-3xl text-primary" aria-hidden>{result.a.glyph}</span>
            <ScoreRing score={result.score} />
            <span className="text-3xl text-primary" aria-hidden>{result.b.glyph}</span>
          </div>
          <p className="mt-2 text-center font-display text-xl font-bold">
            {result.a.name} <span className="text-accent">&</span> {result.b.name}
          </p>
          <p className="text-center text-sm font-medium text-primary">{result.label}</p>

          <p className="mx-auto mt-5 max-w-xl text-center text-[15px] leading-relaxed text-foreground/85">
            {result.verdict}
          </p>

          <div className="mx-auto mt-6 grid max-w-md gap-3">
            <Bar label="Aşk" value={result.sub.ask} />
            <Bar label="İletişim" value={result.sub.iletisim} />
            <Bar label="Güven" value={result.sub.guven} />
            <Bar label="Tutku" value={result.sub.tutku} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
              <p className="mb-2 text-sm font-semibold text-success">Güçlü yanlar</p>
              <ul className="space-y-1.5">
                {result.strengths.map((x) => (
                  <li key={x} className="text-sm text-foreground/85">✓ {x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4">
              <p className="mb-2 text-sm font-semibold text-warning">Dikkat</p>
              <ul className="space-y-1.5">
                {result.challenges.map((x) => (
                  <li key={x} className="text-sm text-foreground/85">! {x}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button onClick={share} variant="gold" size="lg" className="w-full sm:w-auto">
              <Share2 className="h-4 w-4" />
              {copied ? "Bağlantı kopyalandı!" : "Sonucu paylaş"}
            </Button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" /> Yeni eşleşme
            </button>
          </div>

          <div className="mt-7 rounded-2xl border border-primary/15 bg-secondary/30 p-5 text-center">
            <p className="text-sm text-muted-foreground">
              Güneş burcu uyumu eğlencelidir; ama gerçek uyum tüm haritada gizli.
              İkinizin doğum haritasını da çıkarmak ister misin?
            </p>
            <Link href="/kesfet" className="mt-3 inline-block">
              <Button variant="default" size="sm">
                Ücretsiz doğum haritası
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
