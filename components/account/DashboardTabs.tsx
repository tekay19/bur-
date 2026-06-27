"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  KeyRound,
  LayoutGrid,
  Moon,
  Plus,
  Settings,
  Sparkles,
  Sun,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuyCredits } from "@/components/account/BuyCredits";
import { LogoutButton } from "@/components/account/LogoutButton";
import { SignPreference } from "@/components/account/SignPreference";
import { SubscribePremiumButton } from "@/components/account/SubscribePremiumButton";
import { PREMIUM_PLAN } from "@/lib/creditPacks";
import { cn } from "@/lib/utils";

type Tab = "panel" | "gunluk" | "analizler" | "ayarlar";

interface DailyReading {
  signSlug: string;
  signName: string;
  glyph: string;
  dateLabel: string;
  genel: string;
}
interface ChartItem {
  id: string;
  name: string;
  birthPlace: string;
  focusArea: string;
  createdAt: number;
}
interface MyChart {
  sun: { sign: string; glyph: string } | null;
  ascendant: { sign: string; glyph: string } | null;
  hasHouses: boolean;
  houses: { house: number; lifeArea: string; score: number; polarity: string }[];
}

const FOCUS: Record<string, string> = {
  general: "Genel",
  career: "Kariyer",
  exam: "Sınav",
  relationship: "İlişki",
  money: "Para",
  education: "Eğitim",
  relocation: "Taşınma",
  spiritual: "Ruhsal",
};

const TABS: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
  { id: "panel", label: "Panel", icon: LayoutGrid },
  { id: "gunluk", label: "Günlük Yorum", icon: Moon },
  { id: "analizler", label: "Analizler", icon: Sparkles },
  { id: "ayarlar", label: "Ayarlar", icon: Settings },
];

function polColor(p: string) {
  return p === "Destekleyici"
    ? "text-success"
    : p === "Zorlayıcı"
      ? "text-warning"
      : "text-muted-foreground";
}

