import type { RestaurantTool } from "../data/tools.schema.ts";

/*
 * Liens partenaires. Les URL d'affiliation ne sont jamais dans le code :
 * une variable d'environnement par outil, AFFILIATE_URL_<SLUG>.
 * Imports relatifs uniquement (module exécuté par scripts/check-content.ts).
 */

export type Env = Readonly<Record<string, string | undefined>>;

export const SPONSORED_REL = "sponsored noopener";
export const LEAD_FORM_PATH = "/mise-en-relation";

/** « exemple-caisse-a » → « AFFILIATE_URL_EXEMPLE_CAISSE_A » */
export function affiliateEnvKey(slug: string): string {
  return `AFFILIATE_URL_${slug.toUpperCase().replace(/-/g, "_")}`;
}

/** URL d'affiliation de l'outil, ou null si absente ou invalide (https obligatoire). */
export function getAffiliateUrl(slug: string, env: Env): string | null {
  const raw = env[affiliateEnvKey(slug)]?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Chemin interne de la page d'origine, ou null s'il n'est pas sûr.
 * Refuse les URL absolues et protocol-relative (« //site », « /\site »). Garde le chemin seul.
 */
export function sanitizeFromPath(value: string | null | undefined): string | null {
  if (!value || value.length > 200) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  try {
    const url = new URL(value, "https://interne.invalid");
    if (url.origin !== "https://interne.invalid") return null;
    return url.pathname;
  } catch {
    return null;
  }
}

export type ToolCta =
  | { kind: "affiliate"; href: string; label: string; mention: string; rel: typeof SPONSORED_REL }
  | { kind: "lead"; href: string; label: string; mention: string }
  | null;

/**
 * Bouton d'action d'un outil selon son programme partenaire :
 * affiliation → /go/ (lien partenaire) ; apport d'affaires → formulaire ; aucun → pas de bouton.
 */
export function resolveToolCta(
  tool: Pick<RestaurantTool, "slug" | "partnerProgram">,
  fromPath: string,
): ToolCta {
  const from = sanitizeFromPath(fromPath);
  switch (tool.partnerProgram) {
    case "affiliation": {
      const query = from ? `?from=${encodeURIComponent(from)}` : "";
      return {
        kind: "affiliate",
        href: `/go/${tool.slug}${query}`,
        label: "Voir l'offre",
        mention: "Lien partenaire",
        rel: SPONSORED_REL,
      };
    }
    case "apport-affaires":
      return {
        kind: "lead",
        href: `${LEAD_FORM_PATH}?outil=${encodeURIComponent(tool.slug)}`,
        label: "Être rappelé par l'éditeur",
        mention: "Mise en relation rémunérée",
      };
    case "aucun":
      return null;
  }
}
