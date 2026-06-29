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
  }
}

export function CookiePrefsButton() {
  function open() {
    if (typeof window === "undefined") return;
    if (window.UC_UI?.showSecondLayer) window.UC_UI.showSecondLayer();
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
