"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, UserPlus, X } from "lucide-react";
import type { MemberRow } from "@/lib/adminData";
import { fmtDate } from "@/lib/adminClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  Notice,
  Pager,
  PageHeader,
  PageLoading,
  SearchBox,
} from "@/components/admin/parts";

interface Resp {
  db: boolean;
  rows: MemberRow[];
  total: number;
  page: number;
  pageSize: number;
}

export default function MembersPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [q]);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/admin/users?q=${encodeURIComponent(q)}&page=${page}`, {
        signal: ctrl.signal,
      })
        .then((r) => r.json())
        .then(setData)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, page, reload]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Üyeler"
        desc="E-posta + şifre ile kayıtlı üyeler. Detaya girip kredi/plan yönet."
      />

      <NewMemberForm onCreated={() => setReload((x) => x + 1)} />

      <SearchBox value={q} onChange={setQ} placeholder="E-posta veya isim ara…" />

      {loading && !data ? (
        <PageLoading />
      ) : data && data.db === false ? (
        <Notice>Veritabanı bağlı değil (DATABASE_URL yok).</Notice>
      ) : !data || data.rows.length === 0 ? (
        <Notice>Üye bulunamadı.</Notice>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Üye</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 text-right font-medium">Kredi</th>
                  <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">
                    Aldı / Harcadı
                  </th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Kayıt
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{m.email}</p>
                      {m.name && (
                        <p className="text-xs text-muted-foreground">{m.name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          m.plan === "premium"
                            ? "rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold"
                            : "rounded-full border border-border bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                        }
                      >
                        {m.plan === "premium" ? "Premium" : "Ücretsiz"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {m.credits}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-muted-foreground sm:table-cell">
                      {m.totalPurchased} / {m.totalSpent}
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                      {fmtDate(m.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/yonetim/uyeler/${m.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        Detay <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3">
            <Pager
              page={data.page}
              pageSize={data.pageSize}
              total={data.total}
              onPage={setPage}
            />
          </div>
        </Card>
      )}
    </div>
  );
}

function NewMemberForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [credits, setCredits] = useState("0");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function genPw() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const arr = new Uint32Array(14);
    crypto.getRandomValues(arr);
    let p = "";
    for (const n of arr) p += chars[n % chars.length];
    setPassword(p + "#7");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        password,
        plan,
        credits: Math.max(0, Math.trunc(Number(credits) || 0)),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setMsg(`✓ Üye oluşturuldu → ${email} / ${password}`);
      setEmail("");
      setName("");
      setPassword("");
      setCredits("0");
      setPlan("free");
      onCreated();
    } else setMsg(data.error ?? "Oluşturulamadı.");
    setBusy(false);
  }

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" /> Yeni üye
      </Button>
    );
  }

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold">Yeni üye oluştur</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Kapat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <Field label="E-posta">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT}
            placeholder="ornek@mail.com"
          />
        </Field>
        <Field label="Ad (opsiyonel)">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT}
            placeholder="Ad Soyad"
          />
        </Field>
        <Field label="Şifre (min 8)">
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={INPUT}
              placeholder="Şifre"
            />
            <Button type="button" size="sm" variant="outline" onClick={genPw}>
              Üret
            </Button>
          </div>
        </Field>
        <Field label="Başlangıç kredisi">
          <input
            type="number"
            min={0}
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="Plan">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={plan === "free" ? "default" : "outline"}
              onClick={() => setPlan("free")}
            >
              Ücretsiz
            </Button>
            <Button
              type="button"
              size="sm"
              variant={plan === "premium" ? "gold" : "outline"}
              onClick={() => setPlan("premium")}
            >
              Premium
            </Button>
          </div>
        </Field>
        <div className="flex items-end">
          <Button type="submit" size="sm" variant="gold" disabled={busy} className="w-full">
            {busy ? "Oluşturuluyor…" : "Üye oluştur"}
          </Button>
        </div>
      </form>
      {msg && <p className="mt-3 break-words text-sm text-primary">{msg}</p>}
    </Card>
  );
}

const INPUT =
  "h-10 w-full rounded-xl border border-input bg-secondary/40 px-3 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
