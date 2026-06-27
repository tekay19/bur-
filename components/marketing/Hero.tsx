import Link from "next/link";
import { ArrowRight, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Orrery } from "./Orrery";
import { Pill } from "./Section";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pb-16 sm:pt-16 lg:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center lg:text-left">
          <Reveal>
            <Pill className="mb-6">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              AI destekli astroloji · Türkçe · Anlaşılır
            </Pill>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              Yıldızların{" "}
              <span className="gradient-text">senin için</span>
              <br className="hidden sm:block" /> ne dediğini öğren
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Doğum bilgini gir; natal haritan, güncel transitlerin ve hayat
              alanların için kişisel AI yorumun saniyeler içinde hazır olsun.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
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
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground lg:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-gold text-gold" />
                İlk analiz ücretsiz
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                Kayıt gerektirmez
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-accent" />
                1 dakikada hazır
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative flex justify-center">
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-primary/20 blur-3xl" />
          <Orrery />
        </Reveal>
      </div>
    </section>
  );
}
