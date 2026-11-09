import { describe, expect, it } from "vitest";
import { toBengaliNumber, getAge, formatHeight } from "@/lib/utils/bengali";

describe("Bengali Utilities", () => {
  it("converts english digits to bengali digits correctly", () => {
    expect(toBengaliNumber(1234567890)).toBe("১২৩৪৫৬৭৮৯০");
    expect(toBengaliNumber("ML-1042")).toBe("ML-১০৪২");
  });

  it("calculates age accurately from birth year", () => {
    const currentYear = new Date().getFullYear();
    expect(getAge(2000)).toBe(currentYear - 2000);
  });

  it("formats height in bengali feet and inches", () => {
    expect(formatHeight(5, 7)).toBe("৫' ৭\"");
    expect(formatHeight(6, 0)).toBe("৬' ০\"");
  });
});
