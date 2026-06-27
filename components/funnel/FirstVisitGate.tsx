"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// İlk kez gelen ziyaretçiyi (hydration sonrası, istemci tarafında) bir kez
// /kesfet funnel'ına yönlendirir. Bot/crawler JS çalıştırmadığı için SSR
// içeriği etkilenmez (SEO güvenli). Tekrar zorlamaz: bayrak set edilir.
const SEEN_KEY = "astro_funnel_v1";

export function FirstVisitGate() {
  const router = useRouter();

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return; // daha önce görüldü → dokunma
      // Bayrağı hemen yaz: geri tuşuyla dönünce sonsuz döngü olmasın.
      localStorage.setItem(SEEN_KEY, "1");
      router.replace("/kesfet");
    } catch {
      /* localStorage yoksa sessizce vazgeç */
    }
  }, [router]);

  return null;
}
