"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { animalForYear, type ChineseSign } from "@/lib/chinese";

export function ChineseZodiac() {
  const [year, setYear] = useState("");
  const [result, setResult] = useState<ChineseSign | null>(null);
  const [resultYear, setResultYear] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const y = Number(new URLSearchParams(window.location.search).get("yil"));
    if (y >= 1920 && y <= 2030) {
      setYear(String(y));
      setResult(animalForYear(y));
      setResultYear(y);
    }
  }, []);

  function show() {
    const y = Number(year);
    if (!Number.isInteger(y) || y < 1920 || y > 2030) {
      setErr("1920–2030 arası bir doğum yılı gir.");
      return;
    }
    setErr(null);
    setResult(animalForYear(y));
    setResultYear(y);
    const url = new URL(window.location.href);
    url.searchParams.set("yil", String(y));
    window.history.replaceState({}, "", url.toString());
  }

  function reset() {
    setResult(null);
    setResultYear(null);
    setYear("");
    const url = new URL(window.location.href);
    url.searchParams.delete("yil");
    window.history.replaceState({}, "", url.toString());
  }

  async function share() {
    const url = window.location.href;
    const text = result ? `Çin burcum ${result.name} ${result.emoji} çıktı! Sen de bak:` : "Çin burcuna bak:";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Çin Burcu", text, url });
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

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-primary/15 bg-card/50 p-6 text-center backdrop-blur-md sm:p-8">
        <p className="mb-3 text-sm text-muted-foreground">Doğum yılını gir</p>
        <div className="mx-auto flex max-w-xs items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && show()}
            placeholder="Örn. 1995"
            className="h-12 w-full rounded-xl border border-input bg-secondary/40 px-4 text-center text-lg font-semibold text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [color-scheme:dark]"
          />
          <Button onClick={show} variant="gold" size="lg" className="flex-shrink-0">
            Göster
          </Button>
        </div>
        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
      </div>

      {result && (
        <motion.div
          key={result.slug + resultYear}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-primary/25 bg-card/60 p-6 text-center backdrop-blur-md sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            {resultYear} · Çin Burcun
          </p>
          <div className="mt-3 text-7xl" aria-hidden>{result.emoji}</div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">{result.name}</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-foreground/85">
            {result.summary}
          </p>

          <div className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-2">
            {result.traits.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1 text-xs text-foreground/80">
                <Sparkles className="h-3 w-3 text-primary" /> {t}
              </span>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-left">
            {result.description.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">{p}</p>
            ))}
          </div>

          <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
              <p className="mb-2 text-sm font-semibold text-success">Güçlü yanlar</p>
              <ul className="space-y-1.5">
                {result.strengths.map((x) => <li key={x} className="text-sm text-foreground/85">✓ {x}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4">
              <p className="mb-2 text-sm font-semibold text-warning">Dikkat</p>
              <ul className="space-y-1.5">
                {result.weaknesses.map((x) => <li key={x} className="text-sm text-foreground/85">! {x}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
              Uyumlu: {result.compatible.join(", ")}
            </span>
            <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-gold">
              🎨 Şanslı renk: {result.luckyColor}
            </span>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button onClick={share} variant="gold" size="lg" className="w-full sm:w-auto">
              <Share2 className="h-4 w-4" />
              {copied ? "Bağlantı kopyalandı!" : "Sonucu paylaş"}
            </Button>
            <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <RotateCcw className="h-4 w-4" /> Başka yıl
            </button>
          </div>

          <div className="mt-7 rounded-2xl border border-primary/15 bg-secondary/30 p-5">
            <p className="text-sm text-muted-foreground">
              Çin burcun yıla, Batı burcun aya göredir. İkisini de + doğum
              haritanı keşfetmek ister misin?
            </p>
            <Link href="/kesfet" className="mt-3 inline-block">
              <Button variant="default" size="sm">Ücretsiz doğum haritası <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
