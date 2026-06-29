"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Heart,
  Briefcase,
  Coins,
  Sparkles,
  Lock,
  Loader2,
  Moon,
  Sun,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getSignByDate, type Sign } from "@/lib/zodiac";
import { CREDIT_PACKS } from "@/lib/creditPacks";
import { TR_ILLER, ilceler } from "@/lib/utils/tr-il-ilce";

// localStorage anahtarları
const SEEN_KEY = "astro_funnel_v1"; // ilk ziyaret kapısı bunu kontrol eder
const DATA_KEY = "astro_onboarding"; // doğum bilgisi (harita-olustur'da otomatik üretim)

type Phase = "intro" | "form" | "loading" | "reveal" | "pricing";

const FOCI = [
  { id: "ask", label: "Aşk & İlişkiler", icon: Heart },
  { id: "kariyer", label: "Kariyer & Başarı", icon: Briefcase },
  { id: "para", label: "Para & Bolluk", icon: Coins },
  { id: "genel", label: "Genel hayatım", icon: Sparkles },
] as const;

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
const CURRENT_YEAR = 2025;
const YEARS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) =>
  String(CURRENT_YEAR - i),
);
const pad = (n: string) => n.padStart(2, "0");

// "Harita hazırlanıyor" sahnesinin adımları.
const LOADING_STEPS = [
  "Doğum bilgilerin okunuyor",
  "Güneş, Ay ve gezegenler konumlanıyor",
  "Yükselen ve 12 ev hesaplanıyor",
  "Gezegen açıları çözümleniyor",
  "Haritanın enerji dengesi çiziliyor",
  "Kişisel yorumun hazırlanıyor",
];
const LOADING_PER = 1000; // adım başına ms
const LOADING_TOTAL = LOADING_PER * LOADING_STEPS.length + 700;

