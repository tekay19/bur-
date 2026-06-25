"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { GuestRow } from "@/lib/adminData";
import { fmtDate } from "@/lib/adminClient";
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
  rows: GuestRow[];
  total: number;
  page: number;
  pageSize: number;
}

export default function GuestsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [q]);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/admin/guests?q=${encodeURIComponent(q)}&page=${page}`, {
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
  }, [q, page]);

  async function adjust(id: string, sign: 1 | -1) {
    const n = Math.trunc(Number(amounts[id] ?? "1")) || 1;
    setBusyId(id);
    const res = await fetch(`/api/admin/guests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creditsDelta: sign * n }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok && typeof j.credits === "number") {
      setData((p) =>
        p
          ? {
              ...p,
              rows: p.rows.map((r) =>
                r.id === id ? { ...r, credits: j.credits } : r,
              ),
            }
          : p,
      );
    }
    setBusyId(null);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Misafir hesaplar"
        desc="Üyeliksiz (çerez/aid) kredi hesapları. Kurtarma kodu ile aranabilir."
      />

      <SearchBox value={q} onChange={setQ} placeholder="aid veya ASTRO-kodu ara…" />

      {loading && !data ? (
        <PageLoading />
      ) : data && data.db === false ? (
        <Notice>Veritabanı bağlı değil (DATABASE_URL yok).</Notice>
      ) : !data || data.rows.length === 0 ? (
        <Notice>Misafir hesap bulunamadı.</Notice>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Hesap / Kurtarma kodu</th>
                  <th className="px-4 py-3 text-right font-medium">Kredi</th>
                  <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">
                    Aldı / Harcadı
                  </th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Oluşturma
                  </th>
                  <th className="px-4 py-3 font-medium">Kredi işlemi</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((g) => (
                  <tr
                    key={g.id}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-muted-foreground">
                        {g.id.slice(0, 12)}…
                      </p>
                      <p className="font-mono text-xs font-medium text-gold">
                        {g.recoveryCode}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {g.credits}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-muted-foreground sm:table-cell">
                      {g.totalPurchased} / {g.totalSpent}
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                      {fmtDate(g.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={1}
                          value={amounts[g.id] ?? "1"}
                          onChange={(e) =>
                            setAmounts((a) => ({ ...a, [g.id]: e.target.value }))
                          }
                          className="h-8 w-14 rounded-lg border border-input bg-secondary/40 px-2 text-xs focus-visible:border-primary focus-visible:outline-none"
                        />
                        <button
                          type="button"
                          disabled={busyId === g.id}
                          onClick={() => adjust(g.id, 1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary/40 hover:bg-secondary disabled:opacity-40"
                          aria-label="Kredi ekle"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={busyId === g.id}
                          onClick={() => adjust(g.id, -1)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary/40 hover:bg-secondary disabled:opacity-40"
                          aria-label="Kredi çıkar"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
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
