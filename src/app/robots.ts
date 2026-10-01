import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/go/", "/admin/"] }],
    host: siteConfig.url,
    // sitemap : ajouté en phase 5 avec sitemap.ts.
  };
}
