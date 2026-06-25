// İstemci tarafı admin yardımcıları (tarayıcı-güvenli, server bağımlılığı yok).

export function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function fmtDay(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function fmtUsd(n: number): string {
  return "$" + (n ?? 0).toFixed(2);
}

export const FOCUS_LABELS: Record<string, string> = {
  general: "Genel",
  career: "Kariyer",
  exam: "Sınav",
  love: "İlişki",
  money: "Para",
  health: "Sağlık",
};

export function focusLabel(f: string): string {
  return FOCUS_LABELS[f] ?? f;
}
