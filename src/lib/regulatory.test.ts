import { describe, expect, it } from "vitest";
import { getRegulatoryClaim, REGULATORY_TOPICS, regulatoryClaims } from "./regulatory";

describe("regulatory", () => {
  it("contient une entrée par sujet, chacune datée", () => {
    expect(regulatoryClaims.map((c) => c.id).sort()).toEqual([...REGULATORY_TOPICS].sort());
    for (const claim of regulatoryClaims) expect(claim.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("toute affirmation publiée a une source", () => {
    for (const claim of regulatoryClaims.filter((c) => !c.isPlaceholder)) {
      expect(claim.sourceUrl).toMatch(/^https:\/\//);
    }
  });

  it("retrouve une entrée par sujet", () => {
    expect(getRegulatoryClaim("titres-restaurant").id).toBe("titres-restaurant");
  });
});
