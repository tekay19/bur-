import { Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, polarityVariant } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PLANET_GLYPH } from "@/lib/astrology/constants";
import { Disclaimer } from "@/components/Disclaimer";
import type { HouseAnalysis as HouseAnalysisType } from "@/lib/astrology/types";

export function HouseAnalysis({
  houses,
  hasHouses,
}: {
  houses: HouseAnalysisType[];
  hasHouses: boolean;
}) {
  if (!hasHouses || houses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ev Analizi</CardTitle>
        </CardHeader>
        <CardContent>
          <Disclaimer text="Doğum saati bilinmediği için ev analizi yapılamadı. Ev ve yükselen yorumları için kesin doğum saati gereklidir." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          Ev Analizi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {houses.map((h) => (
            <div
              key={h.house}
              className="rounded-xl border border-border bg-secondary/30 p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                      {h.house}
                    </span>
                    <span className="text-sm font-semibold">
                      {h.lifeArea.split(",")[0]}
                    </span>
                  </div>
                </div>
                <Badge variant={polarityVariant(h.polarity)}>
                  {h.polarity}
                </Badge>
              </div>

              <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>Yönetici: {h.ruler}</span>
                {h.rulerSign && <span>({h.rulerSign})</span>}
                {h.planetsInHouse.length > 0 && (
                  <span className="flex items-center gap-1">
                    •
                    {h.planetsInHouse.map((p) => (
                      <span key={p} title={p}>
                        {PLANET_GLYPH[p]}
                      </span>
                    ))}
                  </span>
                )}
                <Badge variant={h.active ? "supportive" : "weak"} className="ml-auto">
                  {h.active ? "Çalışıyor" : "Sakin"}
                </Badge>
              </div>

              <Progress value={h.score} className="mb-2" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {h.shortNote}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
