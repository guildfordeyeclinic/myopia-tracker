/**
 * Literature-based age-banded elongation rates (illustrative).
 * See BCDO review (Poon) summarizing Mutti, COMET/Hou, and clinical
 * myopia-management consensus (e.g. Myopia Profile summaries).
 *
 * Untreated progressive myopes (typical published ranges):
 *   younger school-age: ~0.3 mm/year
 *   preteens / teens:   ~0.2 mm/year
 *
 * Physiologic / emmetropic peer growth (typical):
 *   under ~10: 0.1–0.2 mm/year
 *   older:     ~0.1 mm/year then tapering
 */

export function untreatedRateMmPerYear(age: number): number {
  if (age < 10) return 0.3;
  if (age < 15) return 0.2;
  return 0.08;
}

export function physiologicRateMmPerYear(age: number): number {
  if (age < 10) return 0.15;
  if (age < 13) return 0.1;
  if (age < 16) return 0.05;
  return 0.02;
}

/**
 * Project AL forward year-by-year to targetAge using a rate function.
 */
export function projectAl(
  currentAl: number,
  currentAge: number,
  targetAge: number,
  rateFn: (age: number) => number
): number {
  if (targetAge <= currentAge) return currentAl;
  let al = currentAl;
  let age = currentAge;
  const step = 0.25;
  while (age < targetAge - 1e-9) {
    const dt = Math.min(step, targetAge - age);
    al += rateFn(age) * dt;
    age += dt;
  }
  return Math.round(al * 100) / 100;
}

export function projectUntreatedTo18(currentAl: number, currentAge: number) {
  return projectAl(currentAl, currentAge, 18, untreatedRateMmPerYear);
}

export function projectPhysiologicTo18(currentAl: number, currentAge: number) {
  return projectAl(currentAl, currentAge, 18, physiologicRateMmPerYear);
}

export const HIGH_MYOPIA_AL_MM = 26;
