import { hasDatabase, prisma } from "./db/prisma";
import { CREDIT_PACKS } from "./creditPacks";
import { hashPassword } from "./auth";

// ============================================================
// Admin veri katmanı — yalnızca DB (Postgres) modunda anlamlıdır.
// DB yoksa fonksiyonlar boş/null döner; sayfalar "DB bağlı değil" gösterir.
// Tüm yazılar (kredi/plan/sil) çağıran admin API'lerinde yetki kontrolünden
// SONRA çağrılır.
// ============================================================

export const adminHasDb = hasDatabase && Boolean(prisma);

const DAY = 86_400_000;
const since = (days: number) => new Date(Date.now() - days * DAY);

// Kredi sayısından paket/fiyat türet (Satışlar için). 3 ve 10 farklı → güvenli.
function packByCredits(credits: number) {
  return CREDIT_PACKS.find((p) => p.credits === credits) ?? null;
}

// recipient "user:<uid>" | "guest:<aid>" → tip + id
function parseRecipient(r: string): { type: "user" | "guest" | "?"; id: string } {
  const i = r.indexOf(":");
  if (i < 0) return { type: "?", id: r };
  const t = r.slice(0, i);
  return {
    type: t === "user" ? "user" : t === "guest" ? "guest" : "?",
    id: r.slice(i + 1),
  };
}

// ownerKey üye uid'i mi (cuid, tiresiz) yoksa misafir aid'i mi (uuid, tireli)?
export function ownerKind(ownerKey: string | null): "user" | "guest" | "anon" {
  if (!ownerKey) return "anon";
  return ownerKey.includes("-") ? "guest" : "user";
}

export interface AdminStats {
  members: { total: number; new24h: number; new7d: number; new30d: number };
  guests: { total: number; new7d: number };
  analyses: {
    total: number;
    new24h: number;
    new7d: number;
    daily: { date: string; count: number }[];
  };
  credits: { outstanding: number; purchased: number; spent: number };
  plans: { free: number; premium: number };
  sales: {
    count: number;
    creditsSold: number;
    revenueUsd: number;
    recent: SaleRow[];
  };
  recentMembers: {
    id: string;
    email: string;
    name: string | null;
    credits: number;
    plan: string;
    createdAt: string;
  }[];
}

export async function getStats(): Promise<AdminStats | null> {
  if (!adminHasDb || !prisma) return null;

  const [
    mTotal,
    m24,
    m7,
    m30,
    gTotal,
    g7,
    aTotal,
    a24,
    a7,
    userAgg,
    acctAgg,
    byPlan,
    chartsForSeries,
    payments,
    recentMembers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since(1) } } }),
    prisma.user.count({ where: { createdAt: { gte: since(7) } } }),
    prisma.user.count({ where: { createdAt: { gte: since(30) } } }),
    prisma.creditAccount.count(),
    prisma.creditAccount.count({ where: { createdAt: { gte: since(7) } } }),
    prisma.userChart.count(),
    prisma.userChart.count({ where: { createdAt: { gte: since(1) } } }),
    prisma.userChart.count({ where: { createdAt: { gte: since(7) } } }),
    prisma.user.aggregate({
      _sum: { credits: true, totalPurchased: true, totalSpent: true },
    }),
    prisma.creditAccount.aggregate({
      _sum: { credits: true, totalPurchased: true, totalSpent: true },
    }),
    prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),
    prisma.userChart.findMany({
      where: { createdAt: { gte: since(30) } },
      select: { createdAt: true },
    }),
    prisma.processedPayment.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        plan: true,
        createdAt: true,
      },
    }),
  ]);

  // Son 14 günün günlük analiz serisi (JS tarafında kovala — dialect-bağımsız).
  const buckets = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    buckets.set(new Date(Date.now() - i * DAY).toISOString().slice(0, 10), 0);
  }
  for (const c of chartsForSeries) {
    const key = c.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const daily = Array.from(buckets, ([date, count]) => ({ date, count }));

  const creditsOutstanding =
    (userAgg._sum.credits ?? 0) + (acctAgg._sum.credits ?? 0);
  const purchased =
    (userAgg._sum.totalPurchased ?? 0) + (acctAgg._sum.totalPurchased ?? 0);
  const spent = (userAgg._sum.totalSpent ?? 0) + (acctAgg._sum.totalSpent ?? 0);

  let free = 0;
  let premium = 0;
  for (const row of byPlan) {
    if (row.plan === "premium") premium = row._count._all;
    else free += row._count._all;
  }

  let creditsSold = 0;
  let revenueUsd = 0;
  const recentSales: SaleRow[] = [];
  for (const p of payments) {
    creditsSold += p.credits;
    const pack = packByCredits(p.credits);
    revenueUsd += pack?.price ?? 0;
    if (recentSales.length < 8) {
      const rec = parseRecipient(p.recipient);
      recentSales.push({
        id: p.id,
        credits: p.credits,
        packLabel: pack?.label ?? `${p.credits} kredi`,
        amountUsd: pack?.price ?? 0,
        recipientType: rec.type,
        recipientId: rec.id,
        createdAt: p.createdAt.toISOString(),
      });
    }
  }

  return {
    members: { total: mTotal, new24h: m24, new7d: m7, new30d: m30 },
    guests: { total: gTotal, new7d: g7 },
    analyses: { total: aTotal, new24h: a24, new7d: a7, daily },
    credits: { outstanding: creditsOutstanding, purchased, spent },
    plans: { free, premium },
    sales: {
      count: payments.length,
      creditsSold,
      revenueUsd: Math.round(revenueUsd * 100) / 100,
      recent: recentSales,
    },
    recentMembers: recentMembers.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    })),
  };
}

