import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Image Open Graph par défaut (src/app/opengraph-image.tsx). Next remplace tout le bloc
 * openGraph d'une page au lieu de le fusionner : l'image est donc toujours redonnée ici.
 * Les routes qui ont leur propre opengraph-image.tsx passent son chemin via `image`.
 */
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — outils pour restaurateurs testés en service`,
};

/**
 * Metadata complète d'une page : titre, description, URL canonique, Open Graph, Twitter.
 * Image : celle de la route si `image` est fourni, sinon l'image par défaut du site.
 */
export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Titre complet sans le suffixe « · site » (page d'accueil). */
  absoluteTitle?: boolean;
  /** Chemin de l'image Open Graph propre à la route (ex. `${path}/opengraph-image`). */
  image?: string;
}): Metadata {
  const image = input.image
    ? { ...DEFAULT_OG_IMAGE, url: input.image, alt: input.title }
    : DEFAULT_OG_IMAGE;
  const ogTitle = input.absoluteTitle ? input.title : `${input.title} · ${siteConfig.name}`;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      title: ogTitle,
      description: input.description,
      url: input.path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: input.type ?? "website",
      images: [image],
      ...(input.type === "article"
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: input.description,
      images: [image.url],
    },
  };
}
