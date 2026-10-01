import type { RestaurantTool, ToolCategory } from "@/data/tools.schema";
import type { RegulatoryTopic } from "@/lib/regulatory";
import { CATEGORY_PATHS, ESTABLISHMENT_PATHS } from "@/lib/routes";

/*
 * Contenu éditorial des pages comparatif (par catégorie) et des pages par type d'établissement.
 * Règle : conseils de terrain uniquement. Aucun prix, aucune fonctionnalité d'un outil précis
 * (ça vit dans src/data/tools.ts), aucune affirmation réglementaire (src/lib/regulatory.ts).
 */

export type ComparisonPageDef = {
  path: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  criteriaTitle: string;
  criteria: readonly { title: string; body: string }[];
  filter: (tool: RestaurantTool) => boolean;
  emptyMessage: string;
  showCalculator: boolean;
  regulatory: readonly RegulatoryTopic[];
};

const inCategory =
  (...categories: ToolCategory[]) =>
  (tool: RestaurantTool) =>
    categories.includes(tool.category);

/** Pages établissement : caisses et terminaux (tout ce qui sert à encaisser). */
const encaissement = inCategory("caisse", "paiement");

export const CATEGORY_PAGES = {
  caisse: {
    path: CATEGORY_PATHS.caisse,
    eyebrow: "Comparatif · Logiciels de caisse",
    title: "Logiciel de caisse restaurant : ceux qui tiennent le service",
    metaTitle: "Comparatif logiciel de caisse restaurant",
    metaDescription:
      "Les logiciels de caisse pour restaurant testés en plein service : rapidité, prise en main par un extra, coupure internet, tickets cuisine. Prix vérifiés.",
    intro:
      "La caisse, c'est le cœur du service. Si elle rame à 20 h 30, toute la salle rame avec. On les a classées sur ce qui compte quand ça envoie, pas sur la plaquette.",
    criteriaTitle: "Ce qui compte vraiment",
    criteria: [
      {
        title: "Envoyer vite",
        body: "Le nombre de touches pour envoyer une table complète. En coup de feu, chaque écran en trop se paie en minutes.",
      },
      {
        title: "Tenir sans internet",
        body: "La box finit toujours par lâcher un samedi. Une caisse qui continue d'encaisser et d'envoyer en cuisine, c'est non négociable.",
      },
      {
        title: "Former un extra en une soirée",
        body: "Si votre extra ne sait pas encaisser seul après une heure, la caisse est trop compliquée pour votre rotation.",
      },
      {
        title: "Le vrai coût sur 3 ans",
        body: "Abonnement, postes en plus, matériel, frais carte : comparez le total sur la durée de l'engagement, pas le prix d'appel.",
      },
    ],
    filter: inCategory("caisse"),
    emptyMessage: "Aucune caisse dans le comparatif pour l'instant.",
    showCalculator: true,
    regulatory: ["certification-caisse", "facturation-electronique"],
  },
  paiement: {
    path: CATEGORY_PATHS.paiement,
    eyebrow: "Comparatif · Terminaux de paiement",
    title: "Terminal de paiement restaurant : le vrai prix de chaque carte",
    metaTitle: "Comparatif terminal de paiement (TPE) restaurant",
    metaDescription:
      "Les terminaux de paiement pour restaurant comparés sur la commission réelle, les titres-restaurant et le fonctionnement en service. Tarifs vérifiés.",
    intro:
      "Un TPE, ça se juge au relevé de fin de mois et à la table de huit qui veut payer en quatre fois. On compare le coût réel et ce que ça donne quand la salle est pleine.",
    criteriaTitle: "Ce qui compte vraiment",
    criteria: [
      {
        title: "La commission réelle",
        body: "Le taux affiché plus les frais par transaction. Sur des petits tickets, les frais fixes pèsent plus lourd que le pourcentage.",
      },
      {
        title: "Les titres-restaurant",
        body: "Le midi, une bonne part de l'addition peut arriver en titres. Vérifiez lesquels le terminal accepte, et à quel coût.",
      },
      {
        title: "Le réseau en salle",
        body: "Terrasse, sous-sol, fond de salle : testez la connexion là où vous encaissez vraiment, pas à côté de la box.",
      },
      {
        title: "Le lien avec la caisse",
        body: "Un montant ressaisi à la main, c'est une erreur de caisse qui finit par arriver. L'idéal : le montant part de la caisse.",
      },
    ],
    filter: inCategory("paiement"),
    emptyMessage: "Aucun terminal dans le comparatif pour l'instant.",
    showCalculator: true,
    regulatory: ["titres-restaurant"],
  },
  reservation: {
    path: CATEGORY_PATHS.reservation,
    eyebrow: "Comparatif · Réservation en ligne",
    title: "Réservation en ligne : remplir la salle sans se faire poser de lapin",
    metaTitle: "Comparatif logiciel de réservation en ligne restaurant",
    metaDescription:
      "Les outils de réservation en ligne pour restaurant comparés : no-show, commission par couvert ou abonnement, plan de salle. Testés en service.",
    intro:
      "Un bon outil de réservation remplit la salle et protège des tables vides. Un mauvais vous coûte une commission sur des clients qui seraient venus de toute façon.",
    criteriaTitle: "Ce qui compte vraiment",
    criteria: [
      {
        title: "Les no-shows",
        body: "Empreinte bancaire, rappel la veille, liste d'attente : ce qui transforme une table vide en table occupée.",
      },
      {
        title: "Commission ou abonnement",
        body: "Payer au couvert peut coûter cher sur les clients fidèles. Faites le compte sur un mois plein.",
      },
      {
        title: "Le plan de salle au passe",
        body: "Le chef de rang doit voir d'un coup d'œil qui arrive, à quelle table, et combien de temps elle reste.",
      },
    ],
    filter: inCategory("reservation"),
    emptyMessage: "Aucun outil de réservation dans le comparatif pour l'instant.",
    showCalculator: false,
    regulatory: [],
  },
  "commande-en-ligne": {
    path: CATEGORY_PATHS["commande-en-ligne"],
    eyebrow: "Comparatif · Commande en ligne",
    title: "Commande en ligne : vendre à emporter sans saturer la cuisine",
    metaTitle: "Comparatif commande en ligne et click & collect restaurant",
    metaDescription:
      "Les solutions de commande en ligne et de click & collect pour restaurant comparées : commission, intégration caisse, tickets en cuisine.",
    intro:
      "La commande en ligne, c'est du chiffre en plus, à condition qu'elle arrive en cuisine au bon moment et sans ressaisie. Sinon, c'est un deuxième service en plein premier.",
    criteriaTitle: "Ce qui compte vraiment",
    criteria: [
      {
        title: "Zéro ressaisie",
        body: "La commande doit tomber dans la caisse et en cuisine toute seule. Une tablette de plus sur le passe, c'est une erreur de plus.",
      },
      {
        title: "Maîtriser le rythme",
        body: "Pouvoir couper les commandes ou allonger les délais quand la salle est pleine, en un geste.",
      },
      {
        title: "Ce que ça vous laisse",
        body: "Commission par commande ou abonnement : calculez votre marge sur une commande type, emballage compris.",
      },
    ],
    filter: inCategory("commande-en-ligne"),
    emptyMessage: "Aucune solution de commande en ligne dans le comparatif pour l'instant.",
    showCalculator: false,
    regulatory: [],
  },
} as const satisfies Record<ToolCategory, ComparisonPageDef>;

