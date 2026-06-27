import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { DashboardTabs } from "@/components/account/DashboardTabs";
import { SID_COOKIE, getUserById, verifySession } from "@/lib/auth";
import { DAILY_TRIAL_COOKIE, trialDaysLeft } from "@/lib/dailyTrial";
import { getUserPrefs } from "@/lib/account";
import { getDailyHoroscope } from "@/lib/horoscope";
import { getDailyHoroscopeAI } from "@/lib/ai/generateDailyHoroscope";
import { getAnalysis } from "@/lib/db/storage";
import { SIGN_GLYPH, signFromLongitude } from "@/lib/astrology/constants";
import { hasDatabase, prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Panelim — Astrotek AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const uid = verifySession(cookies().get(SID_COOKIE)?.value);
  if (!uid) redirect("/giris");
  const user = await getUserById(uid).catch(() => null);
  if (!user) redirect("/giris");

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

  const firstName = user.name?.split(" ")[0] || user.email.split("@")[0];
  const initials = (user.name || user.email)[0]?.toUpperCase() ?? "?";
  const isPremium = user.plan === "premium";

  // Günlük yorum erişimi: premium süresiz, ücretsiz üye 15 gün (cihaz + hesap bazlı).
  const trialRaw = trialDaysLeft(
    cookies().get(DAILY_TRIAL_COOKIE)?.value,
    user.createdAt,
    isPremium,
  );
  const dailyOpen = trialRaw > 0;
  const trialLeft = Number.isFinite(trialRaw) ? trialRaw : 0;

  // Üye + erişim varsa AI günlük yorum (burç+gün cache'li), yoksa kural tabanlı.
  const todayReading = prefs.sign
    ? dailyOpen
      ? await getDailyHoroscopeAI(prefs.sign)
      : getDailyHoroscope(prefs.sign)
    : null;

  // En son haritadan burç + yükselen + evler (ana panelde gösterilir).
  let myChart: {
    sun: { sign: string; glyph: string } | null;
    ascendant: { sign: string; glyph: string } | null;
    hasHouses: boolean;
    houses: {
      house: number;
      lifeArea: string;
      score: number;
      polarity: string;
    }[];
  } | null = null;

  if (charts[0]) {
    const full = await getAnalysis(charts[0].id, [uid]).catch(() => null);
    if (full) {
      const sun = full.natal.planets.find((p) => p.name === "Güneş");
      // Yükselen, planets dizisinde olmayabilir → ascendant derecesinden türet.
      const ascSign =
        full.natal.ascendant !== null && full.natal.ascendant !== undefined
          ? signFromLongitude(full.natal.ascendant).sign
          : null;
      myChart = {
        sun: sun ? { sign: sun.sign, glyph: SIGN_GLYPH[sun.sign] } : null,
        ascendant: ascSign
          ? { sign: ascSign, glyph: SIGN_GLYPH[ascSign] }
          : null,
        hasHouses: full.natal.meta.hasHouses,
        houses: full.houseAnalysis.map((h) => ({
          house: h.house,
          lifeArea: h.lifeArea,
          score: h.score,
          polarity: h.polarity,
        })),
      };
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Karşılama */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-white shadow-lg shadow-primary/20">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Merhaba, {firstName} 👋
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <span
            className={
              isPremium
                ? "inline-flex items-center gap-1.5 self-start rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
                : "inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground"
            }
          >
            <Star className="h-3 w-3" />
            {isPremium ? "Premium üye" : "Ücretsiz üye"}
          </span>
        </header>

        <DashboardTabs
          credits={user.credits}
          isPremium={isPremium}
          dailyOpen={dailyOpen}
          trialLeft={trialLeft}
          prefsSign={prefs.sign}
          prefsDailyEmail={prefs.dailyEmail}
          todayReading={
            todayReading
              ? {
                  signSlug: todayReading.signSlug,
                  signName: todayReading.signName,
                  glyph: todayReading.glyph,
                  dateLabel: todayReading.dateLabel,
                  genel: todayReading.genel,
                }
              : null
          }
          charts={charts.map((c) => ({
            id: c.id,
            name: c.name,
            birthPlace: c.birthPlace,
            focusArea: c.focusArea,
            createdAt: new Date(c.createdAt).getTime(),
          }))}
          myChart={myChart}
        />
      </main>
      <SiteFooter />
    </>
  );
}
