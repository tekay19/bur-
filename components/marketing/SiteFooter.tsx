import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Ürün",
    links: [
      { label: "Harita oluştur", href: "/kesfet" },
      { label: "Özellikler", href: "/#ozellikler" },
      { label: "Fiyatlar", href: "/#fiyatlar" },
    ],
  },
  {
    title: "İçerik",
    links: [
      { label: "Günlük Burç Yorumu", href: "/burc-yorumlari" },
      { label: "AstroProfil™", href: "/astroprofil" },
      { label: "Burçlar", href: "/burclar" },
      { label: "Burç Testi", href: "/test" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Hesap",
    links: [
      { label: "Giriş yap", href: "/giris" },
      { label: "Üye ol", href: "/giris?mode=register" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <BrandLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI destekli, sade Türkçe astroloji. Doğum haritan ve güncel
              etkilerin tek bir akıcı deneyimde.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {year} Astrotek AI · Sembolik analiz, kesin kehanet değildir.</p>
          <p>Türkiye&apos;de sevgiyle tasarlandı ✦</p>
        </div>
      </div>
    </footer>
  );
}
