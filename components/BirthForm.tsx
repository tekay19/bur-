"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Briefcase,
  Coins,
  GraduationCap,
  Heart,
  MapPin,
  Plane,
  Sparkles,
  Sun,
  Target,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Disclaimer } from "@/components/Disclaimer";
import { LoadingState } from "@/components/LoadingState";
import { listCities } from "@/lib/utils/geocoding";
import { birthFormSchema } from "@/lib/validation";

const MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const CURRENT_YEAR = 2026;
const YEARS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) =>
  String(CURRENT_YEAR - i),
);

const FOCUS_OPTIONS = [
  { value: "general", label: "Genel", icon: Sparkles },
  { value: "career", label: "Kariyer", icon: Briefcase },
  { value: "exam", label: "Sınav / Atanma", icon: Target },
  { value: "relationship", label: "İlişki", icon: Heart },
  { value: "money", label: "Para", icon: Coins },
  { value: "education", label: "Eğitim", icon: GraduationCap },
  { value: "relocation", label: "Taşınma", icon: Plane },
  { value: "spiritual", label: "Ruhsal Dönem", icon: Sun },
] as const;

const ACCURACY = [
  { v: "exact", l: "Kesin" },
  { v: "approx", l: "Yaklaşık" },
  { v: "unknown", l: "Bilmiyorum" },
] as const;

const pad = (n: string) => n.padStart(2, "0");

