export type Sex = "male" | "female";
export type Ethnicity = "european" | "east_asian";

/** Percentile ranks stored in reference tables */
export type PercentileKey =
  | "p5"
  | "p10"
  | "p25"
  | "p50"
  | "p75"
  | "p90"
  | "p95";

export const PERCENTILE_KEYS: PercentileKey[] = [
  "p5",
  "p10",
  "p25",
  "p50",
  "p75",
  "p90",
  "p95",
];

export const PERCENTILE_VALUES: Record<PercentileKey, number> = {
  p5: 5,
  p10: 10,
  p25: 25,
  p50: 50,
  p75: 75,
  p90: 90,
  p95: 95,
};

export interface AgeRow {
  age: number;
  p5: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  /** Optional LMS for exact Z-score (East Asian Diez 2022) */
  l?: number;
  m?: number;
  s?: number;
}

export interface SexCurves {
  sex: Sex;
  ages: AgeRow[];
}

export interface ReferenceSet {
  id: Ethnicity;
  label: string;
  regionNote: string;
  source: string;
  citation: string;
  doi?: string;
  ageMin: number;
  ageMax: number;
  male: SexCurves;
  female: SexCurves;
}

export interface MeasurementInput {
  age: number;
  sex: Sex;
  ethnicity: Ethnicity;
  alOd: number;
  alOs: number;
  /** Per-eye corneal radius in mm (optional) */
  cornealRadiusOdMm?: number;
  cornealRadiusOsMm?: number;
  /** Per-eye lens thickness in mm (optional) */
  lensThicknessOdMm?: number;
  lensThicknessOsMm?: number;
}

export interface EyeInsight {
  eye: "OD" | "OS";
  al: number;
  percentile: number;
  percentileLabel: string;
  p50: number;
  deltaVsP50: number;
  deltaLabel: string;
  untreatedAlAt18: number;
  crosses26mm: boolean;
  alCr?: number;
  alCrFlag?: boolean;
  lensThicknessMm?: number;
  /** LT / AL ratio when both available */
  ltAl?: number;
}

export interface AnalysisResult {
  input: MeasurementInput;
  od: EyeInsight;
  os: EyeInsight;
  physiologicRateMmPerYear: number;
  untreatedRateMmPerYear: number;
  referenceLabel: string;
  ageClamped: number;
  ageOutOfRange: boolean;
  /** True when age &lt; published chart minimum (usually 6) — percentile is extrapolated */
  ageExtrapolatedYoung?: boolean;
}
