import { z } from "zod";

/*
 * Schéma des outils comparés. Ce module (comme tools.ts) est aussi exécuté
 * directement par Node dans scripts/check-content.ts : imports relatifs avec
 * extension .ts uniquement, pas d'alias « @/ ».
 */

export const TOOL_CATEGORIES = ["caisse", "paiement", "reservation", "commande-en-ligne"] as const;
export const PRICING_MODELS = ["abonnement", "commission", "mixte"] as const;
export const PARTNER_PROGRAMS = ["affiliation", "apport-affaires", "aucun"] as const;
export const ESTABLISHMENT_TYPES = [
  "restaurant",
  "brasserie",
  "bar",
  "restauration-rapide",
  "food-truck",
  "boulangerie",
] as const;

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  caisse: "Logiciel de caisse",
  paiement: "Terminal de paiement",
  reservation: "Réservation en ligne",
  "commande-en-ligne": "Commande en ligne",
};

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Format attendu : minuscules, chiffres et tirets");

const text = z.string().trim().min(1, "Champ vide");

const isoDate = z.iso.date("Date attendue au format AAAA-MM-JJ");

/** Montant en euros HT. null = sans objet pour cet outil (voir chaque champ). */
const euros = z.number().nonnegative().finite();

export const toolSchema = z
  .object({
    id: slug,
    name: text,
    publisher: text,
    category: z.enum(TOOL_CATEGORIES),
    pricingModel: z.enum(PRICING_MODELS),
    /** € HT par mois et par poste. null = pas d'abonnement. */
    subscriptionMonthlyHT: euros.nullable(),
    /** € HT, achat du matériel de base. 0 = fourni ; null = aucun matériel nécessaire. */
    hardwarePriceHT: euros.nullable(),
    /** Taux de commission carte en %. null = pas d'encaissement carte intégré. */
    cardCommissionRate: z.number().min(0).max(15).nullable(),
    /** Durée d'engagement en mois. 0 = sans engagement. */
    commitmentMonths: z.int().min(0).max(120),
    establishmentTypes: z
      .array(z.enum(ESTABLISHMENT_TYPES))
      .min(1, "Au moins un type d'établissement")
      .refine((list) => new Set(list).size === list.length, "Types en double"),
    multiSite: z.boolean(),
    worksOffline: z.boolean(),
    mealVouchers: z.boolean(),
    deliveryIntegrations: z.array(text),
    strengths: z.array(text).min(1, "Au moins un point fort"),
    watchouts: z.array(text).min(1, "Au moins un point de vigilance"),
    fieldReview: z.string().trim().min(40, "Avis terrain trop court (40 caractères minimum)"),
    partnerProgram: z.enum(PARTNER_PROGRAMS),
    slug,
    verifiedAt: isoDate,
    isPlaceholder: z.boolean(),
  })
  .strict()
  .superRefine((tool, ctx) => {
    const needsSubscription = tool.pricingModel !== "commission";
    const needsCommission = tool.pricingModel !== "abonnement" || tool.category === "paiement";
    if (needsSubscription && tool.subscriptionMonthlyHT === null) {
      ctx.addIssue({
        code: "custom",
        path: ["subscriptionMonthlyHT"],
        message: `Prix d'abonnement obligatoire pour le modèle « ${tool.pricingModel} »`,
      });
    }
    if (needsCommission && tool.cardCommissionRate === null) {
      ctx.addIssue({
        code: "custom",
        path: ["cardCommissionRate"],
        message: "Taux de commission obligatoire (modèle à la commission ou terminal de paiement)",
      });
    }
    if (tool.verifiedAt > new Date().toISOString().slice(0, 10)) {
      ctx.addIssue({
        code: "custom",
        path: ["verifiedAt"],
        message: "Date de vérification future",
      });
    }
  });

export const toolsSchema = z.array(toolSchema).superRefine((tools, ctx) => {
  for (const key of ["id", "slug"] as const) {
    const seen = new Set<string>();
    tools.forEach((tool, index) => {
      if (seen.has(tool[key])) {
        ctx.addIssue({
          code: "custom",
          path: [index, key],
          message: `${key} en double : ${tool[key]}`,
        });
      }
      seen.add(tool[key]);
    });
  }
});

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];
export type PricingModel = (typeof PRICING_MODELS)[number];
export type PartnerProgram = (typeof PARTNER_PROGRAMS)[number];
export type EstablishmentType = (typeof ESTABLISHMENT_TYPES)[number];
export type RestaurantTool = z.infer<typeof toolSchema>;

/** Valide la liste ; lève une erreur lisible (fait échouer dev et build) si un outil est incomplet. */
export function parseTools(input: unknown): RestaurantTool[] {
  const result = toolsSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `Données outils invalides (src/data/tools.ts) :\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}
