import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CREDIT_PACKS } from "@/lib/creditPacks";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";

const PERKS = [
  "Natal harita + transit analizi",
  "Gezegen, ev ve açı skorları",
  "Kariyer, aşk, para, sınav, sağlık",
  "12 aylık zaman çizelgesi",
  "Günlük burç yorumu (ücretsiz üyelikte 15 gün)",
];

export function Pricing() {
  return (
    <Section id="fiyatlar">
      <Reveal>
        <SectionHeading
          eyebrow="Fiyatlar"
          title="Önce ücretsiz dene, sonra kredi yükle"
          description="İlk analiz ücretsiz. Daha fazlası için tek seferlik kredi paketleri — abonelik yok. Güvenli ödeme Creem ile."
        />
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
        {/* Ücretsiz */}
        <Reveal className="flex flex-col rounded-3xl border border-primary/15 bg-card/60 p-6 backdrop-blur-md">
          <p className="text-sm font-semibold text-muted-foreground">Ücretsiz</p>
          <p className="mt-2 font-display text-3xl font-bold">$0</p>
          <p className="mt-1 text-xs text-muted-foreground">İlk analizin bizden</p>
          <ul className="mt-5 flex-1 space-y-2.5 text-sm">
            {PERKS.slice(0, 3).map((p) => (
              <li key={p} className="flex items-start gap-2 text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                {p}
              </li>
            ))}
          </ul>
          <Link href="/kesfet" className="mt-6">
            <Button variant="outline" className="w-full">
              Ücretsiz başla
            </Button>
          </Link>
        </Reveal>

        {/* Kredi paketleri */}
        {CREDIT_PACKS.map((pack) => (
          <Reveal
            key={pack.id}
            className={cn(
              "relative flex flex-col rounded-3xl border p-6 backdrop-blur-md",
              pack.popular
                ? "border-gold/40 bg-gradient-to-b from-gold/10 to-card/60 shadow-xl shadow-gold/10"
                : "border-primary/15 bg-card/60",
            )}
          >
            {pack.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-gold-foreground">
                EN POPÜLER
              </span>
            )}
            <p className="text-sm font-semibold text-muted-foreground">{pack.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">
              ${pack.price}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {pack.credits} analiz · ${(pack.price / pack.credits).toFixed(2)}/analiz
            </p>
            <ul className="mt-5 flex-1 space-y-2.5 text-sm">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-2 text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  {p}
                </li>
              ))}
            </ul>
            {/* Plan seç → önce üyelik → kayıttan sonra gerçek ödeme otomatik başlar */}
            <Link href={`/giris?mode=register&pack=${pack.id}`} className="mt-6">
              <Button
                variant={pack.popular ? "gold" : "default"}
                className="w-full"
              >
                {pack.popular && <Sparkles className="h-4 w-4" />}
                Satın Al
              </Button>
            </Link>
          </Reveal>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-md text-center text-xs text-muted-foreground">
        Fiyatlar USD&apos;dir; bankan otomatik TL&apos;ye çevirir. Abonelik yok,
        gizli ücret yok.
      </p>
    </Section>
  );
}
