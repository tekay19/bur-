import {
  Briefcase,
  Coins,
  GraduationCap,
  Heart,
  HeartPulse,
  Lightbulb,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/Disclaimer";
import type { AiInterpretation as AiType } from "@/lib/ai/prompts";

export function AiInterpretation({ ai }: { ai: AiType }) {
  const sections = [
    { icon: Briefcase, title: "Kariyer", text: ai.career },
    { icon: GraduationCap, title: "Sınav / Atanma", text: ai.examAppointment },
    { icon: Heart, title: "İlişki", text: ai.relationship },
    { icon: Coins, title: "Para", text: ai.money },
    { icon: HeartPulse, title: "Sağlık & Rutin", text: ai.healthRoutine },
  ].filter((s) => s.text && s.text.trim().length > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              AI Yorumu
            </span>
            <Badge variant={ai.source === "ai" ? "strong" : "neutral"}>
              {ai.source === "ai" ? "AI üretimi" : "Kural-tabanlı yorum"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="leading-relaxed text-foreground/90">{ai.summary}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            {ai.strongThemes.length > 0 && (
              <div className="rounded-xl border border-success/25 bg-success/[0.07] p-4">
                <h4 className="mb-2 text-sm font-semibold text-success">
                  Güçlü Temalar
                </h4>
                <ul className="space-y-1.5">
                  {ai.strongThemes.map((t, i) => (
                    <li key={i} className="flex gap-2 text-xs text-foreground/80">
                      <span className="text-success">+</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {ai.challengingThemes.length > 0 && (
              <div className="rounded-xl border border-warning/25 bg-warning/[0.07] p-4">
                <h4 className="mb-2 text-sm font-semibold text-warning">
                  Zorlayıcı Temalar
                </h4>
                <ul className="space-y-1.5">
                  {ai.challengingThemes.map((t, i) => (
                    <li key={i} className="flex gap-2 text-xs text-foreground/80">
                      <span className="text-warning">!</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hayat alanı yorumları */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Card key={s.title}>
            <CardContent className="p-5">
              <div className="mb-2 flex items-center gap-2">
                <s.icon className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold">{s.title}</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {s.text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pratik tavsiyeler */}
      {ai.practicalAdvice.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-gold" />
              Pratik Tavsiyeler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {ai.practicalAdvice.map((a, i) => (
                <li
                  key={i}
                  className="flex gap-2 rounded-lg border border-border bg-secondary/30 p-3 text-sm text-foreground/80"
                >
                  <span className="text-gold">{i + 1}.</span>
                  {a}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Uyarılar */}
      {ai.warnings.length > 0 && (
        <Card>
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-4 w-4 text-warning" />
              <h4 className="text-sm font-semibold">Önemli Notlar</h4>
            </div>
            {ai.warnings.map((w, i) => (
              <Disclaimer key={i} text={w} compact />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
