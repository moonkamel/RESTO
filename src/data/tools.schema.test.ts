import { describe, expect, it } from "vitest";
import { parseTools, toolSchema, type RestaurantTool } from "./tools.schema";

const valid: RestaurantTool = {
  id: "outil-test",
  name: "Outil test",
  publisher: "Éditeur test",
  category: "caisse",
  pricingModel: "abonnement",
  subscriptionMonthlyHT: 49,
  extraStationMonthlyHT: 29,
  hardwarePriceHT: 0,
  cardCommissionRate: null,
  cardFixedFeeHT: null,
  commitmentMonths: 12,
  establishmentTypes: ["brasserie"],
  multiSite: true,
  worksOffline: true,
  mealVouchers: false,
  deliveryIntegrations: [],
  strengths: ["Rapide"],
  watchouts: ["Engagement"],
  fieldReview: "Un avis terrain suffisamment long pour passer la validation.",
  partnerProgram: "affiliation",
  slug: "outil-test",
  verifiedAt: "2026-01-15",
  isPlaceholder: false,
};

const issues = (input: unknown) => {
  const r = toolSchema.safeParse(input);
  return r.success ? [] : r.error.issues.map((i) => i.path.join("."));
};

describe("toolSchema", () => {
  it("accepte un outil complet", () => {
    expect(issues(valid)).toEqual([]);
  });

  it("refuse un outil auquel il manque un champ", () => {
    const { verifiedAt: _omit, ...incomplete } = valid;
    expect(issues(incomplete)).toContain("verifiedAt");
  });

  it("refuse un champ inconnu (faute de frappe)", () => {
    expect(issues({ ...valid, prixMensuel: 10 })).not.toEqual([]);
  });

  it("exige un prix d'abonnement pour les modèles abonnement et mixte", () => {
    expect(issues({ ...valid, subscriptionMonthlyHT: null })).toContain("subscriptionMonthlyHT");
    expect(
      issues({
        ...valid,
        pricingModel: "mixte",
        subscriptionMonthlyHT: null,
        cardCommissionRate: 1,
      }),
    ).toContain("subscriptionMonthlyHT");
  });

  it("exige un taux de commission pour le modèle commission et les TPE", () => {
    expect(issues({ ...valid, pricingModel: "commission", subscriptionMonthlyHT: null })).toContain(
      "cardCommissionRate",
    );
    expect(issues({ ...valid, category: "paiement" })).toContain("cardCommissionRate");
  });

  it("refuse les valeurs hors bornes et les formats invalides", () => {
    expect(issues({ ...valid, subscriptionMonthlyHT: -1 })).toContain("subscriptionMonthlyHT");
    expect(issues({ ...valid, cardCommissionRate: 40 })).toContain("cardCommissionRate");
    expect(issues({ ...valid, commitmentMonths: 1.5 })).toContain("commitmentMonths");
    expect(issues({ ...valid, slug: "Outil Test" })).toContain("slug");
    expect(issues({ ...valid, verifiedAt: "15/01/2026" })).toContain("verifiedAt");
    expect(issues({ ...valid, establishmentTypes: [] })).toContain("establishmentTypes");
    expect(issues({ ...valid, strengths: [] })).toContain("strengths");
    expect(issues({ ...valid, fieldReview: "Trop court." })).toContain("fieldReview");
  });

  it("exige le prix du poste supplémentaire avec un abonnement, et seulement dans ce cas", () => {
    expect(issues({ ...valid, extraStationMonthlyHT: null })).toContain("extraStationMonthlyHT");
    expect(
      issues({
        ...valid,
        pricingModel: "commission",
        subscriptionMonthlyHT: null,
        cardCommissionRate: 1.5,
        cardFixedFeeHT: 0,
      }),
    ).toContain("extraStationMonthlyHT");
  });

  it("exige les frais fixes avec un taux de commission (0 si aucun), et seulement dans ce cas", () => {
    expect(issues({ ...valid, cardCommissionRate: 1.5 })).toContain("cardFixedFeeHT");
    expect(issues({ ...valid, cardCommissionRate: 1.5, cardFixedFeeHT: 0 })).toEqual([]);
    expect(issues({ ...valid, cardFixedFeeHT: 0.1 })).toContain("cardFixedFeeHT");
  });

  it("refuse une date de vérification dans le futur", () => {
    expect(issues({ ...valid, verifiedAt: "2999-01-01" })).toContain("verifiedAt");
  });
});

describe("parseTools", () => {
  it("refuse les id et slugs en double avec un message lisible", () => {
    expect(() => parseTools([valid, valid])).toThrow(/en double/);
  });

  it("indique le fichier à corriger", () => {
    expect(() => parseTools([{ ...valid, name: "" }])).toThrow(/src\/data\/tools\.ts/);
  });
});
