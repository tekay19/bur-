import { NextRequest, NextResponse } from "next/server";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { isEmailConfigured, sendMail } from "@/lib/email";
import { getDailyHoroscope } from "@/lib/horoscope";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://astrotek.ai").replace(/\/$/, "");

// GET /api/cron/daily-horoscope — günlük yorum e-postalarını gönderir.
// Zamanlama: Vercel Cron (her sabah). Güvenlik: CRON_SECRET.
//   Vercel Cron otomatik "Authorization: Bearer <CRON_SECRET>" gönderir.
//   Manuel tetikleme: ?key=<CRON_SECRET>
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  const key = req.nextUrl.searchParams.get("key");
  if (!secret || (auth !== secret && key !== secret)) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  if (!hasDatabase || !prisma)
    return NextResponse.json({ error: "DB yok." }, { status: 503 });
  if (!isEmailConfigured)
    return NextResponse.json({ error: "SMTP yapılandırılmamış." }, { status: 503 });

  // Günlük e-posta açık + burcu kayıtlı üyeler.
  const users = await prisma.user.findMany({
    where: { dailyEmail: true, sign: { not: null } },
    select: { email: true, name: true, sign: true },
    take: 1000,
  });

  const results = await Promise.allSettled(
    users.map(async (u) => {
      const h = getDailyHoroscope(u.sign as string);
      if (!h) return;
      await sendMail({
        to: u.email,
        subject: `${h.glyph} ${h.signName} burcu günlük yorumun hazır`,
        html: dailyEmailHtml(u.name, h.signName, h.genel, h.ask, h.kariyer, h.para, h.signSlug),
      });
    }),
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;
  return NextResponse.json({ ok: true, total: users.length, sent, failed });
}

function dailyEmailHtml(
  name: string | null,
  signName: string,
  genel: string,
  ask: string,
  kariyer: string,
  para: string,
  slug: string,
): string {
  const hi = name ? `Merhaba ${name},` : "Merhaba,";
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0e0a1a;color:#e9e3f2;border-radius:16px;padding:28px">
    <p style="margin:0 0 8px;color:#c9a84a;font-weight:bold;letter-spacing:1px">ASTROTEK AI · GÜNLÜK YORUM</p>
    <h1 style="margin:0 0 14px;font-size:22px">${signName} burcu — bugün</h1>
    <p style="margin:0 0 16px">${hi}</p>
    <p style="margin:0 0 18px;line-height:1.6">${genel}</p>
    <p style="margin:0 0 8px;line-height:1.5"><strong style="color:#e879b9">Aşk:</strong> ${ask}</p>
    <p style="margin:0 0 8px;line-height:1.5"><strong style="color:#c9a84a">Kariyer:</strong> ${kariyer}</p>
    <p style="margin:0 0 22px;line-height:1.5"><strong style="color:#56c596">Para:</strong> ${para}</p>
    <a href="${SITE_URL}/burc-yorumlari/${slug}" style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#e879b9);color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold">Tam yorumu oku</a>
    <p style="margin:24px 0 0;font-size:12px;color:#8a82a0">
      Bu hatırlatmayı <a href="${SITE_URL}/hesap" style="color:#a78bfa">hesabından</a> kapatabilirsin.
    </p>
  </div>`;
}
