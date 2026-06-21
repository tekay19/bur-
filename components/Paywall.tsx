"use client";

import { useState } from "react";
import { Check, KeyRound, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREDIT_PACKS } from "@/lib/creditPacks";

// Kredi bitince gösterilen ödeme/yükleme ekranı (üyeliksiz, test ödeme).
export function Paywall({
  recoveryCode,
  onCredits,
}: {
  recoveryCode?: string;
  onCredits: (credits: number) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function buy(pack: string) {
    setBusy(pack);
    setMsg(null);
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purchase", pack }),
      });
      const data = await res.json();
      if (res.ok) onCredits(data.credits);
      else setMsg(data.error ?? "Bir hata oluştu.");
    } catch {
      setMsg("Sunucuya ulaşılamadı.");
    }
    setBusy(null);
  }

  async function redeem() {
    if (!code.trim()) return;
    setBusy("redeem");
    setMsg(null);
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "redeem", code }),
      });
      const data = await res.json();
      if (res.ok) onCredits(data.credits);
      else setMsg(data.error ?? "Kod bulunamadı.");
    } catch {
      setMsg("Sunucuya ulaşılamadı.");
    }
    setBusy(null);
  }

  return (
    <div className="rounded-3xl border border-gold/30 bg-card/85 p-6 backdrop-blur-md sm:p-8">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 text-gold">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="font-display text-xl font-semibold">
          Ücretsiz hakkın doldu
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Yeni analizler için kredi yükle. Üyelik gerekmez — kredin bu cihaza
          tanımlanır.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {CREDIT_PACKS.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={!!busy}
            onClick={() => buy(p.id)}
            className={`relative flex flex-col items-center rounded-2xl border p-5 text-center transition-all disabled:opacity-60 ${
              p.popular
                ? "border-gold/50 bg-gold/10"
                : "border-border bg-secondary/30 hover:border-gold/40"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-2.5 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                EN POPÜLER
              </span>
            )}
            <span className="font-display text-2xl font-bold">{p.label}</span>
            <span className="mt-1 text-2xl font-bold text-gold">
              ₺{p.price}
            </span>
            <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/80">
              {busy === p.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 text-success" />
              )}
              Satın Al
            </span>
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Şu an <strong>test modu</strong> — gerçek ödeme alınmaz. Iyzico
        entegrasyonu yakında.
      </p>

      {/* Kurtarma kodu */}
      {recoveryCode && (
        <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-3 text-center text-xs">
          <span className="text-muted-foreground">Kurtarma kodun: </span>
          <strong className="text-gold">{recoveryCode}</strong>
          <p className="mt-1 text-muted-foreground/70">
            Bu kodu sakla; çerez silinirse kredilerini geri yüklersin.
          </p>
        </div>
      )}

      {/* Kod ile geri yükleme */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Kurtarma kodu (ASTRO-XXXXXX)"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={redeem}
            disabled={busy === "redeem"}
          >
            <KeyRound className="h-4 w-4" />
            Yükle
          </Button>
        </div>
      </div>

      {msg && (
        <p className="mt-3 text-center text-sm text-destructive">{msg}</p>
      )}
    </div>
  );
}
