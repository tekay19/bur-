import { NextRequest, NextResponse } from "next/server";
import { getGaStats } from "@/lib/ga";
import { sendTelegram, telegramConfigured } from "@/lib/telegram";
import { hasDatabase, prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Günlük Telegram trafik/iş özeti. Vercel Cron tetikler (Authorization: Bearer
// <CRON_SECRET>). Manuel: ?key=<CRON_SECRET>.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  const key = req.nextUrl.searchParams.get("key");
  if (!secret || (auth !== secret && key !== secret))
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  if (!telegramConfigured)
    return NextResponse.json({ error: "Telegram yapılandırılmamış." }, { status: 503 });

  // Son 24 saat: yeni üye + satış (birinci taraf veri)
  let newUsers = 0;
  let sales = 0;
  if (hasDatabase && prisma) {
    const since = new Date(Date.now() - 24 * 3600 * 1000);
    [newUsers, sales] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: since } } }).catch(() => 0),
      prisma.processedPayment
        .count({ where: { createdAt: { gte: since } } })
        .catch(() => 0),
    ]);
  }

  const lines = ["📊 Astrotek AI — Günlük özet", ""];
  lines.push(`🆕 Yeni üye (24s): ${newUsers}`);
  lines.push(`💰 Satış (24s): ${sales}`);

  // GA trafik (yapılandırılmışsa)
  const ga = await getGaStats();
  if (ga.configured && !ga.error) {
    lines.push("");
    lines.push(`👥 Şu an aktif: ${ga.realtimeUsers}`);
    lines.push(`👣 Ziyaretçi (7g): ${ga.summary.users7d}`);
    lines.push(`📄 Görüntüleme (28g): ${ga.summary.pageViews28d}`);
    if (ga.topPages[0])
      lines.push(`🔥 En çok: ${ga.topPages[0].path} (${ga.topPages[0].views})`);
    if (ga.sources[0]) lines.push(`🌐 Kaynak: ${ga.sources[0].source}`);
  } else {
    lines.push("");
    lines.push("(GA trafik verisi yok — GA env ayarlanınca burada görünür)");
  }

  await sendTelegram(lines.join("\n"));
  return NextResponse.json({ ok: true });
}
