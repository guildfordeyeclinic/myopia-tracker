import { interpolateAgeRow } from "./interpolate";
import type { AgeRow, PercentileKey } from "./types";
import { PERCENTILE_KEYS, PERCENTILE_VALUES } from "./types";

/**
 * LMS Z-score when L, M, S available.
 * Z = ((y/M)^L - 1) / (L*S)  for L ≠ 0
 * Z = ln(y/M) / S             for L = 0
 */
export function lmsZScore(al: number, l: number, m: number, s: number): number {
  if (m <= 0 || s <= 0) return 0;
  if (Math.abs(l) < 1e-9) {
    return Math.log(al / m) / s;
  }
  return (Math.pow(al / m, l) - 1) / (l * s);
}

/** Approximate percentile from standard normal Z (Abramowitz & Stegun) */
function normalCdf(z: number): number {
  // erf approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

/**
 * Estimate percentile rank for a measured AL at a given age.
 * Prefer LMS when available; else interpolate between tabulated percentiles.
 */
export function percentileRank(al: number, rows: AgeRow[], age: number): number {
  const row = interpolateAgeRow(rows, age);

  if (row.l != null && row.m != null && row.s != null) {
    const z = lmsZScore(al, row.l, row.m, row.s);
    const p = normalCdf(z) * 100;
    return clamp(p, 0.5, 99.5);
  }

  // Piecewise linear between tabulated percentile AL values
  const pts = PERCENTILE_KEYS.map((k) => ({
    p: PERCENTILE_VALUES[k],
    al: row[k as PercentileKey],
  })).sort((a, b) => a.al - b.al);

  if (al <= pts[0].al) {
    // extrapolate below P5
    const slope = (pts[1].p - pts[0].p) / (pts[1].al - pts[0].al || 1e-6);
    return clamp(pts[0].p + slope * (al - pts[0].al), 0.5, 99.5);
  }
  if (al >= pts[pts.length - 1].al) {
    const n = pts.length;
    const slope =
      (pts[n - 1].p - pts[n - 2].p) / (pts[n - 1].al - pts[n - 2].al || 1e-6);
    return clamp(pts[n - 1].p + slope * (al - pts[n - 1].al), 0.5, 99.5);
  }

  for (let i = 0; i < pts.length - 1; i++) {
    if (al >= pts[i].al && al <= pts[i + 1].al) {
      const t = (al - pts[i].al) / (pts[i + 1].al - pts[i].al || 1e-6);
      return pts[i].p + t * (pts[i + 1].p - pts[i].p);
    }
  }
  return 50;
}

export function deltaVsP50(al: number, rows: AgeRow[], age: number): number {
  const p50 = interpolateAgeRow(rows, age).p50;
  return al - p50;
}

export function formatDeltaMm(delta: number): string {
  const abs = Math.abs(delta);
  const mm = abs.toFixed(2);
  if (Math.abs(delta) < 0.005) return `about the same as the P50 eye length (${mm} mm difference)`;
  if (delta > 0) return `${mm} mm longer than the P50 eye length for age/sex/ethnicity`;
  return `${mm} mm shorter than the P50 eye length for age/sex/ethnicity`;
}

export function formatPercentile(p: number): string {
  if (p <= 1) return "<1st";
  if (p >= 99) return ">99th";
  const rounded = Math.round(p);
  const mod10 = rounded % 10;
  const mod100 = rounded % 100;
  let suffix = "th";
  if (mod10 === 1 && mod100 !== 11) suffix = "st";
  else if (mod10 === 2 && mod100 !== 12) suffix = "nd";
  else if (mod10 === 3 && mod100 !== 13) suffix = "rd";
  return `~${rounded}${suffix}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
