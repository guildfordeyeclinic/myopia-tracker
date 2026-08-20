import { describe, expect, it } from "vitest";
import { averageK } from "./keratometry";

describe("averageK", () => {
  it("averages steep and flat", () => {
    expect(averageK("44.00", "42.50")).toBe("43.25");
    expect(averageK("7.70", "7.90")).toBe("7.80");
  });

  it("returns null when a meridian is missing", () => {
    expect(averageK("44.00", "")).toBeNull();
    expect(averageK("", "42.50")).toBeNull();
    expect(averageK("", "")).toBeNull();
  });
});
