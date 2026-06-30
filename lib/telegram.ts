// Telegram bildirim gönderici — yeni üye/satış/analiz + günlük trafik özeti.
// env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID. Yoksa sessizce no-op.
// Best-effort: hata olsa bile ana akışı (kayıt/ödeme) ASLA bozmaz.

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const telegramConfigured = Boolean(TOKEN && CHAT_ID);

export async function sendTelegram(text: string): Promise<void> {
  if (!telegramConfigured) return;
  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    /* bildirim best-effort — yut */
  }
}

// Ateşle-ve-unut: çağıran await etmeden kullanabilir (ana akışı bloklamaz).
export function notify(text: string): void {
  void sendTelegram(text);
}
