import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, polarityVariant } from "@/components/ui/badge";
import { PLANET_GLYPH } from "@/lib/astrology/constants";
import type { AspectType, NatalChart } from "@/lib/astrology/types";

const ASPECT_SYMBOL: Record<AspectType, string> = {
  Kavuşum: "☌",
  Altmışlık: "⚹",
  Kare: "□",
  Üçgen: "△",
  Karşıt: "☍",
};

export function AspectTable({ natal }: { natal: NatalChart }) {
  if (natal.aspects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Açı Analizi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Belirgin major açı bulunamadı.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Açı Analizi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {natal.aspects.map((a, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl border border-border bg-secondary/30 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-muted-foreground">
                    {PLANET_GLYPH[a.planet1]}
                  </span>
                  {a.planet1}
                  <span className="px-1 text-lg text-gold">
                    {ASPECT_SYMBOL[a.type]}
                  </span>
                  <span className="text-muted-foreground">
                    {PLANET_GLYPH[a.planet2]}
                  </span>
                  {a.planet2}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="neutral">{a.type}</Badge>
                <span className="text-xs text-muted-foreground">
                  orb {a.orb}°
                </span>
                <Badge variant={polarityVariant(a.polarity)}>
                  {a.polarity}
                </Badge>
              </div>
              <p className="w-full text-xs text-muted-foreground sm:hidden">
                {a.lifeAreaNote}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Açılar orb (sapma) değerine göre güçten zayıfa sıralanmıştır. Dar
          orb = güçlü etki.
        </p>
      </CardContent>
    </Card>
  );
}
