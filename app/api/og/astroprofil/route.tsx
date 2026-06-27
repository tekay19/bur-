import { ImageResponse } from "next/og";
import { computeScores, generateProfile } from "@/lib/astroprofile/engine";
import { getSign } from "@/lib/zodiac";

export const runtime = "edge";

// AstroProfil sonucu paylaşım görseli (1200×630).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const b = searchParams.get("b") ?? "";
  const c = searchParams.get("c") ?? "";
  if (!getSign(b) || !/^[0-3]{10}$/.test(c))
    return new Response("Bulunamadı", { status: 404 });

  const r = generateProfile(b, computeScores(b, c.split("").map(Number)));
  const top2 = r.top.slice(0, 2).map((t) => t.label).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #100a20 0%, #1d1238 55%, #0d0918 100%)",
          color: "#ECE6F5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 5, color: "#c9a84a", fontWeight: 700 }}>
          ASTROTEK AI · KİŞİLİK ANALİZİ
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 32, color: "#a78bfa" }}>
          Kişisel Profilin
        </div>
        <div style={{ display: "flex", marginTop: 6, fontSize: 120, fontWeight: 800 }}>
          {r.signName}
        </div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 38, color: "#cbb6e8" }}>
          En güçlü: {top2}
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 24, color: "#8a82a0" }}>
          astrotek · ücretsiz astrolojik kişilik analizi
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
