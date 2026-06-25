"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Ghost,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import type { AdminStats } from "@/lib/adminData";
import { fmtDate, fmtUsd } from "@/lib/adminClient";
import { Notice, PageLoading } from "@/components/admin/parts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [db, setDb] = useState(true);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setDb(d.db !== false);
        setStats(d.stats ?? null);
      })
      .catch(() => setErr("İstatistikler yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (err) return <Notice>{err}</Notice>;
  if (!db)
    return (
      <Notice>
        Veritabanı bağlı değil (DATABASE_URL yok). Admin verileri yalnızca
        Postgres modunda görünür.
      </Notice>
    );
  if (!stats) return <Notice>Veri yok.</Notice>;

  const maxDaily = Math.max(1, ...stats.analyses.daily.map((d) => d.count));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Genel Bakış
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Üyeler, analizler, krediler ve satışların özeti.
        </p>
      </header>

      {/* KPI kartları */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          icon={<Users className="h-4 w-4" />}
          label="Üye"
          value={stats.members.total}
          sub={`+${stats.members.new7d} / 7g`}
        />
        <Stat
          icon={<Ghost className="h-4 w-4" />}
          label="Misafir hesap"
          value={stats.guests.total}
          sub={`+${stats.guests.new7d} / 7g`}
        />
        <Stat
          icon={<Sparkles className="h-4 w-4" />}
          label="Analiz"
          value={stats.analyses.total}
          sub={`+${stats.analyses.new24h} / bugün`}
        />
        <Stat
          icon={<TrendingUp className="h-4 w-4" />}
          label="Gelir (USD)"
          value={fmtUsd(stats.sales.revenueUsd)}
          sub={`${stats.sales.count} satış`}
        />
        <Stat
          icon={<Wallet className="h-4 w-4" />}
          label="Bekleyen kredi"
          value={stats.credits.outstanding}
          sub="üye + misafir"
        />
        <Stat
          icon={<CreditCard className="h-4 w-4" />}
          label="Satılan kredi"
          value={stats.sales.creditsSold}
          sub={`${stats.credits.spent} harcandı`}
        />
        <Stat
          icon={<Users className="h-4 w-4" />}
          label="Premium"
          value={stats.plans.premium}
          sub={`${stats.plans.free} ücretsiz`}
        />
        <Stat
          icon={<Sparkles className="h-4 w-4" />}
          label="Analiz / 7g"
          value={stats.analyses.new7d}
          sub="son 7 gün"
        />
      </div>

      {/* Günlük analiz grafiği */}
      <section className="rounded-3xl border border-primary/20 bg-card/85 p-5 backdrop-blur-xl">
        <h2 className="mb-4 font-display text-base font-semibold">
          Son 14 gün — günlük analiz
        </h2>
        <div className="flex h-32 items-end gap-1.5">
          {stats.analyses.daily.map((d) => (
            <div
              key={d.date}
              className="group relative flex flex-1 flex-col items-center justify-end"
              title={`${d.date}: ${d.count}`}
            >
              <span className="mb-1 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {d.count}
              </span>
              <div
                className="w-full rounded-t bg-gradient-to-t from-primary/40 to-accent/70"
                style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count ? 4 : 1 }}
              />
              <span className="mt-1 text-[9px] text-muted-foreground">
                {d.date.slice(8, 10)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Son üyeler */}
        <section className="rounded-3xl border border-primary/20 bg-card/85 p-5 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Son üyeler</h2>
            <Link href="/yonetim/uyeler" className="text-xs text-primary hover:underline">
              Tümü →
            </Link>
          </div>
          <ul className="divide-y divide-border/60">
            {stats.recentMembers.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">Henüz üye yok.</li>
            )}
            {stats.recentMembers.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.email}</p>
                  <p className="text-xs text-muted-foreground">{fmtDate(m.createdAt)}</p>
                </div>
                <span className="flex-shrink-0 rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
                  {m.plan === "premium" ? "Premium" : `${m.credits} kredi`}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Son satışlar */}
        <section className="rounded-3xl border border-primary/20 bg-card/85 p-5 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Son satışlar</h2>
            <Link href="/yonetim/satislar" className="text-xs text-primary hover:underline">
              Tümü →
            </Link>
          </div>
          <ul className="divide-y divide-border/60">
            {stats.sales.recent.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">Henüz satış yok.</li>
            )}
            {stats.sales.recent.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.packLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.recipientType === "user" ? "Üye" : "Misafir"} · {fmtDate(s.createdAt)}
                  </p>
                </div>
                <span className="flex-shrink-0 text-sm font-semibold text-success">
                  {fmtUsd(s.amountUsd)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-card/85 p-4 backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-display text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
