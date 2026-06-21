import { CalendarRange } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, polarityVariant } from "@/components/ui/badge";
import { PLANET_GLYPH } from "@/lib/astrology/constants";
import {
  groupForecastByPeriod,
  type TransitEvent,
} from "@/lib/astrology/transitForecast";

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TransitForecast({ forecast }: { forecast: TransitEvent[] }) {
  if (!forecast || forecast.length === 0) return null;
  const periods = groupForecastByPeriod(forecast).filter(
    (p) => p.events.length > 0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-gold" />
          Yaklaşan Önemli Transitler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xs text-muted-foreground">
          Önümüzdeki 12 ayda yavaş gezegenlerin (Jüpiter, Satürn, Uranüs,
          Neptün, Plüton) natal noktalarına <strong>tam açı yaptığı tarihler</strong>.
          Bu tarihler ilgili temanın en belirgin hissedildiği dönemlerdir.
        </p>

        {periods.map((period) => (
          <div key={period.key}>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="strong">{period.label}</Badge>
              <span className="text-xs text-muted-foreground">
                {period.events.length} transit
              </span>
            </div>
            <div className="space-y-2">
              {period.events.slice(0, 10).map((e, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-secondary/30 p-3"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gold">
                      {fmt(e.exactDate)}
                    </span>
                    <Badge variant={polarityVariant(e.polarity)}>
                      {e.polarity}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{e.theme}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {e.note}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground/60">
                    {PLANET_GLYPH[e.transitPlanet]} {e.transitPlanet} ·{" "}
                    {e.natalTarget}
                    {e.retrograde ? " · geri hareket" : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="text-xs text-muted-foreground">
          Retro (℞) işaretli transitler geri hareketle tekrar değebilir; tema
          birkaç kez gündeme gelebilir. Tarihler yaklaşıktır ve sembolik
          eğilim gösterir; kesin olay tahmini değildir.
        </p>
      </CardContent>
    </Card>
  );
}
