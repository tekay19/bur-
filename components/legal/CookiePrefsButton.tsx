"use client";

import { Cookie } from "lucide-react";

// Usercentrics CMP'yi yeniden açar (kullanıcı çerez tercihini değiştirebilsin).
// Usercentrics yalnızca üretimde yüklendiğinden, local'de buton sessiz kalır.
declare global {
  interface Window {
    UC_UI?: {
      showSecondLayer?: () => void;
      showFirstLayer?: () => void;
    };
    __ucCmp?: {
      showSecondLayer?: () => void;
      showFirstLayer?: () => void;
    };
  }
}

export function CookiePrefsButton() {
  function open() {
    if (typeof window === "undefined") return;
    // Yeni Web CMP (__ucCmp) ve eski Browser UI (UC_UI) — ikisini de dene.
    if (window.__ucCmp?.showSecondLayer) window.__ucCmp.showSecondLayer();
    else if (window.UC_UI?.showSecondLayer) window.UC_UI.showSecondLayer();
    else if (window.__ucCmp?.showFirstLayer) window.__ucCmp.showFirstLayer();
    else if (window.UC_UI?.showFirstLayer) window.UC_UI.showFirstLayer();
  }

  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
    >
      <Cookie className="h-4 w-4" /> Çerez tercihlerini değiştir
    </button>
  );
}