export const ESTABLISHMENT_PAGES = {
  "food-truck": {
    path: ESTABLISHMENT_PATHS["food-truck"],
    eyebrow: "Caisse · Food truck",
    title: "Caisse pour food truck : encaisser vite, partout, même sans réseau",
    metaTitle: "Quelle caisse pour un food truck ?",
    metaDescription:
      "Caisses et terminaux adaptés au food truck : fonctionnement hors ligne, autonomie, rapidité en file d'attente, sans engagement. Testés sur le terrain.",
    intro:
      "Dans un camion, la file d'attente ne pardonne pas et le réseau change à chaque emplacement. Il faut une caisse qui encaisse en trois gestes et qui se moque de la 4G.",
    criteriaTitle: "Ce qui compte dans un camion",
    criteria: [
      {
        title: "Hors ligne d'abord",
        body: "Marché, festival, parking : le réseau n'est jamais garanti. La caisse doit encaisser et synchroniser plus tard.",
      },
      {
        title: "La file d'attente",
        body: "Un écran simple, les produits en gros, le paiement sans contact en un geste. Chaque seconde compte quand dix personnes attendent.",
      },
      {
        title: "Sans engagement",
        body: "L'activité est saisonnière. Méfiez-vous des contrats longs qui facturent l'hiver comme l'été.",
      },
    ],
    filter: (t: RestaurantTool) => encaissement(t) && t.establishmentTypes.includes("food-truck"),
    emptyMessage: "Aucune caisse testée pour le food truck pour l'instant.",
    showCalculator: true,
    regulatory: ["certification-caisse"],
  },
  brasserie: {
    path: ESTABLISHMENT_PATHS.brasserie,
    eyebrow: "Caisse · Brasserie",
    title: "Caisse pour brasserie : tenir 200 couverts sans perdre une table",
    metaTitle: "Quelle caisse pour une brasserie ?",
    metaDescription:
      "Caisses adaptées à la brasserie : envoi par table, plan de salle, postes bar et salle, tickets cuisine et bar séparés. Testées en coup de feu.",
    intro:
      "En brasserie, la caisse doit suivre la salle, le bar, la terrasse et la cuisine en même temps. Le moindre ralentissement se voit au passe.",
    criteriaTitle: "Ce qui compte en brasserie",
    criteria: [
      {
        title: "Plan de salle et transferts",
        body: "Changer une table, scinder une addition, regrouper deux tables : en deux touches, pas en cinq écrans.",
      },
      {
        title: "Plusieurs postes",
        body: "Bar, salle, terrasse : chaque poste en plus a un coût. Comptez-le dès le départ.",
      },
      {
        title: "Bons séparés cuisine et bar",
        body: "Les boissons au bar, les plats en cuisine, dans le bon ordre d'envoi. Sinon le service se désynchronise.",
      },
    ],
    filter: (t: RestaurantTool) => encaissement(t) && t.establishmentTypes.includes("brasserie"),
    emptyMessage: "Aucune caisse testée pour la brasserie pour l'instant.",
    showCalculator: true,
    regulatory: ["certification-caisse"],
  },
  boulangerie: {
    path: ESTABLISHMENT_PATHS.boulangerie,
    eyebrow: "Caisse · Boulangerie",
    title: "Caisse pour boulangerie : des petits tickets, beaucoup de passages",
    metaTitle: "Quelle caisse pour une boulangerie ?",
    metaDescription:
      "Caisses et terminaux adaptés à la boulangerie : vitesse en caisse, frais carte sur petits tickets, titres-restaurant le midi. Comparés et testés.",
    intro:
      "Une baguette, un café, une formule midi : en boulangerie, le ticket est petit et la file est longue. La vitesse et les frais par transaction font toute la différence.",
    criteriaTitle: "Ce qui compte en boulangerie",
    criteria: [
      {
        title: "Les frais sur petits tickets",
        body: "Avec un ticket moyen bas, les frais fixes par transaction coûtent plus cher que le pourcentage. Faites le calcul.",
      },
      {
        title: "La vitesse au comptoir",
        body: "Produits en accès direct, rendu monnaie clair, paiement sans contact rapide : le rush du matin ne laisse pas de marge.",
      },
      {
        title: "Le midi",
        body: "Formules, titres-restaurant, sandwichs : vérifiez que la caisse gère tout ça sans manipulation.",
      },
    ],
    filter: (t: RestaurantTool) => encaissement(t) && t.establishmentTypes.includes("boulangerie"),
    emptyMessage: "Aucune caisse testée pour la boulangerie pour l'instant.",
    showCalculator: true,
    regulatory: ["certification-caisse", "titres-restaurant"],
  },
  "multi-sites": {
    path: ESTABLISHMENT_PATHS["multi-sites"],
    eyebrow: "Caisse · Multi-sites",
    title: "Caisse multi-sites : piloter plusieurs adresses depuis un seul écran",
    metaTitle: "Quelle caisse pour un groupe multi-sites ?",
    metaDescription:
      "Caisses multi-sites pour petits groupes de restaurants : chiffres consolidés, carte centralisée, droits par équipe, coût par établissement.",
    intro:
      "Dès la deuxième adresse, la question change : il ne s'agit plus d'encaisser, mais de comparer, d'harmoniser et de garder la main sans être partout.",
    criteriaTitle: "Ce qui compte à plusieurs adresses",
    criteria: [
      {
        title: "Les chiffres consolidés",
        body: "CA, couverts, ticket moyen par site et au total, sans exporter dix tableurs le lundi matin.",
      },
      {
        title: "Une carte, plusieurs prix",
        body: "Changer un plat ou un prix partout d'un coup, tout en gardant des exceptions par site.",
      },
      {
        title: "Les droits par équipe",
        body: "Le directeur de site voit son établissement, pas celui d'à côté. Les remises et annulations sont tracées.",
      },
    ],
    filter: (t: RestaurantTool) => t.category === "caisse" && t.multiSite,
    emptyMessage: "Aucune caisse multi-sites testée pour l'instant.",
    showCalculator: true,
    regulatory: ["certification-caisse", "facturation-electronique"],
  },
} as const satisfies Record<keyof typeof ESTABLISHMENT_PATHS, ComparisonPageDef>;

export const ALL_COMPARISON_PAGES: readonly ComparisonPageDef[] = [
  ...Object.values(CATEGORY_PAGES),
  ...Object.values(ESTABLISHMENT_PAGES),
];