export function OnboardingFunnel() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");

  // Doğum bilgileri (ana formla aynı yapı)
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [il, setIl] = useState("");
  const [ilce, setIlce] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [focus, setFocus] = useState<string>("genel");

  // Sonuç
  const [sign, setSign] = useState<Sign | null>(null);
  const [loadStep, setLoadStep] = useState(0);
  const [percent, setPercent] = useState(0);

  const focusLabel = useMemo(
    () => FOCI.find((f) => f.id === focus)?.label ?? "hayatın",
    [focus],
  );

  const daysInMonth = useMemo(() => {
    const m = Number(month);
    const y = Number(year) || 2000;
    if (!m) return 31;
    return new Date(y, m, 0).getDate();
  }, [month, year]);
  const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

  // Ay/yıl değişince geçersiz günü sıfırla (31 seçiliyken Şubat gibi)
  useEffect(() => {
    if (day && Number(day) > daysInMonth) setDay("");
  }, [daysInMonth, day]);

  const formValid =
    name.trim().length >= 2 &&
    !!day &&
    !!month &&
    !!year &&
    !!il &&
    !!ilce &&
    (unknownTime || (hour !== "" && minute !== ""));

  function markSeen() {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* yoksay */
    }
  }

  // Bilgi adımından "harita hazırlanıyor" sahnesine geç + veriyi sakla
  function startAnalysis() {
    markSeen();
    const birthDate = `${year}-${pad(month)}-${pad(day)}`;
    const birthTime = unknownTime ? "" : `${pad(hour)}:${pad(minute)}`;
    const birthPlace = ilce ? `${ilce}, ${il}` : il;
    const computed = getSignByDate(birthDate);
    setSign(computed);
    try {
      localStorage.setItem(
        DATA_KEY,
        JSON.stringify({
          name: name.trim(),
          birthDate,
          birthPlace,
          birthTime,
          birthTimeAccuracy: unknownTime ? "unknown" : "exact",
          focus,
          sign: computed?.slug,
        }),
      );
    } catch {
      /* yoksay */
    }
    setPhase("loading");
  }

  // Loading sahnesini sırayla ilerlet + akıcı yüzde sayacı → bitince reveal
  useEffect(() => {
    if (phase !== "loading") return;
    setLoadStep(0);
    setPercent(0);
    const timers = LOADING_STEPS.map((_, i) =>
      setTimeout(() => setLoadStep(i + 1), LOADING_PER * (i + 1)),
    );
    const tick = setInterval(
      () => setPercent((p) => (p >= 99 ? 99 : p + 1)),
      Math.max(20, Math.floor(LOADING_TOTAL / 100)),
    );
    const done = setTimeout(() => {
      setPercent(100);
      setPhase("reveal");
    }, LOADING_TOTAL);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [phase]);

  // Plan seç → önce üyelik → kayıttan sonra gerçek ödeme otomatik başlar
  function selectPlan(packId: string) {
    markSeen();
    router.push(`/giris?mode=register&pack=${packId}&from=kesfet`);
  }

  // Ücretsiz başla → kayıt sonrası harita otomatik üretilir (veri saklı)
  function startFree() {
    markSeen();
    router.push(`/giris?mode=register&from=kesfet&next=harita-olustur`);
  }

  function skip() {
    markSeen();
    router.push("/");
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      {/* Kaçış kapısı */}
      <button
        type="button"
        onClick={skip}
        aria-label="Kapat"
        className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-secondary/40 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      <AnimatePresence mode="wait">
        {/* ---------------- INTRO ---------------- */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
              <Sparkles className="h-3.5 w-3.5" /> 60 saniyede doğum haritan
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Doğum haritanda{" "}
              <span className="gradient-text">ne yazıyor?</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Doğum tarihin, yerin ve saatinle gerçek natal haritanı çıkaralım;
              Güneş, Ay, yükselen ve gezegenlerin seni bekliyor. Ücretsiz başla. 🔮
            </p>
            <Button
              variant="gold"
              size="lg"
              className="mt-8 w-full sm:w-auto"
              onClick={() => setPhase("form")}
            >
              Haritamı çıkar
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              İlk haritan ücretsiz · kart gerekmez
            </p>
          </motion.div>
        )}

        {/* ---------------- FORM (gerçek doğum bilgisi) ---------------- */}
        {phase === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Doğum bilgilerin
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Tarihin Güneş burcunu, yerin ve saatin yükselenini ve evlerini
                belirler.
              </p>
            </div>

            <div className="mt-7 space-y-5 rounded-3xl border border-primary/15 bg-card/50 p-6 backdrop-blur-md">
              {/* Ad Soyad */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adın ve soyadın"
                  autoComplete="name"
                  className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary/50"
                />
              </div>

              {/* Doğum tarihi — gün / ay / yıl */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Doğum tarihin
                </label>
                <div className="grid grid-cols-3 gap-2 [&>*]:min-w-0">
                  <Select value={day} onChange={(e) => setDay(e.target.value)}>
                    <option value="">Gün</option>
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                  <Select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option value="">Ay</option>
                    {MONTHS.map((m, i) => (
                      <option key={m} value={String(i + 1)}>
                        {m}
                      </option>
                    ))}
                  </Select>
                  <Select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Yıl</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Doğum saati — saat / dakika */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Doğum saatin
                </label>
                <div className="flex items-center gap-2">
                  <Select
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
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
                  <span className="text-muted-foreground">:</span>
                  <Select
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
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
                <label className="mt-1.5 flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={unknownTime}
                    onChange={(e) => setUnknownTime(e.target.checked)}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  Saatimi bilmiyorum (yükselen/ev yorumu yapılmaz)
                </label>
              </div>

              {/* Doğum yeri — il / ilçe */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Doğum yerin
                </label>
                <div className="grid grid-cols-2 gap-2 [&>*]:min-w-0">
                  <Select
                    value={il}
                    onChange={(e) => {
                      setIl(e.target.value);
                      setIlce("");
                    }}
                  >
                    <option value="">İl seç</option>
                    {TR_ILLER.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>
                  <Select
                    value={ilce}
                    onChange={(e) => setIlce(e.target.value)}
                    disabled={!il}
                  >
                    <option value="">{il ? "İlçe seç" : "Önce il seç"}</option>
                    {il &&
                      ilceler(il).map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                  </Select>
                </div>
              </div>

              {/* Odak */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Haritanda en çok neyi merak ediyorsun?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {FOCI.map((f) => {
                    const Icon = f.icon;
                    const active = focus === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFocus(f.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left text-sm transition-all",
                          active
                            ? "border-primary/50 bg-primary/10 text-foreground"
                            : "border-primary/15 bg-card/60 text-muted-foreground hover:border-primary/30",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              className="mt-6 w-full"
              disabled={!formValid}
              onClick={startAnalysis}
            >
              Haritamı çıkar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* ---------------- LOADING ---------------- */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-6 text-center"
          >
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              {/* nabız gibi parlama */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gold/20 blur-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.7, 0.35] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* dış halka */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/15 border-r-primary/60 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
              {/* iç halka (ters yön) */}
              <motion.div
                className="absolute inset-4 rounded-full border-2 border-gold/15 border-b-gold"
                animate={{ rotate: -360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
              />
              {/* yörüngede dönen yıldız */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_10px_2px] shadow-gold/60" />
              </motion.div>
              {/* merkez glyph */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-9 w-9 text-gold" />
              </motion.div>
            </div>

            {/* yüzde */}
            <p className="mt-6 font-display text-5xl font-bold tabular-nums">
              <span className="gradient-text">%{percent}</span>
            </p>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight sm:text-2xl">
              {name ? `${name.split(" ")[0]}, ` : ""}haritan hazırlanıyor…
            </h2>

            {/* ilerleme çubuğu */}
            <div className="mx-auto mt-4 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-gold"
                animate={{ width: `${percent}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>

            <div className="mx-auto mt-6 max-w-sm space-y-2.5 text-left">
              {LOADING_STEPS.map((s, i) => {
                const done = i < loadStep;
                const activeNow = i === loadStep;
                return (
                  <div
                    key={s}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all",
                      done
                        ? "border-success/30 bg-success/5 text-foreground"
                        : activeNow
                          ? "border-primary/30 bg-primary/5 text-foreground"
                          : "border-border/40 bg-card/30 text-muted-foreground",
                    )}
                  >
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      {done ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : activeNow ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                      )}
                    </span>
                    {s}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ---------------- REVEAL ---------------- */}
        {phase === "reveal" && sign && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <Check className="h-3.5 w-3.5" /> Doğum haritan hazır
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {name ? `${name.split(" ")[0]}, ` : ""}haritan{" "}
              <span className="gradient-text">seni bekliyor</span>
            </h2>

            {/* Ücretsiz tadımlık: gerçek Güneş burcu */}
            <div className="mx-auto mt-5 flex max-w-sm items-center gap-3 rounded-2xl border border-primary/20 bg-card/60 p-4 text-left">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 text-2xl text-primary ring-1 ring-primary/20">
                {sign.glyph}
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Güneş burcun</p>
                <p className="font-display text-lg font-bold">
                  {sign.name}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    · {sign.element}
                  </span>
                </p>
              </div>
              <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                AÇIK
              </span>
            </div>

            {/* Kilitli — merak ettiren blur */}
            <div className="relative mx-auto mt-4 max-w-sm overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/[0.08] to-card/60 p-5 text-left">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-gold">
                  Haritanda seni bekleyenler
                </p>
                <Lock className="h-4 w-4 text-gold" />
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: Moon, label: "Ay burcun", hint: "duygusal dünyan" },
                  { icon: Sun, label: "Yükselen burcun", hint: "dışa yansıyan yüzün" },
                  { icon: Heart, label: "Venüs · Mars", hint: "aşk ve tutku enerjin" },
                  { icon: Star, label: "En güçlü gezegenin", hint: "kaderini yönlendiren" },
                ].map(({ icon: Icon, label, hint }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 flex-shrink-0 text-gold/70" />
                    <span className="text-sm font-medium text-foreground/90">
                      {label}
                    </span>
                    <span className="select-none rounded bg-foreground/10 px-2 py-0.5 text-sm text-foreground/60 blur-[5px]">
                      {hint}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 rounded-xl bg-foreground/[0.04] px-3 py-2 text-center text-xs text-muted-foreground">
                ✨ 12 ev · 10 gezegen · {focusLabel} için kişisel transit
                yorumların hazır
              </p>
            </div>

            <Button
              variant="gold"
              size="lg"
              className="mt-6 w-full"
              onClick={() => setPhase("pricing")}
            >
              Doğum haritamı gör
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              İlk haritan ücretsiz · 30 saniyede üye ol
            </p>
          </motion.div>
        )}

        {/* ---------------- PRICING ---------------- */}
        {phase === "pricing" && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Tam doğum haritanı açmak için bir plan seç
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                İlk haritan ücretsiz. Plan seç, saniyeler içinde üye ol; haritan
                hesabında hazır olsun.
              </p>
            </div>

            <div className="mt-7 grid gap-4">
              {/* Ücretsiz */}
              <button
                type="button"
                onClick={startFree}
                className="group flex items-center justify-between gap-4 rounded-3xl border border-primary/15 bg-card/60 p-5 text-left backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div>
                  <p className="font-display text-lg font-bold">Ücretsiz</p>
                  <p className="text-sm text-muted-foreground">
                    İlk haritan bizden · üye ol, hemen hazır
                  </p>
                </div>
                <span className="font-display text-2xl font-bold">$0</span>
              </button>

              {/* Kredi paketleri */}
              {CREDIT_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => selectPlan(pack.id)}
                  className={cn(
                    "group relative flex items-center justify-between gap-4 rounded-3xl border p-5 text-left backdrop-blur-md transition-all hover:-translate-y-0.5",
                    pack.popular
                      ? "border-gold/40 bg-gradient-to-b from-gold/10 to-card/60 shadow-xl shadow-gold/10"
                      : "border-primary/15 bg-card/60 hover:border-primary/40",
                  )}
                >
                  {pack.popular && (
                    <span className="absolute -top-3 left-5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-gold-foreground">
                      EN POPÜLER
                    </span>
                  )}
                  <div>
                    <p className="font-display text-lg font-bold">{pack.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {pack.credits} analiz · $
                      {(pack.price / pack.credits).toFixed(2)}/analiz
                    </p>
                  </div>
                  <span className="flex items-center gap-2 font-display text-2xl font-bold">
                    ${pack.price}
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </span>
                </button>
              ))}
            </div>

            <p className="mx-auto mt-5 max-w-md text-center text-xs text-muted-foreground">
              Fiyatlar USD&apos;dir; bankan otomatik TL&apos;ye çevirir. Abonelik
              yok, gizli ücret yok.
            </p>
            <button
              type="button"
              onClick={startFree}
              className="mx-auto mt-3 block text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              Şimdilik ücretsiz devam et
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
