import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Clock, KeyRound, Moon, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { BuyCredits } from "@/components/account/BuyCredits";
import { LogoutButton } from "@/components/account/LogoutButton";
import { SignPreference } from "@/components/account/SignPreference";
import { SID_COOKIE, getUserById, verifySession } from "@/lib/auth";
import { getUserPrefs } from "@/lib/account";
import { getDailyHoroscope } from "@/lib/horoscope";
import { hasDatabase, prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Hesabım — Astrotek AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const FOCUS: Record<string, string> = {
  general: "Genel",
  career: "Kariyer",
  exam: "Sınav",
  relationship: "İlişki",
  money: "Para",
  education: "Eğitim",
  relocation: "Taşınma",
  spiritual: "Ruhsal",
};

export default async function AccountPage() {
  // Korumalı: giriş yoksa giriş sayfasına yönlendir.
  const uid = verifySession(cookies().get(SID_COOKIE)?.value);
  if (!uid) redirect("/giris");
  const user = await getUserById(uid).catch(() => null);
  if (!user) redirect("/giris");

  // Kullanıcının analiz geçmişi (kendi kayıtları — ownerKey = uid).
  const charts =
    hasDatabase && prisma
      ? await prisma.userChart.findMany({
          where: { ownerKey: uid },
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            name: true,
            birthPlace: true,
            focusArea: true,
            createdAt: true,
          },
        })
      : [];

  const prefs = await getUserPrefs(uid);
  const todayReading = prefs.sign ? getDailyHoroscope(prefs.sign) : null;

  const initials = (user.name || user.email)[0]?.toUpperCase() ?? "?";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Üst — hesap özeti */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-white">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                Merhaba, {user.name || user.email.split("@")[0]}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <span
            className={
              user.plan === "premium"
                ? "self-start rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
                : "self-start rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground"
            }
          >
            {user.plan === "premium" ? "Premium üye" : "Ücretsiz üye"}
          </span>
        </header>

        {/* Kredi bakiyesi */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md sm:col-span-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4" />
              <span className="text-xs">Kredi bakiyen</span>
            </div>
            <p className="mt-2 font-display text-4xl font-bold">{user.credits}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Her analiz 1 kredi harcar
            </p>
            <Link href="/harita-olustur" className="mt-4 inline-block">
              <Button variant="outline" size="sm" className="w-full">
                <Sparkles className="h-4 w-4" /> Yeni analiz
              </Button>
            </Link>
          </div>

          {/* Kredi satın al — ÖDEME burada */}
          <div className="rounded-3xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md sm:col-span-2">
            <h2 className="mb-4 font-display text-lg font-semibold">
              Kredi Satın Al
            </h2>
            <BuyCredits />
          </div>
        </section>

        {/* Günlük burç yorumu — burcunu kaydet */}
        <section className="mt-8 rounded-3xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md">
          <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold">
            <Moon className="h-5 w-5 text-gold" /> Günlük Burç Yorumun
          </h2>

          {todayReading && (
            <div className="mb-5 mt-3 rounded-2xl border border-primary/15 bg-secondary/30 p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl text-primary" aria-hidden>{todayReading.glyph}</span>
                <div>
                  <p className="text-sm font-semibold">{todayReading.signName} · Bugün</p>
                  <p className="text-xs capitalize text-muted-foreground">{todayReading.dateLabel}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/85">{todayReading.genel}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <p className="text-xs text-muted-foreground"><strong className="text-accent">Aşk:</strong> {todayReading.ask}</p>
                <p className="text-xs text-muted-foreground"><strong className="text-gold">Kariyer:</strong> {todayReading.kariyer}</p>
                <p className="text-xs text-muted-foreground"><strong className="text-success">Para:</strong> {todayReading.para}</p>
              </div>
              <Link
                href={`/burc-yorumlari/${todayReading.signSlug}`}
                className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
              >
                Tam günlük yorum, haftalık & aylık →
              </Link>
            </div>
          )}

          <SignPreference initialSign={prefs.sign} initialDailyEmail={prefs.dailyEmail} />
        </section>

        {/* Analiz geçmişi */}
        <section className="mt-8">
          <h2 className="mb-4 font-display text-lg font-semibold">
            Analizlerim ({charts.length})
          </h2>
          {charts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-secondary/30 p-6 text-center text-sm text-muted-foreground">
              Henüz analizin yok.{" "}
              <Link href="/harita-olustur" className="font-medium text-primary hover:underline">
                İlk analizini oluştur →
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {charts.map((c) => (
                <Link
                  key={c.id}
                  href={`/analiz/${c.id}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-card/60 p-4 backdrop-blur-md transition-colors hover:border-primary/40"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {FOCUS[c.focusArea] ?? c.focusArea} · {c.birthPlace}
                    </p>
                  </div>
                  <span className="flex flex-shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(c.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Ayarlar */}
        <section className="mt-8">
          <h2 className="mb-4 font-display text-lg font-semibold">Ayarlar</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/sifremi-unuttum">
              <Button variant="outline" size="sm">
                <KeyRound className="h-4 w-4" /> Şifre değiştir
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
