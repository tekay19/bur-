import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/Disclaimer";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

export function CtaSection() {
  return (
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 px-6 py-14 text-center sm:px-16 sm:py-20">
          {/* Gerçek gece-gökyüzü fotoğrafı + okunabilirlik için degrade örtü */}
          <Image
            src="/images/galaxy.jpg"
            alt="Yıldızlı gökyüzü altında bir kişi"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background/90" />
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative z-10">
          <Moon className="mx-auto mb-5 h-10 w-10 text-gold" />
          <h2 className="mx-auto max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Bugün gökyüzü senin için ne hazırladı?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Birkaç bilgiyle başla; haritan, transitlerin ve AI yorumun
            saniyeler içinde hazır.
          </p>
          <Link href="/harita-olustur" className="mt-8 inline-block">
            <Button variant="gold" size="lg" className="group">
              Ücretsiz Haritamı Oluştur
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Disclaimer
            className="mx-auto mt-10 max-w-xl text-left"
            text="Bu yorumlar astrolojik sembolizm ve kişisel farkındalık amaçlıdır. Kesin gelecek tahmini değildir."
          />
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
