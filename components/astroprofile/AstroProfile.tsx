"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SIGNS, getSign } from "@/lib/zodiac";
import { QUESTIONS } from "@/lib/astroprofile/data";
import {
  computeScores,
  generateProfile,
  type ProfileResult,
} from "@/lib/astroprofile/engine";
import { ProfileResultView } from "./ProfileResult";

type Phase = "welcome" | "sign" | "quiz" | "loading" | "result";

const LOADING_LINES = [
  "Burç enerjini okuyorum… ✨",
  "Cevaplarını karıştırıyorum… 🔮",
  "Aa, ilginç bir kombinasyon çıktı…",
  "Profilini son kez parlatıyorum…",
];

export function AstroProfile() {
  const [phase, setPhase] = useState<Phase>("welcome");
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
    setPhase("welcome");
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

  // --- Hoş geldin ---
  if (phase === "welcome") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/55 to-gold/5 p-8 text-center backdrop-blur-md sm:p-12"
      >
        <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />

        <span className="relative inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
          <Sparkles className="h-3.5 w-3.5" /> AstroProfil™
        </span>
        <h2 className="relative mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Burcun seni <span className="gradient-text">tam olarak</span> anlatmıyor
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Milyonlarca insan aynı burçla doğuyor ama hiçbiri birbirinin aynısı
          değil. 10 eğlenceli soruyla burcunu kişiliğinle harmanlıyoruz;{" "}
          <strong className="text-foreground/90">çıkan profil kimseninkine benzemiyor.</strong>{" "}
          Hazır mısın?
        </p>

        <div className="relative mx-auto mt-6 flex max-w-sm flex-wrap items-center justify-center gap-1.5 text-lg text-primary/70" aria-hidden>
          {SIGNS.map((s) => (
            <span key={s.slug}>{s.glyph}</span>
          ))}
        </div>

        <Button onClick={() => setPhase("sign")} variant="gold" size="lg" className="group relative mt-8">
          Hadi Başlayalım
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <p className="relative mt-3 text-xs text-muted-foreground">
          ~2 dakika · Ücretsiz · Kayıt gerekmez
        </p>
      </motion.div>
    );
  }

  // --- Burç seçimi ---
  if (phase === "sign") {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-center font-display text-2xl font-bold tracking-tight">
          Peki, hangi burçtan başlıyoruz? 👀
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
          Burcun profilinin çıkış noktası — gerisini birazdan vereceğin
          cevaplar şekillendirecek.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
          {SIGNS.map((s, i) => (
            <motion.button
              key={s.slug}
              onClick={() => pickSign(s.slug)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.25 }}
              className="flex flex-col items-center gap-1 rounded-2xl border border-primary/10 bg-card/50 px-2 py-4 transition-all hover:-translate-y-1 hover:border-gold/40 hover:bg-gold/5"
            >
              <span className="text-2xl text-primary" aria-hidden>{s.glyph}</span>
              <span className="text-xs font-medium">{s.name}</span>
              <span className="text-[10px] text-muted-foreground">{s.dates.split(" – ")[0]}</span>
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

        <AnimatePresence mode="wait">
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
            <div className="mt-5 grid gap-3">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => choose(i)}
                  disabled={transitioning}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-card/60 px-5 py-4 text-left text-[15px] transition-all",
                    transitioning
                      ? "pointer-events-none opacity-50"
                      : "hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/5 active:scale-[0.99]",
                  )}
                >
                  <span>{opt.text}</span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-gold" />
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
