"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIGNS } from "@/lib/zodiac";

export function SignPreference({
  initialSign,
  initialDailyEmail,
}: {
  initialSign: string | null;
  initialDailyEmail: boolean;
}) {
  const router = useRouter();
  const [sign, setSign] = useState(initialSign);
  const [email, setEmail] = useState(initialDailyEmail);
  const [saving, setSaving] = useState(false);

  async function save(data: { sign?: string; dailyEmail?: boolean }) {
    setSaving(true);
    const res = await fetch("/api/me/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);
    setSaving(false);
    if (res?.ok) router.refresh();
    return Boolean(res?.ok);
  }

  async function chooseSign(slug: string) {
    setSign(slug);
    await save({ sign: slug });
  }

  async function toggleEmail() {
    const next = !email;
    setEmail(next);
    const ok = await save({ dailyEmail: next });
    if (!ok) setEmail(!next);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-3 text-sm text-muted-foreground">
          Burcunu seç; her gün <strong className="text-foreground/90">bugünkü yorumun</strong> burada görünsün.
        </p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {SIGNS.map((s) => (
            <button
              key={s.slug}
              onClick={() => chooseSign(s.slug)}
              disabled={saving}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 transition-all disabled:opacity-60",
                sign === s.slug
                  ? "border-primary/50 bg-primary/15"
                  : "border-primary/10 bg-card/50 hover:border-primary/30",
              )}
            >
              <span className={cn("text-lg", sign === s.slug ? "text-primary" : "text-foreground/70")} aria-hidden>
                {s.glyph}
              </span>
              <span className="text-[11px] font-medium">{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-card/50 p-4">
        <span className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-primary" />
          Günlük yorum e-posta hatırlatması
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={email}
          onClick={toggleEmail}
          disabled={saving}
          className={cn(
            "relative h-6 w-11 flex-shrink-0 rounded-full transition-colors",
            email ? "bg-gradient-to-r from-primary to-accent" : "bg-secondary",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
              email ? "translate-x-[22px]" : "translate-x-0.5",
            )}
          />
        </button>
      </label>

      {saving && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Kaydediliyor…
        </p>
      )}
      {sign && !saving && (
        <p className="flex items-center gap-1.5 text-xs text-success">
          <Check className="h-3.5 w-3.5" /> Tercihlerin kayıtlı.
        </p>
      )}
    </div>
  );
}
