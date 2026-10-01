import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { tools } from "@/data/tools";
import { ALL_COMPARISON_PAGES, CATEGORY_PAGES } from "./comparison-pages";

describe("pages comparatif", () => {
  it("chaque page a sa route et une URL unique", () => {
    const paths = ALL_COMPARISON_PAGES.map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const path of paths) {
      expect(existsSync(new URL(`../app${path}/page.tsx`, import.meta.url)), path).toBe(true);
    }
  });

  it("les pages catégorie ne listent que leur catégorie", () => {
    for (const [category, page] of Object.entries(CATEGORY_PAGES)) {
      for (const tool of tools.filter(page.filter)) expect(tool.category).toBe(category);
    }
  });

  // Règle 2 : aucun prix ni taux dans le texte éditorial (ils vivent dans src/data/tools.ts).
  it("le texte éditorial ne contient ni prix ni taux", () => {
    for (const page of ALL_COMPARISON_PAGES) {
      const text = [
        page.title,
        page.intro,
        page.metaDescription,
        ...page.criteria.flatMap((c) => [c.title, c.body]),
      ].join(" ");
      expect(text, page.path).not.toMatch(/\d[\d\s,.]*\s?(€|%|euros?)/i);
    }
  });
});
