"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { computeResult, QUIZ, type QuizOption } from "@/lib/quiz";
import { getSign, type Sign } from "@/lib/zodiac";

export function ZodiacQuiz() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<QuizOption[]>([]);
  const [result, setResult] = useState<Sign | null>(null);
  const [copied, setCopied] = useState(false);

  // Paylaşılan link (?sonuc=koc) ile doğrudan sonucu göster.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("sonuc");
    if (slug) {
      const s = getSign(slug);
      if (s) setResult(s);
    }
  }, []);

  function choose(opt: QuizOption) {
    const next = [...picked, opt];
    setPicked(next);
    if (step + 1 < QUIZ.length) {
      setStep(step + 1);
    } else {
      const r = computeResult(next);
      setResult(r);
      const url = new URL(window.location.href);
      url.searchParams.set("sonuc", r.slug);
      window.history.replaceState({}, "", url.toString());
    }
  }

  function restart() {
    setStep(0);
    setPicked([]);
    setResult(null);
    setCopied(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("sonuc");
    window.history.replaceState({}, "", url.toString());
  }

  async function share() {
    const url = window.location.href;
    const text = `Ruh burcum ${result?.name} çıktı! Sen de keşfet:`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Burç Kişilik Testi", text, url });
        return;
      } catch {
        /* iptal edildi → kopyalamaya düş */
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

  // --- Sonuç ekranı ---
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-3xl border border-primary/25 bg-card/60 p-6 text-center backdrop-blur-md sm:p-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          Ruh burcun
        </p>
        <div className="mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/25 to-accent/20 text-5xl text-primary ring-1 ring-primary/20">
          <span aria-hidden>{result.glyph}</span>
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight">
          {result.name} Burcu
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.element} · {result.quality} · {result.dates}
        </p>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-foreground/85">
          {result.summary}
        </p>

        <div className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-2">
          {result.traits.slice(0, 4).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1 text-xs text-foreground/80"
            >
              <Sparkles className="h-3 w-3 text-primary" /> {t}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={share} variant="gold" size="lg" className="w-full sm:w-auto">
            <Share2 className="h-4 w-4" />
            {copied ? "Bağlantı kopyalandı!" : "Sonucu paylaş"}
          </Button>
          <Link href={`/burclar/${result.slug}`} className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              Tüm özelliklerini gör
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={restart}
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" /> Testi tekrar çöz
        </button>

        <div className="mt-8 rounded-2xl border border-primary/15 bg-secondary/30 p-5">
          <p className="text-sm text-muted-foreground">
            Bu test güneş burcuna dair eğlenceli bir tahmindir. Gerçek burcunu ve
            tüm haritanı öğrenmek ister misin?
          </p>
          <Link href="/kesfet" className="mt-3 inline-block">
            <Button variant="default" size="sm">
              Ücretsiz doğum haritamı oluştur
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // --- Soru ekranı ---
  const question = QUIZ[step];
  const progress = Math.round((step / QUIZ.length) * 100);

  return (
    <div className="rounded-3xl border border-primary/15 bg-card/50 p-6 backdrop-blur-md sm:p-8">
      {/* İlerleme */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Soru {step + 1} / {QUIZ.length}
          </span>
          <span>%{progress}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            animate={{ width: `${((step + 1) / QUIZ.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-xl font-semibold sm:text-2xl">
            {question.q}
          </h2>
          <div className="mt-5 grid gap-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => choose(opt)}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-card/60 px-5 py-4 text-left text-[15px] transition-all",
                  "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5",
                )}
              >
                <span>{opt.text}</span>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
