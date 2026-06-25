"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmtDate, fmtUsd, focusLabel } from "@/lib/adminClient";
import { Card, Notice, PageLoading } from "@/components/admin/parts";

interface Detail {
  user: {
    id: string;
    email: string;
    name: string | null;
    credits: number;
    plan: string;
    totalPurchased: number;
    totalSpent: number;
    createdAt: string;
  };
  charts: {
    id: string;
    name: string;
    birthPlace: string;
    focusArea: string;
    createdAt: string;
  }[];
  payments: { id: string; credits: number; amountUsd: number; createdAt: string }[];
}

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [d, setD] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [amount, setAmount] = useState("3");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => data && setD(data))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function adjustCredits(sign: 1 | -1) {
    const n = Math.trunc(Number(amount));
    if (!n || n <= 0) {
      setMsg("Geçerli bir miktar gir.");
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creditsDelta: sign * n }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setD((p) => (p ? { ...p, user: { ...p.user, credits: data.credits } } : p));
      setMsg(`Kredi güncellendi: ${data.credits}`);
    } else setMsg(data.error ?? "İşlem başarısız.");
    setBusy(false);
  }

  async function setPlan(plan: "free" | "premium") {
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setD((p) => (p ? { ...p, user: { ...p.user, plan } } : p));
      setMsg("Plan güncellendi.");
    } else setMsg(data.error ?? "İşlem başarısız.");
    setBusy(false);
  }

  async function remove() {
    if (
      !confirm(
        "Bu üye KALICI olarak silinecek (analizleri dahil). Bu işlem geri alınamaz. Devam?",
      )
    )
      return;
    setBusy(true);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) router.replace("/yonetim/uyeler");
    else {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error ?? "Silinemedi.");
      setBusy(false);
    }
  }

  if (loading) return <PageLoading />;
  if (notFound || !d)
    return (
      <div className="space-y-4">
        <BackLink />
        <Notice>Üye bulunamadı.</Notice>
      </div>
    );

  const u = d.user;

  return (
    <div className="space-y-5">
      <BackLink />

      <header>
        <h1 className="font-display text-2xl font-bold tracking-tight">{u.email}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {u.name ? `${u.name} · ` : ""}Kayıt: {fmtDate(u.createdAt)}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Mini label="Kredi" value={u.credits} />
        <Mini label="Plan" value={u.plan === "premium" ? "Premium" : "Ücretsiz"} />
        <Mini label="Toplam aldı" value={u.totalPurchased} />
        <Mini label="Toplam harcadı" value={u.totalSpent} />
      </div>

      {/* Eylemler */}
      <Card className="p-5">
        <h2 className="mb-4 font-display text-base font-semibold">İşlemler</h2>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Kredi ekle / çıkar</p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10 w-24 rounded-xl border border-input bg-secondary/40 px-3 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => adjustCredits(1)}
              >
                <Plus className="h-4 w-4" /> Ekle
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => adjustCredits(-1)}
              >
                <Minus className="h-4 w-4" /> Çıkar
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-muted-foreground">Plan</p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={u.plan === "free" ? "default" : "outline"}
                disabled={busy}
                onClick={() => setPlan("free")}
              >
                Ücretsiz
              </Button>
              <Button
                type="button"
                size="sm"
                variant={u.plan === "premium" ? "gold" : "outline"}
                disabled={busy}
                onClick={() => setPlan("premium")}
              >
                Premium
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-2 text-xs text-muted-foreground">Tehlikeli bölge</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={remove}
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" /> Üyeyi sil (KVKK)
            </Button>
          </div>

          {msg && <p className="text-sm text-primary">{msg}</p>}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 font-display text-base font-semibold">
            Analizleri ({d.charts.length})
          </h2>
          <ul className="divide-y divide-border/60">
            {d.charts.length === 0 && (
              <li className="py-2 text-sm text-muted-foreground">Analiz yok.</li>
            )}
            {d.charts.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {focusLabel(c.focusArea)} · {c.birthPlace}
                  </p>
                </div>
                <Link
                  href={`/yonetim/analizler/${c.id}`}
                  className="flex-shrink-0 text-xs text-primary hover:underline"
                >
                  Aç →
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 font-display text-base font-semibold">
            Ödemeleri ({d.payments.length})
          </h2>
          <ul className="divide-y divide-border/60">
            {d.payments.length === 0 && (
              <li className="py-2 text-sm text-muted-foreground">Ödeme yok.</li>
            )}
            {d.payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{p.credits} kredi</p>
                  <p className="text-xs text-muted-foreground">{fmtDate(p.createdAt)}</p>
                </div>
                <span className="flex-shrink-0 text-sm font-semibold text-success">
                  {fmtUsd(p.amountUsd)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/yonetim/uyeler"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" /> Üyeler
    </Link>
  );
}

function Mini({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-card/85 p-4 backdrop-blur-xl">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-bold">{value}</p>
    </div>
  );
}
