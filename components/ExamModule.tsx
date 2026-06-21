import { GraduationCap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/progress";
import { Disclaimer } from "@/components/Disclaimer";
import type { ChartScores } from "@/lib/astrology/types";
import type { AiInterpretation } from "@/lib/ai/prompts";

// Sınav / Atanma / Kariyer özel modülü (focusArea exam veya career ise gösterilir)
export function ExamModule({
  scores,
  aiText,
}: {
  scores: ChartScores;
  aiText: string;
}) {
  const exam = scores.examAppointment;
  const career = scores.career;

  const indicators = [
    { label: "Sınav / Atanma", score: exam.value },
    { label: "Kariyer", score: career.value },
    { label: "Eğitim", score: scores.education.value },
  ];

  return (
    <Card className="border-gold/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-gold" />
          Sınav / Atanma / Kariyer Modülü
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <ScoreRing value={exam.value} size={140} label="Atanma" />
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <Badge variant="strong" className="text-sm">
              {exam.label}
            </Badge>
            <p className="text-sm leading-relaxed text-foreground/90">
              {aiText}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {indicators.map((ind) => (
            <div
              key={ind.label}
              className="rounded-xl border border-border bg-secondary/30 p-3 text-center"
            >
              <div className="text-xs text-muted-foreground">{ind.label}</div>
              <div className="mt-1 text-2xl font-bold">{ind.score}</div>
            </div>
          ))}
        </div>

        {/* Göstergeler */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-success/25 bg-success/[0.06] p-4">
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-success">
              <GraduationCap className="h-4 w-4" />
              Destekleyen Göstergeler
            </h4>
            <ul className="space-y-1 text-xs text-foreground/80">
              {exam.supporting.length > 0 ? (
                exam.supporting.map((s, i) => (
                  <li key={i}>+ {s}</li>
                ))
              ) : (
                <li className="text-muted-foreground">Belirgin destek yok.</li>
              )}
            </ul>
          </div>
          <div className="rounded-xl border border-warning/25 bg-warning/[0.06] p-4">
            <h4 className="mb-2 text-sm font-semibold text-warning">
              Zorlayan Göstergeler
            </h4>
            <ul className="space-y-1 text-xs text-foreground/80">
              {exam.challenging.length > 0 ? (
                exam.challenging.map((s, i) => <li key={i}>! {s}</li>)
              ) : (
                <li className="text-muted-foreground">
                  Belirgin engel görünmüyor.
                </li>
              )}
            </ul>
          </div>
        </div>

        <Disclaimer text="Bu modül kesin atanma/başarı garantisi vermez. Skorlar, ilgili ev ve transitlerin sembolik ağırlıklandırmasıdır; planlama ve farkındalık için kullanın." />
      </CardContent>
    </Card>
  );
}
