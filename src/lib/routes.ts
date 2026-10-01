import type { EstablishmentType, ToolCategory } from "@/data/tools.schema";

/** Chemins internes partagés (pages qui existent). */
export const CALCULATOR_PATH = "/calculateur-cout-caisse";
export const AUTHOR_PATH = "/auteur";
export const GUIDES_PATH = "/guides";

export function articlePath(slug: string): string {
  return `${GUIDES_PATH}/${slug}`;
}

export const CATEGORY_PATHS: Record<ToolCategory, string> = {
  caisse: "/logiciel-caisse-restaurant",
  paiement: "/terminal-paiement-restaurant",
  reservation: "/reservation-en-ligne-restaurant",
  "commande-en-ligne": "/commande-en-ligne-restaurant",
};

export function reviewPath(slug: string): string {
  return `/avis/${slug}`;
}

/** Pages « caisse par type d'établissement » (le multi-sites n'est pas un type, c'est un critère). */
export const ESTABLISHMENT_PATHS = {
  "food-truck": "/caisse-food-truck",
  brasserie: "/caisse-brasserie",
  boulangerie: "/caisse-boulangerie",
  "multi-sites": "/caisse-multi-sites",
} as const satisfies Partial<Record<EstablishmentType | "multi-sites", string>>;
