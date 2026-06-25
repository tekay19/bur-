// Sade, profesyonel uzay arka planı.
// - Karmaşık dekoratif şekiller yok (göz yormaz).
// - Dönüşüm odaklı palet: güven veren indigo + premium mor + sıcak altın hale.
// - Hafif: birkaç yumuşak gradyan + ince yıldız dokusu (CSS, JS yok).
export function SpaceBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Derin uzay temel gradyanı (yukarıdan aşağı koyulaşan indigo) */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,hsl(258_55%_12%)_0%,hsl(256_52%_8%)_45%,hsl(252_50%_5%)_100%)]" />

      {/* Premium mor hale — üst orta (markanın ana rengi) */}
      <div className="absolute left-1/2 top-[-18%] h-[60%] w-[85%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,hsl(268_75%_46%/0.20),transparent_68%)] blur-3xl" />

      {/* Yumuşak gül hale — sağ (sıcaklık, denge) */}
      <div className="absolute right-[-18%] top-[22%] h-[48%] w-[55%] rounded-full bg-[radial-gradient(circle,hsl(330_68%_50%/0.10),transparent_70%)] blur-3xl" />

      {/* Sıcak altın hale — alt (dönüşüm: bakışı CTA'ya çeker) */}
      <div className="absolute bottom-[-12%] left-[14%] h-[42%] w-[48%] rounded-full bg-[radial-gradient(circle,hsl(43_85%_55%/0.07),transparent_72%)] blur-3xl" />

      {/* İnce yıldız dokusu (çok hafif) */}
      <div className="starfield absolute inset-0 opacity-30" />

      {/* Kenar vinyeti — içeriğe odak */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_55%,hsl(252_55%_4%/0.55)_100%)]" />
    </div>
  );
}
