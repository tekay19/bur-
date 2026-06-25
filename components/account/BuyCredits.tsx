"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CREDIT_PACKS } from "@/lib/creditPacks";

// Giriş yapmış kullanıcı için kredi satın alma (Creem ödeme).
// POST /api/credits {action:"purchase"} → Creem checkout URL'ine yönlendirir.
export function BuyCredits() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function buy(packId: string) {
    setBusy(packId);
    setMsg(null);
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purchase", pack: packId }),
      });
      const data = await res.json();
      if (res.ok && data.checkout_url) {
        // Güvenli ödeme: Creem hosted sayfasına yönlendir.
        window.location.href = data.checkout_url;
        return; // yönlendirme sırasında buton "yükleniyor" kalsın
      }
      if (res.ok) {
        // Test ortamı (Creem yoksa) — kredi doğrudan eklendi.
        setMsg("Kredilerin hesabına eklendi.");
        router.refresh();
      } else {
        setMsg(data.error ?? "Ödeme başlatılamadı.");
      }
    } catch {
      setMsg("Sunucuya ulaşılamadı.");
    }
    setBusy(null);
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {CREDIT_PACKS.map((p) => (
          <div
            key={p.id}
            className={cn(
              "relative flex flex-col rounded-2xl border p-5",
              p.popular
                ? "border-gold/40 bg-gradient-to-b from-gold/10 to-card/40"
                : "border-primary/15 bg-card/50",
            )}
          >
            {p.popular && (
              <span className="absolute -top-2.5 left-5 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-gold-foreground">
                EN POPÜLER
              </span>
            )}
            <p className="font-display text-lg font-semibold">{p.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">${p.price}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {p.credits} analiz · ${(p.price / p.credits).toFixed(2)}/analiz
            </p>
            <button
              type="button"
              disabled={!!busy}
              onClick={() => buy(p.id)}
              className={cn(
                "mt-4 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-60",
                p.popular
                  ? "bg-gradient-to-br from-[hsl(42_95%_62%)] to-[hsl(28_85%_56%)] text-white shadow-lg shadow-amber-500/25"
                  : "bg-gradient-to-br from-primary to-accent text-primary-foreground",
              )}
            >
              {busy === p.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : p.popular ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Satın Al
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Güvenli ödeme <strong>Creem</strong> ile. Fiyatlar USD&apos;dir; bankan
        otomatik TL&apos;ye çevirir. Abonelik yok.
      </p>
      {msg && <p className="mt-2 text-sm text-primary">{msg}</p>}
    </div>
  );
}
