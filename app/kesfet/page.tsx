import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SID_COOKIE, verifySession } from "@/lib/auth";
import { OnboardingFunnel } from "@/components/funnel/OnboardingFunnel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ücretsiz Astroloji Analizi — Hemen Başla",
  description:
    "Birkaç kısa soruyla ruh burcunu bul, doğum bilgilerinle kişisel astroloji analizini saniyeler içinde hazırla. Ücretsiz başla.",
  robots: { index: false, follow: false },
};

export default function KesfetPage() {
  // Zaten üye olanlar testle uğraşmasın → doğrudan harita formuna.
  const isMember = Boolean(verifySession(cookies().get(SID_COOKIE)?.value));
  if (isMember) redirect("/harita-olustur");

  return (
    <main className="relative min-h-screen overflow-hidden">
      <OnboardingFunnel />
    </main>
  );
}
