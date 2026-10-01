import { describe, expect, it } from "vitest";
import { tools as realTools } from "@/data/tools";
import type { RestaurantTool } from "@/data/tools.schema";
import {
  checkContent,
  collectPlaceholders,
  isStrictBuild,
  missingAffiliateUrls,
} from "./content-guard";

const baseTool = realTools[0] as RestaurantTool;
const tool = (over: Partial<RestaurantTool>): RestaurantTool => ({ ...baseTool, ...over });

const clean = {
  tools: [tool({ slug: "caisse-a", isPlaceholder: false, partnerProgram: "affiliation" })],
  author: { isPlaceholder: false, name: "Auteur" },
  regulatory: [{ id: "titres-restaurant", title: "Titres-restaurant", isPlaceholder: false }],
};
const okEnv = { AFFILIATE_URL_CAISSE_A: "https://partenaire.example" };

describe("isStrictBuild", () => {
  it("bloque en production Vercel ou sur demande explicite", () => {
    expect(isStrictBuild({ VERCEL_ENV: "production" })).toBe(true);
    expect(isStrictBuild({ BLOCK_PLACEHOLDERS: "true" })).toBe(true);
  });
  it("laisse passer previews, builds locaux et CI", () => {
    expect(isStrictBuild({ VERCEL_ENV: "preview" })).toBe(false);
    expect(isStrictBuild({ NODE_ENV: "production" })).toBe(false);
    expect(isStrictBuild({})).toBe(false);
  });
});

describe("collectPlaceholders", () => {
  it("liste outils, auteur et réglementaire factices", () => {
    const items = collectPlaceholders({
      tools: [tool({ isPlaceholder: true, name: "Outil X", slug: "x" })],
      author: { isPlaceholder: true, name: "[NOM]" },
      regulatory: [{ id: "a", title: "Règle A", isPlaceholder: true }],
    });
    expect(items.map((i) => i.kind)).toEqual(["outil", "auteur", "réglementaire"]);
  });
  it("ne signale rien quand tout est réel", () => {
    expect(collectPlaceholders(clean)).toEqual([]);
  });
});

describe("missingAffiliateUrls", () => {
  it("ne concerne que les outils en affiliation", () => {
    const list = [
      tool({ slug: "caisse-a", partnerProgram: "affiliation" }),
      tool({ slug: "resa-c", partnerProgram: "apport-affaires" }),
    ];
    expect(missingAffiliateUrls(list, {})).toEqual(["AFFILIATE_URL_CAISSE_A"]);
    expect(missingAffiliateUrls(list, okEnv)).toEqual([]);
  });
});

describe("checkContent", () => {
  const dirty = { ...clean, author: { isPlaceholder: true, name: "[NOM]" } };

  it("bloque le build de production s'il reste du contenu factice", () => {
    const result = checkContent(dirty, { ...okEnv, VERCEL_ENV: "production" });
    expect(result.errors).toHaveLength(1);
    expect(result.warnings).toEqual([]);
  });

  it("bloque le build de production si un lien d'affiliation manque", () => {
    expect(checkContent(clean, { VERCEL_ENV: "production" }).errors).toEqual([
      expect.stringContaining("AFFILIATE_URL_CAISSE_A"),
    ]);
  });

  it("se contente d'avertir hors production", () => {
    const result = checkContent(dirty, { VERCEL_ENV: "preview" });
    expect(result.errors).toEqual([]);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("passe en production quand tout est réel et configuré", () => {
    expect(checkContent(clean, { ...okEnv, VERCEL_ENV: "production" })).toEqual({
      strict: true,
      errors: [],
      warnings: [],
    });
  });
});
