import { describe, expect, it } from "vitest";
import { getToolBySlug, tools } from "./tools";

describe("données outils", () => {
  it("se chargent et passent la validation", () => {
    expect(tools.length).toBeGreaterThan(0);
  });

  it("couvrent les trois programmes partenaires (utile tant que les données sont factices)", () => {
    expect(new Set(tools.map((t) => t.partnerProgram))).toEqual(
      new Set(["affiliation", "apport-affaires", "aucun"]),
    );
  });

  it("retrouvent un outil par son slug", () => {
    const first = tools[0];
    expect(first && getToolBySlug(first.slug)).toBe(first);
    expect(getToolBySlug("inconnu")).toBeUndefined();
  });
});
