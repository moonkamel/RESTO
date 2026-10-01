/**
 * Parcours de l'auteur : argument de crédibilité n° 1 du site.
 *
 * RÈGLE : uniquement des faits réels et vérifiables. Afficher des chiffres
 * inventés sur un site d'affiliation est une pratique commerciale trompeuse
 * (art. L121-2 du Code de la consommation) et ruine la confiance du lecteur.
 *
 * Tant que `isPlaceholder` vaut true, un avertissement s'affiche en
 * développement et le build de production échoue (garde-fou de la phase 2).
 */

export type AuthorStat = { value: string; label: string };
export type AuthorMilestone = { period: string; title: string; body: string };
export type AuthorVenue = { name: string; type: string; area: string; since: string };

export const author = {
  isPlaceholder: true, // PLACEHOLDER — à remplacer par tes informations réelles
  name: "[PRÉNOM NOM]",
  role: "Restaurateur, [N] établissements à Paris",
  stats: [
    { value: "[N]", label: "établissements à Paris" },
    { value: "[X] M€", label: "de chiffre d'affaires annuel cumulé" },
    { value: "[N] ans", label: "de service, du passe au bureau" },
  ],
  pitch:
    "J'ai commencé au passe. Aujourd'hui je gère [N] adresses à Paris. Chaque caisse, chaque TPE, chaque outil de résa présenté ici, je l'ai vu tourner un samedi soir — ou je le dis.",
  milestones: [
    {
      period: "[ANNÉE]",
      title: "En cuisine",
      body: "[POSTE ET MAISON]. Le coup de feu s'apprend au passe, pas en réunion. C'est là que j'ai vu ce qu'une caisse qui rame coûte en service.",
    },
    {
      period: "[ANNÉE]",
      title: "Premier établissement",
      body: "[NOM OU TYPE D'ÉTABLISSEMENT, QUARTIER]. Premier choix de caisse, de TPE, de contrat. [CE QUE VOUS AURIEZ FAIT AUTREMENT].",
    },
    {
      period: "[ANNÉE]",
      title: "[N] adresses à Paris",
      body: "[TYPES D'ÉTABLISSEMENTS]. Des outils qui doivent tenir sur plusieurs sites, avec des équipes qui tournent et des extras à former en une soirée.",
    },
    {
      period: "Aujourd'hui",
      title: "Ce site",
      body: "Ce que j'aurais voulu lire avant de signer : les vrais coûts sur la durée, des tests en service, et ce qui coince.",
    },
  ],
  quote:
    "[CITATION PERSONNELLE — par exemple la phrase que vous répétez à vos équipes avant le service]",
  /** Présentation longue (page auteur), un paragraphe par entrée. */
  bio: [
    "[PARAGRAPHE 1 — d'où vous venez : formation, premières maisons, ce que la cuisine vous a appris.]",
    "[PARAGRAPHE 2 — le passage à la gestion : premier établissement, ce qui a marché, ce qui a coûté cher.]",
    "[PARAGRAPHE 3 — aujourd'hui : vos adresses, vos équipes, ce que vous attendez d'un outil.]",
  ],
  /** Établissements gérés (affichés sur la page auteur). */
  venues: [
    { name: "[NOM]", type: "[TYPE]", area: "Paris [ARRONDISSEMENT]", since: "[ANNÉE]" },
    { name: "[NOM]", type: "[TYPE]", area: "Paris [ARRONDISSEMENT]", since: "[ANNÉE]" },
    { name: "[NOM]", type: "[TYPE]", area: "Paris [ARRONDISSEMENT]", since: "[ANNÉE]" },
  ],
  /**
   * Comment les tests « en service » sont faits. Doit décrire ce qui est VRAIMENT fait :
   * c'est l'engagement qui justifie la note terrain.
   */
  testingProtocol: [
    "[ÉTAPE 1 — où l'outil est installé (quel établissement) et pendant combien de services.]",
    "[ÉTAPE 2 — comment la prise en main par un extra est testée.]",
    "[ÉTAPE 3 — comment la coupure internet est simulée.]",
    "[ÉTAPE 4 — comment la brigade juge la lisibilité des tickets.]",
  ],
} as const satisfies {
  isPlaceholder: boolean;
  name: string;
  role: string;
  stats: readonly AuthorStat[];
  pitch: string;
  milestones: readonly AuthorMilestone[];
  quote: string;
  bio: readonly string[];
  venues: readonly AuthorVenue[];
  testingProtocol: readonly string[];
};
