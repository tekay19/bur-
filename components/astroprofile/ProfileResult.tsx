"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Flame,
  Heart,
  Moon,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  ProfileCategory,
  ProfileResult,
  ProfileSection,
  TraitScore,
} from "@/lib/astroprofile/engine";
import { Radar } from "./Radar";

const CATEGORIES: { key: ProfileCategory; label: string; icon: typeof Sparkles }[] = [
  { key: "portre", label: "Portren", icon: Sparkles },
  { key: "guc", label: "Güç & Gölge", icon: Flame },
  { key: "ask", label: "Aşk & Uyum", icon: Heart },
  { key: "kariyer", label: "Kariyer & Zihin", icon: Briefcase },
  { key: "kehanet", label: "Yıldızların Sözü", icon: Moon },
];

function TraitBar({ t, tone }: { t: TraitScore; tone: "high" | "low" }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-foreground/85">{t.label}</span>
        <span className="text-muted-foreground">{t.value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={
            tone === "high"
              ? "h-full rounded-full bg-gradient-to-r from-primary to-accent"
              : "h-full rounded-full bg-gradient-to-r from-warning/70 to-warning"
          }
          style={{ width: `${t.value}%` }}
        />
      </div>
    </div>
  );
}

function SectionCard({ sec, wide }: { sec: ProfileSection; wide?: boolean }) {
  return (
    <section
      className={`rounded-3xl border border-primary/15 bg-card/50 p-6 backdrop-blur-md ${
        wide ? "lg:col-span-2" : ""
      }`}
    >
      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
        {sec.title}
      </h3>
      <div className="mt-3 space-y-2.5">
        {sec.paragraphs.map((p, j) => (
          <p key={j} className="text-[15px] leading-relaxed text-foreground/85">
            {p}
          </p>
        ))}
      </div>
      {sec.tags && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sec.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProfileResultView({
  result,
  onRestart,
  onShare,
  copied,
}: {
  result: ProfileResult;
  onRestart: () => void;
  onShare: () => void;
  copied: boolean;
}) {
  const [active, setActive] = useState<ProfileCategory>("portre");
  const sectionsFor = (cat: ProfileCategory) =>
    result.sections.filter((s) => s.category === cat);

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/60 to-gold/5 p-6 text-center backdrop-blur-md sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
          AstroProfil™ hazır
        </p>
        <div className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/25 to-accent/20 text-4xl text-primary ring-1 ring-primary/20">
          <span aria-hidden>{result.glyph}</span>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {result.signName} · Kişisel Profilin
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm italic text-muted-foreground">
          “{result.headline}.”
        </p>
      </div>

      {/* Kategori sekmeleri (enine) */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const on = active === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                on
                  ? "border-gold/50 bg-gold/15 text-gold"
                  : "border-primary/15 bg-card/50 text-muted-foreground hover:border-primary/35 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Aktif kategori içeriği */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {active === "portre" ? (
            <div className="grid gap-4">
              {sectionsFor("portre").map((sec) => (
                <SectionCard key={sec.id} sec={sec} />
              ))}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-primary/15 bg-card/50 p-6 backdrop-blur-md">
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                    Kişilik haritan
                  </h3>
                  <Radar scores={result.scores} />
                </div>
                <div className="space-y-5 rounded-3xl border border-primary/15 bg-card/50 p-6 backdrop-blur-md">
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-success">
                      En güçlü 4 yönün
                    </h3>
                    <div className="space-y-3">
                      {result.top.map((t) => (
                        <TraitBar key={t.key} t={t} tone="high" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-warning">
                      Gelişime açık 3 yönün
                    </h3>
                    <div className="space-y-3">
                      {result.low.map((t) => (
                        <TraitBar key={t.key} t={t} tone="low" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {sectionsFor(active).map((sec) => (
                <SectionCard
                  key={sec.id}
                  sec={sec}
                  wide={sec.id === "genel" || sec.id === "kapanis" || !!sec.tags}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Eylemler */}
      <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
        <Button onClick={onShare} variant="gold" size="lg" className="w-full sm:w-auto">
          <Share2 className="h-4 w-4" />
          {copied ? "Bağlantı kopyalandı!" : "Profilimi paylaş"}
        </Button>
        <Link href={`/burclar/${result.signSlug}`} className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full">
            {result.signName} burcunu keşfet
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="text-center">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" /> Testi yeniden çöz
        </button>
      </div>

      {/* CTA */}
      <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/15 via-card/40 to-gold/10 p-6 text-center backdrop-blur-md sm:p-8">
        <p className="mx-auto max-w-lg text-sm text-muted-foreground">
          Bu profil güneş burcun ve kişilik tercihlerine dayanıyor. Yükselen
          burcun, ay burcun ve gezegenlerinle{" "}
          <strong className="text-foreground/90">gerçek doğum haritanı</strong> da
          çıkarmak ister misin?
        </p>
        <Link href="/kesfet" className="mt-4 inline-block">
          <Button variant="default" size="lg">
            Ücretsiz doğum haritamı oluştur
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
