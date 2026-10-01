import { describe, expect, it } from "vitest";
import { planGoRedirect } from "./go-redirect";

const tools = [
  { slug: "caisse-a", partnerProgram: "affiliation" },
  { slug: "resa-c", partnerProgram: "apport-affaires" },
  { slug: "commande-d", partnerProgram: "aucun" },
] as const;

const env = {
  AFFILIATE_URL_CAISSE_A: "https://partenaire.example/?ref=site",
  PLAUSIBLE_DOMAIN: "site.fr",
};

const plan = (overrides: Partial<Parameters<typeof planGoRedirect>[0]> = {}) =>
  planGoRedirect({
    slug: "caisse-a",
    tools,
    requestUrl: "https://site.fr/go/caisse-a?from=/caisse-brasserie",
    referer: null,
    siteUrl: "https://site.fr",
    env,
    ...overrides,
  });

describe("planGoRedirect", () => {
  it("redirige en 302 vers l'URL partenaire et prépare l'événement", () => {
    const result = plan();
    expect(result).toMatchObject({
      status: 302,
      location: "https://partenaire.example/?ref=site",
      apiHost: "https://plausible.io",
      event: { name: "Affiliate Click", props: { tool: "caisse-a", page: "/caisse-brasserie" } },
    });
  });

  it("répond 404 pour un outil inconnu", () => {
    expect(plan({ slug: "inconnu" })).toEqual({ status: 404 });
  });

  it("répond 404 pour un outil sans programme d'affiliation", () => {
    expect(plan({ slug: "resa-c" })).toEqual({ status: 404 });
    expect(plan({ slug: "commande-d" })).toEqual({ status: 404 });
  });

  it("répond 404 si l'URL d'affiliation n'est pas configurée", () => {
    expect(plan({ env: { PLAUSIBLE_DOMAIN: "site.fr" } })).toEqual({ status: 404 });
  });

  it("utilise le Referer du site si le paramètre from est absent", () => {
    const result = plan({
      requestUrl: "https://site.fr/go/caisse-a",
      referer: "https://site.fr/avis/caisse-a?x=1",
    });
    expect(result.status === 302 && result.event?.props.page).toBe("/avis/caisse-a");
  });

  it("ignore un Referer externe et un from malveillant", () => {
    const result = plan({
      requestUrl: "https://site.fr/go/caisse-a?from=//evil.example",
      referer: "https://evil.example/page",
    });
    expect(result.status === 302 && result.event?.props.page).toBe("inconnue");
  });

  it("redirige sans événement si Plausible n'est pas configuré", () => {
    expect(plan({ env: { AFFILIATE_URL_CAISSE_A: env.AFFILIATE_URL_CAISSE_A } })).toMatchObject({
      status: 302,
      event: null,
      apiHost: null,
    });
  });
});
