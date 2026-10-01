import { describe, expect, it } from "vitest";
import {
  affiliateEnvKey,
  getAffiliateUrl,
  resolveToolCta,
  sanitizeFromPath,
  SPONSORED_REL,
} from "./affiliate";

describe("affiliateEnvKey", () => {
  it("dérive le nom de variable du slug", () => {
    expect(affiliateEnvKey("exemple-caisse-a")).toBe("AFFILIATE_URL_EXEMPLE_CAISSE_A");
  });
});

describe("getAffiliateUrl", () => {
  const key = "AFFILIATE_URL_OUTIL";
  it("renvoie l'URL https configurée", () => {
    expect(getAffiliateUrl("outil", { [key]: " https://partenaire.example/?ref=1 " })).toBe(
      "https://partenaire.example/?ref=1",
    );
  });
  it("refuse une variable absente, vide, invalide ou non https", () => {
    expect(getAffiliateUrl("outil", {})).toBeNull();
    expect(getAffiliateUrl("outil", { [key]: "" })).toBeNull();
    expect(getAffiliateUrl("outil", { [key]: "pas une url" })).toBeNull();
    expect(getAffiliateUrl("outil", { [key]: "http://partenaire.example" })).toBeNull();
    expect(getAffiliateUrl("outil", { [key]: "javascript:alert(1)" })).toBeNull();
  });
});

describe("sanitizeFromPath", () => {
  it("garde le chemin interne, sans requête ni ancre", () => {
    expect(sanitizeFromPath("/logiciel-caisse-restaurant")).toBe("/logiciel-caisse-restaurant");
    expect(sanitizeFromPath("/avis/outil?x=1#top")).toBe("/avis/outil");
  });
  it("refuse tout ce qui pourrait sortir du site", () => {
    for (const value of [
      null,
      "",
      "avis",
      "//evil.example",
      "/\\evil.example",
      "https://evil.example",
    ]) {
      expect(sanitizeFromPath(value)).toBeNull();
    }
    expect(sanitizeFromPath(`/${"a".repeat(300)}`)).toBeNull();
  });
});

describe("resolveToolCta", () => {
  it("affiliation : lien /go/ sponsorisé avec la page d'origine", () => {
    expect(
      resolveToolCta({ slug: "outil", partnerProgram: "affiliation" }, "/caisse-brasserie"),
    ).toEqual({
      kind: "affiliate",
      href: "/go/outil?from=%2Fcaisse-brasserie",
      label: "Voir l'offre",
      mention: "Lien partenaire",
      rel: SPONSORED_REL,
    });
    expect(SPONSORED_REL).toBe("sponsored noopener");
  });

  it("affiliation : ignore une page d'origine douteuse", () => {
    const cta = resolveToolCta({ slug: "outil", partnerProgram: "affiliation" }, "//evil.example");
    expect(cta?.href).toBe("/go/outil");
  });

  it("apport d'affaires : formulaire de mise en relation, jamais /go/", () => {
    const cta = resolveToolCta({ slug: "outil", partnerProgram: "apport-affaires" }, "/");
    expect(cta).toMatchObject({ kind: "lead", href: "/mise-en-relation?outil=outil" });
    expect(cta?.href).not.toContain("/go/");
  });

  it("aucun programme : pas de bouton", () => {
    expect(resolveToolCta({ slug: "outil", partnerProgram: "aucun" }, "/")).toBeNull();
  });
});
