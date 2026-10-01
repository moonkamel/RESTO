import type { RestaurantTool } from "@/data/tools.schema";

const exact = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const percent = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

/** 50 → « 50 € » ; 0.1 → « 0,10 € » (centimes affichés dès qu'il y en a). */
export function formatPrice(value: number): string {
  return Number.isInteger(value)
    ? exact.format(value)
    : new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }).format(value);
}

/** 1.5 → « 1,5 % » */
export function formatRate(value: number): string {
  return `${percent.format(value)} %`;
}

type PricedTool = Pick<
  RestaurantTool,
  | "subscriptionMonthlyHT"
  | "extraStationMonthlyHT"
  | "hardwarePriceHT"
  | "cardCommissionRate"
  | "cardFixedFeeHT"
  | "commitmentMonths"
>;

export function formatSubscription(tool: PricedTool): string {
  if (tool.subscriptionMonthlyHT === null) return "Aucun";
  const base = `${formatPrice(tool.subscriptionMonthlyHT)} HT/mois`;
  const extra = tool.extraStationMonthlyHT;
  if (extra === null || extra === tool.subscriptionMonthlyHT) return `${base} par poste`;
  return `${base}, puis ${formatPrice(extra)} HT/mois par poste supplémentaire`;
}

export function formatCommission(tool: PricedTool): string {
  if (tool.cardCommissionRate === null) return "Paiement non intégré";
  const fee = tool.cardFixedFeeHT ?? 0;
  return fee > 0
    ? `${formatRate(tool.cardCommissionRate)} + ${formatPrice(fee)} par transaction`
    : formatRate(tool.cardCommissionRate);
}

export function formatHardware(tool: PricedTool): string {
  if (tool.hardwarePriceHT === null) return "Aucun matériel";
  if (tool.hardwarePriceHT === 0) return "Fourni";
  return `${formatPrice(tool.hardwarePriceHT)} HT par poste`;
}

export function formatCommitment(tool: PricedTool): string {
  return tool.commitmentMonths === 0 ? "Sans engagement" : `${tool.commitmentMonths} mois`;
}
