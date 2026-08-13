/**
 * Absolute crystalline lens power — modified Bennett method
 * (Hernandez et al., Biomed Opt Express 2015).
 *
 * Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC4646557/
 * DOI: 10.1364/BOE.6.004501
 *
 * L = n / (VD − (b−1)·LT) − n / (vL − b·LT)
 *
 * with b from conjugate ratio ML, thin-lens position proportional to LT.
 * Appendix worked example (subject 1-OD) is unit-tested.
 *
 * Distances in mm; powers in D. Uses n·1000 = 1336 in mm/D units.
 */

/** Aqueous / vitreous index */
export const N_AQUEOUS = 1.336;
/** Corneal refractive index */
export const N_CORNEA = 1.376;
/** Fixed R4/R3 = −0.6, nL = 1.43 → coefficients in Eq. (17) */
export const B_NUM_A = 0.65;
export const B_NUM_B = 0.584;
/** Default R2/R1 when posterior radius not measured (appendix §6.2) */
export const DEFAULT_R2_OVER_R1 = 0.81;
/** Default central corneal thickness (mm) */
export const DEFAULT_CCT_MM = 0.55;
/** Spectacle vertex distance (m) */
export const VERTEX_M = 0.014;

export interface BennettInput {
  /** Cycloplegic spherical equivalent at spectacle plane (D) */
  seSpectacleD: number;
  /** Axial length (mm) */
  alMm: number;
  /**
   * Anterior chamber depth from corneal epithelium to anterior lens (mm).
   * Common biometer output. Aqueous depth used in the formula is ACD − CCT.
   */
  acdEpiToLensMm: number;
  /** Central lens thickness (mm) */
  ltMm: number;
  /** Mean anterior corneal radius of curvature (mm) */
  r1Mm: number;
  /** Optional posterior corneal radius (mm). Default = 0.81 × R1 */
  r2Mm?: number;
  /** Optional CCT (mm). Default 0.55 */
  cctMm?: number;
  /** Spectacle vertex distance (m). Default 0.014 */
  vertexM?: number;
}

export interface BennettResult {
  lensPowerD: number;
  /** Refraction at anterior corneal plane (D) */
  rCornealD: number;
  /** Total corneal power K (D) */
  kD: number;
  k1D: number;
  k2D: number;
  /** Aqueous ACD used in formula (posterior cornea → lens) */
  acdAqueousMm: number;
  vitreousDepthMm: number;
  vLMm: number;
  ml: number;
  b: number;
  cctMm: number;
  r1Mm: number;
  r2Mm: number;
}

/** Spectacle SE → corneal-plane refraction (D) */
export function seToCornealPlane(
  seD: number,
  vertexM: number = VERTEX_M
): number {
  const denom = 1 - vertexM * seD;
  if (Math.abs(denom) < 1e-9) return NaN;
  return seD / denom;
}

/**
 * Hernandez modified Bennett crystalline lens power (D).
 * Returns null if geometry is invalid.
 */
