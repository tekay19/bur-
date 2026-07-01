"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  ChevronLeft,
  ChevronRight,
  Heart,
  Rabbit,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Section, SectionHeading } from "./Section";
import { Reveal, RevealGroup } from "./Reveal";

const TESTS = [
  {
    href: "/astroprofil",
    badge: "AstroProfil™",
    category: "Kişilik Analizi",
    icon: Brain,
    title: "Dinamik Kişilik Analizi",
    desc: "Burcun ile kişilik tercihlerini birleştiren derin analiz. 12 özellik, 10 soru; karar verme tarzın, ilişki stilin, kariyer eğilimin ve daha fazlası.",
    cta: "Analize Başla",
    featured: true,
    minutes: "~2 dk",
  },
  {
    href: "/uyumluluk",
    badge: "Aşk Testi",
    category: "Uyum Testi",
    icon: Heart,
    title: "Burç Uyumu Testi",
    desc: "Senin burcun ve sevdiğinin burcunu seç; aşk, iletişim, güven ve tutku uyumunuzu yüzdeyle anında öğren ve paylaş.",
    cta: "Uyuma Bak",
    featured: false,
    minutes: "~30 sn",
  },
  {
    href: "/test",
    badge: "Eğlenceli Test",
    category: "Eğlenceli Test",
    icon: Sparkles,
    title: "Ruh Burcun Hangisi?",
    desc: "8 kısa, eğlenceli soru. Kişiliğine en çok hangi burç uyuyor? Hızlıca keşfet ve sonucunu arkadaşlarınla paylaş.",
    cta: "Teste Başla",
    featured: false,
    minutes: "~1 dk",
  },
  {
    href: "/cin-burcu",
    badge: "Çin Astrolojisi",
    category: "Eğlenceli Test",
    icon: Rabbit,
    title: "Çin Burcun Ne?",
    desc: "Doğum yılını gir, 12 Çin burcundan (Ejderha, Kaplan, Tavşan…) hangisi olduğunu, özelliklerini ve uyumlu hayvanları anında öğren.",
    cta: "Yılını Gir",
    featured: false,
    minutes: "~15 sn",
  },
];

const CATEGORIES = ["Tümü", ...Array.from(new Set(TESTS.map((t) => t.category)))];
const PAGE_SIZE = 3;

export function TestsSection({ compact = false }: { compact?: boolean }) {
  if (compact) return <CompactTests />;
  return <FilteredTests />;
}

// --- Diğer sayfalarda kullanılan sade satır (DEĞİŞMEDİ) ---
function CompactTests() {
  return (
    <Section id="testler" className="max-w-none px-0 py-10 sm:px-0 sm:py-12">
      <Reveal>
        <SectionHeading
          eyebrow="Ücretsiz Testler"
          title="Kendini keşfet"
          description="Ücretsiz testlerle astrolojik profilini ve uyumunu keşfet. Anında sonuç al, arkadaşlarınla paylaş."
        />
      </Reveal>

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TESTS.map((t) => (
          <TestCard key={t.href} t={t} />
        ))}
      </RevealGroup>
    </Section>
  );
}

// --- Ana sayfa (giriş): sol filtre + sağda kare kart ızgarası + sayfalama ---
function FilteredTests() {
  const [category, setCategory] = useState("Tümü");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (category === "Tümü" ? TESTS : TESTS.filter((t) => t.category === category)),
    [category],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function selectCategory(cat: string) {
    setCategory(cat);
    setPage(1);
  }

  return (
    <Section id="testler">
      <Reveal>
        <SectionHeading
          eyebrow="Ücretsiz Testler"
          title="Kendini keşfet"
          description="Ücretsiz testlerle astrolojik profilini ve uyumunu keşfet. Anında sonuç al, arkadaşlarınla paylaş."
        />
      </Reveal>

      <div className="mt-12 flex flex-col gap-8 lg:flex-row">
        {/* Sol: filtre */}
        <aside className="flex-shrink-0 lg:w-56">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kategori
          </p>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "Tümü" ? TESTS.length : TESTS.filter((t) => t.category === cat).length;
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => selectCategory(cat)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <span>{cat}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[11px]",
                      active ? "bg-primary/20" : "bg-secondary",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Sağ: kare kart ızgarası + sayfalama */}
        <div className="min-w-0 flex-1">
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((t) => (
              <SquareTestCard key={t.href} t={t} />
            ))}
          </RevealGroup>

          {pageItems.length === 0 && (
            <p className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">
              Bu kategoride henüz test yok.
            </p>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Önceki sayfa"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === page}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    p === page
                      ? "bg-gold text-gold-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Sonraki sayfa"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

type Test = (typeof TESTS)[number];

function TestCard({ t }: { t: Test }) {
  const Icon = t.icon;
  return (
    <Reveal as="div" className="h-full">
      <Link href={t.href} className="group block h-full">
        <article
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 sm:p-8",
            t.featured
              ? "border-gold/40 bg-gradient-to-br from-gold/10 via-card/60 to-primary/10 hover:border-gold/60"
              : "border-primary/20 bg-card/60 hover:border-primary/45",
          )}
        >
          {t.featured && (
            <span className="absolute right-5 top-5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-gold-foreground">
              EN KAPSAMLI
            </span>
          )}
          <div
            className={cn(
              "mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl",
              t.featured
                ? "bg-gradient-to-br from-gold/30 to-primary/20 text-gold ring-1 ring-gold/30"
                : "bg-gradient-to-br from-primary/25 to-accent/20 text-primary ring-1 ring-primary/20",
            )}
          >
            <Icon className="h-6 w-6" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.badge} · {t.minutes}
          </span>
          <h3 className="mt-1 font-display text-xl font-bold tracking-tight sm:text-2xl">
            {t.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>

          <div className="mt-6">
            <Button variant={t.featured ? "gold" : "outline"} className="w-full">
              {t.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </article>
      </Link>
    </Reveal>
  );
}

// Kare (aspect-square) kart — sol filtre + ızgara düzeni için.
function SquareTestCard({ t }: { t: Test }) {
  const Icon = t.icon;
  return (
    <Reveal as="div" className="h-full">
      <Link href={t.href} className="group block h-full">
        <article
          className={cn(
            "flex aspect-square h-full flex-col overflow-hidden rounded-3xl border p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1",
            t.featured
              ? "border-gold/40 bg-gradient-to-br from-gold/10 via-card/60 to-primary/10 hover:border-gold/60"
              : "border-primary/20 bg-card/60 hover:border-primary/45",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                t.featured
                  ? "bg-gradient-to-br from-gold/30 to-primary/20 text-gold ring-1 ring-gold/30"
                  : "bg-gradient-to-br from-primary/25 to-accent/20 text-primary ring-1 ring-primary/20",
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            {t.featured && (
              <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                EN KAPSAMLI
              </span>
            )}
          </div>

          <span className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t.badge} · {t.minutes}
          </span>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight tracking-tight">
            {t.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
            {t.desc}
          </p>

          <div className="mt-4">
            <Button variant={t.featured ? "gold" : "outline"} size="sm" className="w-full">
              {t.cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </article>
      </Link>
    </Reveal>
  );
}
