/**
 * Identité du site. Remplacer les valeurs entre crochets avant la mise en ligne.
 */
export const siteConfig = {
  name: "[NOM DU SITE]",
  shortDescription: "Caisse, TPE, réservation, commande en ligne : les outils testés en service.",
  description:
    "Comparatifs et avis d'outils pour restaurateurs, écrits par un cuisinier en poste : logiciels de caisse, terminaux de paiement, réservation et commande en ligne.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_FR",
  author: {
    name: "[NOM DE L'AUTEUR]",
  },
} as const;
