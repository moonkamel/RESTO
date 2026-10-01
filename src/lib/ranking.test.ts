import { describe, expect, it } from "vitest";
import type { RestaurantTool } from "@/data/tools.schema";
import { fieldScore, rankTools } from "./ranking";

type T = Pick<RestaurantTool, "name" | "verifiedAt" | "fieldTest">;

const test = (scores: (number | null)[]): RestaurantTool["fieldTest"] => {
  const [rush, extraOnboarding, offline, kitchenTickets] = scores.map((score) => ({
    score,
    verdict: "v",
  }));
  return {
    testedAt: "2026-01-01",
    context: "c",
    rush: rush!,
    extraOnboarding: extraOnboarding!,
    offline: offline!,
    kitchenTickets: kitchenTickets!,
  };
};

describe("fieldScore", () => {
  it("fait la moyenne des critères notés : (4 + 3 + 5 + 4) / 4 = 4", () => {
    expect(fieldScore({ fieldTest: test([4, 3, 5, 4]) })).toBe(4);
  });
  it("ignore les critères sans objet : (5 + 5 + 2) / 3 = 4", () => {
    expect(fieldScore({ fieldTest: test([5, 5, 2, null]) })).toBe(4);
  });
  it("arrondit au dixième : (3 + 4 + 3) / 3 = 3,33… → 3,3", () => {
    expect(fieldScore({ fieldTest: test([3, 4, null, 3]) })).toBe(3.3);
  });
  it("renvoie null sans test ou sans critère noté", () => {
    expect(fieldScore({ fieldTest: null })).toBeNull();
    expect(fieldScore({ fieldTest: test([null, null, null, null]) })).toBeNull();
  });
});

describe("rankTools", () => {
  const a: T = { name: "Alpha", verifiedAt: "2026-01-01", fieldTest: test([3, 3, 3, 3]) };
  const b: T = { name: "Bravo", verifiedAt: "2026-01-01", fieldTest: test([5, 5, 5, 5]) };
  const c: T = { name: "Charlie", verifiedAt: "2026-06-01", fieldTest: null };
  const d: T = { name: "Delta", verifiedAt: "2026-03-01", fieldTest: test([3, 3, 3, 3]) };
  const e: T = { name: "Écho", verifiedAt: "2026-01-01", fieldTest: test([3, 3, 3, 3]) };

  it("classe par note terrain décroissante, non testés en dernier", () => {
    expect(rankTools([c, a, b]).map((t) => t.name)).toEqual(["Bravo", "Alpha", "Charlie"]);
  });
  it("à note égale : vérification la plus récente, puis ordre alphabétique", () => {
    expect(rankTools([e, a, d]).map((t) => t.name)).toEqual(["Delta", "Alpha", "Écho"]);
  });
  it("ne modifie pas la liste d'origine", () => {
    const list = [a, b];
    rankTools(list);
    expect(list).toEqual([a, b]);
  });
});
