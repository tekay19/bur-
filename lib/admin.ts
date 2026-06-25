import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  SID_COOKIE,
  getUserById,
  verifySession,
  type PublicUser,
} from "./auth";

// ============================================================
// Süperadmin erişimi — ADMIN_EMAILS env listesine dayanır (şema değişikliği yok).
// Admin: bu listede bulunan e-postayla KAYITLI + GİRİŞ yapmış bir User olmalı.
// ADMIN_EMAILS=virgülle ayrık (örn. "ben@site.com, ortak@site.com").
// ============================================================

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function adminConfigured(): boolean {
  return ADMIN_EMAILS.length > 0;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

// --- Server Component (layout) tarafı: next/headers cookies() ---
export async function getAdminFromCookies(): Promise<PublicUser | null> {
  const uid = verifySession(cookies().get(SID_COOKIE)?.value);
  if (!uid) return null;
  const user = await getUserById(uid).catch(() => null);
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

// --- API Route (NextRequest) tarafı ---
export async function getAdminFromRequest(
  req: NextRequest,
): Promise<PublicUser | null> {
  const uid = verifySession(req.cookies.get(SID_COOKIE)?.value);
  if (!uid) return null;
  const user = await getUserById(uid).catch(() => null);
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

// Admin değilse standart 403 yanıtı (varlığı ele vermeden net hata).
export function adminForbidden(): NextResponse {
  return NextResponse.json(
    { error: "Bu işlem için yetkin yok." },
    { status: 403 },
  );
}