export function bennettLensPower(input: BennettInput): BennettResult | null {
  const {
    seSpectacleD,
    alMm,
    acdEpiToLensMm,
    ltMm,
    r1Mm,
    r2Mm: r2In,
    cctMm: cctIn,
    vertexM = VERTEX_M,
  } = input;

  if (
    ![seSpectacleD, alMm, acdEpiToLensMm, ltMm, r1Mm].every((x) =>
      Number.isFinite(x)
    ) ||
    alMm <= 0 ||
    acdEpiToLensMm <= 0 ||
    ltMm <= 0 ||
    r1Mm <= 0
  ) {
    return null;
  }

  const cct = cctIn != null && cctIn > 0 ? cctIn : DEFAULT_CCT_MM;
  const r2 = r2In != null && r2In > 0 ? r2In : DEFAULT_R2_OVER_R1 * r1Mm;

  // Aqueous ACD (posterior cornea → anterior lens)
  const acdAqueous = acdEpiToLensMm - cct;
  if (acdAqueous <= 0.5) return null;

  const vd = alMm - acdEpiToLensMm - ltMm;
  if (vd <= 0.5) return null;

  const r = seToCornealPlane(seSpectacleD, vertexM);
  if (!Number.isFinite(r)) return null;

  // Step 1 — corneal powers (appendix §6.1), radii in metres for surface powers
  const R1_m = r1Mm / 1000;
  const R2_m = r2 / 1000;
  const K1 = (N_CORNEA - 1) / R1_m;
  const K2 = (N_AQUEOUS - N_CORNEA) / R2_m;
  const K =
    K1 + K2 - (cct / 1000 / N_CORNEA) * K1 * K2;

  // H1V1 (mm): −CCT·K2/(nK·K)  → positive when K2 < 0
  const h1v1 = (-cct * K2) / (N_CORNEA * K);

  // n in mm·D units
  const nMm = N_AQUEOUS * 1000;

  // vL (mm) — distance from anterior lens to primary image of cornea
  // Eq. (15a): vL = n/(R+K) − ACD − CCT − H1V1
  // with ACD = aqueous depth
  const vergenceDenom = r + K;
  if (Math.abs(vergenceDenom) < 1e-6) return null;
  const vL = nMm / vergenceDenom - acdAqueous - cct - h1v1;
  if (vL <= ltMm) return null;

  // Step 2 — approximate ML (Eq. 18)
  // ML = (VD + LT/2) / (vL_full − LT/2)
  // where vL_full in Eq.18 uses the same corneal path as vL
  const mlNum = vd + ltMm / 2;
  const mlDen = vL - ltMm / 2;
  if (mlDen <= 0) return null;
  const ml = mlNum / mlDen;
  if (ml * ml >= 0.999) return null;

  // Step 3 — b (Eq. 17)
  const ml2 = ml * ml;
  const b = (B_NUM_A - B_NUM_B * ml2) / (1 - ml2);

  // Step 5 — lens power (Eq. 14 / 16)
  const sExit = vd - (b - 1) * ltMm;
  const sObj = vL - b * ltMm;
  if (sExit <= 0 || sObj <= 0) return null;

  const lensPowerD = nMm / sExit - nMm / sObj;
  if (!Number.isFinite(lensPowerD)) return null;

  return {
    lensPowerD: round2(lensPowerD),
    rCornealD: round2(r),
    kD: round2(K),
    k1D: round2(K1),
    k2D: round2(K2),
    acdAqueousMm: round2(acdAqueous),
    vitreousDepthMm: round2(vd),
    vLMm: round2(vL),
    ml: round3(ml),
    b: round3(b),
    cctMm: round3(cct),
    r1Mm: round2(r1Mm),
    r2Mm: round2(r2),
  };
}

/** Convert mean K in diopters (keratometric 1.3375) → approximate anterior radius mm */
export function kDioptersToRadiusMm(kD: number): number {
  if (kD <= 0) return NaN;
  return 337.5 / kD;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}

/** Fallback typical band when age is 10+ (clinic teaching range) */
export const LENS_POWER_NORMAL_MIN_D = 20;
export const LENS_POWER_NORMAL_MAX_D = 24;

export type LensPowerAgeBand = "under_6" | "6_9" | "10_13" | "14_18" | "over_18";

export interface AgeBufferRule {
  band: LensPowerAgeBand;
  /** Short age-group label shown in the UI */
  label: string;
  /** Buffer depleted if Bennett power is at or below this (D) */
  thresholdD: number;
  typicalMinD: number;
  typicalMaxD: number;
  clinicalNote: string;
}

/**
 * Age-stratified remaining-buffer thresholds.
 * Younger eyes should still have higher lens power; a low Bennett value
 * at that age means the reserve was used early.
 */
