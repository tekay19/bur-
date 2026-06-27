import { ImageResponse } from "next/og";
import { getSign } from "@/lib/zodiac";

export const runtime = "edge";

// Günlük burç yorumu paylaşım görseli (1200×630).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const s = getSign(searchParams.get("sign") ?? "");
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
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 5, color: "#c9a84a", fontWeight: 700 }}>
          ASTROTEK AI · GÜNLÜK YORUM
        </div>
        <div style={{ display: "flex", marginTop: 44, fontSize: 130, fontWeight: 800 }}>
          {s.name}
        </div>
        <div style={{ display: "flex", marginTop: 12, fontSize: 40, color: "#cbb6e8" }}>
          Günlük Burç Yorumu
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 24, color: "#8a82a0" }}>
          astrotek · her gün güncellenir, ücretsiz
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
