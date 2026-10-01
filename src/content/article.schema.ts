import { z } from "zod";
import { ESTABLISHMENT_TYPES, TOOL_CATEGORIES } from "../data/tools.schema.ts";

/*
 * Schéma du frontmatter des articles (content/articles/*.mdx).
 * Lu par content-collections.ts et par scripts/check-content.ts : imports relatifs uniquement.
 */

export const ARTICLE_CATEGORIES = [...TOOL_CATEGORIES, "general"] as const;
export const ARTICLE_ESTABLISHMENTS = [...ESTABLISHMENT_TYPES, "multi-sites", "tous"] as const;
/** Auteurs connus. « principal » = src/config/author.ts. */
export const ARTICLE_AUTHORS = ["principal"] as const;

const isoDate = z.iso.date("Date attendue au format AAAA-MM-JJ");

export const articleSchema = z
  .object({
    title: z.string().trim().min(10).max(90, "Titre trop long pour Google (90 caractères max)"),
    description: z
      .string()
      .trim()
      .min(70, "Description trop courte (70 caractères min)")
      .max(170, "Description trop longue (170 caractères max)"),
    publishedAt: isoDate,
    updatedAt: isoDate,
    category: z.enum(ARTICLE_CATEGORIES),
    establishmentType: z.enum(ARTICLE_ESTABLISHMENTS),
    author: z.enum(ARTICLE_AUTHORS),
    sources: z.array(
      z
        .object({
          label: z.string().trim().min(1),
          /** https obligatoire ; vide autorisé seulement dans un article placeholder. */
          url: z.union([z.url({ protocol: /^https$/ }), z.literal("")]),
        })
        .strict(),
    ),
    /** Questions fréquentes : affichées en fin d'article et balisées en FAQPage. */
    faq: z
      .array(z.object({ question: z.string().trim().min(1), answer: z.string().trim().min(1) }))
      .default([]),
    isPlaceholder: z.boolean(),
    content: z.string(),
  })
  .superRefine((a, ctx) => {
    if (a.updatedAt < a.publishedAt) {
      ctx.addIssue({
        code: "custom",
        path: ["updatedAt"],
        message: "Mise à jour avant publication",
      });
    }
    if (a.updatedAt > new Date().toISOString().slice(0, 10)) {
      ctx.addIssue({ code: "custom", path: ["updatedAt"], message: "Date future" });
    }
    if (!a.isPlaceholder) {
      if (a.sources.length === 0) {
        ctx.addIssue({ code: "custom", path: ["sources"], message: "Au moins une source" });
      }
      a.sources.forEach((s, i) => {
        if (s.url === "") {
          ctx.addIssue({ code: "custom", path: ["sources", i, "url"], message: "URL obligatoire" });
        }
      });
    }
  });

export type ArticleFrontmatter = z.infer<typeof articleSchema>;
