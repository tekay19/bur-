import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress, ScoreRing, scoreColor } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import type { ScoreDetail } from "@/lib/astrology/types";

// Sade, derli toplu alan skor kartı (hayat alanı ızgarası için)
export function CompactScoreCard({ score }: { score: ScoreDetail }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{score.category}</span>
        <span
          className="text-lg font-bold tabular-nums"
          style={{ color: scoreColor(score.value) }}
        >
          {score.value}
        </span>
      </div>
      <Progress value={score.value} className="mb-2" />
      <p className="text-xs text-muted-foreground">{score.label}</p>
    </div>
  );
}

export function ScoreCard({ score }: { score: ScoreDetail }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex shrink-0 justify-center">
          <ScoreRing value={score.value} size={104} />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-base font-semibold">
              {score.category}
            </h3>
            <Tooltip content={score.explanation} />
          </div>
          <p className="text-sm font-medium text-foreground/80">
            {score.label}
          </p>

          {score.supporting.length > 0 && (
            <div className="space-y-1">
              {score.supporting.slice(0, 2).map((s, i) => (
                <p
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-success"
                >
                  <TrendingUp className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>{s}</span>
                </p>
              ))}
            </div>
          )}
          {score.challenging.length > 0 && (
            <div className="space-y-1">
              {score.challenging.slice(0, 2).map((s, i) => (
                <p
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-warning"
                >
                  <TrendingDown className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>{s}</span>
                </p>
              ))}
            </div>
          )}
          {score.supporting.length === 0 &&
            score.challenging.length === 0 && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Minus className="h-3 w-3" /> Belirgin gösterge yok.
              </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