export function lensPowerAgeRule(ageYears: number): AgeBufferRule {
  if (ageYears < 6) {
    return {
      band: "under_6",
      label: "Under 6 (using 6–9 threshold)",
      thresholdD: 18.5,
      typicalMinD: 21,
      typicalMaxD: 23,
      clinicalNote:
        "Children this young should still have high lens power. The 6–9 depleted threshold (≤ +18.5 D) is applied as a conservative floor.",
    };
  }
  if (ageYears < 10) {
    return {
      band: "6_9",
      label: "Ages 6–9",
      thresholdD: 18.5,
      typicalMinD: 21,
      typicalMaxD: 23,
      clinicalNote:
        "Lens power is typically about +21.0 to +23.0 D at this age. A value already at or below +18.5 D suggests the child has used lens reserve early to compensate for axial stretch.",
    };
  }
  if (ageYears < 14) {
    return {
      band: "10_13",
      label: "Ages 10–13",
      thresholdD: 17.0,
      typicalMinD: LENS_POWER_NORMAL_MIN_D,
      typicalMaxD: LENS_POWER_NORMAL_MAX_D,
      clinicalNote:
        "The eye is approaching intermediate structural maturation. Remaining lens buffer is nearing exhaustion at or below +17.0 D.",
    };
  }
  if (ageYears <= 18) {
    return {
      band: "14_18",
      label: "Ages 14–18",
      thresholdD: 15.5,
      typicalMinD: LENS_POWER_NORMAL_MIN_D,
      typicalMaxD: LENS_POWER_NORMAL_MAX_D,
      clinicalNote:
        "This is the usual biological floor of the human crystalline lens. Further flattening below +15.5 D is not expected.",
    };
  }
  return {
    band: "over_18",
    label: "Over 18 (using 14–18 floor)",
    thresholdD: 15.5,
    typicalMinD: LENS_POWER_NORMAL_MIN_D,
    typicalMaxD: LENS_POWER_NORMAL_MAX_D,
    clinicalNote:
      "Adult eyes are interpreted with the 14–18 biological floor (≤ +15.5 D).",
  };
}

export type LensPowerBand = "buffer_gone" | "low" | "normal" | "high";

export function classifyLensPower(
  lensPowerD: number,
  ageYears: number
): LensPowerBand {
  const rule = lensPowerAgeRule(ageYears);
  if (lensPowerD <= rule.thresholdD) return "buffer_gone";
  if (lensPowerD < rule.typicalMinD) return "low";
  if (lensPowerD <= rule.typicalMaxD) return "normal";
  return "high";
}

export function lensPowerInterpretation(
  lensPowerD: number,
  ageYears: number
): {
  band: LensPowerBand;
  rule: AgeBufferRule;
  label: string;
  detail: string;
  tone: "red" | "amber" | "green" | "slate";
} {
  const rule = lensPowerAgeRule(ageYears);
  const band = classifyLensPower(lensPowerD, ageYears);
  const thr = `+${rule.thresholdD.toFixed(1)} D`;
  const typical = `+${rule.typicalMinD.toFixed(0)} to +${rule.typicalMaxD.toFixed(0)} D`;

  switch (band) {
    case "buffer_gone":
      return {
        band,
        rule,
        label: "Buffer depleted",
        detail: `${rule.label}: Bennett power ≤ ${thr}. ${rule.clinicalNote}`,
        tone: "red",
      };
    case "low":
      return {
        band,
        rule,
        label: "Below typical for age",
        detail: `${rule.label}: below the usual ${typical} band, but still above the depleted threshold (${thr}). ${rule.clinicalNote}`,
        tone: "amber",
      };
    case "normal":
      return {
        band,
        rule,
        label: "Typical for age",
        detail: `${rule.label}: within the usual ${typical} band. Buffer is considered depleted only at ≤ ${thr}.`,
        tone: "green",
      };
    case "high":
      return {
        band,
        rule,
        label: "Above typical for age",
        detail: `${rule.label}: above the usual ${typical} band. Buffer is considered depleted only at ≤ ${thr}.`,
        tone: "slate",
      };
  }
}
