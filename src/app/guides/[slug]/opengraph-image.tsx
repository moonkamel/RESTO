import { getArticle, getArticles } from "@/lib/articles";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/seo/og-image";

export const alt = "Guide pour restaurateurs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug);
  if (!article) return new Response("Introuvable", { status: 404 });
  return renderOgImage({ eyebrow: "Guide", title: article.title });
}
