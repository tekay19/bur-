"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Me {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
}

export function AuthWidget() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setMe(d.user);
        setIsAdmin(Boolean(d.isAdmin));
      })
      .catch(() => {});
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setMe(null);
    router.refresh();
  }

  if (me) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link
            href="/yonetim"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Yönetim
          </Link>
        )}
        <Link
          href="/hesap"
          title="Hesabım"
          className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 py-1 pl-3 pr-1.5 transition-colors hover:border-primary/40 hover:bg-secondary"
        >
          <span className="hidden text-xs font-medium text-gold sm:inline">
            {me.plan === "premium" ? "Premium" : `${me.credits} kredi`}
          </span>
          <span className="hidden text-sm text-foreground/80 md:inline">
            {me.name || me.email.split("@")[0]}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
            {(me.name || me.email)[0]?.toUpperCase()}
          </span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          aria-label="Çıkış yap"
          title="Çıkış"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Link href="/giris">
      <Button variant="ghost" size="sm">
        <UserIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Giriş</span>
      </Button>
    </Link>
  );
}
