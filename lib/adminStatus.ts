import { hasDatabase, prisma } from "./db/prisma";
import { verifyEmail } from "./email";

// Sistem Durumu paneli — operasyonel kör noktayı kapatır.
// "Yapılandırılmış mı?" (env) + mümkünse "gerçekten çalışıyor mu?" (canlı test).

export type StatusLevel = "ok" | "warn" | "error" | "off";

export interface StatusCheck {
  key: string;
  label: string;
  level: StatusLevel;
  detail: string;
}

const has = (v: string | undefined | null) => Boolean(v && v.trim());

const EXPECTED_DOMAIN = "astrotekai.com";

// AI anahtarını canlı doğrula (OpenAI-uyumlu /models). "Geçersiz anahtar"ı yakalar.
async function checkAi(): Promise<StatusCheck> {
  const key = process.env.AI_API_KEY ?? process.env.GEMINI_API_KEY;
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";
  if (!key)
    return {
      key: "ai",
      label: "AI (yorum motoru)",
      level: "warn",
      detail: "AI_API_KEY yok — yorumlar kural-tabanlı şablona düşer (çalışır ama AI yok).",
    };
  const base = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/models`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok)
      return { key: "ai", label: "AI (yorum motoru)", level: "ok", detail: `Anahtar geçerli · ${model}` };
    const txt = (await res.text()).replace(/\s+/g, " ").slice(0, 140);
    return {
      key: "ai",
      label: "AI (yorum motoru)",
      level: "error",
      detail: `Anahtar GEÇERSİZ — AI ${res.status}: ${txt}`,
    };
  } catch (e) {
    return {
      key: "ai",
      label: "AI (yorum motoru)",
      level: "error",
      detail: `Bağlanılamadı: ${(e as Error).message}`,
    };
  }
}

async function checkDb(): Promise<StatusCheck> {
  if (!hasDatabase || !prisma)
    return { key: "db", label: "Veritabanı", level: "error", detail: "DATABASE_URL tanımlı değil." };
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { key: "db", label: "Veritabanı", level: "ok", detail: "Bağlantı sağlıklı (Neon/PostgreSQL)." };
  } catch (e) {
    return { key: "db", label: "Veritabanı", level: "error", detail: `Bağlanılamadı: ${(e as Error).message}` };
  }
}

async function checkEmail(): Promise<StatusCheck> {
  const r = await verifyEmail();
  if (!r.configured)
    return {
      key: "smtp",
      label: "E-posta (SMTP)",
      level: "warn",
      detail: "SMTP_HOST yok — hoş geldin/şifre/günlük yorum mailleri GÖNDERİLMEZ.",
    };
  if (r.ok)
    return {
      key: "smtp",
      label: "E-posta (SMTP)",
      level: "ok",
      detail: `Bağlantı + kimlik doğrulama başarılı (${process.env.SMTP_HOST}).`,
    };
  return {
    key: "smtp",
    label: "E-posta (SMTP)",
    level: "error",
    detail: `Yapılandırılmış ama bağlanamıyor: ${r.error ?? "bilinmeyen hata"}`,
  };
}

function checkCreem(): StatusCheck {
  const apiKey = has(process.env.CREEM_API_KEY);
  const packs = [
    process.env.CREEM_PRODUCT_PACK1,
    process.env.CREEM_PRODUCT_PACK5,
    process.env.CREEM_PRODUCT_PACK10,
  ];
  const setCount = packs.filter(has).length;
  if (!apiKey)
    return {
      key: "creem",
      label: "Ödeme (Creem)",
      level: "warn",
      detail: "CREEM_API_KEY yok — satın alma kapalı (test/üretim-kapalı modu).",
    };
  if (setCount < 3)
    return {
      key: "creem",
      label: "Ödeme (Creem)",
      level: "error",
      detail: `Ürün id eksik: ${setCount}/3 paket tanımlı. Eksikler için "Satın Al" çalışmaz.`,
    };
  return {
    key: "creem",
    label: "Ödeme (Creem)",
    level: "ok",
    detail: `API + 3 paket ürünü tanımlı${has(process.env.CREEM_PRODUCT_PREMIUM) ? " + premium" : " (premium yok)"}.`,
  };
}

function checkSession(): StatusCheck {
  const ok = has(process.env.SESSION_SECRET) || has(process.env.AUTH_SECRET);
  return ok
    ? { key: "session", label: "Oturum güvenliği", level: "ok", detail: "SESSION_SECRET tanımlı — girişler güvenli imzalı." }
    : {
        key: "session",
        label: "Oturum güvenliği",
        level: "error",
        detail: "SESSION_SECRET YOK — üretimde tüm girişler reddedilir!",
      };
}

function checkAdminEmails(): StatusCheck {
  const list = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return list.length
    ? { key: "admins", label: "Admin erişimi", level: "ok", detail: `${list.length} admin e-postası: ${list.join(", ")}` }
    : { key: "admins", label: "Admin erişimi", level: "error", detail: "ADMIN_EMAILS boş — panele kimse giremez." };
}

function checkSiteUrl(): StatusCheck {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!has(url))
    return {
      key: "siteurl",
      label: "Site adresi (SEO)",
      level: "warn",
      detail: `NEXT_PUBLIC_SITE_URL yok — kod varsayılanı (${EXPECTED_DOMAIN}) kullanılır.`,
    };
  if (!url!.includes(EXPECTED_DOMAIN))
    return {
      key: "siteurl",
      label: "Site adresi (SEO)",
      level: "error",
      detail: `Yanlış domain: ${url} — canonical/sitemap buraya gider, Google bunu indexler! ${EXPECTED_DOMAIN} olmalı.`,
    };
  return { key: "siteurl", label: "Site adresi (SEO)", level: "ok", detail: url! };
}

function checkCron(): StatusCheck {
  return has(process.env.CRON_SECRET)
    ? { key: "cron", label: "Günlük e-posta cron", level: "ok", detail: "CRON_SECRET tanımlı — zamanlanmış görev korumalı." }
    : {
        key: "cron",
        label: "Günlük e-posta cron",
        level: "warn",
        detail: "CRON_SECRET yok — günlük yorum maili cron'u korumasız/çalışmayabilir.",
      };
}

export interface SystemStatus {
  checks: StatusCheck[];
  summary: { ok: number; warn: number; error: number };
  dailyEmailSubscribers: number;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  let subs = 0;
  if (hasDatabase && prisma) {
    subs = await prisma.user.count({ where: { dailyEmail: true } }).catch(() => 0);
  }

  const [db, ai, smtp] = await Promise.all([checkDb(), checkAi(), checkEmail()]);
  const checks: StatusCheck[] = [
    db,
    checkSession(),
    ai,
    smtp,
    checkCreem(),
    checkSiteUrl(),
    checkAdminEmails(),
    checkCron(),
  ];

  const summary = { ok: 0, warn: 0, error: 0 };
  for (const c of checks) {
    if (c.level === "ok") summary.ok++;
    else if (c.level === "warn") summary.warn++;
    else if (c.level === "error") summary.error++;
  }

  return { checks, summary, dailyEmailSubscribers: subs };
}
