import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

// Tam genişlikte görsel bant — gerçek bulutsu fotoğrafı + okunabilirlik için
// koyu degrade örtü. next/image ile optimize edilir (self-host, CSP uyumlu).
export function CosmicBand() {
  return (
    <section className="relative my-8 overflow-hidden">
      <div className="relative min-h-[22rem] w-full sm:min-h-[26rem]">
        <Image
          src="/images/nebula.jpg"
          alt="Derin uzayda renkli bir bulutsu"
          fill
          sizes="100vw"
          className="object-cover"
        />
        {/* Okunabilirlik + marka tonu için degrade örtü */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />

        <div className="relative z-10 mx-auto flex h-full min-h-[22rem] w-full max-w-6xl items-center px-4 sm:min-h-[26rem] sm:px-6">
          <Reveal className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">
              Gerçek gök konumları
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Senin doğduğun anın <span className="gradient-text">gökyüzü</span>,
              bugünün rehberi
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              Astrotek AI, NASA-seviyesi astronomik verilerle haritanı çıkarır;
              soyut sembolleri hayatına dair okunabilir içgörülere çevirir.
            </p>
            <Link href="/kesfet" className="mt-7 inline-block">
              <Button variant="gold" size="lg" className="group">
                Haritamı oluştur
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