// --- Üyeler ---
export interface MemberRow {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  plan: string;
  totalPurchased: number;
  totalSpent: number;
  createdAt: string;
}

export async function listMembers(opts: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: MemberRow[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(5, opts.pageSize ?? 25));
  if (!adminHasDb || !prisma) return { rows: [], total: 0, page, pageSize };

  const q = opts.q?.trim();
  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" as const } },
          { name: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    rows: users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      credits: u.credits,
      plan: u.plan,
      totalPurchased: u.totalPurchased,
      totalSpent: u.totalSpent,
      createdAt: u.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
  };
}

export async function getMemberDetail(id: string) {
  if (!adminHasDb || !prisma) return null;
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) return null;
  const [charts, payments] = await Promise.all([
    prisma.userChart.findMany({
      where: { ownerKey: id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        name: true,
        birthPlace: true,
        focusArea: true,
        createdAt: true,
      },
    }),
    prisma.processedPayment.findMany({
      where: { recipient: `user:${id}` },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return {
    user: {
      id: u.id,
      email: u.email,
      name: u.name,
      credits: u.credits,
      plan: u.plan,
      totalPurchased: u.totalPurchased,
      totalSpent: u.totalSpent,
      createdAt: u.createdAt.toISOString(),
    },
    charts: charts.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })),
    payments: payments.map((p) => {
      const pack = packByCredits(p.credits);
      return {
        id: p.id,
        credits: p.credits,
        amountUsd: pack?.price ?? 0,
        createdAt: p.createdAt.toISOString(),
      };
    }),
  };
}

// Krediyi delta ile ayarla (0'ın altına inmez). Yeni bakiyeyi döndürür.
export async function adjustMemberCredits(
  id: string,
  delta: number,
): Promise<number | null> {
  if (!adminHasDb || !prisma) return null;
  const u = await prisma.user.findUnique({ where: { id }, select: { credits: true } });
  if (!u) return null;
  const next = Math.max(0, u.credits + Math.trunc(delta));
  const updated = await prisma.user.update({
    where: { id },
    data: { credits: next },
    select: { credits: true },
  });
  return updated.credits;
}

export async function setMemberPlan(
  id: string,
  plan: "free" | "premium",
): Promise<boolean> {
  if (!adminHasDb || !prisma) return false;
  const res = await prisma.user.updateMany({ where: { id }, data: { plan } });
  return res.count > 0;
}

