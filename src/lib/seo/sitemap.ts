import type { MetadataRoute } from "next";
import type { ComparisonPageDef } from "@/content/comparison-pages";
import type { RestaurantTool } from "@/data/tools.schema";
import { articlePath, AUTHOR_PATH, CALCULATOR_PATH, GUIDES_PATH, reviewPath } from "@/lib/routes";
import { absoluteUrl } from "./jsonld";

type Input = {
  siteUrl: string;
  tools: readonly RestaurantTool[];
  comparisonPages: readonly Pick<ComparisonPageDef, "path" | "filter">[];
  articles: readonly { slug: string; updatedAt: string }[];
};

const latest = (dates: string[]) => dates.sort().at(-1);

/**
 * Plan du site. lastModified = vraie date de dernière vérification ou mise à jour
 * (jamais la date du build). /go/ et /admin/ n'y figurent pas.
 */
export function buildSitemap(input: Input): MetadataRoute.Sitemap {
  const url = (path: string) => absoluteUrl(input.siteUrl, path);
  const allToolDates = input.tools.map((t) => t.verifiedAt);
  const articleDates = input.articles.map((a) => a.updatedAt);
  const siteLatest = latest([...allToolDates, ...articleDates]);

  return [
    { url: url("/"), lastModified: siteLatest },
    { url: url(CALCULATOR_PATH), lastModified: latest([...allToolDates]) },
    ...input.comparisonPages.map((page) => ({
      url: url(page.path),
      lastModified: latest(input.tools.filter(page.filter).map((t) => t.verifiedAt)),
    })),
    ...input.tools.map((t) => ({ url: url(reviewPath(t.slug)), lastModified: t.verifiedAt })),
    { url: url(GUIDES_PATH), lastModified: latest([...articleDates]) },
    ...input.articles.map((a) => ({ url: url(articlePath(a.slug)), lastModified: a.updatedAt })),
    { url: url(AUTHOR_PATH) },
  ].map((entry) => (entry.lastModified ? entry : { url: entry.url }));
}
