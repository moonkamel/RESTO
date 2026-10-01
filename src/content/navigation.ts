import { CATEGORY_PATHS, ESTABLISHMENT_PATHS } from "@/lib/routes";

/** Libellés courts de navigation (menus, pied de page). */
export const NAV_GROUPS = [
  {
    title: "Comparatifs",
    links: [
      { href: CATEGORY_PATHS.caisse, label: "Logiciels de caisse" },
      { href: CATEGORY_PATHS.paiement, label: "Terminaux de paiement" },
      { href: CATEGORY_PATHS.reservation, label: "Réservation en ligne" },
      { href: CATEGORY_PATHS["commande-en-ligne"], label: "Commande en ligne" },
    ],
  },
  {
    title: "Par établissement",
    links: [
      { href: ESTABLISHMENT_PATHS.brasserie, label: "Brasserie" },
      { href: ESTABLISHMENT_PATHS.boulangerie, label: "Boulangerie" },
      { href: ESTABLISHMENT_PATHS["food-truck"], label: "Food truck" },
      { href: ESTABLISHMENT_PATHS["multi-sites"], label: "Multi-sites" },
    ],
  },
] as const;
