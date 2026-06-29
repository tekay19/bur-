"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CREDIT_PACKS } from "@/lib/creditPacks";

type Mode = "login" | "register";

// Kayıt/giriş sonrası izin verilen site-içi hedefler (açık yönlendirme yok).
// Yalnızca bu sabit liste; başka her şey yok sayılıp /hesap'a düşer.
const SAFE_NEXT = new Set(["harita-olustur", "hesap"]);

// Giriş + Kayıt tek sayfada, sekmeli. (Eski modal'ın sayfa hali.)
// `pack` verilirse (funnel'dan gelen plan seçimi), başarılı kayıt/giriş
// sonrası doğrudan o paketin ödemesi başlatılır.
export function AuthForm({
  initialMode = "login",
  pack,
  next,
}: {
  initialMode?: Mode;
  pack?: string;
  next?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // KVKK / sözleşme onayı (zorunlu) + ticari ileti onayı (opsiyonel, ayrı)
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Funnel'da girilen adı kayıt formuna ön-doldur (kolaylık).
  useEffect(() => {
    try {
      const raw = localStorage.getItem("astro_onboarding");
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data?.name === "string" && data.name.trim())
          setName(data.name);
      }
    } catch {
      /* yoksay */
    }
  }, []);

  // Seçilen paket için Creem ödemesini başlat → ödeme sayfasına yönlendir.
  // Başarısızsa hesap paneline düş (orada tekrar deneyebilir).
  async function startCheckout(packId: string) {
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purchase", pack: packId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
    } catch {
      /* sessizce hesaba düş */
    }
    router.push("/hesap");
    router.refresh();
  }

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setErr(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Üyelikte sözleşme/KVKK onayı zorunlu.
    if (mode === "register" && !acceptedTerms) {
      setErr(
        "Devam etmek için Üyelik Sözleşmesi ve KVKK Aydınlatma Metni’ni onaylaman gerekiyor.",
      );
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          ...(mode === "register" && { kvkkConsent: acceptedTerms, marketing }),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error ?? "Bir hata oluştu.");
        setBusy(false);
        return;
      }
      // Başarılı: oturum çerezi set edildi.
      // Funnel'dan GEÇERLİ bir paket seçildiyse → doğrudan ödemeyi başlat.
      // Paket id'si bilinen listeye doğrulanır (tahrif edilmiş ?pack= reddedilir).
      if (pack && CREDIT_PACKS.some((p) => p.id === pack)) {
        await startCheckout(pack);
        return;
      }
      // `next` yalnızca güvenli allowlist'teyse oraya devam et (açık yönlendirme yok).
      if (next && SAFE_NEXT.has(next)) {
        router.push(`/${next}`);
        router.refresh();
        return;
      }
      // Aksi halde doğrudan hesap paneline (az tıklama).
      router.push("/hesap");
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
              placeholder="Şifre (en az 8 karakter)"
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

        {mode === "register" && (
          <div className="space-y-2.5 pt-1">
            <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-border accent-primary"
              />
              <span>
                <Link
                  href="/kullanim-kosullari"
                  target="_blank"
                  className="text-foreground/90 underline underline-offset-2 hover:text-primary"
                >
                  Üyelik Sözleşmesi
                </Link>
                ,{" "}
                <Link
                  href="/gizlilik"
                  target="_blank"
                  className="text-foreground/90 underline underline-offset-2 hover:text-primary"
                >
                  Gizlilik Politikası
                </Link>{" "}
                ve{" "}
                <Link
                  href="/kvkk"
                  target="_blank"
                  className="text-foreground/90 underline underline-offset-2 hover:text-primary"
                >
                  KVKK Aydınlatma Metni
                </Link>
                ’ni okudum, kabul ediyorum.
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-border accent-primary"
              />
              <span>
                Günlük burç yorumu, kampanya ve yenilik e-postaları almak
                istiyorum. <span className="opacity-70">(İsteğe bağlı — istediğin zaman vazgeçebilirsin.)</span>
              </span>
            </label>
          </div>
        )}

        {err && <p className="text-sm text-destructive">{err}</p>}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full"
          disabled={busy || (mode === "register" && !acceptedTerms)}
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
