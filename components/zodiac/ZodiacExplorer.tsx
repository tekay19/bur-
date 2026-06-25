"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SIGNS } from "@/lib/zodiac";
import { cn } from "@/lib/utils";
import {
  Compatibility,
  GenderBlock,
  SignGeneral,
  SignHero,
  TraitColumns,
} from "./parts";

type Gender = "kadin" | "erkek";

// Burcunu seç → cinsiyetini seç → ayrıntılı özelliklerini gör.
export function ZodiacExplorer() {
  const [slug, setSlug] = useState(SIGNS[0].slug);
  const [gender, setGender] = useState<Gender>("kadin");
  const sign = SIGNS.find((s) => s.slug === slug) ?? SIGNS[0];

  return (
    <div>
      {/* 1) Burç seçimi */}
      <div role="tablist" aria-label="Burç seç" className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
        {SIGNS.map((s) => {
          const active = s.slug === slug;
          return (
            <button
              key={s.slug}
              role="tab"
              aria-selected={active}
              onClick={() => setSlug(s.slug)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 transition-all",
                active
                  ? "border-primary/50 bg-primary/15 shadow-lg shadow-primary/10"
                  : "border-primary/10 bg-card/50 hover:border-primary/30 hover:bg-card/80",
              )}
            >
              <span
                className={cn(
                  "text-2xl",
                  active ? "text-primary" : "text-foreground/70",
                )}
                aria-hidden
              >
                {s.glyph}
              </span>
              <span className="text-xs font-medium">{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2) Cinsiyet seçimi */}
      <div className="mt-6 flex justify-center">
        <div className="inline-flex rounded-full border border-primary/20 bg-card/60 p-1 backdrop-blur-md">
          {(
            [
              { key: "kadin", label: "Kadın" },
              { key: "erkek", label: "Erkek" },
            ] as const
          ).map((g) => (
            <button
              key={g.key}
              onClick={() => setGender(g.key)}
              aria-pressed={gender === g.key}
              className={cn(
                "relative rounded-full px-6 py-2 text-sm font-medium transition-colors",
                gender === g.key
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {gender === g.key && (
                <motion.span
                  layoutId="genderPill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary to-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3) Sonuç */}
      <motion.div
        key={`${slug}-${gender}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 space-y-6"
      >
        <div className="rounded-3xl border border-primary/15 bg-card/50 p-6 backdrop-blur-md sm:p-8">
          <SignHero sign={sign} />
          <div className="mt-6">
            <SignGeneral sign={sign} />
          </div>
        </div>

        <GenderBlock
          title={`${sign.name} Burcu ${gender === "kadin" ? "Kadını" : "Erkeği"}`}
          profile={gender === "kadin" ? sign.woman : sign.man}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <TraitColumns sign={sign} />
          <Compatibility sign={sign} />
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href={`/burclar/${sign.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            {sign.name} burcunun tüm ayrıntıları
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
