"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleSlash,
  Mail,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, PageLoading } from "@/components/admin/parts";

type Level = "ok" | "warn" | "error" | "off";
interface Check {
  key: string;
  label: string;
  level: Level;
  detail: string;
}
interface Status {
  checks: Check[];
  summary: { ok: number; warn: number; error: number };
  dailyEmailSubscribers: number;
}

const LEVEL = {
  ok: { Icon: CheckCircle2, cls: "text-success", ring: "border-success/30 bg-success/5" },
  warn: { Icon: AlertTriangle, cls: "text-warning", ring: "border-warning/30 bg-warning/5" },
  error: { Icon: XCircle, cls: "text-destructive", ring: "border-destructive/40 bg-destructive/5" },
  off: { Icon: CircleSlash, cls: "text-muted-foreground", ring: "border-border/60 bg-secondary/20" },
} as const;

export default function DurumPage() {
  const [s, setS] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setErr(null);
    fetch("/api/admin/status")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Durum alınamadı"))))
      .then(setS)
      .catch((e) => setErr(e.message))
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
          <h1 className="font-display text-2xl font-bold tracking-tight">Sistem Durumu</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Yapılandırma ve canlı sağlık kontrolü — kör nokta bırakmaz.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Yenile
        </Button>
      </header>

      {err && (
        <Card className="border-destructive/40 p-4 text-sm text-destructive">{err}</Card>
      )}

      {s && (
        <>
          {/* Özet */}
          <div className="grid grid-cols-3 gap-3">
            <Summary label="Sağlıklı" value={s.summary.ok} cls="text-success" />
            <Summary label="Uyarı" value={s.summary.warn} cls="text-warning" />
            <Summary label="Sorun" value={s.summary.error} cls="text-destructive" />
          </div>

          {s.summary.error > 0 && (
            <Card className="border-destructive/40 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">
                {s.summary.error} kritik sorun var — aşağıda kırmızı işaretli satırları düzelt.
              </p>
            </Card>
          )}

          {/* Kontroller */}
          <div className="space-y-2.5">
            {s.checks.map((c) => {
              const { Icon, cls, ring } = LEVEL[c.level];
              return (
                <div
                  key={c.key}
                  className={`flex items-start gap-3 rounded-2xl border p-4 ${ring}`}
                >
                  <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${cls}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="mt-0.5 break-words text-xs text-muted-foreground">{c.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bilgi */}
          <Card className="flex items-center gap-3 p-4">
            <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">{s.dailyEmailSubscribers} kişi</p>
              <p className="text-xs text-muted-foreground">günlük yorum e-postasına abone</p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function Summary({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-card/85 p-4 text-center backdrop-blur-xl">
      <p className={`font-display text-2xl font-bold ${cls}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
