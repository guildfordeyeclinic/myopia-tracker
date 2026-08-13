import { getReference, getSexCurves } from "@/data/references";
import { alCrFlag, alCrRatio } from "./alcr";
import { interpolateAgeRow } from "./interpolate";
import {
  deltaVsP50,
  formatDeltaMm,
  formatPercentile,
  percentileRank,
} from "./percentile";
import {
  HIGH_MYOPIA_AL_MM,
  physiologicRateMmPerYear,
  projectUntreatedTo18,
  untreatedRateMmPerYear,
} from "./project";
import type {
  AnalysisResult,
  EyeInsight,
  MeasurementInput,
} from "./types";

function buildEye(
  eye: "OD" | "OS",
  al: number,
  age: number,
  rows: ReturnType<typeof getSexCurves>["ages"],
  cornealRadiusMm?: number,
  lensThicknessMm?: number
): EyeInsight {
  const p = percentileRank(al, rows, age);
  const p50 = interpolateAgeRow(rows, age).p50;
  const delta = deltaVsP50(al, rows, age);
  const untreatedAlAt18 = projectUntreatedTo18(al, age);

  let ratio: number | undefined;
  let flag: boolean | undefined;
  if (cornealRadiusMm != null && cornealRadiusMm > 0) {
    ratio = Math.round(alCrRatio(al, cornealRadiusMm) * 1000) / 1000;
    flag = alCrFlag(ratio);
  }

  let ltAl: number | undefined;
  let lt: number | undefined;
  if (lensThicknessMm != null && lensThicknessMm > 0 && al > 0) {
    lt = Math.round(lensThicknessMm * 100) / 100;
    ltAl = Math.round((lensThicknessMm / al) * 10000) / 10000;
  }

  return {
    eye,
    al,
    percentile: p,
    percentileLabel: formatPercentile(p),
    p50: Math.round(p50 * 100) / 100,
    deltaVsP50: Math.round(delta * 100) / 100,
    deltaLabel: formatDeltaMm(delta),
    untreatedAlAt18,
    crosses26mm: untreatedAlAt18 >= HIGH_MYOPIA_AL_MM,
    alCr: ratio,
    alCrFlag: flag,
    lensThicknessMm: lt,
    ltAl,
  };
}

/** Absolute age bounds we still compute (with extrapolation outside published tables) */
export const AGE_COMPUTE_MIN = 3;
export const AGE_COMPUTE_MAX = 18;

export function analyzeMeasurement(input: MeasurementInput): AnalysisResult {
  const ref = getReference(input.ethnicity);
  const curves = getSexCurves(input.ethnicity, input.sex);
  // Use actual age for percentile (extrapolates under 6 / over table max)
  const ageUsed = Math.min(
    AGE_COMPUTE_MAX,
    Math.max(AGE_COMPUTE_MIN, input.age)
  );
  const ageOutOfRange =
    input.age < ref.ageMin || input.age > ref.ageMax;
  /** Published tables start at 6; under-6 is linear extrapolation */
  const ageExtrapolatedYoung = input.age < ref.ageMin;

  return {
    input,
    od: buildEye(
      "OD",
      input.alOd,
      ageUsed,
      curves.ages,
      input.cornealRadiusOdMm,
      input.lensThicknessOdMm
    ),
    os: buildEye(
      "OS",
      input.alOs,
      ageUsed,
      curves.ages,
      input.cornealRadiusOsMm,
      input.lensThicknessOsMm
    ),
    physiologicRateMmPerYear: physiologicRateMmPerYear(ageUsed),
    untreatedRateMmPerYear: untreatedRateMmPerYear(ageUsed),
    referenceLabel: ref.label,
    ageClamped: ageUsed,
    ageOutOfRange,
    ageExtrapolatedYoung,
  };
}

export { HIGH_MYOPIA_AL_MM };
