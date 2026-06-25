"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Trash2 } from "lucide-react";
import type { AnalysisRow } from "@/lib/adminData";
import { fmtDate, focusLabel, FOCUS_LABELS } from "@/lib/adminClient";
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
  rows: AnalysisRow[];
  total: number;
  page: number;
  pageSize: number;
}

export default function AnalysesPage() {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [q, focus]);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams({ q, page: String(page) });
      if (focus) params.set("focusArea", focus);
      fetch(`/api/admin/analyses?${params.toString()}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then(setData)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, focus, page]);

  async function remove(id: string) {
    if (!confirm("Bu analiz kalıcı olarak silinecek. Devam?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/analyses/${id}`, { method: "DELETE" });
    if (res.ok)
      setData((p) =>
        p
          ? { ...p, rows: p.rows.filter((r) => r.id !== id), total: p.total - 1 }
          : p,
      );
    setBusyId(null);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analizler"
        desc="Üretilen tüm doğum haritası analizleri (üye + misafir)."
      />

      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="İsim veya doğum yeri ara…" />
        <select
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          className="h-10 rounded-xl border border-input bg-secondary/40 px-3 text-sm focus-visible:border-primary focus-visible:outline-none [color-scheme:dark]"
        >
          <option value="">Tüm odaklar</option>
          {Object.entries(FOCUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {loading && !data ? (
        <PageLoading />
      ) : data && data.db === false ? (
        <Notice>Veritabanı bağlı değil (DATABASE_URL yok).</Notice>
      ) : !data || data.rows.length === 0 ? (
        <Notice>Analiz bulunamadı.</Notice>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">İsim / Doğum</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Odak</th>
                  <th className="px-4 py-3 font-medium">Sahip</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Tarih</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.birthDate} · {a.birthPlace}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {focusLabel(a.focusArea)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {a.ownerKind === "user"
                          ? "Üye"
                          : a.ownerKind === "guest"
                            ? "Misafir"
                            : "Anonim"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                      {fmtDate(a.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/yonetim/analizler/${a.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          Aç <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          disabled={busyId === a.id}
                          onClick={() => remove(a.id)}
                          className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
                          aria-label="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
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
