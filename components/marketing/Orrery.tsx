import type { CSSProperties } from "react";
import styles from "./Orrery.module.css";

// 3B gezegen sistemi (orrery) — hero görseli. Saf CSS animasyonu (kasmaz).
// Server Component: hiç JS göndermez; tüm hareket compositor'da çalışır.
// Geometri yüzde tabanlı → her ekranda güvenli.

type Vars = CSSProperties & Record<string, string | number>;

interface Planet {
  r: string; // yörünge yarıçapı (çerçeve %'i)
  size: string; // çap (%)
  dur: number; // tur süresi (s)
  delay: number; // başlangıç ofseti (s)
  color: string; // tema rengi
  ringed?: boolean; // Satürn benzeri halka
}

const PLANETS: Planet[] = [
  { r: "12%", size: "5.5%", dur: 18, delay: -2, color: "var(--blue)" },
  { r: "18%", size: "7.5%", dur: 26, delay: -11, color: "var(--gold)" },
  { r: "25%", size: "5.5%", dur: 35, delay: -5, color: "var(--rose)" },
  { r: "33%", size: "9%", dur: 52, delay: -20, color: "var(--violet)", ringed: true },
];

// Yörünge yolu çemberleri (çap, çerçeve %'i)
const RINGS = [
  { d: "24%" },
  { d: "36%" },
  { d: "50%" },
  { d: "66%" },
  { d: "84%", outer: true },
];

// Az sayıda, ince yıldız (sade görünüm).
const STARS = [
  { top: "14%", left: "20%", dur: 3.4, delay: 0 },
  { top: "22%", left: "82%", dur: 4.0, delay: 0.8 },
  { top: "78%", left: "16%", dur: 3.0, delay: 0.4 },
  { top: "84%", left: "74%", dur: 4.3, delay: 1.4 },
  { top: "46%", left: "94%", dur: 3.6, delay: 2.0 },
  { top: "8%", left: "54%", dur: 2.8, delay: 1.1 },
];

export function Orrery() {
  return (
    <div className={styles.frame} aria-hidden="true">
      <div className={styles.glow} />

      <div className={styles.scene}>
        <div className={styles.stage}>
          {RINGS.map((ring, i) => (
            <div
              key={i}
              className={`${styles.ring} ${ring.outer ? styles.ringOuter : ""}`}
              style={{ "--d": ring.d } as Vars}
            />
          ))}

          <div className={styles.core}>
            <span className={styles.corePulse} />
          </div>

          {PLANETS.map((p, i) => (
            <div
              key={i}
              className={styles.orbit}
              style={{ "--dur": `${p.dur}s`, "--delay": `${p.delay}s` } as Vars}
            >
              <div
                className={`${styles.planet} ${p.ringed ? styles.ringed : ""}`}
                style={
                  { "--r": p.r, "--size": p.size, "--color": p.color } as Vars
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.stars}>
        {STARS.map((s, i) => (
          <span
            key={i}
            className={styles.star}
            style={
              {
                top: s.top,
                left: s.left,
                "--tdur": `${s.dur}s`,
                "--tdelay": `${s.delay}s`,
              } as Vars
            }
          />
        ))}
      </div>
    </div>
  );
}
