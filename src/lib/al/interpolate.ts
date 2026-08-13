import type { AgeRow, PercentileKey } from "./types";
import { PERCENTILE_KEYS } from "./types";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function buildRow(
  age: number,
  lo: AgeRow,
  hi: AgeRow,
  t: number
): AgeRow {
  const out: AgeRow = {
    age,
    p5: clampAl(lerp(lo.p5, hi.p5, t)),
    p10: clampAl(lerp(lo.p10, hi.p10, t)),
    p25: clampAl(lerp(lo.p25, hi.p25, t)),
    p50: clampAl(lerp(lo.p50, hi.p50, t)),
    p75: clampAl(lerp(lo.p75, hi.p75, t)),
    p90: clampAl(lerp(lo.p90, hi.p90, t)),
    p95: clampAl(lerp(lo.p95, hi.p95, t)),
  };
  if (lo.l != null && hi.l != null) out.l = lerp(lo.l, hi.l, t);
  if (lo.m != null && hi.m != null) out.m = clampAl(lerp(lo.m, hi.m, t));
  if (lo.s != null && hi.s != null) out.s = Math.max(0.001, lerp(lo.s, hi.s, t));
  return out;
}

function clampAl(mm: number) {
  return Math.min(30, Math.max(18, mm));
}

/**
 * Linear interpolate an AgeRow between bracketing table ages.
 * Ages below the first table point (e.g. &lt; 6 y) are linearly extrapolated
 * from the first two ages — approximate only.
 */
export function interpolateAgeRow(rows: AgeRow[], age: number): AgeRow {
  if (rows.length === 0) {
    throw new Error("No reference rows");
  }

  // Extrapolate younger than first table age (usually 6)
  if (age < rows[0].age) {
    if (rows.length === 1) return { ...rows[0], age };
    const a0 = rows[0];
    const a1 = rows[1];
    const span = a1.age - a0.age || 1;
    const t = (age - a0.age) / span; // negative
    return buildRow(age, a0, a1, t);
  }

  // Hold last table age for older (or mild extrapolate from last two)
  if (age > rows[rows.length - 1].age) {
    if (rows.length === 1) return { ...rows[rows.length - 1], age };
    const a0 = rows[rows.length - 2];
    const a1 = rows[rows.length - 1];
    const span = a1.age - a0.age || 1;
    const t = (age - a0.age) / span;
    return buildRow(age, a0, a1, t);
  }

  let lo = rows[0];
  let hi = rows[rows.length - 1];
  for (let i = 0; i < rows.length - 1; i++) {
    if (age >= rows[i].age && age <= rows[i + 1].age) {
      lo = rows[i];
      hi = rows[i + 1];
      break;
    }
  }

  const span = hi.age - lo.age || 1;
  const t = (age - lo.age) / span;
  return buildRow(age, lo, hi, t);
}

/** Expected AL at a given percentile key for age */
export function expectedAlAtPercentile(
  rows: AgeRow[],
  age: number,
  key: PercentileKey
): number {
  return interpolateAgeRow(rows, age)[key];
}

/**
 * Dense sample of percentile curves for charting (age step).
 */
export function sampleCurves(
  rows: AgeRow[],
  ageMin: number,
  ageMax: number,
  step = 0.25
): { age: number; values: Record<PercentileKey, number> }[] {
  const out: { age: number; values: Record<PercentileKey, number> }[] = [];
  // Allow mild extrapolation below published min for under-6 display
  const lo = Math.min(ageMin, rows[0].age);
  const hi = Math.max(ageMax, rows[rows.length - 1].age);
  for (let age = lo; age <= hi + 1e-9; age += step) {
    const a = clamp(age, Math.min(3, rows[0].age), Math.max(18, rows[rows.length - 1].age));
    const row = interpolateAgeRow(rows, a);
    const values = {} as Record<PercentileKey, number>;
    for (const key of PERCENTILE_KEYS) values[key] = row[key];
    out.push({ age: Math.round(a * 100) / 100, values });
  }
  return out;
}
