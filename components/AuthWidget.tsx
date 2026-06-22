"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Sparkles,
  User as UserIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Me {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
}

export function AuthWidget() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user))
      .catch(() => {});
  }, []);

  // Modal açıkken: Escape ile kapat + Tab odağını modal içinde tut (focus trap)
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const list = Array.from(nodes).filter((el) => !el.hasAttribute("disabled"));
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const t = setTimeout(
      () => modalRef.current?.querySelector<HTMLElement>("input")?.focus(),
      0,
    );
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

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
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "Bir hata oluştu.");
      } else {
        setMe(data.user);
        setOpen(false);
        setEmail("");
        setPassword("");
        setName("");
        router.refresh();
      }
    } catch {
      setErr("Sunucuya ulaşılamadı.");
    }
    setBusy(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setMe(null);
    router.refresh();
  }

  if (me) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold sm:inline">
          {me.plan === "premium" ? "Premium" : `${me.credits} kredi`}
        </span>
        <span className="hidden text-sm text-foreground/80 md:inline">
          {me.name || me.email.split("@")[0]}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          aria-label="Çıkış yap"
          title="Çıkış"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setMode("register");
          setOpen(true);
        }}
      >
        <UserIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Üye Ol</span>
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={mode === "register" ? "Üye Ol" : "Giriş Yap"}
            className="relative w-full max-w-sm rounded-3xl border border-primary/20 bg-card/95 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-5 text-center">
              <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold">
                {mode === "register" ? "Üye Ol" : "Giriş Yap"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "register"
                  ? "Üye ol, +1 ücretsiz analiz + haritalarını kaydet."
                  : "Hesabınla giriş yap."}
              </p>
            </div>

            <form onSubmit={submit} className="space-y-3">
              {mode === "register" && (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adın (opsiyonel)"
                  autoComplete="name"
                />
              )}
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta"
                autoComplete="email"
                required
              />
              <div className="relative">
                <Input
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

            <button
              type="button"
              onClick={() => {
                setErr(null);
                setMode(mode === "register" ? "login" : "register");
              }}
              className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === "register"
                ? "Zaten üye misin? Giriş yap"
                : "Hesabın yok mu? Üye ol"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
