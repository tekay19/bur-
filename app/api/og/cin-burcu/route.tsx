import { ImageResponse } from "next/og";
import { animalForYear } from "@/lib/chinese";

export const runtime = "edge";

// Çin burcu sonucu paylaşım görseli (1200×630).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const y = Number(searchParams.get("yil"));
  if (!(y >= 1920 && y <= 2030)) return new Response("Bulunamadı", { status: 404 });
  const a = animalForYear(y);

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
          ASTROTEK AI · ÇİN BURCU
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 150 }}>{a.emoji}</div>
        <div style={{ display: "flex", marginTop: 6, fontSize: 96, fontWeight: 800 }}>{a.name}</div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 34, color: "#cbb6e8" }}>
          {y} · {a.traits.slice(0, 3).join(" · ")}
        </div>
        <div style={{ display: "flex", marginTop: 34, fontSize: 24, color: "#8a82a0" }}>
          astrotek · ücretsiz çin burcu hesaplama
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
