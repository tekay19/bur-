import {
  Briefcase,
  Check,
  Heart,
  Sparkles,
  User,
  X,
} from "lucide-react";
import type { GenderProfile, Sign } from "@/lib/zodiac";

const elementColor: Record<Sign["element"], string> = {
  Ateş: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  Toprak: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Hava: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  Su: "border-violet-400/30 bg-violet-400/10 text-violet-300",
};

// Burç başlığı: büyük glyph + isim + tarih + element/nitelik/yönetici + özet.
export function SignHero({ sign }: { sign: Sign }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/25 to-accent/20 text-5xl text-primary ring-1 ring-primary/20">
        <span aria-hidden>{sign.glyph}</span>
      </div>
      <div className="min-w-0">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {sign.name} Burcu
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{sign.dates}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${elementColor[sign.element]}`}>
            {sign.element}
          </span>
          <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
            {sign.quality} nitelik
          </span>
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs text-gold">
            Yönetici: {sign.ruler}
          </span>
        </div>
      </div>
    </div>
  );
}

// Genel kişilik paragrafları + öne çıkan özellik etiketleri.
export function SignGeneral({ sign }: { sign: Sign }) {
  return (
    <div>
      <div className="space-y-3">
        {sign.general.map((p, i) => (
          <p key={i} className="leading-relaxed text-foreground/85">
            {p}
          </p>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {sign.traits.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1 text-xs text-foreground/80"
          >
            <Sparkles className="h-3 w-3 text-primary" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// Güçlü / zayıf yönler (iki sütun).
export function TraitColumns({ sign }: { sign: Sign }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-success/20 bg-success/5 p-5">
        <h3 className="mb-3 text-sm font-semibold text-success">Güclü yönleri</h3>
        <ul className="space-y-2">
          {sign.strengths.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-foreground/85">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-warning/20 bg-warning/5 p-5">
        <h3 className="mb-3 text-sm font-semibold text-warning">Dikkat edilecekler</h3>
        <ul className="space-y-2">
          {sign.weaknesses.map((w) => (
            <li key={w} className="flex items-start gap-2 text-sm text-foreground/85">
              <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
              {w}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Cinsiyete özel blok: kişilik + aşk + kariyer.
export function GenderBlock({
  title,
  profile,
}: {
  title: string;
  profile: GenderProfile;
}) {
  return (
    <div className="rounded-3xl border border-primary/15 bg-card/60 p-6 backdrop-blur-md sm:p-7">
      <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
        <User className="h-5 w-5 text-primary" /> {title}
      </h3>

      <div className="mt-4 space-y-3">
        {profile.personality.map((p, i) => (
          <p key={i} className="leading-relaxed text-foreground/85">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-accent">
            <Heart className="h-4 w-4" /> Aşk & İlişki
          </p>
          <div className="space-y-2">
            {profile.love.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gold">
            <Briefcase className="h-4 w-4" /> Kariyer
          </p>
          <div className="space-y-2">
            {profile.career.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Uyumlu burçlar.
export function Compatibility({ sign }: { sign: Sign }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-card/60 p-5 backdrop-blur-md">
      <h3 className="text-sm font-semibold">En uyumlu burçlar</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {sign.compatibility.best.map((b) => (
          <span
            key={b}
            className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary"
          >
            {b}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {sign.compatibility.note}
      </p>
    </div>
  );
}

// SSS listesi (accordion).
export function SignFaqList({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <div className="grid gap-3">
      {faq.map((f) => (
        <details
          key={f.q}
          className="group rounded-2xl border border-primary/15 bg-card/70 px-5 py-4 backdrop-blur-md [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium">
            {f.q}
            <span className="text-gold transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
