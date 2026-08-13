/**
 * Optional AL / corneal radius ratio.
 * BCDO article notes AL/C (both in mm) > 3 is often discussed as premyopic risk.
 *
 * Mean keratometry in diopters → radius (mm): r = 337.5 / K
 * (standard keratometric index 1.3375)
 *
 * LT/AL buffering bands (clinical teaching thresholds):
 *   > 0.14          → still some buffering left
 *   0.13 – 0.135    → buffer running low
 *   < 0.126         → buffering completely gone
 */

export function meanKToRadiusMm(meanK: number): number {
  if (meanK <= 0) return NaN;
  return 337.5 / meanK;
}

export function alCrRatio(alMm: number, cornealRadiusMm: number): number {
  if (cornealRadiusMm <= 0) return NaN;
  return alMm / cornealRadiusMm;
}

export const ALCR_PREMYOPIA_THRESHOLD = 3.0;

export function alCrFlag(ratio: number): boolean {
  return Number.isFinite(ratio) && ratio > ALCR_PREMYOPIA_THRESHOLD;
}

/** LT/AL > this → buffering still present */
export const LTAL_BUFFERING_LEFT = 0.14;
/** LT/AL in [LTAL_BUFFER_LOW_MIN, LTAL_BUFFER_LOW_MAX] → buffer running low */
export const LTAL_BUFFER_LOW_MAX = 0.135;
export const LTAL_BUFFER_LOW_MIN = 0.13;
/** LT/AL < this → buffering completely gone */
export const LTAL_BUFFER_GONE = 0.126;

export type LtalBand =
  | "buffering_left"
  | "borderline"
  | "running_low"
  | "critical"
  | "gone";

export function classifyLtAl(ltAl: number): LtalBand {
  if (ltAl > LTAL_BUFFERING_LEFT) return "buffering_left";
  if (ltAl > LTAL_BUFFER_LOW_MAX) return "borderline"; // (0.135, 0.14]
  if (ltAl >= LTAL_BUFFER_LOW_MIN) return "running_low"; // [0.13, 0.135]
  if (ltAl >= LTAL_BUFFER_GONE) return "critical"; // [0.126, 0.13)
  return "gone"; // < 0.126
}

export function ltAlInterpretation(ltAl: number): {
  band: LtalBand;
  label: string;
  detail: string;
  tone: "green" | "amber" | "orange" | "red" | "slate";
} {
  const band = classifyLtAl(ltAl);
  switch (band) {
    case "buffering_left":
      return {
        band,
        label: "Buffering left",
        detail: `LT/AL > ${LTAL_BUFFERING_LEFT} — still some crystalline-lens buffering remaining.`,
        tone: "green",
      };
    case "borderline":
      return {
        band,
        label: "Borderline buffering",
        detail: `LT/AL between ${LTAL_BUFFER_LOW_MAX} and ${LTAL_BUFFERING_LEFT} — buffering still present but approaching the low-buffer zone.`,
        tone: "slate",
      };
    case "running_low":
      return {
        band,
        label: "Buffer running low",
        detail: `LT/AL ${LTAL_BUFFER_LOW_MIN}–${LTAL_BUFFER_LOW_MAX} — buffer is running low.`,
        tone: "amber",
      };
    case "critical":
      return {
        band,
        label: "Buffer critically low",
        detail: `LT/AL between ${LTAL_BUFFER_GONE} and ${LTAL_BUFFER_LOW_MIN} — near complete loss of buffering.`,
        tone: "orange",
      };
    case "gone":
      return {
        band,
        label: "Buffering completely gone",
        detail: `LT/AL < ${LTAL_BUFFER_GONE} — buffering is completely gone.`,
        tone: "red",
      };
  }
}
