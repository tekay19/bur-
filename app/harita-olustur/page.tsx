import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BirthForm } from "@/components/BirthForm";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata = {
  title: "Harita Oluştur — Astrotek AI",
};

export default function CreateChartPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6 sm:py-10">
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
          Haritanı <span className="gradient-text">oluştur</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          4 küçük adım, 1 dakika. Sonra yorumun hazır.
        </p>
      </div>

      <BirthForm />
    </main>
  );
}
