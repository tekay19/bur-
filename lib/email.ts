import nodemailer, { type Transporter } from "nodemailer";
import { LEGAL } from "./legal";

// ============================================================
// SMTP e-posta modülü (sağlayıcı bağımsız).
// - Ayarlar SMTP_* ortam değişkenlerinden okunur.
// - SMTP_HOST boşsa GÖNDERİM YAPILMAZ: içerik (ve linkler) sunucu konsoluna
//   loglanır → geliştirme/test'te yeterli, prod'da gerçek SMTP bağlanır.
// - Genişletilebilir: yeni bildirimler için generic sendMail() kullan.
// ============================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotekai.com";
const FROM =
  process.env.SMTP_FROM ||
  process.env.SMTP_USER ||
  "Astrotek AI <no-reply@astrotekai.com>";
// Gönderim no-reply'dan olsa da cevaplar gerçek kutuya (Proton) düşsün.
const REPLY_TO = process.env.SMTP_REPLY_TO || LEGAL.contactEmail;

export const isEmailConfigured = Boolean(process.env.SMTP_HOST);

let cached: Transporter | null = null;

function getTransport(): Transporter | null {
  if (!isEmailConfigured) return null;
  if (cached) return cached;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure, // true: 465/SSL, false: 587/STARTTLS
    auth: user ? { user, pass } : undefined,
  });
  return cached;
}

interface MailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Genel gönderim. SMTP yoksa konsola loglar (no-op değil, görünür yedek).
export async function sendMail({ to, subject, html, text }: MailInput): Promise<void> {
  const transport = getTransport();
  if (!transport) {
    console.info(
      `[email] SMTP yapılandırılmamış — gönderilmedi. to=${to} subject="${subject}"`,
    );
    return;
  }
  await transport.sendMail({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject,
    html,
    text: text ?? stripHtml(html),
  });
}

// --- Senaryolar ---

export async function sendWelcomeEmail(
  to: string,
  name?: string | null,
): Promise<void> {
  const hi = name ? `Merhaba ${escapeHtml(name)},` : "Merhaba,";
  const html = emailLayout(
    "Aramıza hoş geldin ✨",
    `
      <p style="margin:0 0 16px">${hi}</p>
      <p style="margin:0 0 16px">
        Astrotek AI'a kaydoldun! Doğum haritanı çıkarıp güncel gökyüzünün
        senin için ne söylediğini sade bir dille okuyabilirsin.
      </p>
      <p style="margin:0 0 24px">Hesabına 1 ücretsiz analiz tanımlandı 🎁</p>
      ${button(`${SITE_URL}/harita-olustur`, "Haritamı Oluştur")}
    `,
  );
  await sendMail({ to, subject: "Astrotek AI'a hoş geldin ✨", html });
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  name?: string | null,
): Promise<void> {
  // SMTP yoksa linki net şekilde logla ki geliştirmede akış test edilebilsin.
  if (!isEmailConfigured) {
    console.info(`[email] Şifre sıfırlama linki (${to}): ${resetUrl}`);
  }
  const hi = name ? `Merhaba ${escapeHtml(name)},` : "Merhaba,";
  const html = emailLayout(
    "Şifre sıfırlama",
    `
      <p style="margin:0 0 16px">${hi}</p>
      <p style="margin:0 0 16px">
        Şifreni sıfırlamak için bir istek aldık. Aşağıdaki butona tıklayarak
        yeni şifreni belirleyebilirsin. Bu bağlantı <strong>60 dakika</strong>
        içinde geçerlidir.
      </p>
      ${button(resetUrl, "Şifremi Sıfırla")}
      <p style="margin:24px 0 0;font-size:13px;color:#a99fc0">
        Buton çalışmazsa bu bağlantıyı tarayıcına yapıştır:<br />
        <a href="${resetUrl}" style="color:#f0b24a;word-break:break-all">${resetUrl}</a>
      </p>
      <p style="margin:16px 0 0;font-size:13px;color:#a99fc0">
        Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin; şifren değişmez.
      </p>
    `,
  );
  await sendMail({ to, subject: "Astrotek AI — Şifre sıfırlama", html });
}

// --- Şablon yardımcıları (e-posta istemcisi dostu, satır içi stil) ---

function emailLayout(title: string, bodyHtml: string): string {
  return `
  <div style="margin:0;padding:24px;background:#0c0a17;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <div style="max-width:520px;margin:0 auto;background:#16121f;border:1px solid #2a2440;border-radius:18px;overflow:hidden">
      <div style="padding:20px 28px;border-bottom:1px solid #2a2440">
        <span style="font-size:18px;font-weight:700;color:#ece5f0">Astrotek <span style="color:#f0b24a">AI</span></span>
      </div>
      <div style="padding:28px">
        <h1 style="margin:0 0 20px;font-size:22px;color:#ece5f0">${title}</h1>
        <div style="font-size:15px;line-height:1.6;color:#d6cfe6">${bodyHtml}</div>
      </div>
      <div style="padding:18px 28px;border-top:1px solid #2a2440;font-size:12px;color:#8a7fa6">
        Astrotek AI · Sembolik analiz, kesin kehanet değildir.
      </div>
    </div>
  </div>`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;padding:13px 26px;background:#f0b24a;color:#1a1426;font-weight:700;font-size:15px;text-decoration:none;border-radius:9999px">${label}</a>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
