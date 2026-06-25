"use client";

import { useEffect, useState } from "react";
import type { SaleRow } from "@/lib/adminData";
import { fmtDate, fmtUsd } from "@/lib/adminClient";
import {
  Card,
  Notice,
  Pager,
  PageHeader,
  PageLoading,
} from "@/components/admin/parts";

interface Resp {
  db: boolean;
  rows: SaleRow[];
  total: number;
  page: number;
  pageSize: number;
  revenueUsd: number;
  creditsSold: number;
}

export default function SalesPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/sales?page=${page}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Satışlar"
        desc="Creem.io üzerinden tamamlanan kredi paketi ödemeleri."
      />

      {loading && !data ? (
        <PageLoading />
      ) : data && data.db === false ? (
        <Notice>Veritabanı bağlı değil (DATABASE_URL yok).</Notice>
      ) : !data ? (
        <Notice>Veri yok.</Notice>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Summary label="Toplam gelir" value={fmtUsd(data.revenueUsd)} accent />
            <Summary label="Satılan kredi" value={String(data.creditsSold)} />
            <Summary label="İşlem sayısı" value={String(data.total)} />
          </div>

          {data.rows.length === 0 ? (
            <Notice>
              Henüz tamamlanmış ödeme yok. Creem test ödemesi yapıp webhook&apos;u
              (CREEM_WEBHOOK_SECRET) ayarladığında burada görünür.
            </Notice>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Paket</th>
                      <th className="px-4 py-3 text-right font-medium">Tutar</th>
                      <th className="px-4 py-3 font-medium">Alıcı</th>
                      <th className="hidden px-4 py-3 font-medium sm:table-cell">
                        Sipariş</th>
                      <th className="hidden px-4 py-3 font-medium md:table-cell">
                        Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-border/50 last:border-0 hover:bg-secondary/30"
                      >
                        <td className="px-4 py-3 font-medium">
                          {s.packLabel}
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({s.credits} kredi)
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-success">
                          {fmtUsd(s.amountUsd)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs">
                            {s.recipientType === "user" ? "Üye" : "Misafir"}
                          </span>
                          <span className="ml-1 font-mono text-xs text-muted-foreground">
                            {s.recipientId.slice(0, 8)}…
                          </span>
                        </td>
                        <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                          {s.id.slice(0, 14)}…
                        </td>
                        <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                          {fmtDate(s.createdAt)}
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
        </>
      )}
    </div>
  );
}

function Summary({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-card/85 p-4 backdrop-blur-xl">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-display text-xl font-bold sm:text-2xl ${
          accent ? "text-success" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
