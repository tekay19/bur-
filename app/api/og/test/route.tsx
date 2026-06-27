import { ImageResponse } from "next/og";
import { getSign } from "@/lib/zodiac";

export const runtime = "edge";

// Burç Testi sonucu paylaşım görseli (1200×630).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const s = getSign(searchParams.get("sonuc") ?? "");
  if (!s) return new Response("Bulunamadı", { status: 404 });

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
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#c9a84a", fontWeight: 700 }}>
          ASTROTEK AI · BURÇ TESTİ
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 34, color: "#a78bfa" }}>
          Ruh Burcun
        </div>
        <div style={{ display: "flex", marginTop: 6, fontSize: 130, fontWeight: 800 }}>
          {s.name}
        </div>
        <div style={{ display: "flex", marginTop: 18, fontSize: 36, color: "#cbb6e8" }}>
          {s.element} · {s.quality} · {s.dates}
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 24, color: "#8a82a0" }}>
          astrotek · ücretsiz burç kişilik testi
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
