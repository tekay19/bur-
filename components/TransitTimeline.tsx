import { CalendarClock, Clock, Moon, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, polarityVariant } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PLANET_GLYPH } from "@/lib/astrology/constants";
import { groupTransits } from "@/lib/astrology/calculateTransits";
import type { AiInterpretation } from "@/lib/ai/prompts";
import type { TransitChart, TransitHit } from "@/lib/astrology/types";

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function TransitCard({ hit }: { hit: TransitHit }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground/90">{hit.theme}</p>
        <Badge variant={polarityVariant(hit.polarity)}>{hit.polarity}</Badge>
      </div>

      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        {hit.note}
      </p>

      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Etki gücü</span>
          <span>{hit.score}/100</span>
        </div>
        <Progress value={hit.score} />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {PLANET_GLYPH[hit.transitPlanet]} {hit.transitPlanet}
          {hit.aspect !== "Geçiş" ? ` · ${hit.target}` : ` · ${hit.target}`}
        </span>
        {hit.aspect !== "Geçiş" && <span>En güçlü: {fmt(hit.window.peak)}</span>}
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  hits,
}: {
  icon: typeof Zap;
  title: string;
  subtitle: string;
  hits: TransitHit[];
}) {
  if (hits.length === 0) return null;
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">{title}</h4>
        <span className="text-xs text-muted-foreground">— {subtitle}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {hits.slice(0, 6).map((h, i) => (
          <TransitCard key={i} hit={h} />
        ))}
      </div>
    </div>
  );
}

export function TransitTimeline({
  transit,
  timeline,
}: {
  transit: TransitChart;
  timeline: AiInterpretation["timeline"];
}) {
  const groups = groupTransits(transit);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Transit Analizi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Section
            icon={Clock}
            title="Uzun vadeli dönemler"
            subtitle="Aylarca sürebilen, hayatına yön veren etkiler"
            hits={groups.slow}
          />
          <Section
            icon={Zap}
            title="Kısa vadeli etkiler"
            subtitle="Birkaç gün–hafta süren, günlük temalar"
            hits={groups.fast}
          />
          <Section
            icon={Moon}
            title="Bugünün ruh hali"
            subtitle="Ay'ın getirdiği günlük duygusal ton"
            hits={groups.moon}
          />
          {transit.hits.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Şu an natal haritana belirgin bir transit açısı bulunmuyor.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Zaman çizelgesi */}
      {timeline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Zaman Çizelgesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-4 border-l border-border pl-6">
              {timeline.map((t, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-background bg-gold" />
                  <div className="rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="strong">{t.period}</Badge>
                      <span className="text-sm font-medium">{t.theme}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {t.advice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
