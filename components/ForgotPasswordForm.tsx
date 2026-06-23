"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSent(true);
      } else {
        setErr(data.error ?? "Bir hata oluştu.");
      }
    } catch {
      setErr("Sunucuya ulaşılamadı.");
    }
    setBusy(false);
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card/85 p-6 text-center backdrop-blur-md sm:p-8">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
          <MailCheck className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl font-semibold">E-postanı kontrol et</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Eğer <strong className="text-foreground">{email}</strong> ile bir hesap
          varsa, şifre sıfırlama bağlantısını gönderdik. Gelen kutunu (ve spam
          klasörünü) kontrol et. Bağlantı 60 dakika geçerlidir.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="outline" size="sm">
            Ana sayfaya dön
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-3xl border border-border/60 bg-card/85 p-6 backdrop-blur-md sm:p-8"
    >
      <div className="space-y-1.5">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresin"
          autoComplete="email"
          required
        />
      </div>

      {err && <p className="text-sm text-destructive">{err}</p>}

      <Button
        type="submit"
        variant="gold"
        size="lg"
        className="w-full"
        disabled={busy}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Sıfırlama Bağlantısı Gönder"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Şifreni hatırladın mı?{" "}
        <Link href="/giris" className="text-foreground hover:underline">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
