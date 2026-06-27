import Link from "next/link";
import {
  Activity,
  Briefcase,
  Check,
  Heart,
  Lock,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Teaser {
  key: "ask" | "kariyer" | "para" | "saglik";
  title: string;
  text: string;
  stars: number;
}

const ICONS = {
  ask: <Heart className="h-4 w-4 text-accent" />,
  kariyer: <Briefcase className="h-4 w-4 text-gold" />,
  para: <Wallet className="h-4 w-4 text-success" />,
  saglik: <Activity className="h-4 w-4 text-primary" />,
};

function MiniStars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < n
              ? "h-3 w-3 fill-gold text-gold"
              : "h-3 w-3 text-muted-foreground/25"
          }
        />
      ))}
    </span>
  );
}

// Gerçek içeriği belli belirsiz gösteren, dönüşüm odaklı premium kilit.
// teasers: arkada blur'lu gösterilecek gerçek (kısaltılmış) yorumlar.
// expired=true: ücretsiz üye 15 günlük denemesini doldurdu → premium'a yönlendir.
export function PremiumLock({
  teasers,
  expired = false,
}: {
  teasers: Teaser[];
  expired?: boolean;
}) {
  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-b from-gold/[0.07] via-card/50 to-card/80 p-1.5 shadow-xl shadow-gold/10">
      <div className="relative overflow-hidden rounded-[1.35rem]">
        {/* Arka planda gerçek yorumlar — okunur gibi ama blur'lu (iştah açar) */}
        <div
          className="pointer-events-none select-none space-y-3 p-5 blur-[6px] sm:p-6"
          aria-hidden
        >
          {teasers.map((t) => (
            <div
              key={t.key}
              className="rounded-2xl border border-primary/15 bg-card/70 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                  {ICONS[t.key]} {t.title}
                </span>
                <MiniStars n={t.stars} />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t.text}
              </p>
            </div>
          ))}
        </div>

        {/* Yumuşak karartma — içeriği üstte hafif, altta tamamen gizler */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-card/40 via-card/70 to-card/95" />

        {/* Parıltı dokunuşları */}
        <Sparkles className="pointer-events-none absolute left-6 top-6 h-4 w-4 text-gold/40" />
        <Star className="pointer-events-none absolute right-8 top-10 h-3 w-3 fill-gold/30 text-gold/30" />

        {/* Öne çıkan kilit kartı */}
        <div className="absolute inset-0 flex items-center justify-center p-5">
          <div className="w-full max-w-md rounded-3xl border border-gold/25 bg-card/80 p-6 text-center backdrop-blur-xl sm:p-7">
            <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/30 to-accent/20 text-gold ring-1 ring-gold/30">
              <span className="absolute inset-0 animate-pulse rounded-2xl bg-gold/10" />
              <Lock className="relative h-6 w-6" />
            </span>

            <h2 className="mt-4 font-display text-xl font-bold tracking-tight sm:text-2xl">
              {expired ? (
                <>
                  Ücretsiz <span className="gradient-text">denemen doldu</span>
                </>
              ) : (
                <>
                  Bugünün <span className="gradient-text">tam yorumu</span> hazır
                </>
              )}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {expired
                ? "15 günlük ücretsiz günlük yorum hakkın bitti. Aşk, kariyer, para yorumların ve haftalık & aylık burcun premium üyelikle devam eder."
                : "Aşk, kariyer ve para yorumun, haftalık & aylık burcun, şanslı renk-sayın — hepsi seni bekliyor."}
            </p>

            <ul className="mx-auto mt-4 grid max-w-xs gap-2 text-left">
              {[
                "Her gün aşk · kariyer · para yorumu",
                "Haftalık & aylık burç yorumu",
                "Şanslı renk, sayı ve e-posta hatırlatma",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0 text-success" />
                  <span className="text-foreground/85">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2.5">
              {expired ? (
                <Link href="/hesap" className="w-full">
                  <Button variant="gold" size="lg" className="w-full">
                    <Sparkles className="h-4 w-4" />
                    Premium&apos;a geç
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/giris?mode=register" className="w-full">
                    <Button variant="gold" size="lg" className="w-full">
                      <Sparkles className="h-4 w-4" />
                      Ücretsiz üye ol — hemen aç
                    </Button>
                  </Link>
                  <Link href="/kesfet" className="w-full">
                    <Button variant="outline" size="lg" className="w-full">
                      Sana özel detaylı analizi al
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {expired
                ? "Üyeliğin sürüyor · premium ile sınırsız günlük yorum"
                : "Üyelik tamamen ücretsiz · 30 saniyede hazır · kart gerekmez"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
