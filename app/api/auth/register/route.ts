import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  SID_COOKIE,
  SID_COOKIE_OPTS,
  WELCOME_BONUS,
  createUser,
  findUserByEmail,
  hashPassword,
  signSession,
} from "@/lib/auth";
import { AID_COOKIE, claimAccountCredits } from "@/lib/credits";
import {
  DAILY_TRIAL_COOKIE,
  DAILY_TRIAL_COOKIE_OPTS,
} from "@/lib/dailyTrial";
import { sendWelcomeEmail } from "@/lib/email";
import { setUserPrefs } from "@/lib/account";
import { getSign } from "@/lib/zodiac";
import { notify } from "@/lib/telegram";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta gir"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı").max(200),
  name: z.string().max(60).optional().or(z.literal("")),
  // KVKK / Üyelik Sözleşmesi onayı — üyelik için zorunlu.
  kvkkConsent: z.boolean().optional(),
  // Ticari elektronik ileti (günlük yorum/pazarlama) onayı — opsiyonel.
  marketing: z.boolean().optional(),
  // Günlük yorum lead magnet'ten gelen burç (opsiyonel).
  sign: z.string().max(20).optional(),
});

// Cihaz başına ücretsiz "ilk analiz" hakkı çerezi. İlk hesap hoş geldin
// kredisini alır; aynı cihazdan açılan diğer hesaplara ücretsiz analiz verilmez.
const FREEBIE_COOKIE = "atk_fb";
const FREEBIE_COOKIE_OPTS = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 yıl
};

export async function POST(req: NextRequest) {
  // Sahte hesap spam'ine karşı hız sınırı (IP başına). Her hesap ücretsiz
  // kredi aldığı için bu, ücretsiz katman suistimalini de yavaşlatır.
  const ip = getClientIp(req);
  const rl = rateLimit(`register:ip:${ip}`, 6, 60 * 60_000); // 6 / saat
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Form hatası." },
      { status: 422 },
    );
  }
  const { email, password, name, kvkkConsent, marketing, sign } = parsed.data;

  // Sözleşme/KVKK onayı olmadan üyelik oluşturulamaz (sunucu tarafı zorunluluk).
  if (kvkkConsent !== true) {
    return NextResponse.json(
      {
        error:
          "Üyelik için Üyelik Sözleşmesi ve KVKK Aydınlatma Metni onayı gereklidir.",
      },
      { status: 422 },
    );
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta zaten kayıtlı. Giriş yapmayı dene." },
        { status: 409 },
      );
    }

    // Cihazın ücretsiz "ilk analiz" hakkı daha önce kullanıldı mı?
    // İlk hesap: misafir kredisi taşınır + hoş geldin kredisi verilir.
    // Aynı cihazdan sonraki hesaplar: 0 kredi (ücretsiz analiz yok, satın alır).
    const firstOnDevice = !req.cookies.get(FREEBIE_COOKIE)?.value;

    let guestCredits = 0;
    const aid = req.cookies.get(AID_COOKIE)?.value;
    if (firstOnDevice && aid) {
      // claimAccountCredits misafir hesabını atomik olarak 0'a çeker; böylece
      // aynı krediler hem üyede hem misafirde sayılmaz (çift harcama önlenir).
      try {
        guestCredits = await claimAccountCredits(aid);
      } catch {
        /* yoksay */
      }
    }

    const initialCredits = firstOnDevice ? guestCredits + WELCOME_BONUS : 0;

    const user = await createUser(
      email,
      hashPassword(password),
      name || null,
      initialCredits,
    );

    // Telegram: yeni üye bildirimi (best-effort).
    notify(`🆕 Yeni üye\n${email}${name ? ` — ${name}` : ""}`);

    // Ticari ileti onayı → günlük e-posta; lead magnet burcu → kayıtlı burç.
    const prefs: { dailyEmail?: boolean; sign?: string } = {};
    if (marketing) prefs.dailyEmail = true;
    if (sign && getSign(sign)) prefs.sign = sign;
    if (Object.keys(prefs).length) {
      try {
        await setUserPrefs(user.id, prefs);
      } catch {
        /* yoksay */
      }
    }

    // Hoş geldin maili (best-effort; başarısız olsa da kayıt başarılı sayılır).
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (mailErr) {
      console.error("Hoş geldin maili gönderilemedi:", mailErr);
    }

    const res = NextResponse.json({ user });
    res.cookies.set(SID_COOKIE, signSession(user.id), SID_COOKIE_OPTS);
    // Krediler taşındı; eski misafir çerezini sıfırla ki yeniden kullanılmasın
    // (logout sonrası eski hesaptan çift harcama vektörünü kapatır).
    if (aid) res.cookies.set(AID_COOKIE, "", { path: "/", maxAge: 0 });
    // Cihazın ücretsiz hakkını işaretle → sonraki hesaplar bonus alamaz.
    res.cookies.set(FREEBIE_COOKIE, "1", FREEBIE_COOKIE_OPTS);
    // Günlük yorum 15 günlük denemesini cihaz bazında başlat (yoksa).
    // Aynı cihazdan yeni hesaplar denemeyi sıfırlayamaz.
    if (!req.cookies.get(DAILY_TRIAL_COOKIE)?.value) {
      res.cookies.set(
        DAILY_TRIAL_COOKIE,
        String(Date.now()),
        DAILY_TRIAL_COOKIE_OPTS,
      );
    }
    return res;
  } catch (e) {
    console.error("Kayıt hatası:", e);
    return NextResponse.json(
      { error: "Kayıt yapılamadı. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
