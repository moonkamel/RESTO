import { describe, expect, it } from "vitest";
import {
  compareTools,
  computeToolCost,
  crossingRevenue,
  linearCost,
  parseNumber,
  validateInputs,
  type CostInputs,
  type CostTool,
  type RawInputs,
} from "./cost";

/*
 * Cas vérifiés à la main. Hypothèses du scénario principal :
 * CA 20 000 €/mois, 80 % par carte (16 000 €), 2 postes, 24 mois, ticket moyen 25 €
 * (640 transactions/mois), taux bancaire actuel 1,2 % sans frais fixes.
 */

const base: Omit<CostTool, "slug" | "name" | "category" | "pricingModel"> = {
  publisher: "Éditeur",
  subscriptionMonthlyHT: null,
  extraStationMonthlyHT: null,
  hardwarePriceHT: null,
  cardCommissionRate: null,
  cardFixedFeeHT: null,
  commitmentMonths: 0,
  partnerProgram: "affiliation",
  verifiedAt: "2026-01-01",
  isPlaceholder: false,
};

// Caisse à l'abonnement, sans paiement intégré.
const caisseA: CostTool = {
  ...base,
  slug: "caisse-a",
  name: "Caisse A",
  category: "caisse",
  pricingModel: "abonnement",
  subscriptionMonthlyHT: 50,
  extraStationMonthlyHT: 30,
  hardwarePriceHT: 1000,
};

// Terminal à la commission : 1,75 % + 0,10 € par transaction.
const tpeB: CostTool = {
  ...base,
  slug: "tpe-b",
  name: "TPE B",
  category: "paiement",
  pricingModel: "commission",
  hardwarePriceHT: 50,
  cardCommissionRate: 1.75,
  cardFixedFeeHT: 0.1,
};

// Caisse mixte avec paiement intégré à 1,2 %.
const caisseC: CostTool = {
  ...base,
  slug: "caisse-c",
  name: "Caisse C",
  category: "caisse",
  pricingModel: "mixte",
  subscriptionMonthlyHT: 30,
  extraStationMonthlyHT: 15,
  hardwarePriceHT: 400,
  cardCommissionRate: 1.2,
  cardFixedFeeHT: 0,
};

// Hors périmètre du calculateur.
const resa: CostTool = { ...caisseC, slug: "resa", name: "Résa", category: "reservation" };

const scenario: CostInputs = {
  monthlyRevenue: 20_000,
  cardSharePercent: 80,
  stations: 2,
  months: 24,
  averageTicket: 25,
  externalCardRate: 1.2,
  externalCardFixedFee: null,
};

describe("computeToolCost", () => {
  it("caisse A : (50 + 30) × 24 = 1 920 ; 1 000 × 2 = 2 000 ; 16 000 × 1,2 % × 24 = 4 608", () => {
    const cost = computeToolCost(caisseA, scenario);
    expect(cost?.subscription).toBeCloseTo(1920, 6);
    expect(cost?.hardware).toBeCloseTo(2000, 6);
    expect(cost?.cardFees).toBeCloseTo(4608, 6);
    expect(cost?.total).toBeCloseTo(8528, 6);
    expect(cost?.cardFeesSource).toBe("externe");
  });

  it("TPE B : (16 000 × 1,75 % + 640 × 0,10) × 24 = (280 + 64) × 24 = 8 256 ; matériel 100", () => {
    const cost = computeToolCost(tpeB, scenario);
    expect(cost?.subscription).toBe(0);
    expect(cost?.hardware).toBeCloseTo(100, 6);
    expect(cost?.cardFees).toBeCloseTo(8256, 6);
    expect(cost?.total).toBeCloseTo(8356, 6);
    expect(cost?.cardFeesSource).toBe("integre");
  });

  it("caisse C : (30 + 15) × 24 = 1 080 ; 400 × 2 = 800 ; 16 000 × 1,2 % × 24 = 4 608", () => {
    expect(computeToolCost(caisseC, scenario)?.total).toBeCloseTo(6488, 6);
  });

  it("TPE B, 1 poste, 12 mois, CA 10 000 €, 50 % carte, ticket 20 € : (87,50 + 25) × 12 + 50 = 1 400", () => {
    const cost = computeToolCost(tpeB, {
      ...scenario,
      monthlyRevenue: 10_000,
      cardSharePercent: 50,
      stations: 1,
      months: 12,
      averageTicket: 20,
    });
    expect(cost?.total).toBeCloseTo(1400, 6);
  });

  it("un seul poste : le prix du poste supplémentaire ne compte pas", () => {
    expect(computeToolCost(caisseA, { ...scenario, stations: 1 })?.subscription).toBeCloseTo(
      1200,
      6,
    );
  });

  it("utilise le taux intégré de l'outil, même si un taux externe est saisi", () => {
    expect(computeToolCost(tpeB, { ...scenario, externalCardRate: 0.1 })?.total).toBeCloseTo(
      8356,
      6,
    );
  });

  it("applique les frais fixes externes saisis : 640 × 0,05 × 24 = 768 de plus", () => {
    const cost = computeToolCost(caisseA, { ...scenario, externalCardFixedFee: 0.05 });
    expect(cost?.cardFees).toBeCloseTo(4608 + 768, 6);
  });

  it("caisse sans paiement intégré et sans taux saisi : non calculable", () => {
    expect(computeToolCost(caisseA, { ...scenario, externalCardRate: null })).toBeNull();
  });

  it("0 % de paiement carte : aucun frais carte", () => {
    expect(computeToolCost(tpeB, { ...scenario, cardSharePercent: 0 })?.cardFees).toBe(0);
  });
});

