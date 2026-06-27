import { ImageResponse } from "next/og";
import { getCompatibility } from "@/lib/compatibility";

export const runtime = "edge";

// Paylaşım önizleme görseli (1200×630) — uyum sonucu sosyal medyada
// görselli çıksın diye. WhatsApp/Instagram/X otomatik bunu gösterir.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const r = getCompatibility(searchParams.get("s1") ?? "", searchParams.get("s2") ?? "");
  if (!r) return new Response("Bulunamadı", { status: 404 });

  const color = r.score >= 85 ? "#56c596" : r.score >= 65 ? "#a78bfa" : "#e8a13a";

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
          position: "relative",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#c9a84a", fontWeight: 700 }}>
          ASTROTEK AI · BURÇ UYUMU
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 28, fontSize: 72, fontWeight: 800 }}>
          <span>{r.a.name}</span>
          <span style={{ color: "#e879b9", fontSize: 56 }}>&#10084;</span>
          <span>{r.b.name}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 230,
            height: 230,
            borderRadius: 230,
            border: `15px solid ${color}`,
            marginTop: 30,
            fontSize: 92,
            fontWeight: 800,
          }}
        >
          %{r.score}
        </div>

        <div style={{ display: "flex", marginTop: 22, fontSize: 40, fontWeight: 700, color }}>
          {r.label}
        </div>

        <div style={{ display: "flex", marginTop: 26, fontSize: 24, color: "#8a82a0" }}>
          astrotek · ücretsiz burç uyumu testi
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
