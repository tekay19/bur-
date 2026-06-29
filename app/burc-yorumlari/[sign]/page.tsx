import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Activity, Briefcase, Heart, Lightbulb, Moon, Star, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { TestsSection } from "@/components/marketing/TestsSection";
import { TransitBanner } from "@/components/horoscope/TransitBanner";
import { PremiumLock } from "@/components/horoscope/PremiumLock";
import { SID_COOKIE, getUserById, verifySession } from "@/lib/auth";
import { DAILY_TRIAL_COOKIE, trialDaysLeft } from "@/lib/dailyTrial";
import { getDailyHoroscopeAI } from "@/lib/ai/generateDailyHoroscope";
import { getAllSigns, getSign } from "@/lib/zodiac";
import {
  getDailyHoroscope,
  getMonthlyHoroscope,
  getTransitAlerts,
  getWeeklyHoroscope,
} from "@/lib/horoscope";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotekai.com";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { sign: string } }): Metadata {
  const s = getSign(params.sign);
  if (!s) return { title: "Bulunamadı" };
  const title = `${s.name} Burcu Günlük Yorum — Bugün`;
  const description = `${s.name} burcu günlük yorumu: bugün aşk, kariyer, para ve genel yorumun. Her gün güncellenir, ücretsiz. ${s.name} burcunu bugün ne bekliyor?`;
  return {
    title,
    description,
    keywords: [
      `${s.name.toLowerCase()} günlük yorum`,
      `${s.name.toLowerCase()} burcu günlük`,
      `${s.name.toLowerCase()} bugün`,
      `${s.name.toLowerCase()} burç yorumu`,
      "günlük burç yorumu",
    ],
    alternates: { canonical: `/burc-yorumlari/${s.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/burc-yorumlari/${s.slug}`,
      locale: "tr_TR",
      images: [{ url: `${SITE_URL}/api/og/burc-yorumlari?sign=${s.slug}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [`${SITE_URL}/api/og/burc-yorumlari?sign=${s.slug}`],
    },
  };
}

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < n ? "h-3.5 w-3.5 fill-gold text-gold" : "h-3.5 w-3.5 text-muted-foreground/30"}
        />
      ))}
    </span>
  );
}

export default async function SignHoroscopePage({
  params,
}: {
  params: { sign: string };
}) {
  const sign = getSign(params.sign);
  if (!sign) notFound();
  const today = new Date();
  let h = getDailyHoroscope(sign.slug, today);
  if (!h) notFound();

  // Erişim: günlük detaylı yorum üyelik planına dahildir.
  // - Premium üye: süresiz.
  // - Ücretsiz üye: cihaz başına 15 günlük deneme.
  // - Misafir: kilitli (üyeliğe yönlendirilir).
  const uid = verifySession(cookies().get(SID_COOKIE)?.value);
  const user = uid ? await getUserById(uid).catch(() => null) : null;
  const isMember = Boolean(user);
  const isPremium = user?.plan === "premium";
  const trialLeft = trialDaysLeft(
    cookies().get(DAILY_TRIAL_COOKIE)?.value,
    user?.createdAt ?? 0,
    isPremium,
  );
  const showDeep = isMember && trialLeft > 0;

  // Üye + erişim varsa günlük yorum AI ile yazılır (burç+gün başına cache'li).
  if (showDeep) {
    h = (await getDailyHoroscopeAI(sign.slug, today)) ?? h;
  }

  const others = getAllSigns().filter((s) => s.slug !== sign.slug);
  const alerts = getTransitAlerts(today);
  const weekly = showDeep ? getWeeklyHoroscope(sign.slug, today) : null;
  const monthly = showDeep ? getMonthlyHoroscope(sign.slug, today) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${sign.name} Burcu Günlük Yorum`,
    description: h.genel,
    inLanguage: "tr-TR",
    datePublished: h.date,
    dateModified: h.date,
    author: { "@type": "Organization", name: "Astrotek AI" },
    publisher: { "@type": "Organization", name: "Astrotek AI" },
    mainEntityOfPage: `${SITE_URL}/burc-yorumlari/${sign.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-foreground">Ana sayfa</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/burc-yorumlari" className="hover:text-foreground">Günlük Yorumlar</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground/80" aria-current="page">{sign.name}</li>
          </ol>
        </nav>

        <header className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/25 to-accent/20 text-4xl text-primary ring-1 ring-primary/20">
            <span aria-hidden>{sign.glyph}</span>
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {sign.name} Burcu Günlük Yorum
            </h1>
            <p className="text-sm capitalize text-muted-foreground">{h.dateLabel}</p>
          </div>
        </header>

        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Moon className="h-4 w-4 text-gold" /> Bugün Ay <strong className="text-foreground/90">{h.moonSign}</strong> burcunda
        </p>

        {alerts.length > 0 && (
          <div className="mt-4">
            <TransitBanner alerts={alerts} />
          </div>
        )}

        {/* Genel — ÜCRETSİZ (herkese açık, SEO) */}
        <section className="mt-6 rounded-3xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md sm:p-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Bugün Genel</h2>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                {h.tema}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-gold" /> Enerji
                <Stars n={h.genelEnerji} />
              </span>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-foreground/90">{h.genel}</p>
        </section>

        {/* Ay evresi · günün tavsiyesi · uyumlu burç — ÜCRETSİZ */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary/15 bg-card/50 p-5 backdrop-blur-md">
            <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold"><Moon className="h-4 w-4 text-gold" /> Ay Evresi</p>
            <p className="text-sm font-medium text-primary">{h.ayEvresi.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{h.ayEvresi.meaning}</p>
          </div>
          <div className="rounded-2xl border border-primary/15 bg-card/50 p-5 backdrop-blur-md">
            <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold"><Lightbulb className="h-4 w-4 text-gold" /> Günün Tavsiyesi</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.gununTavsiyesi}</p>
          </div>
          <div className="rounded-2xl border border-primary/15 bg-card/50 p-5 backdrop-blur-md">
            <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold"><Heart className="h-4 w-4 text-accent" /> Bugün Uyumlu Burç</p>
            <p className="mt-1 text-lg font-semibold text-primary">{h.uyumluBurc}</p>
            <p className="text-xs text-muted-foreground">Bugün enerjiniz uyumlu.</p>
          </div>
        </div>

        {/* Aşk / Kariyer / Para — üyelik planı (premium veya 15 gün deneme) */}
        {showDeep ? (
          <div className="mt-6 space-y-4">
            {!isPremium && trialLeft > 0 && (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gold/25 bg-gold/5 px-4 py-2.5 text-sm">
                <span className="text-foreground/85">
                  ✨ Ücretsiz günlük yorum denemen:{" "}
                  <strong className="text-gold">{trialLeft} gün</strong> kaldı
                </span>
                <Link
                  href="/hesap"
                  className="flex-shrink-0 text-xs font-medium text-gold hover:underline"
                >
                  Premium&apos;a geç →
                </Link>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DeepCard icon={<Heart className="h-4 w-4 text-accent" />} title="Aşk" stars={h.enerji.ask} text={h.ask} />
              <DeepCard icon={<Briefcase className="h-4 w-4 text-gold" />} title="Kariyer" stars={h.enerji.kariyer} text={h.kariyer} />
              <DeepCard icon={<Wallet className="h-4 w-4 text-success" />} title="Para" stars={h.enerji.para} text={h.para} />
              <DeepCard icon={<Activity className="h-4 w-4 text-primary" />} title="Sağlık" stars={h.enerji.saglik} text={h.saglik} />
            </div>
            <div className="flex flex-wrap gap-3 rounded-2xl border border-gold/25 bg-gold/5 p-4 text-sm">
              <span>🎨 Şanslı renk: <strong className="text-gold">{h.sansliRenk}</strong></span>
              <span>🔢 Şanslı sayı: <strong className="text-gold">{h.sansliSayi}</strong></span>
            </div>

            {/* Haftalık & Aylık — üyeye özel */}
            <div className="grid gap-4 sm:grid-cols-2">
              {weekly && (
                <div className="rounded-2xl border border-primary/15 bg-card/60 p-5 backdrop-blur-md">
                  <p className="mb-1 text-sm font-semibold">{weekly.title}</p>
                  <p className="mb-2 text-xs text-muted-foreground">{weekly.range}</p>
                  {weekly.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted-foreground">{p}</p>
                  ))}
                </div>
              )}
              {monthly && (
                <div className="rounded-2xl border border-primary/15 bg-card/60 p-5 backdrop-blur-md">
                  <p className="mb-1 text-sm font-semibold">{monthly.title}</p>
                  <p className="mb-2 text-xs capitalize text-muted-foreground">{monthly.range}</p>
                  {monthly.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted-foreground">{p}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <PremiumLock
            teasers={[
              { key: "ask", title: "Aşk", text: h.ask, stars: h.enerji.ask },
              {
                key: "kariyer",
                title: "Kariyer",
                text: h.kariyer,
                stars: h.enerji.kariyer,
              },
              { key: "para", title: "Para", text: h.para, stars: h.enerji.para },
            ]}
            expired={isMember}
          />
        )}

        {/* Diğer burçlar */}
        <nav aria-label="Diğer burçlar" className="mt-10">
          <h2 className="mb-3 font-display text-base font-semibold">Diğer burçların bugünü</h2>
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/burc-yorumlari/${s.slug}`}
                  className="flex flex-col items-center gap-1 rounded-xl border border-primary/10 bg-card/50 px-2 py-2.5 text-center transition-colors hover:border-primary/30 hover:bg-card/80"
                >
                  <span className="text-lg text-primary" aria-hidden>{s.glyph}</span>
                  <span className="text-[11px] font-medium">{s.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10">
          <Link href={`/burclar/${sign.slug}`} className="text-sm font-medium text-primary hover:underline">
            {sign.name} burcunun tüm özellikleri →
          </Link>
        </div>

        <div className="mt-10">
          <TestsSection compact />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function DeepCard({ icon, title, stars, text }: { icon: React.ReactNode; title: string; stars: number; text: string }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-card/60 p-5 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold">{icon} {title}</span>
        <Stars n={stars} />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

