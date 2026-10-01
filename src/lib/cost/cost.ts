import type { RestaurantTool } from "@/data/tools.schema";

/*
 * Calculateur « Abonnement ou commission : quelle caisse vous coûte le moins ? »
 *
 * Toutes les fonctions sont pures et testées (cost.test.ts, cas vérifiés à la main).
 * Le coût d'une offre est linéaire en CA mensuel R :
 *   coût(R) = fixe + pente × R
 *   fixe  = (abonnement 1er poste + poste supp. × (postes − 1)) × mois + matériel × postes
 *   pente = mois × part carte × (taux % + frais fixes / ticket moyen)
 * Les frais carte ne sont pas soumis à la TVA ; abonnement et matériel sont en HT.
 */

export const DURATIONS = [12, 24, 36] as const;
export type Duration = (typeof DURATIONS)[number];

/** Catégories comparées : une « offre d'encaissement » = une caisse ou un terminal de paiement. */
export const CALCULATOR_CATEGORIES = ["caisse", "paiement"] as const;

export type CostInputs = {
  /** CA mensuel encaissé, en € TTC. */
  monthlyRevenue: number;
  /** Part du CA payée par carte, de 0 à 100. */
  cardSharePercent: number;
  /** Nombre de postes d'encaissement (≥ 1). */
  stations: number;
  months: Duration;
  /** Ticket moyen payé par carte, en € TTC (sert aux frais fixes par transaction). */
  averageTicket: number;
  /** Taux actuel de la banque/du TPE, pour les caisses sans paiement intégré. null = inconnu. */
  externalCardRate: number | null;
  /** Frais fixes actuels par transaction, en €. null = 0. */
  externalCardFixedFee: number | null;
};

export type CostTool = Pick<
  RestaurantTool,
  | "slug"
  | "name"
  | "publisher"
  | "category"
  | "pricingModel"
  | "subscriptionMonthlyHT"
  | "extraStationMonthlyHT"
  | "hardwarePriceHT"
  | "cardCommissionRate"
  | "cardFixedFeeHT"
  | "commitmentMonths"
  | "partnerProgram"
  | "verifiedAt"
  | "isPlaceholder"
>;

export type CardFeesSource = "integre" | "externe";

export type LinearCost = {
  /** Coût indépendant du CA sur la durée (abonnement + matériel). */
  fixed: number;
  /** Coût par € de CA mensuel, sur la durée. */
  slope: number;
  cardFeesSource: CardFeesSource;
};

export type CostBreakdown = {
  subscription: number;
  hardware: number;
  cardFees: number;
  total: number;
  cardFeesSource: CardFeesSource;
};

export function isCalculatorTool(tool: Pick<RestaurantTool, "category">): boolean {
  return (CALCULATOR_CATEGORIES as readonly string[]).includes(tool.category);
}

/** Abonnement et matériel sur la durée : la partie du coût indépendante du CA. */
function fixedParts(
  tool: CostTool,
  inputs: CostInputs,
): { subscription: number; hardware: number } {
  const first = tool.subscriptionMonthlyHT ?? 0;
  const extra = tool.extraStationMonthlyHT ?? 0;
  return {
    subscription: (first + extra * (inputs.stations - 1)) * inputs.months,
    hardware: (tool.hardwarePriceHT ?? 0) * inputs.stations,
  };
}

/** Forme linéaire du coût, ou null si on ne connaît pas les frais carte de l'offre. */
export function linearCost(tool: CostTool, inputs: CostInputs): LinearCost | null {
  const card =
    tool.cardCommissionRate !== null
      ? { rate: tool.cardCommissionRate, fee: tool.cardFixedFeeHT ?? 0, source: "integre" as const }
      : inputs.externalCardRate !== null
        ? {
            rate: inputs.externalCardRate,
            fee: inputs.externalCardFixedFee ?? 0,
            source: "externe" as const,
          }
        : null;
  if (!card) return null;

  const { subscription, hardware } = fixedParts(tool, inputs);
  const perEuroPerMonth =
    (inputs.cardSharePercent / 100) * (card.rate / 100 + card.fee / inputs.averageTicket);

  return {
    fixed: subscription + hardware,
    slope: inputs.months * perEuroPerMonth,
    cardFeesSource: card.source,
  };
}

export function computeToolCost(tool: CostTool, inputs: CostInputs): CostBreakdown | null {
  const linear = linearCost(tool, inputs);
  if (!linear) return null;
  const { subscription, hardware } = fixedParts(tool, inputs);
  const cardFees = linear.slope * inputs.monthlyRevenue;
  return {
    subscription,
    hardware,
    cardFees,
    total: subscription + hardware + cardFees,
    cardFeesSource: linear.cardFeesSource,
  };
}

export type RankedTool = { tool: CostTool; cost: CostBreakdown; linear: LinearCost };

