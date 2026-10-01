import { describe, expect, it } from "vitest";
import { formatEuros, formatIsoDate } from "./format";

// Intl insère des espaces insécables : on les normalise pour comparer.
const plain = (s: string) => s.replace(/[  ]/g, " ");

describe("format", () => {
  it("formate les montants à l'euro près", () => {
    expect(plain(formatEuros(12345.6))).toBe("12 346 €");
    expect(plain(formatEuros(0))).toBe("0 €");
  });
  it("formate les dates ISO en français", () => {
    expect(formatIsoDate("2026-10-01")).toBe("1 octobre 2026");
  });
});