// ADMIN_EMAILS listesi (admin hesaplarını silme/koruma için — env tek kaynak).
const ADMIN_EMAILS_SET = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);
const isProtectedAdmin = (email: string) =>
  ADMIN_EMAILS_SET.has(email.toLowerCase().trim());

// KVKK uyumlu tam silme: analizler (+sonuçlar cascade) + sıfırlama token'ları + üye.
// GÜVENLİK: admin hesabı veya işlemi yapan adminin KENDİSİ silinemez (kilitlenme).
export async function deleteMember(
  id: string,
  actingId?: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!adminHasDb || !prisma)
    return { ok: false, error: "Veritabanı bağlı değil." };
  if (actingId && id === actingId)
    return { ok: false, error: "Kendi hesabını silemezsin." };
  const u = await prisma.user.findUnique({
    where: { id },
    select: { email: true },
  });
  if (!u) return { ok: false, error: "Üye bulunamadı." };
  if (isProtectedAdmin(u.email))
    return {
      ok: false,
      error: "Admin hesabı silinemez — önce ADMIN_EMAILS'ten çıkar.",
    };
  try {
    await prisma.$transaction([
      prisma.userChart.deleteMany({ where: { ownerKey: id } }),
      prisma.passwordResetToken.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);
    return { ok: true };
  } catch {
    return { ok: false, error: "Silinemedi." };
  }
}

// Admin: üyeye yeni şifre belirle (hash'lenerek yazılır).
export async function setMemberPassword(
  id: string,
  newPassword: string,
): Promise<boolean> {
  if (!adminHasDb || !prisma) return false;
  const res = await prisma.user.updateMany({
    where: { id },
    data: { passwordHash: hashPassword(newPassword) },
  });
  return res.count > 0;
}

// Admin: panelden yeni üye oluştur.
export async function createMember(input: {
  email: string;
  password: string;
  name?: string | null;
  plan?: "free" | "premium";
  credits?: number;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!adminHasDb || !prisma)
    return { ok: false, error: "Veritabanı bağlı değil." };
  const email = input.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "Bu e-posta zaten kayıtlı." };
  const u = await prisma.user.create({
    data: {
      email,
      passwordHash: hashPassword(input.password),
      name: input.name?.trim() || null,
      plan: input.plan === "premium" ? "premium" : "free",
      credits: Math.max(0, Math.trunc(input.credits ?? 0)),
    },
    select: { id: true },
  });
  return { ok: true, id: u.id };
}

// --- Misafir hesaplar (CreditAccount) ---
export interface GuestRow {
  id: string;
  credits: number;
  totalPurchased: number;
  totalSpent: number;
  recoveryCode: string;
  createdAt: string;
}

