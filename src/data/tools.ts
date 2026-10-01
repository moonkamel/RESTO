import { parseTools, type RestaurantTool } from "./tools.schema.ts";

/*
 * SOURCE UNIQUE des données outils. Rempli par le propriétaire du site, jamais par Claude.
 *
 * Toutes les valeurs ci-dessous sont FACTICES (// PLACEHOLDER) et servent à faire tourner
 * le site pendant le développement. Remplacer chaque outil par un outil réel, vérifié à la
 * source (grille tarifaire, contrat, démo), puis passer isPlaceholder à false.
 *
 * Unités : subscriptionMonthlyHT en € HT/mois/poste ; hardwarePriceHT en € HT ;
 * cardCommissionRate en % ; commitmentMonths en mois.
 * Lien d'affiliation : variable d'environnement AFFILIATE_URL_<SLUG> (voir .env.example).
 */
const data: RestaurantTool[] = [
  {
    // PLACEHOLDER — outil fictif
    id: "exemple-caisse-a",
    name: "[Caisse exemple A]",
    publisher: "[Éditeur A]",
    category: "caisse",
    pricingModel: "abonnement",
    subscriptionMonthlyHT: 50, // PLACEHOLDER
    hardwarePriceHT: 1000, // PLACEHOLDER
    cardCommissionRate: null, // PLACEHOLDER
    commitmentMonths: 12, // PLACEHOLDER
    establishmentTypes: ["restaurant", "brasserie", "bar"],
    multiSite: true, // PLACEHOLDER
    worksOffline: true, // PLACEHOLDER
    mealVouchers: true, // PLACEHOLDER
    deliveryIntegrations: ["[Plateforme de livraison]"], // PLACEHOLDER
    strengths: ["[Point fort à renseigner]"],
    watchouts: ["[Point de vigilance à renseigner]"],
    fieldReview: "[AVIS TERRAIN À RÉDIGER — ce que l'outil donne en plein coup de feu.]",
    partnerProgram: "affiliation",
    slug: "exemple-caisse-a",
    verifiedAt: "2026-10-01",
    isPlaceholder: true,
  },
  {
    // PLACEHOLDER — outil fictif
    id: "exemple-tpe-b",
    name: "[TPE exemple B]",
    publisher: "[Éditeur B]",
    category: "paiement",
    pricingModel: "commission",
    subscriptionMonthlyHT: null,
    hardwarePriceHT: 50, // PLACEHOLDER
    cardCommissionRate: 1.5, // PLACEHOLDER
    commitmentMonths: 0, // PLACEHOLDER
    establishmentTypes: ["food-truck", "boulangerie", "restauration-rapide"],
    multiSite: false, // PLACEHOLDER
    worksOffline: false, // PLACEHOLDER
    mealVouchers: true, // PLACEHOLDER
    deliveryIntegrations: [],
    strengths: ["[Point fort à renseigner]"],
    watchouts: ["[Point de vigilance à renseigner]"],
    fieldReview: "[AVIS TERRAIN À RÉDIGER — ce que l'outil donne en plein coup de feu.]",
    partnerProgram: "affiliation",
    slug: "exemple-tpe-b",
    verifiedAt: "2026-10-01",
    isPlaceholder: true,
  },
  {
    // PLACEHOLDER — outil fictif
    id: "exemple-resa-c",
    name: "[Réservation exemple C]",
    publisher: "[Éditeur C]",
    category: "reservation",
    pricingModel: "mixte",
    subscriptionMonthlyHT: 30, // PLACEHOLDER
    hardwarePriceHT: null,
    cardCommissionRate: 2, // PLACEHOLDER
    commitmentMonths: 0, // PLACEHOLDER
    establishmentTypes: ["restaurant", "brasserie"],
    multiSite: true, // PLACEHOLDER
    worksOffline: false, // PLACEHOLDER
    mealVouchers: false, // PLACEHOLDER
    deliveryIntegrations: [],
    strengths: ["[Point fort à renseigner]"],
    watchouts: ["[Point de vigilance à renseigner]"],
    fieldReview: "[AVIS TERRAIN À RÉDIGER — ce que l'outil donne en plein coup de feu.]",
    partnerProgram: "apport-affaires",
    slug: "exemple-resa-c",
    verifiedAt: "2026-10-01",
    isPlaceholder: true,
  },
  {
    // PLACEHOLDER — outil fictif
    id: "exemple-commande-d",
    name: "[Commande en ligne exemple D]",
    publisher: "[Éditeur D]",
    category: "commande-en-ligne",
    pricingModel: "abonnement",
    subscriptionMonthlyHT: 40, // PLACEHOLDER
    hardwarePriceHT: null,
    cardCommissionRate: null, // PLACEHOLDER
    commitmentMonths: 12, // PLACEHOLDER
    establishmentTypes: ["restauration-rapide", "food-truck"],
    multiSite: false, // PLACEHOLDER
    worksOffline: false, // PLACEHOLDER
    mealVouchers: false, // PLACEHOLDER
    deliveryIntegrations: ["[Plateforme de livraison]"], // PLACEHOLDER
    strengths: ["[Point fort à renseigner]"],
    watchouts: ["[Point de vigilance à renseigner]"],
    fieldReview: "[AVIS TERRAIN À RÉDIGER — ce que l'outil donne en plein coup de feu.]",
    partnerProgram: "aucun",
    slug: "exemple-commande-d",
    verifiedAt: "2026-10-01",
    isPlaceholder: true,
  },
];

/** Outils validés. Un outil incomplet lève une erreur au chargement : dev et build échouent. */
export const tools: readonly RestaurantTool[] = parseTools(data);

export function getToolBySlug(slug: string): RestaurantTool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