describe("linearCost / crossingRevenue", () => {
  it("donne fixe et pente : TPE B = 100 + 0,4128 × CA ; caisse C = 1 880 + 0,2304 × CA", () => {
    expect(linearCost(tpeB, scenario)).toMatchObject({ fixed: 100 });
    expect(linearCost(tpeB, scenario)?.slope).toBeCloseTo(24 * 0.8 * (0.0175 + 0.1 / 25), 12);
    expect(linearCost(caisseC, scenario)?.fixed).toBeCloseTo(1880, 6);
    expect(linearCost(caisseC, scenario)?.slope).toBeCloseTo(0.2304, 12);
  });

  it("point de bascule TPE B / caisse C : (1 880 − 100) / (0,4128 − 0,2304) ≈ 9 758,77 €", () => {
    const b = linearCost(tpeB, scenario);
    const c = linearCost(caisseC, scenario);
    const revenue = b && c ? crossingRevenue(b, c) : null;
    expect(revenue).toBeCloseTo(9758.77, 2);
    // Vérification : les deux coûts s'égalent à ce CA.
    const at = { ...scenario, monthlyRevenue: revenue ?? 0 };
    expect(computeToolCost(tpeB, at)?.total).toBeCloseTo(
      computeToolCost(caisseC, at)?.total ?? 0,
      6,
    );
  });

  it("pas de bascule si les droites sont parallèles ou se croisent à un CA négatif", () => {
    expect(
      crossingRevenue(
        { fixed: 0, slope: 1, cardFeesSource: "integre" },
        { fixed: 5, slope: 1, cardFeesSource: "integre" },
      ),
    ).toBeNull();
    expect(
      crossingRevenue(
        { fixed: 0, slope: 1, cardFeesSource: "integre" },
        { fixed: 5, slope: 2, cardFeesSource: "integre" },
      ),
    ).toBeNull();
  });
});

describe("compareTools", () => {
  it("classe par coût total croissant et écarte les catégories hors calculateur", () => {
    const { ranked, incomplete } = compareTools([caisseA, tpeB, caisseC, resa], scenario);
    expect(ranked.map((r) => r.tool.slug)).toEqual(["caisse-c", "tpe-b", "caisse-a"]);
    expect(incomplete).toEqual([]);
  });

  it("met de côté les caisses sans paiement intégré quand le taux actuel n'est pas saisi", () => {
    const { ranked, incomplete } = compareTools([caisseA, tpeB], {
      ...scenario,
      externalCardRate: null,
    });
    expect(ranked.map((r) => r.tool.slug)).toEqual(["tpe-b"]);
    expect(incomplete.map((t) => t.slug)).toEqual(["caisse-a"]);
  });

  it("calcule la bascule entre la commission et l'abonnement les moins chers", () => {
    const { breakEven } = compareTools([caisseA, tpeB, caisseC], scenario);
    expect(breakEven).toMatchObject({
      commission: tpeB,
      subscription: caisseC,
      cheaperBelow: "commission",
    });
    expect(breakEven?.revenue).toBeCloseTo(9758.77, 2);
  });

  it("à CA plus faible, la commission passe devant : sous 9 758 €, TPE B est moins cher que C", () => {
    const { ranked } = compareTools([tpeB, caisseC], { ...scenario, monthlyRevenue: 9000 });
    expect(ranked[0]?.tool.slug).toBe("tpe-b");
  });

  it("pas de bascule sans les deux modèles", () => {
    expect(compareTools([caisseC], scenario).breakEven).toBeNull();
    expect(compareTools([tpeB], scenario).breakEven).toBeNull();
  });

  it("départage les égalités par nom", () => {
    const twin = { ...caisseC, slug: "a-twin", name: "A jumelle" };
    expect(compareTools([caisseC, twin], scenario).ranked.map((r) => r.tool.slug)).toEqual([
      "a-twin",
      "caisse-c",
    ]);
  });
});

describe("parseNumber / validateInputs", () => {
  const raw: RawInputs = {
    monthlyRevenue: "30 000",
    cardSharePercent: "80",
    stations: "2",
    months: "24",
    averageTicket: "22,50",
    externalCardRate: "",
    externalCardFixedFee: "",
  };

  it("accepte espaces et virgule décimale", () => {
    expect(parseNumber("30 000")).toBe(30000);
    expect(parseNumber("1,75")).toBe(1.75);
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("abc")).toBeNull();
  });

  it("transforme une saisie valide en entrées de calcul", () => {
    expect(validateInputs(raw)).toEqual({
      ok: true,
      inputs: {
        monthlyRevenue: 30000,
        cardSharePercent: 80,
        stations: 2,
        months: 24,
        averageTicket: 22.5,
        externalCardRate: null,
        externalCardFixedFee: null,
      },
    });
  });

  it("signale chaque champ invalide", () => {
    const result = validateInputs({
      monthlyRevenue: "-1",
      cardSharePercent: "120",
      stations: "1,5",
      months: "18",
      averageTicket: "0",
      externalCardRate: "abc",
      externalCardFixedFee: "9",
    });
    expect(result.ok).toBe(false);
    expect(Object.keys(result.ok ? {} : result.errors).sort()).toEqual(
      [
        "averageTicket",
        "cardSharePercent",
        "externalCardFixedFee",
        "externalCardRate",
        "monthlyRevenue",
        "months",
        "stations",
      ].sort(),
    );
  });
});
