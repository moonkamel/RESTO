import { FIELD_CRITERIA, type RestaurantTool } from "@/data/tools.schema";

/*
 * Classement éditorial (pages comparatif et établissement).
 * Règle publique, affichée dans « Comment on classe » :
 *   1. note terrain = moyenne des critères « Testé en service » applicables (1 à 5) ;
 *   2. les outils non testés en service passent après les outils testés ;
 *   3. à égalité : le plus récemment vérifié, puis ordre alphabétique.
 * Le programme partenaire (affiliation, apport d'affaires, aucun) n'intervient jamais.
 */

type RankableTool = Pick<RestaurantTool, "name" | "verifiedAt" | "fieldTest">;

/** Note terrain sur 5, arrondie au dixième, ou null si l'outil n'a aucun critère noté. */
export function fieldScore(tool: Pick<RestaurantTool, "fieldTest">): number | null {
  if (!tool.fieldTest) return null;
  const scores = FIELD_CRITERIA.map((c) => tool.fieldTest?.[c].score).filter(
    (s): s is number => typeof s === "number",
  );
  if (scores.length === 0) return null;
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(mean * 10) / 10;
}

export function rankTools<T extends RankableTool>(tools: readonly T[]): T[] {
  return [...tools].sort((a, b) => {
    const sa = fieldScore(a);
    const sb = fieldScore(b);
    if (sa !== sb) {
      if (sa === null) return 1;
      if (sb === null) return -1;
      return sb - sa;
    }
    if (a.verifiedAt !== b.verifiedAt) return a.verifiedAt < b.verifiedAt ? 1 : -1;
    return a.name.localeCompare(b.name, "fr");
  });
}
