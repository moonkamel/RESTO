import type { RestaurantTool } from "../data/tools.schema.ts";
import { affiliateEnvKey, getAffiliateUrl, type Env } from "./affiliate.ts";

/*
 * Garde-fou de contenu, exécuté avant chaque build (scripts/check-content.ts)
 * et utilisé par le bandeau d'avertissement en développement.
 */

export type PlaceholderItem = {
  kind: "outil" | "auteur" | "réglementaire" | "article";
  label: string;
};

export type ContentSources = {
  tools: readonly RestaurantTool[];
  author: { isPlaceholder: boolean; name: string };
  regulatory: readonly { id: string; title: string; isPlaceholder: boolean }[];
  articles?: readonly { title: string; slug: string; isPlaceholder: boolean }[];
};

/**
 * Build bloquant : la vraie production Vercel, ou BLOCK_PLACEHOLDERS=true
 * (pour tester le blocage en local ou sur un autre hébergeur).
 * Les previews Vercel et les builds locaux/CI passent avec avertissement.
 */
export function isStrictBuild(env: Env): boolean {
  return env.VERCEL_ENV === "production" || env.BLOCK_PLACEHOLDERS === "true";
}

export function collectPlaceholders(sources: ContentSources): PlaceholderItem[] {
  return [
    ...sources.tools
      .filter((t) => t.isPlaceholder)
      .map((t) => ({ kind: "outil" as const, label: `${t.name} (${t.slug})` })),
    ...(sources.author.isPlaceholder
      ? [{ kind: "auteur" as const, label: "Parcours de l'auteur (src/config/author.ts)" }]
      : []),
    ...sources.regulatory
      .filter((c) => c.isPlaceholder)
      .map((c) => ({ kind: "réglementaire" as const, label: c.title })),
    ...(sources.articles ?? [])
      .filter((a) => a.isPlaceholder)
      .map((a) => ({ kind: "article" as const, label: `${a.title} (${a.slug})` })),
  ];
}

/** Outils en affiliation sans URL valide dans l'environnement : nom de la variable manquante. */
export function missingAffiliateUrls(tools: readonly RestaurantTool[], env: Env): string[] {
  return tools
    .filter((t) => t.partnerProgram === "affiliation" && !getAffiliateUrl(t.slug, env))
    .map((t) => affiliateEnvKey(t.slug));
}

export function checkContent(
  sources: ContentSources,
  env: Env,
): { strict: boolean; errors: string[]; warnings: string[] } {
  const strict = isStrictBuild(env);
  const problems = [
    ...collectPlaceholders(sources).map((p) => `Contenu factice (${p.kind}) : ${p.label}`),
    ...missingAffiliateUrls(sources.tools, env).map(
      (key) => `Lien d'affiliation manquant ou invalide (https requis) : ${key}`,
    ),
  ];
  return strict
    ? { strict, errors: problems, warnings: [] }
    : { strict, errors: [], warnings: problems };
}
