"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarClock,
  GitCompareArrows,
  Home,
  LayoutGrid,
  Moon,
  Sparkles,
  Star,
  Table,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChartSummary } from "@/components/ChartSummary";
import { NatalWheel } from "@/components/NatalWheel";
import { PlanetTable } from "@/components/PlanetTable";
import { HouseAnalysis } from "@/components/HouseAnalysis";
import { AspectTable } from "@/components/AspectTable";
import { TransitTimeline } from "@/components/TransitTimeline";
import { TransitForecast } from "@/components/TransitForecast";
import { ScoreCard, CompactScoreCard } from "@/components/ScoreCard";
import { ExamModule } from "@/components/ExamModule";
import { AiInterpretation } from "@/components/AiInterpretation";
import { Disclaimer } from "@/components/Disclaimer";
import { FOCUS_LABELS } from "@/lib/astrology/constants";
import { formatTR } from "@/lib/utils/date";
import type { AnalysisResult } from "@/lib/analysis";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: AnalysisResult };

const NAV = [
  { id: "summary", label: "Genel Özet", icon: LayoutGrid },
  { id: "scores", label: "Skorlar", icon: Star },
  { id: "exam", label: "Sınav / Atanma", icon: Target },
  { id: "planets", label: "Natal Tablo", icon: Table },
  { id: "houses", label: "Ev Analizi", icon: Home },
  { id: "aspects", label: "Açılar", icon: GitCompareArrows },
  { id: "transits", label: "Transit & Zaman", icon: CalendarClock },
  { id: "ai", label: "AI Yorumu", icon: Sparkles },
];

export function AnalysisDashboard({ id }: { id: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1) İstemci önbelleği
      try {
        const cached = sessionStorage.getItem(`analysis:${id}`);
        if (cached) {
          const data = JSON.parse(cached) as AnalysisResult;
          if (!cancelled) setState({ status: "ready", data });
          return;
        }
      } catch {
        /* yok say */
      }

      // 2) Sunucudan getir (DB varsa)
      try {
        const res = await fetch(`/api/chart?id=${encodeURIComponent(id)}`);
        if (!res.ok) {
          if (!cancelled)
            setState({
              status: "error",
              message:
                "Bu analiz bulunamadı. Bağlantı süresi dolmuş olabilir; lütfen yeni bir harita oluşturun.",
            });
          return;
        }
        const json = await res.json();
        if (!cancelled) setState({ status: "ready", data: json.result });
      } catch {
        if (!cancelled)
          setState({
            status: "error",
            message: "Analiz yüklenemedi. Lütfen tekrar deneyin.",
          });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") return <DashboardSkeleton />;
  if (state.status === "error") return <ErrorView message={state.message} />;

  const { data } = state;
  const { natal, scores, ai, houseAnalysis, transit, forecast, input } = data;
  const showExam =
    input.focusArea === "exam" || input.focusArea === "career";

  const scoreList = [
    scores.career,
    scores.examAppointment,
    scores.relationship,
    scores.money,
    scores.education,
    scores.healthRoutine,
  ];

  return (
    <div className="container py-6 lg:py-8">
      {/* Üst başlık */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Moon className="h-5 w-5 text-gold" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold sm:text-2xl">
              {input.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              {formatTR(new Date(input.birthDate))}
              {input.birthTime && ` • ${input.birthTime}`} • {input.birthPlace}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="strong">{FOCUS_LABELS[input.focusArea]}</Badge>
          <Link href="/harita-olustur">
            <Button variant="outline" size="sm">
              Yeni harita
            </Button>
          </Link>
        </div>
      </header>

      {input.birthTimeAccuracy !== "exact" && (
        <Disclaimer
          className="mb-6"
          text={
            input.birthTimeAccuracy === "unknown"
              ? "Doğum saati bilinmediği için ev ve yükselen yorumları yapılmadı; analiz gezegen burçları ve genel açılara dayanır."
              : "Doğum saati yaklaşık olduğundan ev ve yükselen yorumları kesin değildir."
          }
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sol menü */}
        <aside className="hidden lg:block">
          <nav className="sticky top-6 space-y-1">
            {NAV.filter((n) => n.id !== "exam" || showExam).map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* İçerik */}
        <div className="min-w-0 space-y-12">
          <section id="summary" className="scroll-mt-6 space-y-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <NatalWheel natal={natal} />
                <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-4 rounded-full bg-success" />
                    Destekleyici açı
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-4 rounded-full bg-warning" />
                    Zorlayıcı açı
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-4 rounded-full bg-primary" />
                    Kavuşum
                  </span>
                </div>
                {!natal.meta.hasHouses && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Doğum saati bilinmediği için evler ve yükselen çizilmedi; çark
                    Koç 0° referansıyla gösteriliyor.
                  </p>
                )}
              </CardContent>
            </Card>
            <ChartSummary natal={natal} scores={scores} />
          </section>

          <section id="scores" className="scroll-mt-6 space-y-4">
            <SectionTitle
              icon={Star}
              title="Hayat Alanı Skorları"
              subtitle="Her alanın sembolik destek düzeyi (0-100)"
            />
            <ScoreCard score={scores.overall} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {scoreList.map((s) => (
                <CompactScoreCard key={s.category} score={s} />
              ))}
            </div>
          </section>

          {showExam && (
            <section id="exam" className="scroll-mt-6">
              <ExamModule scores={scores} aiText={ai.examAppointment} />
            </section>
          )}

          <section id="planets" className="scroll-mt-6">
            <PlanetTable natal={natal} />
          </section>

          <section id="houses" className="scroll-mt-6">
            <HouseAnalysis
              houses={houseAnalysis}
              hasHouses={natal.meta.hasHouses}
            />
          </section>

          <section id="aspects" className="scroll-mt-6">
            <AspectTable natal={natal} />
          </section>

          <section id="transits" className="scroll-mt-6 space-y-6">
            <TransitForecast forecast={forecast ?? []} />
            <TransitTimeline transit={transit} timeline={ai.timeline} />
          </section>

          <section id="ai" className="scroll-mt-6">
            <AiInterpretation ai={ai} />
          </section>

          <Disclaimer text="Bu yorumlar astrolojik sembolizm ve eğlence/kişisel farkındalık amaçlıdır. Kesin gelecek tahmini değildir. Sağlık, hukuki ve finansal kararlarda uzmana danışın." />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Star;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
      <div>
        <h2 className="font-display text-lg font-semibold leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container py-8">
      <Skeleton className="mb-6 h-12 w-64" />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Skeleton className="hidden h-80 lg:block" />
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-8">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertCircle className="h-7 w-7" />
          </div>
          <p className="text-muted-foreground">{message}</p>
          <Link href="/harita-olustur">
            <Button variant="gold">Yeni harita oluştur</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
