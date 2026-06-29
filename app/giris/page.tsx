import Link from "next/link";
import { ChevronLeft, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { AuthForm } from "@/components/AuthForm";

export const metadata = {
  title: "Giriş / Üye Ol — Astrotek AI",
  robots: { index: false, follow: false },
};

export default function AuthPage({
  searchParams,
}: {
  searchParams: { mode?: string; pack?: string; next?: string };
}) {
  const initialMode = searchParams.mode === "register" ? "register" : "login";
  const pack = searchParams.pack;
  const next = searchParams.next;

  return (
    <main className="mx-auto w-full max-w-md px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-sm font-medium text-foreground/85 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Geri
        </Link>
        <BrandLogo size="sm" />
      </div>

      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {initialMode === "register" ? (
            <>
              Hemen <span className="gradient-text">üye ol</span>
            </>
          ) : (
            <>
              Hesabına <span className="gradient-text">giriş</span>
            </>
          )}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {initialMode === "register"
            ? "İlk haritan ücretsiz · kart gerekmez."
            : "Hesabınla giriş yap, kaldığın yerden devam et."}
        </p>
      </div>

      <AuthForm initialMode={initialMode} pack={pack} next={next} />

      {/* Güven şeridi */}
      <ul className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> KVKK uyumlu
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-primary" /> Şifreli & güvenli
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Kartsız üyelik
        </li>
      </ul>

      <p className="mx-auto mt-5 max-w-md text-center text-[11px] leading-relaxed text-muted-foreground/80">
        Kişisel verilerin{" "}
        <Link href="/kvkk" className="underline underline-offset-2 hover:text-foreground">
          KVKK Aydınlatma Metni
        </Link>{" "}
        kapsamında korunur. Devam ederek{" "}
        <Link
          href="/kullanim-kosullari"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Kullanım Koşulları
        </Link>
        ’nı kabul etmiş olursun.
      </p>
    </main>
  );
}
