import { describe, expect, it } from "vitest";
import {
  formatCommission,
  formatCommitment,
  formatHardware,
  formatPrice,
  formatRate,
  formatSubscription,
} from "./tool-format";

const plain = (s: string) => s.replace(/[  ]/g, " ");
const tool = {
  subscriptionMonthlyHT: 50,
  extraStationMonthlyHT: 30,
  hardwarePriceHT: 1000,
  cardCommissionRate: 1.75,
  cardFixedFeeHT: 0.1,
  commitmentMonths: 12,
};

describe("tool-format", () => {
  it("prix et taux", () => {
    expect(plain(formatPrice(1000))).toBe("1 000 €");
    expect(plain(formatPrice(0.1))).toBe("0,10 €");
    expect(formatRate(1.75)).toBe("1,75 %");
  });
  it("abonnement", () => {
    expect(plain(formatSubscription(tool))).toBe(
      "50 € HT/mois, puis 30 € HT/mois par poste supplémentaire",
    );
    expect(plain(formatSubscription({ ...tool, extraStationMonthlyHT: 50 }))).toBe(
      "50 € HT/mois par poste",
    );
    expect(formatSubscription({ ...tool, subscriptionMonthlyHT: null })).toBe("Aucun");
  });
  it("commission", () => {
    expect(plain(formatCommission(tool))).toBe("1,75 % + 0,10 € par transaction");
    expect(formatCommission({ ...tool, cardFixedFeeHT: 0 })).toBe("1,75 %");
    expect(formatCommission({ ...tool, cardCommissionRate: null })).toBe("Paiement non intégré");
  });
  it("matériel et engagement", () => {
    expect(plain(formatHardware(tool))).toBe("1 000 € HT par poste");
    expect(formatHardware({ ...tool, hardwarePriceHT: 0 })).toBe("Fourni");
    expect(formatHardware({ ...tool, hardwarePriceHT: null })).toBe("Aucun matériel");
    expect(formatCommitment(tool)).toBe("12 mois");
    expect(formatCommitment({ ...tool, commitmentMonths: 0 })).toBe("Sans engagement");
  });
});
