/** URL publique : NEXT_PUBLIC_SITE_URL, sinon le domaine de production Vercel, sinon localhost. */
function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return vercel ? `https://${vercel}` : "http://localhost:3000";
}

/**
 * Identité du site. Remplacer les valeurs entre crochets avant la mise en ligne.
 */
export const siteConfig = {
  name: "[NOM DU SITE]",
  shortDescription: "Caisse, TPE, réservation, commande en ligne : les outils testés en service.",
  description:
    "Comparatifs et avis d'outils pour restaurateurs, écrits par un cuisinier en poste : logiciels de caisse, terminaux de paiement, réservation et commande en ligne.",
  url: siteUrl(),
  locale: "fr_FR",
  author: {
    name: "[NOM DE L'AUTEUR]",
  },
} as const;