export type BreakEven = {
  /** CA mensuel (€ TTC) où les deux offres coûtent autant. */
  revenue: number;
  commission: CostTool;
  subscription: CostTool;
  /** Modèle le moins cher sous ce seuil (l'autre l'est au-dessus). */
  cheaperBelow: "commission" | "abonnement";
};

export type Comparison = {
  ranked: RankedTool[];
  /** Offres non comparables faute de frais carte connus (caisse sans paiement intégré). */
  incomplete: CostTool[];
  breakEven: BreakEven | null;
};

/** Point de bascule entre deux coûts linéaires : CA où ils s'égalent, ou null s'ils ne se croisent pas. */
export function crossingRevenue(a: LinearCost, b: LinearCost): number | null {
  const slopeGap = a.slope - b.slope;
  if (Math.abs(slopeGap) < 1e-12) return null;
  const revenue = (b.fixed - a.fixed) / slopeGap;
  return revenue > 0 && Number.isFinite(revenue) ? revenue : null;
}

/**
 * Classe les offres par coût total croissant (à égalité : par nom) et calcule le point de
 * bascule entre l'offre à la commission et l'offre avec abonnement (abonnement ou mixte)
 * les moins chères aux valeurs saisies. Le classement ne dépend que du coût.
 */
export function compareTools(tools: readonly CostTool[], inputs: CostInputs): Comparison {
  const ranked: RankedTool[] = [];
  const incomplete: CostTool[] = [];
  for (const tool of tools.filter(isCalculatorTool)) {
    const linear = linearCost(tool, inputs);
    const cost = computeToolCost(tool, inputs);
    if (linear && cost) ranked.push({ tool, cost, linear });
    else incomplete.push(tool);
  }
  ranked.sort(
    (a, b) => a.cost.total - b.cost.total || a.tool.name.localeCompare(b.tool.name, "fr"),
  );

  const commission = ranked.find((r) => r.tool.pricingModel === "commission");
  const subscription = ranked.find((r) => r.tool.pricingModel !== "commission");
  let breakEven: BreakEven | null = null;
  if (commission && subscription) {
    const revenue = crossingRevenue(commission.linear, subscription.linear);
    if (revenue !== null) {
      breakEven = {
        revenue,
        commission: commission.tool,
        subscription: subscription.tool,
        cheaperBelow:
          commission.linear.fixed <= subscription.linear.fixed ? "commission" : "abonnement",
      };
    }
  }
  return { ranked, incomplete, breakEven };
}

export type InputErrors = Partial<Record<keyof CostInputs, string>>;

/** Champs du formulaire, tels que saisis (chaînes, virgule décimale acceptée). */
export type RawInputs = Record<
  | "monthlyRevenue"
  | "cardSharePercent"
  | "stations"
  | "averageTicket"
  | "externalCardRate"
  | "externalCardFixedFee",
  string
> & { months: string };

export function parseNumber(value: string): number | null {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  if (normalized === "") return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function validateInputs(
  raw: RawInputs,
): { ok: true; inputs: CostInputs } | { ok: false; errors: InputErrors } {
  const errors: InputErrors = {};
  const revenue = parseNumber(raw.monthlyRevenue);
  const share = parseNumber(raw.cardSharePercent);
  const stations = parseNumber(raw.stations);
  const ticket = parseNumber(raw.averageTicket);
  const months = Number(raw.months);
  const extRate = parseNumber(raw.externalCardRate);
  const extFee = parseNumber(raw.externalCardFixedFee);

  if (revenue === null || revenue < 0 || revenue > 10_000_000)
    errors.monthlyRevenue = "Indiquez un CA mensuel entre 0 et 10 000 000 €.";
  if (share === null || share < 0 || share > 100)
    errors.cardSharePercent = "Indiquez une part entre 0 et 100 %.";
  if (stations === null || !Number.isInteger(stations) || stations < 1 || stations > 50)
    errors.stations = "Indiquez un nombre de postes entier entre 1 et 50.";
  if (ticket === null || ticket <= 0 || ticket > 10_000)
    errors.averageTicket = "Indiquez un ticket moyen supérieur à 0 €.";
  if (!(DURATIONS as readonly number[]).includes(months))
    errors.months = "Choisissez 12, 24 ou 36 mois.";
  if (raw.externalCardRate.trim() !== "" && (extRate === null || extRate < 0 || extRate > 15))
    errors.externalCardRate = "Indiquez un taux entre 0 et 15 %.";
  if (raw.externalCardFixedFee.trim() !== "" && (extFee === null || extFee < 0 || extFee > 5))
    errors.externalCardFixedFee = "Indiquez des frais entre 0 et 5 €.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    inputs: {
      monthlyRevenue: revenue as number,
      cardSharePercent: share as number,
      stations: stations as number,
      months: months as Duration,
      averageTicket: ticket as number,
      externalCardRate: extRate,
      externalCardFixedFee: extFee,
    },
  };
}
