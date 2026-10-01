import { allArticles } from "content-collections";

export type Article = (typeof allArticles)[number];

/** Articles, du plus récemment mis à jour au plus ancien. */
export function getArticles(): Article[] {
  return [...allArticles].sort(
    (a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title, "fr"),
  );
}

export function getArticle(slug: string): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}
