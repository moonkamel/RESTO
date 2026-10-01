import { describe, expect, it } from "vitest";
import { tools } from "@/data/tools";
import type { RestaurantTool } from "@/data/tools.schema";
import { buildSitemap } from "./sitemap";

const base = tools[0] as RestaurantTool;
const a = { ...base, slug: "a", category: "caisse" as const, verifiedAt: "2026-03-01" };
const b = { ...base, slug: "b", category: "paiement" as const, verifiedAt: "2026-05-01" };

const sitemap = buildSitemap({
  siteUrl: "https://site.fr",
  tools: [a, b],
  comparisonPages: [
    { path: "/caisses", filter: (t) => t.category === "caisse" },
    { path: "/vide", filter: () => false },
  ],
  articles: [{ slug: "guide", updatedAt: "2026-04-01" }],
});
const byUrl = Object.fromEntries(sitemap.map((e) => [e.url, e.lastModified]));

describe("sitemap", () => {
  it("liste accueil, calculateur, comparatifs, avis, guides et auteur, en URL absolues", () => {
    expect(Object.keys(byUrl)).toEqual([
      "https://site.fr/",
      "https://site.fr/calculateur-cout-caisse",
      "https://site.fr/caisses",
      "https://site.fr/vide",
      "https://site.fr/avis/a",
      "https://site.fr/avis/b",
      "https://site.fr/guides",
      "https://site.fr/guides/guide",
      "https://site.fr/auteur",
    ]);
  });

  it("date chaque page par sa vraie dernière vérification ou mise à jour", () => {
    expect(byUrl["https://site.fr/"]).toBe("2026-05-01");
    expect(byUrl["https://site.fr/caisses"]).toBe("2026-03-01");
    expect(byUrl["https://site.fr/avis/b"]).toBe("2026-05-01");
    expect(byUrl["https://site.fr/guides/guide"]).toBe("2026-04-01");
  });

  it("ne date pas une page sans contenu daté (jamais la date du build)", () => {
    expect(byUrl["https://site.fr/vide"]).toBeUndefined();
    expect(byUrl["https://site.fr/auteur"]).toBeUndefined();
  });

  it("n'expose ni /go/ ni /admin/", () => {
    expect(sitemap.some((e) => /\/(go|admin)\//.test(e.url))).toBe(false);
  });
});
