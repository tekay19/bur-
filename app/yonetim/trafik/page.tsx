"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, Notice, PageLoading } from "@/components/admin/parts";

interface GaStats {
  configured: boolean;
  error?: string;
  realtimeUsers: number;
  summary: { users7d: number; users28d: number; pageViews28d: number; sessions28d: number };
  daily: { date: string; users: number }[];
  topPages: { path: string; views: number }[];
  sources: { source: string; sessions: number }[];
}

export default function TrafikPage() {
  const [s, setS] = useState<GaStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/ga")
      .then((r) => r.json())
      .then(setS)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !s) return <PageLoading />;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Trafik (GA4)</h1>
          <p className="mt-1 text-sm text-muted-foreground">Google Analytics canlı verisi — son 28 gün.</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Yenile
        </Button>
      </header>

      {s && !s.configured && (
        <Notice>
          GA4 bağlı değil. Vercel’e <code>GA_PROPERTY_ID</code>,{" "}
          <code>GA_SA_CLIENT_EMAIL</code> ve <code>GA_SA_PRIVATE_KEY</code> ekleyip
          servis hesabına GA property erişimi verince trafik burada görünür.
        </Notice>
      )}

      {s?.configured && s.error && (
        <Card className="border-destructive/40 p-4 text-sm text-destructive">
          GA hatası: {s.error}
        </Card>
      )}

      {s?.configured && !s.error && (
        <>
          {/* Canlı + özet */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-1.5 text-success">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                <span className="text-xs font-medium">Şu an aktif</span>
              </div>
              <p className="mt-1 font-display text-2xl font-bold">{s.realtimeUsers}</p>
            </Card>
            <Stat label="Ziyaretçi (7g)" value={s.summary.users7d} icon={<Users className="h-3.5 w-3.5" />} />
            <Stat label="Ziyaretçi (28g)" value={s.summary.users28d} icon={<Users className="h-3.5 w-3.5" />} />
            <Stat label="Görüntüleme (28g)" value={s.summary.pageViews28d} icon={<Activity className="h-3.5 w-3.5" />} />
          </div>

          {/* Günlük seri */}
          {s.daily.length > 0 && (
            <Card className="p-5">
              <h2 className="mb-4 text-sm font-semibold">Son 14 gün — ziyaretçi</h2>
              <DailyChart daily={s.daily} />
            </Card>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {/* En çok gezilen sayfalar */}
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-semibold">En çok gezilen sayfalar (28g)</h2>
              <ul className="space-y-2">
                {s.topPages.length === 0 && <li className="text-sm text-muted-foreground">Veri yok.</li>}
                {s.topPages.map((p) => (
                  <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-foreground/85">{p.path}</span>
                    <span className="flex-shrink-0 font-semibold">{p.views}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Trafik kaynakları */}
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-semibold">Trafik kaynağı (28g)</h2>
              <ul className="space-y-2">
                {s.sources.length === 0 && <li className="text-sm text-muted-foreground">Veri yok.</li>}
                {s.sources.map((x) => (
                  <li key={x.source} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-foreground/85">{x.source}</span>
                    <span className="flex-shrink-0 font-semibold">{x.sessions}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl font-bold">{value.toLocaleString("tr-TR")}</p>
    </Card>
  );
}

function DailyChart({ daily }: { daily: { date: string; users: number }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.users));
  return (
    <div className="flex items-end justify-between gap-1.5" style={{ height: 120 }}>
      {daily.map((d) => (
        <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-gradient-to-t from-primary/60 to-accent/70"
            style={{ height: `${Math.max(3, (d.users / max) * 100)}%` }}
            title={`${d.date}: ${d.users}`}
          />
          <span className="text-[9px] text-muted-foreground">{d.date}</span>
        </div>
      ))}
    </div>
  );
}
