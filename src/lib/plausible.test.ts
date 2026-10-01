import { describe, expect, it, vi } from "vitest";
import {
  AFFILIATE_CLICK_EVENT,
  buildAffiliateClickEvent,
  clientIp,
  getPlausibleConfig,
  sendPlausibleEvent,
} from "./plausible";

describe("getPlausibleConfig", () => {
  it("est désactivé sans domaine", () => {
    expect(getPlausibleConfig({})).toBeNull();
  });
  it("utilise plausible.io par défaut et retire le slash final", () => {
    expect(getPlausibleConfig({ PLAUSIBLE_DOMAIN: "site.fr" })).toEqual({
      domain: "site.fr",
      apiHost: "https://plausible.io",
    });
    expect(
      getPlausibleConfig({
        PLAUSIBLE_DOMAIN: "site.fr",
        PLAUSIBLE_API_HOST: "https://stats.site.fr/",
      })?.apiHost,
    ).toBe("https://stats.site.fr");
  });
});

describe("buildAffiliateClickEvent", () => {
  it("rattache le clic à la page d'origine, avec l'outil et la page en propriétés", () => {
    expect(
      buildAffiliateClickEvent({
        domain: "site.fr",
        siteUrl: "https://site.fr/",
        toolSlug: "outil",
        fromPath: "/caisse-brasserie",
        referrer: "https://site.fr/caisse-brasserie",
      }),
    ).toEqual({
      name: AFFILIATE_CLICK_EVENT,
      url: "https://site.fr/caisse-brasserie",
      domain: "site.fr",
      referrer: "https://site.fr/caisse-brasserie",
      props: { tool: "outil", page: "/caisse-brasserie" },
    });
  });
  it("sans page d'origine connue, utilise l'URL /go/", () => {
    const event = buildAffiliateClickEvent({
      domain: "site.fr",
      siteUrl: "https://site.fr",
      toolSlug: "outil",
      fromPath: null,
      referrer: null,
    });
    expect(event.url).toBe("https://site.fr/go/outil");
    expect(event.props.page).toBe("inconnue");
    expect(event).not.toHaveProperty("referrer");
  });
});

describe("clientIp", () => {
  it("prend la première adresse de X-Forwarded-For, sinon X-Real-IP", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" }))).toBe(
      "203.0.113.5",
    );
    expect(clientIp(new Headers({ "x-real-ip": "203.0.113.9" }))).toBe("203.0.113.9");
    expect(clientIp(new Headers())).toBeNull();
  });
});

describe("sendPlausibleEvent", () => {
  const event = buildAffiliateClickEvent({
    domain: "site.fr",
    siteUrl: "https://site.fr",
    toolSlug: "outil",
    fromPath: "/",
    referrer: null,
  });

  it("poste l'événement avec User-Agent et IP du visiteur", async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 202 }));
    const ok = await sendPlausibleEvent(event, {
      apiHost: "https://plausible.io",
      userAgent: "Mozilla/5.0",
      ip: "203.0.113.5",
      fetchImpl,
    });
    expect(ok).toBe(true);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://plausible.io/api/event");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
      "X-Forwarded-For": "203.0.113.5",
    });
    expect(JSON.parse(init.body as string)).toEqual(event);
  });

  it("ne lève jamais, même si Plausible est injoignable", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("réseau");
    });
    await expect(
      sendPlausibleEvent(event, {
        apiHost: "https://plausible.io",
        userAgent: null,
        ip: null,
        fetchImpl,
      }),
    ).resolves.toBe(false);
  });
});
