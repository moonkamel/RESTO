import { after } from "next/server";
import { siteConfig } from "@/config/site";
import { tools } from "@/data/tools";
import { planGoRedirect } from "@/lib/go-redirect";
import { clientIp, sendPlausibleEvent } from "@/lib/plausible";

const NO_INDEX = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

export async function GET(request: Request, ctx: RouteContext<"/go/[tool]">) {
  const { tool } = await ctx.params;
  const plan = planGoRedirect({
    slug: tool,
    tools,
    requestUrl: request.url,
    referer: request.headers.get("referer"),
    siteUrl: siteConfig.url,
    env: process.env,
  });

  if (plan.status === 404) {
    return new Response("Outil inconnu.", { status: 404, headers: NO_INDEX });
  }

  const { event, apiHost } = plan;
  if (event && apiHost) {
    // Envoyé après la réponse : la redirection n'attend jamais Plausible.
    after(() =>
      sendPlausibleEvent(event, {
        apiHost,
        userAgent: request.headers.get("user-agent"),
        ip: clientIp(request.headers),
      }),
    );
  }

  return new Response(null, { status: 302, headers: { ...NO_INDEX, Location: plan.location } });
}
