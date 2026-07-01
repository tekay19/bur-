"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SIGNS, getSign } from "@/lib/zodiac";
import { QUESTIONS } from "@/lib/astroprofile/data";
import {
  computeScores,
  generateProfile,
  type ProfileResult,
} from "@/lib/astroprofile/engine";
import { ProfileResultView } from "./ProfileResult";

// Tam ekran, tek-soru-tek-seferde ("Typeform") akışı: kutu/kart yok, dev
// tipografi, harf rozetli seçenekler, otomatik ilerleme + klavye (1-4).
// Burç seçimi + 10 soru TEK sürekli akış sayılır (11 adım, tek ilerleme çubuğu).
type Phase = "sign" | "quiz" | "loading" | "result";

const TOTAL_STEPS = QUESTIONS.length + 1; // burç seçimi + 10 soru
const LETTERS = ["A", "B", "C", "D"];

const LOADING_LINES = [
  "Burç enerjini okuyorum… ✨",
  "Cevaplarını karıştırıyorum… 🔮",
  "Aa, ilginç bir kombinasyon çıktı…",
  "Profilini son kez parlatıyorum…",
];

function FlowProgress({ index }: { index: number }) {
  const pct = Math.round((index / TOTAL_STEPS) * 100);
  return (
    <div className="mx-auto mb-8 max-w-xl">
      <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Adım {index} / {TOTAL_STEPS}
        </span>
        <span>%{pct}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-gold"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

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

  // Soru geçiş animasyonu bitmeden ikinci bir tıklama/tuş gelirse step/answers
  // senkronu bozulabilir (rage-click / çift tuş koruması).
  function choose(optIdx: number) {
    if (transitioning) return;
    const next = [...answers, optIdx];
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) {
      setTransitioning(true);
      setStep(step + 1);
      timers.current.push(setTimeout(() => setTransitioning(false), 500));
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

  // Typeform imzası: klavyeden 1-4 ile de cevaplanabilir.
  useEffect(() => {
    if (phase !== "quiz" || transitioning) return;
    const q = QUESTIONS[step];
    function onKey(e: KeyboardEvent) {
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) choose(n - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, step, transitioning]);

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

  // --- Burç seçimi (akışın 1. adımı — kartsız, tam ekran his) ---
  if (phase === "sign") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-2xl text-center"
      >
        <FlowProgress index={0} />
        <p className="text-sm font-semibold text-gold">✨ İlk adım</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Önce burcunu söyle <span aria-hidden>👀</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Profilinin çıkış noktası burcun — gerisini birazdan vereceğin
          cevaplar şekillendirecek.
        </p>
        <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-6">
          {SIGNS.map((s, i) => (
            <motion.button
              key={s.slug}
              onClick={() => pickSign(s.slug)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.025, 0.25), duration: 0.2 }}
              className="group flex flex-col items-center gap-2"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/40 text-3xl text-primary transition-all duration-200 group-hover:-translate-y-1 group-hover:bg-gold/15 group-hover:text-gold sm:h-[4.5rem] sm:w-[4.5rem]">
                {s.glyph}
              </span>
              <span className="text-xs font-semibold text-foreground/80 group-hover:text-foreground">
                {s.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  // --- Soru (Typeform tarzı: tam ekran his, harf rozetli, kartsız) ---
  if (phase === "quiz") {
    const question = QUESTIONS[step];
    const flowIndex = step + 1;
    return (
      <div className="mx-auto max-w-2xl">
        <FlowProgress index={flowIndex} />

        {/* mode="popLayout" (mode="wait" DEĞİL): yeni soru animasyon
            beklemeden hemen render olur — düşük güç modunda/arka planda
            donma riski olmaz, çıkan soru akıştan çıkarılır. */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -22 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-medium text-gold">
              <span aria-hidden>{question.emoji}</span> Soru {flowIndex} /{" "}
              {QUESTIONS.length}
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {question.q}
            </h2>

            <div className="mt-8 space-y-2">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => choose(i)}
                  disabled={transitioning}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-xl px-3 py-3.5 text-left text-[15px] transition-colors sm:px-4",
                    transitioning
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-secondary/50",
                  )}
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border text-xs font-bold text-muted-foreground transition-colors group-hover:border-gold group-hover:text-gold">
                    {LETTERS[i]}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Klavyeden{" "}
              <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">1</span>
              –
              <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">4</span>{" "}
              tuşlarıyla da seçebilirsin.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // --- "Kahin" hesaplama (kutusuz, sade) ---
  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
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
