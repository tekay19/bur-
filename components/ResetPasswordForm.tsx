"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Token yoksa form yerine "geçersiz bağlantı" durumu göster.
  if (!token) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-card/85 p-6 text-center backdrop-blur-md sm:p-8">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="font-display text-xl font-semibold">Geçersiz bağlantı</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Bu sıfırlama bağlantısı eksik veya hatalı. Lütfen yeni bir sıfırlama
          isteği gönder.
        </p>
        <Link href="/sifremi-unuttum" className="mt-6 inline-block">
          <Button variant="gold" size="sm">
            Yeni bağlantı iste
          </Button>
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (password.length < 8) {
      setErr("Şifre en az 8 karakter olmalı.");
      return;
    }
    if (password !== confirm) {
      setErr("Şifreler eşleşmiyor.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        // Sunucu auto-login çerezini set etti → ana sayfaya dön ve tazeleyerek
        // oturumlu durumu yansıt.
        router.push("/");
        router.refresh();
        return;
      }
      setErr(data.error ?? "Bir hata oluştu.");
    } catch {
      setErr("Sunucuya ulaşılamadı.");
    }
    setBusy(false);
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-3xl border border-border/60 bg-card/85 p-6 backdrop-blur-md sm:p-8"
    >
      <div className="space-y-1.5">
        <Label htmlFor="password">Yeni şifre</Label>
        <div className="relative">
          <Input
            id="password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="En az 8 karakter"
            autoComplete="new-password"
            required
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
            aria-pressed={show}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm">Yeni şifre (tekrar)</Label>
        <Input
          id="confirm"
          type={show ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Şifreni tekrar yaz"
          autoComplete="new-password"
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
          "Şifreyi Güncelle"
        )}
      </Button>
    </form>
  );
}