export function DashboardTabs(props: {
  credits: number;
  isPremium: boolean;
  dailyOpen: boolean;
  trialLeft: number;
  prefsSign: string | null;
  prefsDailyEmail: boolean;
  todayReading: DailyReading | null;
  charts: ChartItem[];
  myChart: MyChart | null;
}) {
  const [tab, setTab] = useState<Tab>("panel");

  // Dışarıdan /hesap#kredi ile gelince: Panel sekmesini açıp kredi bölümüne kaydır.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#kredi") {
      setTab("panel");
      // sekme render edildikten sonra kaydır
      const t = setTimeout(() => {
        document.getElementById("kredi")?.scrollIntoView({ behavior: "smooth" });
      }, 60);
      return () => clearTimeout(t);
    }
  }, []);

  const {
    credits,
    isPremium,
    dailyOpen,
    trialLeft,
    prefsSign,
    prefsDailyEmail,
    todayReading,
    charts,
    myChart,
  } = props;

  return (
    <>
      {/* Sekme çubuğu */}
      <nav className="mt-8 flex gap-1 overflow-x-auto rounded-2xl border border-border/60 bg-card/40 p-1.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* ---------------- PANEL ---------------- */}
      {tab === "panel" && (
        <div className="mt-6 space-y-6">
          <section className="grid gap-4 lg:grid-cols-3">
            {/* Harita oluştur */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-card/60 to-primary/15 p-7 lg:col-span-2">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gold/10 blur-3xl"
                aria-hidden
              />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                  <Sparkles className="h-3.5 w-3.5" /> Kişisel analiz
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Yeni doğum haritanı oluştur
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Natal harita, transitler ve hayat alanların için kişisel AI
                  yorumun saniyeler içinde hazır olsun.
                </p>
              </div>
              <Link href="/harita-olustur" className="relative mt-6">
                <Button variant="gold" size="lg" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4" /> Harita oluştur
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Kredi */}
            <div className="flex flex-col rounded-3xl border border-primary/20 bg-card/60 p-7 backdrop-blur-md">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Kredi bakiyen
                </span>
              </div>
              <p className="mt-2 font-display text-5xl font-bold tabular-nums">
                {credits}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Her analiz 1 kredi harcar
              </p>
              <a href="#kredi" className="mt-auto pt-5">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4" /> Kredi yükle
                </Button>
              </a>
            </div>
          </section>

          {/* Senin haritan — burç + yükselen + evler */}
          <section className="rounded-3xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md sm:p-7">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
              <Sun className="h-5 w-5 text-gold" /> Senin haritan
            </h2>

            {myChart ? (
              <div className="space-y-5">
                <div className="flex flex-wrap gap-3">
                  {myChart.sun && (
                    <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-secondary/30 px-4 py-3">
                      <span className="text-2xl text-primary">
                        {myChart.sun.glyph}
                      </span>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Güneş burcun
                        </p>
                        <p className="font-display text-base font-bold">
                          {myChart.sun.sign}
                        </p>
                      </div>
                    </div>
                  )}
                  {myChart.ascendant ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-secondary/30 px-4 py-3">
                      <span className="text-2xl text-accent">
                        {myChart.ascendant.glyph}
                      </span>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Yükselen burcun
                        </p>
                        <p className="font-display text-base font-bold">
                          {myChart.ascendant.sign}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center rounded-2xl border border-border/60 bg-secondary/20 px-4 py-3 text-xs text-muted-foreground">
                      Yükselen için doğum saati gerekli
                    </div>
                  )}
                </div>

                {/* Evler */}
                {myChart.hasHouses && myChart.houses.length > 0 ? (
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground/85">
                      Evlerin
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {myChart.houses.map((h) => (
                        <div
                          key={h.house}
                          className="flex items-center justify-between gap-2 rounded-xl border border-primary/10 bg-card/50 px-3 py-2"
                        >
                          <span className="min-w-0 truncate text-sm">
                            <strong className="text-primary">{h.house}.</strong>{" "}
                            {h.lifeArea.split(",")[0]}
                          </span>
                          <span
                            className={cn(
                              "flex-shrink-0 text-xs font-semibold tabular-nums",
                              polColor(h.polarity),
                            )}
                          >
                            {h.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Ev analizi için doğum saatini girerek yeni bir harita
                    oluştur.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-primary/25 bg-secondary/20 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Henüz haritan yok. Doğum bilgilerinle ilk haritanı oluştur;
                  burcun ve evlerin burada görünsün.
                </p>
                <Link href="/harita-olustur" className="mt-4 inline-block">
                  <Button variant="gold" size="sm">
                    <Plus className="h-4 w-4" /> Haritamı oluştur
                  </Button>
                </Link>
              </div>
            )}
          </section>

          {/* Premium üyelik */}
          {isPremium ? (
            <section className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 to-card/60 p-6 backdrop-blur-md sm:p-7">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-gold">
                <Sparkles className="h-5 w-5" /> Premium üyesin
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sınırsız günlük yorum, haftalık & aylık burcun ve güncel transit
                içeriklerin açık. Teşekkürler! ✨
              </p>
            </section>
          ) : (
            <section className="overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-card/60 to-primary/15 p-6 backdrop-blur-md sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                    <Sparkles className="h-5 w-5 text-gold" /> Premium üyelik
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Günlük yorum + transit, sınırsız.
                  </p>
                </div>
                <p className="font-display text-2xl font-bold">
                  ${PREMIUM_PLAN.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    /{PREMIUM_PLAN.period}
                  </span>
                </p>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {PREMIUM_PLAN.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-gold" />
                    <span className="text-foreground/85">{p}</span>
                  </li>
                ))}
              </ul>
              <SubscribePremiumButton className="mt-5 sm:max-w-xs" />
            </section>
          )}

          {/* Kredi yükle */}
          <section
            id="kredi"
            className="scroll-mt-24 rounded-3xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md sm:p-7"
          >
            <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold">
              <Wallet className="h-5 w-5 text-gold" /> Kredi yükle
            </h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Tek seferlik paketler — abonelik yok. Güvenli ödeme Creem ile.
            </p>
            <BuyCredits />
          </section>
        </div>
      )}

      {/* ---------------- GÜNLÜK YORUM ---------------- */}
      {tab === "gunluk" && (
        <div className="mt-6">
          <section className="rounded-3xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Moon className="h-5 w-5 text-gold" /> Günlük burç yorumun
              </h2>
              {dailyOpen ? (
                !isPremium && (
                  <span className="flex-shrink-0 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11px] font-semibold text-gold">
                    Deneme: {trialLeft} gün
                  </span>
                )
              ) : (
                <span className="flex-shrink-0 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">
                  Deneme doldu
                </span>
              )}
            </div>

            {!dailyOpen ? (
              <div className="mt-4 rounded-2xl border border-gold/25 bg-gold/5 p-5 text-center">
                <p className="text-sm text-foreground/85">
                  15 günlük ücretsiz günlük yorum hakkın doldu. Günlük aşk,
                  kariyer ve para yorumların premium üyelikle devam eder.
                </p>
                <SubscribePremiumButton className="mx-auto mt-3 max-w-xs" />
              </div>
            ) : todayReading ? (
              <Link
                href={`/burc-yorumlari/${todayReading.signSlug}`}
                className="mt-4 block rounded-2xl border border-primary/15 bg-secondary/30 p-5 transition-colors hover:border-primary/40"
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="text-2xl text-primary">
                    {todayReading.glyph}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {todayReading.signName} · Bugün
                    </p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {todayReading.dateLabel}
                    </p>
                  </div>
                  <span className="ml-auto text-xs font-medium text-primary">
                    Tümünü gör →
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">
                  {todayReading.genel}
                </p>
              </Link>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Burcunu seç; her gün sana özel günlük yorumun burada görünsün.
              </p>
            )}

            {dailyOpen && (
              <div className="mt-4">
                <SignPreference
                  initialSign={prefsSign}
                  initialDailyEmail={prefsDailyEmail}
                />
              </div>
            )}
          </section>
        </div>
      )}

      {/* ---------------- ANALİZLER ---------------- */}
      {tab === "analizler" && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              Analizlerim{" "}
              <span className="text-muted-foreground">({charts.length})</span>
            </h2>
            <Link
              href="/harita-olustur"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" /> Yeni
            </Link>
          </div>
          {charts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-primary/25 bg-secondary/20 p-8 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm text-muted-foreground">
                Henüz analizin yok. İlk doğum haritanı oluştur, burada saklansın.
              </p>
              <Link href="/harita-olustur" className="mt-4 inline-block">
                <Button variant="gold" size="sm">
                  <Plus className="h-4 w-4" /> İlk haritamı oluştur
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {charts.map((c) => (
                <Link
                  key={c.id}
                  href={`/analiz/${c.id}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-card/60 p-4 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/15 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {FOCUS[c.focusArea] ?? c.focusArea} · {c.birthPlace}
                      </p>
                    </div>
                  </div>
                  <span className="flex flex-shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(c.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                    })}
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------- AYARLAR ---------------- */}
      {tab === "ayarlar" && (
        <div className="mt-6">
          <section className="rounded-3xl border border-border/60 bg-card/40 p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">
              Hesap ayarları
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/sifremi-unuttum">
                <Button variant="outline" size="sm">
                  <KeyRound className="h-4 w-4" /> Şifre değiştir
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
