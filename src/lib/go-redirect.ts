import type { RestaurantTool } from "../data/tools.schema.ts";
import { getAffiliateUrl, sanitizeFromPath, type Env } from "./affiliate.ts";
import { buildAffiliateClickEvent, getPlausibleConfig, type PlausibleEvent } from "./plausible.ts";

export type GoPlan =
  | { status: 404 }
  | { status: 302; location: string; event: PlausibleEvent | null; apiHost: string | null };

/**
 * Décide de la réponse de /go/[tool] (logique pure, testée) :
 * 404 si l'outil est inconnu, sans programme d'affiliation ou sans URL configurée ;
 * sinon 302 vers l'URL partenaire, avec l'événement Plausible à envoyer.
 */
export function planGoRedirect(input: {
  slug: string;
  tools: readonly Pick<RestaurantTool, "slug" | "partnerProgram">[];
  requestUrl: string;
  referer: string | null;
  siteUrl: string;
  env: Env;
}): GoPlan {
  const tool = input.tools.find((t) => t.slug === input.slug);
  if (!tool || tool.partnerProgram !== "affiliation") return { status: 404 };

  const location = getAffiliateUrl(tool.slug, input.env);
  if (!location) return { status: 404 };

  const request = new URL(input.requestUrl);
  const fromPath =
    sanitizeFromPath(request.searchParams.get("from")) ?? sameOriginPath(input.referer, request);

  const plausible = getPlausibleConfig(input.env);
  const event = plausible
    ? buildAffiliateClickEvent({
        domain: plausible.domain,
        siteUrl: input.siteUrl,
        toolSlug: tool.slug,
        fromPath,
        referrer: input.referer,
      })
    : null;

  return { status: 302, location, event, apiHost: plausible?.apiHost ?? null };
}

/** Chemin du Referer s'il vient du site lui-même. */
function sameOriginPath(referer: string | null, request: URL): string | null {
  if (!referer) return null;
  try {
    const url = new URL(referer);
    return url.origin === request.origin ? sanitizeFromPath(url.pathname) : null;
  } catch {
    return null;
  }
}
