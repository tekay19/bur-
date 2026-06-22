import { NextRequest, NextResponse } from "next/server";
import { runFullAnalysis } from "@/lib/analysis";
import type { BirthInput } from "@/lib/astrology/types";
import { getAnalysis, saveAnalysis } from "@/lib/db/storage";
import { geocode } from "@/lib/utils/geocoding";
import { isValidTimeZone } from "@/lib/utils/timezone";
import { chartRequestSchema } from "@/lib/validation";
import {
  AID_COOKIE,
  AID_COOKIE_OPTS,
  getOrCreateAccount,
  newAnonId,
  refundOne,
  spendOne,
} from "@/lib/credits";
import {
  SID_COOKIE,
  getUserById,
  refundUserCredit,
  spendUserCredit,
  verifySession,
} from "@/lib/auth";
import { getClientIp, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/chart — natal + transit + skor + AI analizini üretir ve kaydeder
export async function POST(req: NextRequest) {
  // --- Hız sınırı (pahalı AI yolunu kredi kontrolünden önce korur) ---
  const ip = getClientIp(req);
  const rl = rateLimit(`chart:${ip}`, 10, 60_000); // 10 istek / dakika
  if (!rl.ok) return tooManyRequests(rl.retryAfter);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek gövdesi." },
      { status: 400 },
    );
  }

  const parsed = chartRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Form doğrulaması başarısız.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // --- Kredi kontrolü (DECREMENT-FIRST) ---
  // Pahalı analizden ÖNCE atomik olarak 1 kredi düşülür; analiz başarısız
  // olursa iade edilir. Bu, eşzamanlı isteklerle "1 kredi → N analiz"
  // yarış koşulunu (TOCTOU) önler.
  // Fail-open: kredi sistemi ALTYAPI hatası verirse (DB düşmesi) kullanıcı
  // engellenmez; ama kesin "kredin bitti" sonucu engeller.
  const uid = verifySession(req.cookies.get(SID_COOKIE)?.value);
  let aid = req.cookies.get(AID_COOKIE)?.value;
  let setCookie = false;
  let mode: "user" | "guest" | "skip" = "skip";
  let balanceBefore = 0;
  let recoveryCode: string | undefined;

  if (uid) {
    // Üye — önce hesabı tanı, sonra atomik düş
    let known = false;
    try {
      const user = await getUserById(uid);
      if (user) {
        known = true;
        balanceBefore = user.credits;
      }
    } catch (e) {
      console.error("Üye kredi okunamadı (gating atlanıyor):", e);
    }
    if (known) {
      let spent: boolean | null = null;
      try {
        spent = await spendUserCredit(uid); // credits>0 ise atomik düşer
      } catch (e) {
        console.error("Üye kredi düşülemedi (fail-open):", e);
      }
      if (spent === false) {
        return NextResponse.json(
          {
            error: "Kredin bitti. Premium'a geç veya kredi yükle.",
            code: "NO_CREDITS",
            credits: 0,
            loggedIn: true,
          },
          { status: 402 },
        );
      }
      // true → düşüldü (iade edilebilir); null → altyapı hatası, fail-open (skip)
      if (spent === true) mode = "user";
    }
  } else {
    // Misafir
    if (!aid) {
      aid = newAnonId();
      setCookie = true;
    }
    let account: Awaited<ReturnType<typeof getOrCreateAccount>> | null = null;
    try {
      account = await getOrCreateAccount(aid);
    } catch (e) {
      console.error("Kredi sistemi hatası (gating atlanıyor):", e);
    }
    if (account) {
      balanceBefore = account.credits;
      recoveryCode = account.recoveryCode;
      let spent: boolean | null = null;
      try {
        spent = await spendOne(aid); // credits>0 ise atomik düşer
      } catch (e) {
        console.error("Misafir kredi düşülemedi (fail-open):", e);
      }
      if (spent === false) {
        const res = NextResponse.json(
          {
            error: "Ücretsiz hakkın doldu. Devam etmek için kredi yükle.",
            code: "NO_CREDITS",
            credits: 0,
            recoveryCode,
            loggedIn: false,
          },
          { status: 402 },
        );
        if (setCookie && aid) res.cookies.set(AID_COOKIE, aid, AID_COOKIE_OPTS);
        return res;
      }
      if (spent === true) mode = "guest";
    }
  }

  // Kredi düşüldüyse (mode user/guest), sonraki bir hata durumunda iade et.
  const refundIfSpent = async () => {
    try {
      if (mode === "user" && uid) await refundUserCredit(uid);
      else if (mode === "guest" && aid) await refundOne(aid);
    } catch (e) {
      console.error("Kredi iade edilemedi:", e);
    }
  };

  // Koordinat/zaman dilimi yoksa (veya geçersizse) şehirden geocode et.
  // Geçersiz timezone'u geocode'a yönlendir → sessiz yanlış saat dönüşümü olmaz.
  let { latitude, longitude, timezone } = data;
  if (
    latitude == null ||
    longitude == null ||
    !timezone ||
    !isValidTimeZone(timezone)
  ) {
    const geo = await geocode(data.birthPlace);
    // NaN/undefined koordinat efemerise akmasın → sessiz bozuk harita olmaz.
    if (
      !geo ||
      !Number.isFinite(geo.latitude) ||
      !Number.isFinite(geo.longitude)
    ) {
      await refundIfSpent();
      const res = NextResponse.json(
        {
          error:
            "Doğum yeri bulunamadı. Lütfen şehir adını kontrol edin veya farklı bir yazım deneyin.",
          code: "GEOCODE_FAILED",
        },
        { status: 422 },
      );
      if (setCookie && aid) res.cookies.set(AID_COOKIE, aid, AID_COOKIE_OPTS);
      return res;
    }
    latitude = geo.latitude;
    longitude = geo.longitude;
    timezone = geo.timezone;
  }

  const birthInput: BirthInput = {
    name: data.name,
    gender: data.gender || null,
    date: data.birthDate,
    time: data.birthTime || null,
    place: data.birthPlace,
    latitude,
    longitude,
    timezone,
    birthTimeAccuracy: data.birthTimeAccuracy,
    focusArea: data.focusArea,
  };

  // Kaydı oluşturana bağla (üye uid, yoksa misafir aid) — IDOR koruması.
  const ownerKey = uid ?? aid ?? null;

  try {
    const payload = await runFullAnalysis(birthInput);
    const saved = await saveAnalysis(payload, ownerKey);
    const res = NextResponse.json({
      id: saved.id,
      result: saved,
      credits: mode === "skip" ? undefined : Math.max(0, balanceBefore - 1),
    });
    if (setCookie && aid) res.cookies.set(AID_COOKIE, aid, AID_COOKIE_OPTS);
    return res;
  } catch (err) {
    console.error("Analiz üretilemedi:", err);
    await refundIfSpent(); // kredi düşüldüyse geri ver
    const res = NextResponse.json(
      { error: "Analiz oluşturulurken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 },
    );
    if (setCookie && aid) res.cookies.set(AID_COOKIE, aid, AID_COOKIE_OPTS);
    return res;
  }
}

// GET /api/chart?id=... — kayıtlı analizi getir (yalnızca sahibine).
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id gerekli." }, { status: 400 });
  }
  // Sahiplik: istek sahibinin kimlikleri (üye uid ve/veya misafir aid).
  const uid = verifySession(req.cookies.get(SID_COOKIE)?.value);
  const aid = req.cookies.get(AID_COOKIE)?.value;
  const requesterKeys = [uid, aid].filter(Boolean) as string[];

  const result = await getAnalysis(id, requesterKeys);
  if (!result) {
    return NextResponse.json(
      { error: "Analiz bulunamadı." },
      { status: 404 },
    );
  }
  return NextResponse.json({ result });
}
