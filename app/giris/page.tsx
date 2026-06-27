import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
          Hesabına <span className="gradient-text">giriş</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Giriş yap ya da saniyeler içinde üye ol.
        </p>
      </div>

      <AuthForm initialMode={initialMode} pack={pack} next={next} />
    </main>
  );
}
