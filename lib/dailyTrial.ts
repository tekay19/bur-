// ============================================================
// Günlük burç yorumu — ücretsiz üyelik denemesi (15 gün).
// Güvenlik: deneme başlangıcı GEÇERLİ kaynakların EN ERKENİdir
// (cihaz çerezi + hesabın sunucudaki createdAt'i). Gelecek tarihli/sahte
// çerez yok sayılır → kimse denemeyi uzatamaz. Çerez yalnızca yeni hesapların
// denemeyi SIFIRLAMASINI engeller (daha erken başlangıç dayatır).
// Premium üyeler süresiz erişir.
// ============================================================

export const DAILY_TRIAL_COOKIE = "atk_dh"; // değer: deneme başlangıcı (ms epoch)
export const DAILY_TRIAL_DAYS = 15;
const DAY = 24 * 60 * 60 * 1000;
const TRIAL_MS = DAILY_TRIAL_DAYS * DAY;

export const DAILY_TRIAL_COOKIE_OPTS = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 yıl
};

// Geçerli kaynaklardan (çerez + hesap createdAt) en erken başlangıç.
// Gelecekteki (now'dan büyük) değerler yok sayılır → uzatma sömürüsü kapalı.
function resolveStart(
  cookieVal: string | undefined | null,
  accountCreatedAtMs: number,
): number {
  const now = Date.now();
  const candidates: number[] = [];
  const c = Number(cookieVal);
  if (Number.isFinite(c) && c > 0 && c <= now) candidates.push(c);
  if (
    Number.isFinite(accountCreatedAtMs) &&
    accountCreatedAtMs > 0 &&
    accountCreatedAtMs <= now
  )
    candidates.push(accountCreatedAtMs);
  if (candidates.length === 0) return now; // bilinmiyorsa şimdi (uzatılamaz)
  return Math.min(...candidates); // EN ERKEN → sahte çerezle uzatılamaz
}

// Üye için kalan deneme günü. Premium → Infinity.
export function trialDaysLeft(
  cookieVal: string | undefined | null,
  accountCreatedAtMs: number,
  isPremium = false,
): number {
  if (isPremium) return Infinity;
  const start = resolveStart(cookieVal, accountCreatedAtMs);
  const left = Math.ceil((TRIAL_MS - (Date.now() - start)) / DAY);
  return left > 0 ? left : 0;
}
