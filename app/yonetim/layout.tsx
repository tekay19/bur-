import { redirect } from "next/navigation";
import { getAdminFromCookies } from "@/lib/admin";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = {
  title: "Yönetim — Astrotek AI",
  robots: { index: false, follow: false },
};

// Oturum çerezine göre her istekte yeniden değerlendir (statik cache yok).
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Yetki: ADMIN_EMAILS listesinde + giriş yapmış olmalı; değilse ana sayfaya.
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:px-5 lg:flex-row lg:gap-6 lg:py-8">
      <AdminNav email={admin.email} />
      <main className="min-w-0 flex-1 pb-12">{children}</main>
    </div>
  );
}
