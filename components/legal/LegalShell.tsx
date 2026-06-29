import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { LEGAL, LEGAL_PAGES } from "@/lib/legal";

// Tüm yasal sayfalar için ortak, sade ve okunaklı kabuk.
// `prose` eklentisi yerine arbitrary-variant ile başlık/paragraf/liste stillenir.
export function LegalShell({
  title,
  lead,
  current,
  children,
}: {
  title: string;
  lead?: string;
  current: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">
                Ana sayfa
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>

        <header className="mb-8 border-b border-border/60 pb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {lead && (
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              {lead}
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Son güncelleme: {LEGAL.effectiveDate} · Veri sorumlusu:{" "}
            <strong className="text-foreground/80">{LEGAL.controller}</strong>
          </p>
        </header>

        <article
          className="space-y-4 text-[15px] leading-relaxed
            [&_h2]:mt-9 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground
            [&_h3]:mt-5 [&_h3]:font-semibold [&_h3]:text-foreground
            [&_p]:text-foreground/80
            [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-foreground/80
            [&_li]:marker:text-primary/60
            [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80
            [&_strong]:text-foreground
            [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
            [&_th]:border [&_th]:border-border/60 [&_th]:bg-secondary/40 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left
            [&_td]:border [&_td]:border-border/60 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-foreground/80"
        >
          {children}
        </article>

        {/* Diğer yasal belgeler */}
        <div className="mt-12 rounded-2xl border border-border/60 bg-card/50 p-5">
          <p className="text-sm font-semibold text-foreground">Diğer yasal belgeler</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {LEGAL_PAGES.filter((p) => p.href !== current).map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  → {p.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Sorularınız için:{" "}
            <a
              href={`mailto:${LEGAL.contactEmail}`}
              className="text-primary underline underline-offset-2"
            >
              {LEGAL.contactEmail}
            </a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
