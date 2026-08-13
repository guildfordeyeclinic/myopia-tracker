import { getSexCurves } from "@/data/references";
import { sampleCurves } from "@/lib/al/interpolate";
import type { Ethnicity, Sex } from "@/lib/al/types";

/** Chart window — hide empty space below 21 mm */
export const Y_MIN = 21;
export const Y_MAX = 28;

export function toPlot(al: number) {
  return al - Y_MIN;
}

export function clampPlot(al: number) {
  return Math.min(Y_MAX - Y_MIN, Math.max(0, toPlot(al)));
}

export function buildPercentileSeries(
  ethnicity: Ethnicity,
  sex: Sex,
  age: number
) {
  const curves = getSexCurves(ethnicity, sex);
  const chartAgeMin = Math.min(6, Math.floor(age));
  const chartAgeMax = 18;
  const samples = sampleCurves(curves.ages, chartAgeMin, chartAgeMax, 0.5);

  const data = samples.map((s) => {
    const { p5, p25, p50, p75, p90, p95 } = s.values;
    const c5 = Math.max(p5, Y_MIN);
    const c25 = Math.max(p25, Y_MIN);
    const c50 = Math.max(p50, Y_MIN);
    const c75 = Math.max(p75, Y_MIN);
    const c90 = Math.max(p90, Y_MIN);
    const c95 = Math.max(p95, Y_MIN);

    return {
      age: s.age,
      band0: Math.max(0, c5 - Y_MIN),
      band1: Math.max(0, c25 - c5),
      band2: Math.max(0, c50 - c25),
      band3: Math.max(0, c75 - c50),
      band4: Math.max(0, c90 - c75),
      band5: Math.max(0, c95 - c90),
      band6: Math.max(0, Y_MAX - c95),
      p5: toPlot(p5),
      p25: toPlot(p25),
      p50: toPlot(p50),
      p75: toPlot(p75),
      p90: toPlot(p90),
      p95: toPlot(p95),
      rawP5: p5,
      rawP25: p25,
      rawP50: p50,
      rawP75: p75,
      rawP90: p90,
      rawP95: p95,
    };
  });

  const yTicks = [21, 22, 23, 24, 25, 26, 27, 28].map(toPlot);
  const xTicks =
    chartAgeMin < 6
      ? [chartAgeMin, 6, 8, 10, 12, 14, 16, 18].filter(
          (t, i, a) => a.indexOf(t) === i && t >= chartAgeMin
        )
      : [6, 8, 10, 12, 14, 16, 18];

  return { data, yTicks, xTicks, chartAgeMin, chartAgeMax };
}
