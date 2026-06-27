"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type State =
  | { kind: "loading" }
  | { kind: "success"; credits: number }
  | { kind: "premium" }
  | { kind: "pending" }
  | { kind: "error"; message: string };

// Creem ödeme dönüşü: success_url buraya gelir. Dönüş parametrelerini
// /api/credits/confirm'e gönderir; orada imza + Creem API ile doğrulanıp
// kredi yüklenir (idempotent).
export function PaymentResult() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const search = window.location.search;
    if (!search) {
      setState({ kind: "error", message: "Ödeme bilgisi bulunamadı." });
      return;
    }
    fetch("/api/credits/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ search }),
    })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (r.ok && d.ok && d.premium) setState({ kind: "premium" });
        else if (r.ok && d.ok)
          setState({ kind: "success", credits: d.credits ?? 0 });
        else if (r.ok && d.ok === false) setState({ kind: "pending" });
        else
          setState({
            kind: "error",
            message: d.error ?? "Ödeme doğrulanamadı.",
          });
      })
      .catch(() =>
        setState({ kind: "error", message: "Sunucuya ulaşılamadı." }),
      );
  }, []);

  return (
    <div className="rounded-3xl border border-gold/30 bg-card/85 p-8 text-center backdrop-blur-md">
      {state.kind === "loading" && (
        <>
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-gold" />
          <h1 className="font-display text-xl font-semibold">
            Ödemen doğrulanıyor…
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Bir saniye, kredilerini yüklüyoruz.
          </p>
        </>
      )}

      {state.kind === "success" && (
        <>
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold">Ödeme başarılı 🎉</h1>
          <p className="mt-2 text-muted-foreground">
            Hesabında artık{" "}
            <strong className="text-gold">{state.credits} analiz kredisi</strong>{" "}
            var.
          </p>
          <Link href="/harita-olustur" className="mt-6 inline-block">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Haritamı oluştur
            </Button>
          </Link>
        </>
      )}

      {state.kind === "premium" && (
        <>
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold">
            Premium üyeliğin aktif 🎉
          </h1>
          <p className="mt-2 text-muted-foreground">
            Artık sınırsız günlük yorum, haftalık & aylık burcun ve transit
            içeriklerin açık.
          </p>
          <Link href="/hesap" className="mt-6 inline-block">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Panele git
            </Button>
          </Link>
        </>
      )}

      {state.kind === "pending" && (
        <>
          <Loader2 className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h1 className="font-display text-xl font-semibold">
            Ödeme tamamlanmadı
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            İşlem henüz onaylanmadı. Ödemeyi tamamladıysan birkaç dakika içinde
            kredilerin yüklenir.
          </p>
          <Link href="/" className="mt-6 inline-block">
            <Button variant="outline">Ana sayfaya dön</Button>
          </Link>
        </>
      )}

      {state.kind === "error" && (
        <>
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="font-display text-xl font-semibold">Bir sorun oldu</h1>
          <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ödemen alındıysa kredilerin kısa süre içinde otomatik yüklenir.
          </p>
          <Link href="/" className="mt-6 inline-block">
            <Button variant="outline">Ana sayfaya dön</Button>
          </Link>
        </>
      )}
    </div>
  );
}
