"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIGNS, getSign } from "@/lib/zodiac";
import { QUESTIONS } from "@/lib/astroprofile/data";
import {
  computeScores,
  generateProfile,
  type ProfileResult,
} from "@/lib/astroprofile/engine";
import { ProfileResultView } from "./ProfileResult";

// Not: ayrı bir "hoş geldin" ekranı yok — sayfa başlığı zaten tanıtımı yapıyor,
// bileşen doğrudan burç seçimiyle açılır (bir tıklama azalır, tekrar yok).
type Phase = "sign" | "quiz" | "loading" | "result";

const LOADING_LINES = [
  "Burç enerjini okuyorum… ✨",
  "Cevaplarını karıştırıyorum… 🔮",
  "Aa, ilginç bir kombinasyon çıktı…",
  "Profilini son kez parlatıyorum…",
];

export function AstroProfile() {
  const [phase, setPhase] = useState<Phase>("sign");
  const [signSlug, setSignSlug] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<ProfileResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadLine, setLoadLine] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Paylaşılan link (?b=koc&c=0123…) → aynı profili yeniden üret.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const b = p.get("b");
    const c = p.get("c");
    if (b && c && getSign(b) && /^[0-3]{10}$/.test(c)) {
      const ans = c.split("").map(Number);
      setSignSlug(b);
      setAnswers(ans);
      setResult(generateProfile(b, computeScores(b, ans)));
      setPhase("result");
    }
    return () => timers.current.forEach(clearTimeout);
  }, []);

  function pickSign(slug: string) {
    setSignSlug(slug);
    setStep(0);
    setAnswers([]);
    setPhase("quiz");
  }

  // Soru geçiş animasyonu (~0.28s exit + 0.28s enter) bitmeden ikinci bir
  // tıklama gelirse step/answers senkronu bozulabilir (rage-click koruması).
  function choose(optIdx: number) {
    if (transitioning) return;
    const next = [...answers, optIdx];
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) {
      setTransitioning(true);
      setStep(step + 1);
      timers.current.push(setTimeout(() => setTransitioning(false), 600));
    } else if (signSlug) {
      const res = generateProfile(signSlug, computeScores(signSlug, next));
      setResult(res);
      setPhase("loading");
      setLoadLine(0);
      // "Kahin" hesaplama anı — satırlar sırayla, sonra sonuç.
      LOADING_LINES.forEach((_, i) =>
        timers.current.push(setTimeout(() => setLoadLine(i), i * 600)),
      );
      timers.current.push(
        setTimeout(() => {
          setPhase("result");
          const url = new URL(window.location.href);
          url.searchParams.set("b", signSlug);
          url.searchParams.set("c", next.join(""));
          window.history.replaceState({}, "", url.toString());
        }, 2500),
      );
    }
  }

  function restart() {
    timers.current.forEach(clearTimeout);
    setPhase("sign");
    setSignSlug(null);
    setStep(0);
    setAnswers([]);
    setResult(null);
    setCopied(false);
    setTransitioning(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("b");
    url.searchParams.delete("c");
    window.history.replaceState({}, "", url.toString());
  }

  async function share() {
    const url = window.location.href;
    const text = `AstroProfilim çıktı! ${result?.signName} burcu + kişiliğim. Sen de keşfet:`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "AstroProfil™", text, url });
        return;
      } catch {
        /* iptal → kopyala */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      timers.current.push(setTimeout(() => setCopied(false), 2000));
    } catch {
      /* yoksay */
    }
  }

  // --- Burç seçimi (tek giriş ekranı — kartsız, madalyon-glif tasarım) ---
  if (phase === "sign") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Önce burcunu seç <span aria-hidden>👀</span>
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Profilinin çıkış noktası burcun — gerisini birazdan vereceğin
          cevaplar şekillendirecek.
        </p>
        <div className="mx-auto mt-9 flex max-w-2xl flex-wrap items-start justify-center gap-x-3 gap-y-5 sm:gap-x-5">
          {SIGNS.map((s, i) => (
            <motion.button
              key={s.slug}
              onClick={() => pickSign(s.slug)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.25 }}
              className="group flex w-[4.4rem] flex-col items-center gap-2 sm:w-20"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/10 text-3xl text-primary ring-1 ring-primary/15 transition-all duration-200 group-hover:-translate-y-1 group-hover:from-gold/20 group-hover:to-primary/10 group-hover:text-gold group-hover:ring-gold/40 sm:h-20 sm:w-20">
                {s.glyph}
              </span>
              <span className="text-xs font-semibold text-foreground/85 group-hover:text-foreground">
                {s.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  // --- Test ---
  if (phase === "quiz") {
    const question = QUESTIONS[step];
    const isLast = step === QUESTIONS.length - 1;
    return (
      <div className="rounded-3xl border border-primary/15 bg-card/50 p-6 backdrop-blur-md sm:p-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Soru {step + 1} / {QUESTIONS.length}
              {isLast && " · son soru! 🎉"}
            </span>
            <span>%{Math.round((step / QUESTIONS.length) * 100)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-gold"
              animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* mode="popLayout" (mode="wait" DEĞİL): yeni soru animasyon
            beklemeden hemen render olur — arka plan sekmesi/düşük güç modunda
            rAF duraklarsa bile ekran donmaz, çıkan soru akıştan çıkarılır. */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-primary/15 text-2xl ring-1 ring-gold/20"
                aria-hidden
              >
                {question.emoji}
              </span>
              <h2 className="mt-1 font-display text-xl font-semibold leading-snug sm:text-2xl">
                {question.q}
              </h2>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-primary/15 bg-card/40">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => choose(i)}
                  disabled={transitioning}
                  className={cn(
                    "group flex w-full items-center gap-3 px-5 py-4 text-left text-[15px] transition-colors",
                    i !== 0 && "border-t border-border/50",
                    transitioning
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-gold/10 active:bg-gold/15",
                  )}
                >
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/30 transition-colors group-hover:bg-gold" />
                  <span className="flex-1">{opt.text}</span>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // --- "Kahin" hesaplama ---
  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-primary/20 bg-card/55 p-12 text-center backdrop-blur-md">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary [animation-duration:1.4s]" />
          <div className="absolute inset-0 flex items-center justify-center text-3xl text-primary">
            <span aria-hidden>{result?.glyph ?? "✦"}</span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={loadLine}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-sm font-medium text-foreground/80"
          >
            {LOADING_LINES[loadLine]}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  }

  // --- Sonuç ---
  return result ? (
    <ProfileResultView
      result={result}
      onRestart={restart}
      onShare={share}
      copied={copied}
    />
  ) : null;
}
