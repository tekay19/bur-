"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "register";

// Giriş + Kayıt tek sayfada, sekmeli. (Eski modal'ın sayfa hali.)
export function AuthForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setErr(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error ?? "Bir hata oluştu.");
        setBusy(false);
        return;
      }
      // Başarılı: oturum çerezi set edildi → ana sayfaya dön ve tazele.
      router.push("/");
      router.refresh();
    } catch {
      setErr("Sunucuya ulaşılamadı.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card/85 p-6 backdrop-blur-md sm:p-8">
      {/* Sekme seçici */}
      <div className="mb-6 flex rounded-full border border-border bg-secondary/30 p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            aria-pressed={mode === m}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              mode === m
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "login" ? "Giriş Yap" : "Üye Ol"}
          </button>
        ))}
      </div>

      <p className="mb-5 text-center text-sm text-muted-foreground">
        {mode === "register"
          ? "Üye ol, +1 ücretsiz analiz + haritalarını kaydet."
          : "Hesabınla giriş yap."}
      </p>

      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Adın</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adın (opsiyonel)"
              autoComplete="name"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Şifre</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre (en az 6 karakter)"
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              required
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
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
          ) : mode === "register" ? (
            "Üye Ol"
          ) : (
            "Giriş Yap"
          )}
        </Button>
      </form>

      {mode === "login" && (
        <div className="mt-4 text-center">
          <Link
            href="/sifremi-unuttum"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Şifremi unuttum?
          </Link>
        </div>
      )}
    </div>
  );
}
