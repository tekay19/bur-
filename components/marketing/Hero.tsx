import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelPreview } from "./PanelPreview";
import { Pill } from "./Section";
import { Reveal } from "./Reveal";

const AVATARS = ["♌", "♎", "♏", "♓", "♐"];

export function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-10 text-center sm:px-6 sm:pb-16 sm:pt-14 lg:pt-20">
      <Reveal>
        <Pill className="mb-6">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          AI destekli astroloji · Türkçe · Anlaşılır
        </Pill>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4rem]">
          Doğum haritan <span className="gradient-text">hayatın hakkında</span> ne
          biliyor?
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Aşkta, kariyerde ve parada güçlü yönlerini, zorlandığın noktaları ve
          önündeki fırsatları; natal haritan ve güncel transitlerinle sade,
          kişisel bir Türkçe analizde keşfet.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/kesfet" className="w-full sm:w-auto">
            <Button variant="gold" size="lg" className="group w-full sm:w-auto">
              Ücretsiz Haritamı Oluştur
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/#fiyatlar" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Fiyatları gör
            </Button>
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          İlk haritan ücretsiz · ≈1 dakika · kart gerekmez
        </p>
      </Reveal>

      {/* Sosyal kanıt */}
      <Reveal delay={0.2}>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex -space-x-2">
            {AVATARS.map((g) => (
              <span
                key={g}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-background bg-gradient-to-br from-primary/30 to-accent/20 text-xs text-primary"
              >
                {g}
              </span>
            ))}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </span>
            Sade, isabetli yorumlar
          </span>
        </div>
      </Reveal>

      {/* Ürün önizleme — ilk ekranda gerçek paneli göster */}
      <Reveal delay={0.1} className="mt-12 sm:mt-14">
        <PanelPreview />
      </Reveal>
    </section>
  );
}
