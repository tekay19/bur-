import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, strengthVariant } from "@/components/ui/badge";
import { PLANET_GLYPH, SIGN_GLYPH } from "@/lib/astrology/constants";
import { formatDegree } from "@/lib/utils/date";
import type { NatalChart } from "@/lib/astrology/types";

export function PlanetTable({ natal }: { natal: NatalChart }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Natal Harita Tablosu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Gezegen</th>
                <th className="pb-2 pr-3 font-medium">Burç</th>
                <th className="pb-2 pr-3 font-medium">Derece</th>
                <th className="pb-2 pr-3 font-medium">Ev</th>
                <th className="pb-2 pr-3 font-medium">Retro</th>
                <th className="pb-2 pr-3 font-medium">Güç</th>
                <th className="pb-2 font-medium">Kısa Yorum</th>
              </tr>
            </thead>
            <tbody>
              {natal.planets.map((p) => (
                <tr
                  key={p.name}
                  className="border-b border-border/30 last:border-0 odd:bg-secondary/20"
                >
                  <td className="py-2.5 pr-3 font-medium">
                    <span className="mr-1.5 text-muted-foreground">
                      {PLANET_GLYPH[p.name]}
                    </span>
                    {p.name}
                  </td>
                  <td className="py-2.5 pr-3">
                    {SIGN_GLYPH[p.sign]} {p.sign}
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums text-muted-foreground">
                    {formatDegree(p.signDegree)}
                  </td>
                  <td className="py-2.5 pr-3 text-muted-foreground">
                    {p.house ? `${p.house}. ev` : "—"}
                  </td>
                  <td className="py-2.5 pr-3">
                    {p.retrograde ? (
                      <Badge variant="challenging">℞</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3">
                    {p.strength && (
                      <Badge variant={strengthVariant(p.strength)}>
                        {p.strength}
                      </Badge>
                    )}
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground">
                    {p.dignity?.status !== "Nötr"
                      ? `${p.dignity?.status} • `
                      : ""}
                    {p.sign} enerjisiyle çalışıyor
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!natal.meta.hasHouses && (
          <p className="mt-3 text-xs text-muted-foreground">
            Doğum saati bilinmediği için ev sütunu boş bırakıldı.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