export async function listGuests(opts: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: GuestRow[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(5, opts.pageSize ?? 25));
  if (!adminHasDb || !prisma) return { rows: [], total: 0, page, pageSize };

  const q = opts.q?.trim();
  const where = q
    ? {
        OR: [
          { id: { contains: q, mode: "insensitive" as const } },
          { recoveryCode: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, accts] = await Promise.all([
    prisma.creditAccount.count({ where }),
    prisma.creditAccount.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    rows: accts.map((a) => ({
      id: a.id,
      credits: a.credits,
      totalPurchased: a.totalPurchased,
      totalSpent: a.totalSpent,
      recoveryCode: a.recoveryCode,
      createdAt: a.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
  };
}

export async function adjustGuestCredits(
  id: string,
  delta: number,
): Promise<number | null> {
  if (!adminHasDb || !prisma) return null;
  const a = await prisma.creditAccount.findUnique({
    where: { id },
    select: { credits: true },
  });
  if (!a) return null;
  const next = Math.max(0, a.credits + Math.trunc(delta));
  const updated = await prisma.creditAccount.update({
    where: { id },
    data: { credits: next },
    select: { credits: true },
  });
  return updated.credits;
}

// --- Analizler ---
export interface AnalysisRow {
  id: string;
  name: string;
  birthDate: string;
  birthPlace: string;
  focusArea: string;
  ownerKind: "user" | "guest" | "anon";
  ownerKey: string | null;
  createdAt: string;
}

export async function listAnalyses(opts: {
  q?: string;
  focusArea?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: AnalysisRow[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(5, opts.pageSize ?? 25));
  if (!adminHasDb || !prisma) return { rows: [], total: 0, page, pageSize };

  const q = opts.q?.trim();
  const and: Record<string, unknown>[] = [];
  if (q) {
    and.push({
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { birthPlace: { contains: q, mode: "insensitive" as const } },
      ],
    });
  }
  if (opts.focusArea) and.push({ focusArea: opts.focusArea });
  const where = and.length ? { AND: and } : {};

  const [total, charts] = await Promise.all([
    prisma.userChart.count({ where }),
    prisma.userChart.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        birthDate: true,
        birthPlace: true,
        focusArea: true,
        ownerKey: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    rows: charts.map((c) => ({
      id: c.id,
      name: c.name,
      birthDate: c.birthDate,
      birthPlace: c.birthPlace,
      focusArea: c.focusArea,
      ownerKind: ownerKind(c.ownerKey),
      ownerKey: c.ownerKey,
      createdAt: c.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
  };
}

// Admin detayı — sahiplik kontrolü YOK (yetkili admin her kaydı görebilir).
export async function getAnalysisAdmin(id: string) {
  if (!adminHasDb || !prisma) return null;
  const chart = await prisma.userChart.findUnique({
    where: { id },
    include: { results: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!chart) return null;
  const r = chart.results[0] ?? null;
  return {
    id: chart.id,
    name: chart.name,
    gender: chart.gender,
    birthDate: chart.birthDate,
    birthTime: chart.birthTime,
    birthPlace: chart.birthPlace,
    latitude: chart.latitude,
    longitude: chart.longitude,
    timezone: chart.timezone,
    birthTimeAccuracy: chart.birthTimeAccuracy,
    focusArea: chart.focusArea,
    ownerKind: ownerKind(chart.ownerKey),
    ownerKey: chart.ownerKey,
    createdAt: chart.createdAt.toISOString(),
    natal: r?.natalJson ?? null,
    transit: r?.transitJson ?? null,
    scores: r?.scoresJson ?? null,
    ai: r?.aiInterpretationJson ?? null,
  };
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  if (!adminHasDb || !prisma) return false;
  try {
    await prisma.userChart.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// --- Satışlar (ProcessedPayment) ---
export interface SaleRow {
  id: string;
  credits: number;
  packLabel: string;
  amountUsd: number;
  recipientType: "user" | "guest" | "?";
  recipientId: string;
  createdAt: string;
}

export async function listSales(opts: {
  page?: number;
  pageSize?: number;
}): Promise<{
  rows: SaleRow[];
  total: number;
  page: number;
  pageSize: number;
  revenueUsd: number;
  creditsSold: number;
}> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(5, opts.pageSize ?? 25));
  if (!adminHasDb || !prisma)
    return { rows: [], total: 0, page, pageSize, revenueUsd: 0, creditsSold: 0 };

  const [total, all, pageRows] = await Promise.all([
    prisma.processedPayment.count(),
    prisma.processedPayment.findMany({ select: { credits: true } }),
    prisma.processedPayment.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  let revenueUsd = 0;
  let creditsSold = 0;
  for (const p of all) {
    creditsSold += p.credits;
    revenueUsd += packByCredits(p.credits)?.price ?? 0;
  }

  return {
    rows: pageRows.map((p) => {
      const pack = packByCredits(p.credits);
      const rec = parseRecipient(p.recipient);
      return {
        id: p.id,
        credits: p.credits,
        packLabel: pack?.label ?? `${p.credits} kredi`,
        amountUsd: pack?.price ?? 0,
        recipientType: rec.type,
        recipientId: rec.id,
        createdAt: p.createdAt.toISOString(),
      };
    }),
    total,
    page,
    pageSize,
    revenueUsd: Math.round(revenueUsd * 100) / 100,
    creditsSold,
  };
}
