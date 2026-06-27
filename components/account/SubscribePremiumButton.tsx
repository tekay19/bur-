"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Premium aboneliği başlatır → Creem subscription checkout'una yönlendirir.
export function SubscribePremiumButton({
  label = "Premium'a geç",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function subscribe() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "subscribe" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      setErr(data.error ?? "Abonelik başlatılamadı.");
    } catch {
      setErr("Sunucuya ulaşılamadı.");
    }
    setBusy(false);
  }

  return (
    <div className={className}>
      <Button variant="gold" className="w-full" disabled={busy} onClick={subscribe}>
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            {label}
          </>
        )}
      </Button>
      {err && <p className="mt-2 text-center text-xs text-destructive">{err}</p>}
    </div>
  );
}