export function BirthForm() {
  const router = useRouter();
  const cities = useMemo(() => listCities(), []);

  const [f, setF] = useState({
    name: "",
    gender: "",
    day: "",
    month: "",
    year: "",
    hour: "",
    minute: "",
    place: "",
    accuracy: "exact" as "exact" | "approx" | "unknown",
    focus: "general",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const up = (k: keyof typeof f, v: string) => {
    setF((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "", birthDate: "", birthTime: "" }));
  };

  const unknownTime = f.accuracy === "unknown";

  // Seçilen ay/yıla göre gün sayısı
  const daysInMonth = useMemo(() => {
    const m = Number(f.month);
    const y = Number(f.year) || 2000;
    if (!m) return 31;
    return new Date(y, m, 0).getDate();
  }, [f.month, f.year]);

  const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const birthDate =
      f.day && f.month && f.year
        ? `${f.year}-${pad(f.month)}-${pad(f.day)}`
        : "";
    const birthTime =
      !unknownTime && f.hour !== "" && f.minute !== ""
        ? `${pad(f.hour)}:${pad(f.minute)}`
        : "";

    const payload = {
      name: f.name,
      gender: f.gender as "female" | "male" | "other" | "",
      birthDate,
      birthTime,
      birthPlace: f.place,
      birthTimeAccuracy: f.accuracy,
      focusArea: f.focus as (typeof FOCUS_OPTIONS)[number]["value"],
    };

    const parsed = birthFormSchema.safeParse(payload);
    const fieldErrors: Record<string, string> = {};
    if (!parsed.success) {
      for (const [k, msgs] of Object.entries(
        parsed.error.flatten().fieldErrors,
      )) {
        if (msgs && msgs[0]) fieldErrors[k] = msgs[0];
      }
    }
    if (!birthDate) fieldErrors.birthDate = "Gün, ay ve yılı seç";
    if (!unknownTime && !birthTime)
      fieldErrors.birthTime = "Saati seç veya 'Bilmiyorum'u işaretle";

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(
          data.code === "GEOCODE_FAILED"
            ? "Doğum yerini bulamadık. Şehri/ilçeyi farklı yazmayı dene (örn. 'Kadıköy, İstanbul')."
            : (data.error ?? "Bir hata oluştu."),
        );
        setSubmitting(false);
        return;
      }
      try {
        sessionStorage.setItem(
          `analysis:${data.id}`,
          JSON.stringify(data.result),
        );
      } catch {
        /* yoksay */
      }
      router.push(`/analiz/${data.id}`);
    } catch {
      setServerError("Sunucuya ulaşılamadı. Bağlantını kontrol et.");
      setSubmitting(false);
    }
  }

  if (submitting) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card/60 p-2 backdrop-blur-md">
        <LoadingState />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      {/* Adım 1 — Kimlik */}
      <Step n={1} title="Sen kimsin?">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Adın" icon={User} error={errors.name}>
            <Input
              value={f.name}
              onChange={(e) => up("name", e.target.value)}
              placeholder="Adını yaz"
              autoComplete="given-name"
            />
          </Field>
          <Field label="Cinsiyet" hint="opsiyonel">
            <Select
              value={f.gender}
              onChange={(e) => up("gender", e.target.value)}
            >
              <option value="">Belirtmek istemiyorum</option>
              <option value="female">Kadın</option>
              <option value="male">Erkek</option>
              <option value="other">Diğer</option>
            </Select>
          </Field>
        </div>
      </Step>

      {/* Adım 2 — Doğum anı */}
      <Step n={2} title="Ne zaman doğdun?">
        <Field label="Doğum tarihi" error={errors.birthDate}>
          <div className="grid grid-cols-3 gap-2">
            <Select value={f.day} onChange={(e) => up("day", e.target.value)}>
              <option value="">Gün</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <Select
              value={f.month}
              onChange={(e) => up("month", e.target.value)}
            >
              <option value="">Ay</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={String(i + 1)}>
                  {m}
                </option>
              ))}
            </Select>
            <Select value={f.year} onChange={(e) => up("year", e.target.value)}>
              <option value="">Yıl</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </div>
        </Field>

        <Field
          label="Doğum saati"
          error={errors.birthTime}
          hint={unknownTime ? undefined : "24 saat (örn. 14 : 30)"}
        >
          <div className="flex items-center gap-2">
            <Select
              value={f.hour}
              onChange={(e) => up("hour", e.target.value)}
              disabled={unknownTime}
              className="flex-1"
            >
              <option value="">Saat</option>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={String(i)}>
                  {pad(String(i))}
                </option>
              ))}
            </Select>
            <span className="text-lg font-semibold text-muted-foreground">
              :
            </span>
            <Select
              value={f.minute}
              onChange={(e) => up("minute", e.target.value)}
              disabled={unknownTime}
              className="flex-1"
            >
              <option value="">Dakika</option>
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={String(i)}>
                  {pad(String(i))}
                </option>
              ))}
            </Select>
          </div>
        </Field>

        <Field label="Doğum saatini biliyor musun?">
          <div className="grid grid-cols-3 gap-2">
            {ACCURACY.map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => up("accuracy", opt.v)}
                className={pill(f.accuracy === opt.v)}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </Field>

        {unknownTime && (
          <div className="flex items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/[0.07] px-4 py-3 text-xs text-warning">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Saat bilinmeyince yükselen ve ev yorumları yapılmaz; analiz
              gezegen burçları üzerinden hazırlanır. Sorun değil!
            </span>
          </div>
        )}
      </Step>

      {/* Adım 3 — Yer */}
      <Step n={3} title="Nerede doğdun?">
        <Field label="Şehir veya ilçe" icon={MapPin} error={errors.birthPlace}>
          <Input
            list="city-list"
            value={f.place}
            onChange={(e) => up("place", e.target.value)}
            placeholder="örn. Kadıköy, İstanbul"
            autoComplete="off"
          />
          <datalist id="city-list">
            {cities.map((c) => (
              <option key={c.label} value={c.value}>
                {c.label}
              </option>
            ))}
          </datalist>
          <p className="text-xs text-muted-foreground">
            İlçe de yazabilirsin — tüm Türkiye ilçeleri ve dünya şehirleri
            destekleniyor.
          </p>
        </Field>
      </Step>

      {/* Adım 4 — Odak */}
      <Step n={4} title="Neyi merak ediyorsun?">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FOCUS_OPTIONS.map((opt) => {
            const active = f.focus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => up("focus", opt.value)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center text-xs font-medium transition-all ${
                  active
                    ? "border-gold/60 bg-gold/10 text-gold"
                    : "border-border bg-secondary/30 text-muted-foreground hover:border-gold/40"
                }`}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </Step>

      {serverError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <Button type="submit" variant="gold" size="lg" className="w-full">
        ✨ Haritamı Oluştur
      </Button>

      <Disclaimer compact />
    </form>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/50 p-5 backdrop-blur-md sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold">
          {n}
        </span>
        <h3 className="font-display text-base font-semibold">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  error,
  hint,
  children,
}: {
  label: string;
  icon?: typeof User;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        <Label>{label}</Label>
        {hint && (
          <span className="text-xs text-muted-foreground">· {hint}</span>
        )}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function pill(active: boolean): string {
  return `rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
    active
      ? "border-primary bg-primary/15 text-foreground"
      : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/40"
  }`;
}
