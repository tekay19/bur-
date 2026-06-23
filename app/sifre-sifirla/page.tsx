import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata = {
  title: "Şifre Sıfırla — Astrotek AI",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
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
          Yeni <span className="gradient-text">şifren</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Güvenli bir şifre belirle; ardından otomatik giriş yapacaksın.
        </p>
      </div>

      <ResetPasswordForm token={searchParams.token} />
    </main>
  );
}
