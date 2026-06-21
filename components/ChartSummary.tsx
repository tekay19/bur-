import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import {
  PLANET_GLYPH,
  SIGN_GLYPH,
} from "@/lib/astrology/constants";
import type { ChartScores, NatalChart } from "@/lib/astrology/types";

export function ChartSummary({
  natal,
  scores,
}: {
  natal: NatalChart;
  scores: ChartScores;
}) {
  const sun = natal.planets.find((p) => p.name === "Güneş");
  const moon = natal.planets.find((p) => p.name === "Ay");
  const asc =
    natal.ascendant !== null
      ? natal.planets.find((p) => p.name === "Yükselen")
      : null;
  const mc =
    natal.midheaven !== null
      ? natal.planets.find((p) => p.name === "MC")
      : null;

  const highlights = [
    { label: "Güneş", planet: sun, glyph: "☉" },
    { label: "Ay", planet: moon, glyph: "☽" },
    { label: "Yükselen", planet: asc, glyph: "ASC" },
    { label: "MC (Kariyer)", planet: mc, glyph: "MC" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Genel Özet
          <Badge variant="neutral">{natal.meta.adapter} motoru</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ana noktalar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-xl border border-border bg-secondary/30 p-3 text-center"
            >
              <div className="text-xs text-muted-foreground">{h.label}</div>
              {h.planet ? (
                <div className="mt-1">
                  <div className="text-lg font-semibold">
                    {SIGN_GLYPH[h.planet.sign]} {h.planet.sign}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {h.planet.signDegree.toFixed(0)}°
                  </div>
                </div>
              ) : (
                <div className="mt-1 text-xs text-muted-foreground">
                  Saat gerekli
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex justify-center">
            <ScoreRing value={scores.overall.value} size={132} label="Genel" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Baskın element" value={natal.dominants.element} />
              <Stat label="Baskın nitelik" value={natal.dominants.modality} />
            </div>

            <div>
              <div className="mb-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                En güçlü gezegenler
                <Tooltip content="Esansiyel onur ve açı desteğine göre öne çıkan gezegenler." />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {natal.dominants.strongest.map((p) => (
                  <Badge key={p} variant="strong">
                    {PLANET_GLYPH[p]} {p}
                  </Badge>
                ))}
              </div>
            </div>

            {natal.dominants.challenging.length > 0 && (
              <div>
                <div className="mb-1.5 text-xs text-muted-foreground">
                  En zorlayıcı gezegenler
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {natal.dominants.challenging.map((p) => (
                    <Badge key={p} variant="challenging">
                      {PLANET_GLYPH[p]} {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Element dağılımı */}
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(natal.dominants.elementBreakdown).map(([el, v]) => {
            const total = Object.values(natal.dominants.elementBreakdown).reduce(
              (a, b) => a + b,
              0,
            );
            const pct = total ? Math.round((v / total) * 100) : 0;
            return (
              <div
                key={el}
                className="rounded-lg border border-border bg-secondary/30 p-2 text-center"
              >
                <div className="text-xs text-muted-foreground">{el}</div>
                <div className="text-sm font-semibold">%{pct}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-lg font-semibold">{value}</div>
    </div>
  );
}
