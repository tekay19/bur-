"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CreditCard,
  Ghost,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/yonetim", label: "Genel Bakış", icon: LayoutDashboard, exact: true },
  { href: "/yonetim/trafik", label: "Trafik (GA4)", icon: BarChart3 },
  { href: "/yonetim/durum", label: "Sistem Durumu", icon: Activity },
  { href: "/yonetim/uyeler", label: "Üyeler", icon: Users },
  { href: "/yonetim/misafirler", label: "Misafirler", icon: Ghost },
  { href: "/yonetim/analizler", label: "Analizler", icon: Sparkles },
  { href: "/yonetim/satislar", label: "Satışlar", icon: CreditCard },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/");
  }

  return (
    <aside className="lg:w-60 lg:flex-shrink-0">
      <div className="rounded-3xl border border-primary/20 bg-card/85 p-3 backdrop-blur-xl lg:sticky lg:top-6">
        <div className="mb-3 px-2 pt-1">
          <p className="font-display text-lg font-bold tracking-tight">
            Yönetim
          </p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
          {ITEMS.map((it) => {
            const active = it.exact
              ? pathname === it.href
              : pathname.startsWith(it.href);
            const Icon = it.icon;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex flex-shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 flex gap-1.5 border-t border-border pt-3 lg:flex-col">
          <Link
            href="/"
            className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Siteye dön
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-destructive/15 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Çıkış
          </button>
        </div>
      </div>
    </aside>
  );
}
