import type { AgeRow, ReferenceSet } from "@/lib/al/types";

/**
 * European axial length reference (Tideman et al. 2018 anchors).
 *
 * Published P25 / P50 / P75 at ages 6, 9, 15 (sex-specific) from Tideman
 * comparison tables (also reproduced in clinical reviews summarizing
 * Tideman 2018 vs Diez 2019). Intermediate ages are linearly interpolated.
 * P5 / P10 / P90 / P95 are estimated from a normal approximation using
 * SD ≈ (P75 − P25) / 1.349 so the chart has full labeled bands.
 *
 * Source: Tideman JWL, et al. Axial length growth and the risk of developing
 * myopia in European children. Acta Ophthalmol. 2018;96(3):301-309.
 */

function expandFromQuartiles(
  age: number,
  p25: number,
  p50: number,
  p75: number
): AgeRow {
  const sd = (p75 - p25) / 1.349;
  return {
    age,
    p5: round2(p50 - 1.645 * sd),
    p10: round2(p50 - 1.282 * sd),
    p25: round2(p25),
    p50: round2(p50),
    p75: round2(p75),
    p90: round2(p50 + 1.282 * sd),
    p95: round2(p50 + 1.645 * sd),
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Build yearly rows from anchors at 6, 9, 15 then taper 16–18 */
function buildSex(
  anchors: { age: number; p25: number; p50: number; p75: number }[]
): AgeRow[] {
  const byAge = new Map(anchors.map((a) => [a.age, a]));
  const rows: AgeRow[] = [];

  for (let age = 6; age <= 15; age++) {
    if (byAge.has(age)) {
      const a = byAge.get(age)!;
      rows.push(expandFromQuartiles(age, a.p25, a.p50, a.p75));
      continue;
    }
    // interpolate between surrounding anchors
    let lo = anchors[0];
    let hi = anchors[anchors.length - 1];
    for (let i = 0; i < anchors.length - 1; i++) {
      if (age >= anchors[i].age && age <= anchors[i + 1].age) {
        lo = anchors[i];
        hi = anchors[i + 1];
        break;
      }
    }
    const t = (age - lo.age) / (hi.age - lo.age);
    rows.push(
      expandFromQuartiles(
        age,
        lerp(lo.p25, hi.p25, t),
        lerp(lo.p50, hi.p50, t),
        lerp(lo.p75, hi.p75, t)
      )
    );
  }

  // Ages 16–18: slow residual growth (~0.04–0.06 mm/yr at median, literature taper)
  const a15 = rows[rows.length - 1];
  const annual = {
    p25: 0.03,
    p50: 0.04,
    p75: 0.06,
  };
  for (let age = 16; age <= 18; age++) {
    const years = age - 15;
    rows.push(
      expandFromQuartiles(
        age,
        a15.p25 + annual.p25 * years,
        a15.p50 + annual.p50 * years,
        a15.p75 + annual.p75 * years
      )
    );
  }
  return rows;
}

export const europeanReference: ReferenceSet = {
  id: "european",
  label: "Default",
  regionNote:
    "Default reference for all non–East Asian ethnicities. Based on European children (Netherlands / UK cohorts in Tideman et al.). Intermediate ages interpolated from published anchors.",
  source: "Tideman et al. 2018, European children (P25/P50/P75 anchors)",
  citation:
    "Tideman JWL, Polling JR, Vingerling JR, et al. Axial length growth and the risk of developing myopia in European children. Acta Ophthalmol. 2018;96(3):301-309.",
  doi: "10.1111/aos.13603",
  ageMin: 6,
  ageMax: 18,
  female: {
    sex: "female",
    ages: buildSex([
      { age: 6, p25: 21.66, p50: 22.06, p75: 22.49 },
      { age: 9, p25: 22.33, p50: 22.79, p75: 23.25 },
      { age: 15, p25: 22.68, p50: 23.15, p75: 23.65 },
    ]),
  },
  male: {
    sex: "male",
    ages: buildSex([
      { age: 6, p25: 22.14, p50: 22.59, p75: 23.01 },
      { age: 9, p25: 22.83, p50: 23.31, p75: 23.79 },
      { age: 15, p25: 23.17, p50: 23.65, p75: 24.21 },
    ]),
  },
};
