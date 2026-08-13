import { describe, expect, it } from "vitest";
import { getSexCurves } from "@/data/references";
import { classifyLtAl } from "./alcr";
import { analyzeMeasurement } from "./analyze";
import { interpolateAgeRow } from "./interpolate";
import { percentileRank } from "./percentile";

describe("East Asian Diez 2022 anchors", () => {
  it("matches published female P50 at ages 6 and 15", () => {
    const rows = getSexCurves("east_asian", "female").ages;
    expect(interpolateAgeRow(rows, 6).p50).toBeCloseTo(22.52, 2);
    expect(interpolateAgeRow(rows, 15).p50).toBeCloseTo(24.49, 2);
  });

  it("matches published male P50 at ages 6 and 9", () => {
    const rows = getSexCurves("east_asian", "male").ages;
    expect(interpolateAgeRow(rows, 6).p50).toBeCloseTo(22.98, 2);
    expect(interpolateAgeRow(rows, 9).p50).toBeCloseTo(24.23, 2);
  });

  it("places median AL near 50th percentile via LMS", () => {
    const rows = getSexCurves("east_asian", "male").ages;
    const p = percentileRank(24.23, rows, 9);
    expect(p).toBeGreaterThan(45);
    expect(p).toBeLessThan(55);
  });
});

describe("European Tideman anchors", () => {
  it("matches published P25/P50/P75 at age 6 male", () => {
    const row = interpolateAgeRow(getSexCurves("european", "male").ages, 6);
    expect(row.p25).toBeCloseTo(22.14, 2);
    expect(row.p50).toBeCloseTo(22.59, 2);
    expect(row.p75).toBeCloseTo(23.01, 2);
  });

  it("matches published female P50 at 9 and 15", () => {
    const rows = getSexCurves("european", "female").ages;
    expect(interpolateAgeRow(rows, 9).p50).toBeCloseTo(22.79, 2);
    expect(interpolateAgeRow(rows, 15).p50).toBeCloseTo(23.15, 2);
  });
});

describe("ethnicity difference (core teaching point)", () => {
  it("same AL ranks higher on European than East Asian chart", () => {
    const al = 23.8;
    const age = 9;
    const eu = percentileRank(al, getSexCurves("european", "male").ages, age);
    const ea = percentileRank(al, getSexCurves("east_asian", "male").ages, age);
    expect(eu).toBeGreaterThan(ea);
  });
});

describe("analyzeMeasurement", () => {
  it("returns delta vs P50 and untreated projection", () => {
    const result = analyzeMeasurement({
      age: 9,
      sex: "male",
      ethnicity: "east_asian",
      alOd: 24.5,
      alOs: 24.3,
    });
    expect(result.od.deltaVsP50).toBeCloseTo(24.5 - result.od.p50, 2);
    expect(result.od.untreatedAlAt18).toBeGreaterThan(24.5);
    expect(result.od.percentile).toBeGreaterThan(50);
  });

  it("computes optional AL/CR per eye", () => {
    const result = analyzeMeasurement({
      age: 10,
      sex: "female",
      ethnicity: "european",
      alOd: 23.5,
      alOs: 23.4,
      cornealRadiusOdMm: 7.7,
      cornealRadiusOsMm: 7.8,
    });
    expect(result.od.alCr).toBeCloseTo(23.5 / 7.7, 2);
    expect(result.os.alCr).toBeCloseTo(23.4 / 7.8, 2);
    expect(result.od.alCrFlag).toBe(23.5 / 7.7 > 3);
  });

  it("computes LT/AL per eye", () => {
    const result = analyzeMeasurement({
      age: 9,
      sex: "male",
      ethnicity: "east_asian",
      alOd: 24.5,
      alOs: 24.3,
      lensThicknessOdMm: 3.5,
      lensThicknessOsMm: 3.4,
    });
    expect(result.od.ltAl).toBeCloseTo(3.5 / 24.5, 4);
    expect(result.os.ltAl).toBeCloseTo(3.4 / 24.3, 4);
    expect(result.od.lensThicknessMm).toBe(3.5);
  });
});

describe("LT/AL buffering bands", () => {
  it("classifies buffering left, running low, and gone", () => {
    expect(classifyLtAl(0.145)).toBe("buffering_left");
    expect(classifyLtAl(0.138)).toBe("borderline");
    expect(classifyLtAl(0.132)).toBe("running_low");
    expect(classifyLtAl(0.128)).toBe("critical");
    expect(classifyLtAl(0.12)).toBe("gone");
  });
});
