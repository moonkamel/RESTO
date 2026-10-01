import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { ALL_COMPARISON_PAGES } from "@/content/comparison-pages";
import { tools } from "@/data/tools";
import { getArticles } from "@/lib/articles";
import { buildSitemap } from "@/lib/seo/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap({
    siteUrl: siteConfig.url,
    tools,
    comparisonPages: ALL_COMPARISON_PAGES,
    articles: getArticles(),
  });
}
