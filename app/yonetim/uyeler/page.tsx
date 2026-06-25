"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MemberRow } from "@/lib/adminData";
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
  }, [q, page]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Üyeler"
        desc="E-posta + şifre ile kayıtlı üyeler. Detaya girip kredi/plan yönet."
      />

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
