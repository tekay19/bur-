import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { PaymentResult } from "@/components/PaymentResult";

export const metadata = {
  title: "Ödeme Sonucu — Astrotek AI",
  robots: { index: false, follow: false },
};

export default function PaymentResultPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-sm font-medium text-foreground/85 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Ana sayfa
        </Link>
        <BrandLogo size="sm" />
      </div>
      <PaymentResult />
    </main>
  );
}
