"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
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

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user))
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
        <span className="hidden rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold sm:inline">
          {me.plan === "premium" ? "Premium" : `${me.credits} kredi`}
        </span>
        <span className="hidden text-sm text-foreground/80 md:inline">
          {me.name || me.email.split("@")[0]}
        </span>
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
