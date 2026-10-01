import { getToolBySlug, tools } from "@/data/tools";
import { CATEGORY_LABELS } from "@/data/tools.schema";
import { fieldScore } from "@/lib/ranking";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/seo/og-image";

export const alt = "Avis testé en service";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return tools.map((tool) => ({ tool: tool.slug }));
}

const decimal = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export default async function Image({ params }: { params: Promise<{ tool: string }> }) {
  const tool = getToolBySlug((await params).tool);
  if (!tool) return new Response("Introuvable", { status: 404 });
  const score = fieldScore(tool);
  return renderOgImage({
    eyebrow: `Avis · ${CATEGORY_LABELS[tool.category]}`,
    title: `${tool.name}, testé en service`,
    footer:
      score === null ? "Pas encore testé en service" : `Note terrain ${decimal.format(score)}/5`,
  });
}
