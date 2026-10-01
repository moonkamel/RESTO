import type { Env } from "./affiliate.ts";

/*
 * Événements Plausible envoyés côté serveur (API Events).
 * https://plausible.io/docs/events-api
 */

export const AFFILIATE_CLICK_EVENT = "Affiliate Click";

export type PlausibleEvent = {
  name: string;
  url: string;
  domain: string;
  referrer?: string;
  props: Record<string, string>;
};

export type PlausibleConfig = { domain: string; apiHost: string };

export function getPlausibleConfig(env: Env): PlausibleConfig | null {
  const domain = env.PLAUSIBLE_DOMAIN?.trim();
  if (!domain) return null;
  const apiHost = (env.PLAUSIBLE_API_HOST?.trim() || "https://plausible.io").replace(/\/+$/, "");
  return { domain, apiHost };
}

export function buildAffiliateClickEvent(input: {
  domain: string;
  siteUrl: string;
  toolSlug: string;
  fromPath: string | null;
  referrer: string | null;
}): PlausibleEvent {
  const base = input.siteUrl.replace(/\/+$/, "");
  return {
    name: AFFILIATE_CLICK_EVENT,
    // Rattache l'événement à la page d'origine quand on la connaît.
    url: `${base}${input.fromPath ?? `/go/${input.toolSlug}`}`,
    domain: input.domain,
    ...(input.referrer ? { referrer: input.referrer } : {}),
    props: { tool: input.toolSlug, page: input.fromPath ?? "inconnue" },
  };
}

/** Adresse IP du visiteur (première entrée de X-Forwarded-For), pour le comptage des visiteurs uniques. */
export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || null;
}

/**
 * Envoie l'événement. Ne lève jamais : l'analytics ne doit pas casser une redirection.
 * Renvoie true si Plausible a accepté l'événement.
 */
export async function sendPlausibleEvent(
  event: PlausibleEvent,
  options: {
    apiHost: string;
    userAgent: string | null;
    ip: string | null;
    fetchImpl?: typeof fetch;
  },
): Promise<boolean> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.userAgent) headers["User-Agent"] = options.userAgent;
  if (options.ip) headers["X-Forwarded-For"] = options.ip;
  try {
    const response = await (options.fetchImpl ?? fetch)(`${options.apiHost}/api/event`, {
      method: "POST",
      headers,
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
