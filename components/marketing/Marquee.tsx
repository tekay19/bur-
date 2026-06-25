import type { CSSProperties, ReactNode } from "react";
import styles from "./Marquee.module.css";

// Sürekli yatay kayan şerit — saf CSS animasyonu (Server Component, JS yok).
// Transform compositor'da çalışır → main-thread'i meşgul etmez, kasmaz.
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`${styles.viewport} ${className ?? ""}`}>
      <div
        className={`${styles.track} ${reverse ? styles.reverse : ""}`}
        style={{ "--dur": `${duration}s` } as CSSProperties}
      >
        <div className={styles.group}>{children}</div>
        <div className={styles.group} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
