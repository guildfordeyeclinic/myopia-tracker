import type { ReferenceSet } from "@/lib/al/types";

/**
 * East Asian (Chinese schoolchildren, Wuhan) axial length percentiles.
 * Source: Sanz Diez P, et al. LMS parameters, percentile, and Z-score growth
 * curves for axial length in Chinese schoolchildren in Wuhan.
 * Scientific Reports. 2022;12:4850. doi:10.1038/s41598-022-08907-5
 *
 * Table 2 LMS parameters and percentiles (ages 6–15). Ages 16–18 extended
 * from the 14→15 annual increment (illustrative taper for chart continuity).
 */
export const eastAsianReference: ReferenceSet = {
  id: "east_asian",
  label: "East Asian (Chinese-reference)",
  regionNote:
    "Based on Chinese schoolchildren in Wuhan (ages 6–15). Not all Asian ancestries.",
  source: "Sanz Diez et al. 2022 (LMS), Wuhan Chinese schoolchildren",
  citation:
    "Sanz Diez P, Yang LH, Lu MX, Kiess W, Wahl S. LMS parameters, percentile, and Z-score growth curves for axial length in Chinese schoolchildren in Wuhan. Sci Rep. 2022;12:4850.",
  doi: "10.1038/s41598-022-08907-5",
  ageMin: 6,
  ageMax: 18,
  female: {
    sex: "female",
    ages: [
      { age: 6, l: 1, m: 22.52, s: 0.0362, p5: 21.18, p10: 21.47, p25: 21.97, p50: 22.52, p75: 23.07, p90: 23.56, p95: 23.86 },
      { age: 7, l: 1, m: 22.94, s: 0.0372, p5: 21.54, p10: 21.85, p25: 22.37, p50: 22.94, p75: 23.52, p90: 24.04, p95: 24.35 },
      { age: 8, l: 1, m: 23.37, s: 0.0381, p5: 21.9, p10: 22.22, p25: 22.77, p50: 23.37, p75: 23.97, p90: 24.51, p95: 24.83 },
      { age: 9, l: 1, m: 23.71, s: 0.0389, p5: 22.19, p10: 22.53, p25: 23.09, p50: 23.71, p75: 24.34, p90: 24.9, p95: 25.23 },
      { age: 10, l: 1, m: 23.94, s: 0.0395, p5: 22.38, p10: 22.73, p25: 23.3, p50: 23.94, p75: 24.58, p90: 25.15, p95: 25.49 },
      { age: 11, l: 1, m: 24.09, s: 0.0399, p5: 22.51, p10: 22.86, p25: 23.44, p50: 24.09, p75: 24.73, p90: 25.32, p95: 25.67 },
      { age: 12, l: 1, m: 24.21, s: 0.0402, p5: 22.61, p10: 22.96, p25: 23.55, p50: 24.21, p75: 24.87, p90: 25.46, p95: 25.81 },
      { age: 13, l: 1, m: 24.32, s: 0.0405, p5: 22.7, p10: 23.06, p25: 23.66, p50: 24.32, p75: 24.98, p90: 25.58, p95: 25.94 },
      { age: 14, l: 1, m: 24.41, s: 0.0407, p5: 22.77, p10: 23.13, p25: 23.74, p50: 24.41, p75: 25.08, p90: 25.68, p95: 26.04 },
      { age: 15, l: 1, m: 24.49, s: 0.0409, p5: 22.84, p10: 23.21, p25: 23.82, p50: 24.49, p75: 25.17, p90: 25.78, p95: 26.14 },
      // Extended (not in source table): continue ~14→15 delta
      { age: 16, l: 1, m: 24.57, s: 0.041, p5: 22.91, p10: 23.28, p25: 23.89, p50: 24.57, p75: 25.25, p90: 25.87, p95: 26.23 },
      { age: 17, l: 1, m: 24.64, s: 0.0411, p5: 22.97, p10: 23.34, p25: 23.95, p50: 24.64, p75: 25.32, p90: 25.95, p95: 26.31 },
      { age: 18, l: 1, m: 24.7, s: 0.0412, p5: 23.02, p10: 23.39, p25: 24.0, p50: 24.7, p75: 25.38, p90: 26.01, p95: 26.37 },
    ],
  },
  male: {
    sex: "male",
    ages: [
      { age: 6, l: 1, m: 22.98, s: 0.0363, p5: 21.61, p10: 21.91, p25: 22.42, p50: 22.98, p75: 23.54, p90: 24.05, p95: 24.35 },
      { age: 7, l: 1, m: 23.42, s: 0.0372, p5: 21.99, p10: 22.31, p25: 22.84, p50: 23.42, p75: 24.01, p90: 24.54, p95: 24.86 },
      { age: 8, l: 1, m: 23.87, s: 0.0381, p5: 22.37, p10: 22.7, p25: 23.25, p50: 23.87, p75: 24.48, p90: 25.03, p95: 25.36 },
      { age: 9, l: 1, m: 24.23, s: 0.0388, p5: 22.69, p10: 23.03, p25: 23.6, p50: 24.23, p75: 24.86, p90: 25.43, p95: 25.78 },
      { age: 10, l: 1, m: 24.48, s: 0.0393, p5: 22.89, p10: 23.24, p25: 23.83, p50: 24.48, p75: 25.12, p90: 25.71, p95: 26.06 },
      { age: 11, l: 1, m: 24.64, s: 0.0397, p5: 23.04, p10: 23.39, p25: 23.98, p50: 24.64, p75: 25.3, p90: 25.89, p95: 26.25 },
      { age: 12, l: 1, m: 24.78, s: 0.04, p5: 23.15, p10: 23.51, p25: 24.11, p50: 24.78, p75: 25.45, p90: 26.05, p95: 26.41 },
      { age: 13, l: 1, m: 24.9, s: 0.0402, p5: 23.25, p10: 23.61, p25: 24.22, p50: 24.9, p75: 25.57, p90: 26.18, p95: 26.54 },
      { age: 14, l: 1, m: 24.98, s: 0.0404, p5: 23.32, p10: 23.69, p25: 24.3, p50: 24.98, p75: 25.66, p90: 26.28, p95: 26.64 },
      { age: 15, l: 1, m: 25.07, s: 0.0406, p5: 23.39, p10: 23.76, p25: 24.38, p50: 25.07, p75: 25.75, p90: 26.37, p95: 26.74 },
      { age: 16, l: 1, m: 25.15, s: 0.0407, p5: 23.45, p10: 23.82, p25: 24.45, p50: 25.15, p75: 25.83, p90: 26.45, p95: 26.82 },
      { age: 17, l: 1, m: 25.22, s: 0.0408, p5: 23.51, p10: 23.88, p25: 24.51, p50: 25.22, p75: 25.9, p90: 26.52, p95: 26.89 },
      { age: 18, l: 1, m: 25.28, s: 0.0409, p5: 23.56, p10: 23.93, p25: 24.56, p50: 25.28, p75: 25.96, p90: 26.58, p95: 26.95 },
    ],
  },
};
