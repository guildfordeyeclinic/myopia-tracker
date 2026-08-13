import { describe, expect, it } from "vitest";
import {
  bennettLensPower,
  classifyLensPower,
  kDioptersToRadiusMm,
  seToCornealPlane,
} from "./bennett";

describe("helpers", () => {
  it("converts spectacle SE to corneal plane", () => {
    const cv = seToCornealPlane(-3);
    expect(cv).toBeCloseTo(-3 / (1 - 0.014 * -3), 4);
  });

  it("converts keratometric D to radius", () => {
    expect(kDioptersToRadiusMm(43.27)).toBeCloseTo(337.5 / 43.27, 2);
  });
});

describe("Hernandez modified Bennett (PMC4646557 appendix §6.1)", () => {
  /**
   * Subject 1-OD from Table 3 / Appendix worked example.
   * Expected: K ≈ 42.41 D, ML ≈ 0.695, b ≈ 0.712, L ≈ 21.66 D
   */
  const subject1Od = () => {
    // R at cornea = −4.07 D → spectacle SE that converts to that
    const rCorneal = -4.07;
    const seSpectacle = rCorneal / (1 + 0.014 * rCorneal);
    return bennettLensPower({
      seSpectacleD: seSpectacle,
      alMm: 0.488 + 3.783 + 3.438 + 18.302,
      acdEpiToLensMm: 3.783 + 0.488,
      ltMm: 3.438,
      r1Mm: 7.74,
      r2Mm: 6.37,
      cctMm: 0.488,
    });
  };

  it("matches appendix lens power ≈ 21.66 D", () => {
    const r = subject1Od();
    expect(r).not.toBeNull();
    expect(r!.lensPowerD).toBeCloseTo(21.66, 1);
  });

  it("matches appendix intermediate values", () => {
    const r = subject1Od();
    expect(r).not.toBeNull();
    expect(r!.kD).toBeCloseTo(42.41, 1);
    expect(r!.ml).toBeCloseTo(0.695, 2);
    expect(r!.b).toBeCloseTo(0.712, 2);
    expect(r!.vitreousDepthMm).toBeCloseTo(18.3, 1);
  });

  it("estimates R2 when missing (appendix §6.2 ≈ 21.81 D)", () => {
    const rCorneal = -4.07;
    const seSpectacle = rCorneal / (1 + 0.014 * rCorneal);
    const r = bennettLensPower({
      seSpectacleD: seSpectacle,
      alMm: 0.488 + 3.783 + 3.438 + 18.302,
      acdEpiToLensMm: 3.783 + 0.488,
      ltMm: 3.438,
      r1Mm: 7.74,
      // no r2 — uses 0.81 × R1
      cctMm: 0.488,
    });
    expect(r).not.toBeNull();
    expect(r!.lensPowerD).toBeCloseTo(21.81, 0); // within ~0.5 D
  });

  it("returns null for invalid geometry", () => {
    const r = bennettLensPower({
      seSpectacleD: 0,
      alMm: 20,
      acdEpiToLensMm: 10,
      ltMm: 10,
      r1Mm: 7.8,
    });
    expect(r).toBeNull();
  });

  it("shorter emmetropic eye has higher lens power than longer eye", () => {
    const short = bennettLensPower({
      seSpectacleD: 0,
      alMm: 22.5,
      acdEpiToLensMm: 3.6,
      ltMm: 3.6,
      r1Mm: 7.8,
    });
    const long = bennettLensPower({
      seSpectacleD: 0,
      alMm: 24.5,
      acdEpiToLensMm: 3.6,
      ltMm: 3.6,
      r1Mm: 7.8,
    });
    expect(short).not.toBeNull();
    expect(long).not.toBeNull();
    expect(long!.lensPowerD).toBeLessThan(short!.lensPowerD);
  });
});

describe("lens power clinical bands", () => {
  it("classifies normal, low, buffer gone, and high", () => {
    expect(classifyLensPower(22)).toBe("normal");
    expect(classifyLensPower(20)).toBe("normal");
    expect(classifyLensPower(24)).toBe("normal");
    expect(classifyLensPower(18)).toBe("low");
    expect(classifyLensPower(16)).toBe("buffer_gone");
    expect(classifyLensPower(14)).toBe("buffer_gone");
    expect(classifyLensPower(25)).toBe("high");
  });
});
