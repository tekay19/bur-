"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmtDate, focusLabel } from "@/lib/adminClient";
import { Card, Notice, PageLoading } from "@/components/admin/parts";

interface Detail {
  id: string;
  name: string;
  gender: string | null;
  birthDate: string;
  birthTime: string | null;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  birthTimeAccuracy: string;
  focusArea: string;
  ownerKind: "user" | "guest" | "anon";
  ownerKey: string | null;
  createdAt: string;
  natal: unknown;
  transit: unknown;
  scores: unknown;
  ai: unknown;
}

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [d, setD] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/analyses/${id}`)
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

  async function remove() {
    if (!confirm("Bu analiz kalıcı olarak silinecek. Devam?")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/analyses/${id}`, { method: "DELETE" });
    if (res.ok) router.replace("/yonetim/analizler");
    else setBusy(false);
  }

  if (loading) return <PageLoading />;
  if (notFound || !d)
    return (
      <div className="space-y-4">
        <BackLink />
        <Notice>Analiz bulunamadı.</Notice>
      </div>
    );

  return (
    <div className="space-y-5">
      <BackLink />

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{d.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {focusLabel(d.focusArea)} · {fmtDate(d.createdAt)} ·{" "}
            {d.ownerKind === "user"
              ? "Üye"
              : d.ownerKind === "guest"
                ? "Misafir"
                : "Anonim"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/analiz/${d.id}`} target="_blank">
            <Button size="sm" variant="outline">
              <ExternalLink className="h-4 w-4" /> Genel sayfa
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={remove}
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" /> Sil
          </Button>
        </div>
      </header>

      <Card className="p-5">
        <h2 className="mb-3 font-display text-base font-semibold">Doğum bilgileri</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <Field k="Tarih" v={d.birthDate} />
          <Field k="Saat" v={d.birthTime ?? "—"} />
          <Field k="Saat doğruluğu" v={d.birthTimeAccuracy} />
          <Field k="Yer" v={d.birthPlace} />
          <Field k="Cinsiyet" v={d.gender ?? "—"} />
          <Field k="Zaman dilimi" v={d.timezone} />
          <Field k="Enlem" v={d.latitude.toFixed(4)} />
          <Field k="Boylam" v={d.longitude.toFixed(4)} />
          <Field k="Sahip anahtarı" v={d.ownerKey ?? "—"} mono />
        </dl>
      </Card>

      <div className="space-y-3">
        <JsonBlock title="Skorlar" data={d.scores} open />
        <JsonBlock title="AI yorumu" data={d.ai} />
        <JsonBlock title="Natal harita" data={d.natal} />
        <JsonBlock title="Transit" data={d.transit} />
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/yonetim/analizler"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" /> Analizler
    </Link>
  );
}

function Field({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className={`truncate ${mono ? "font-mono text-xs" : ""}`}>{v}</dd>
    </div>
  );
}

function JsonBlock({
  title,
  data,
  open,
}: {
  title: string;
  data: unknown;
  open?: boolean;
}) {
  if (data == null)
    return (
      <details className="rounded-2xl border border-border bg-card/60">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
          {title} <span className="text-muted-foreground">(veri yok)</span>
        </summary>
      </details>
    );
  return (
    <details
      open={open}
      className="rounded-2xl border border-border bg-card/60"
    >
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
        {title}
      </summary>
      <pre className="max-h-[28rem] overflow-auto border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}
