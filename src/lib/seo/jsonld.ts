/*
 * Données structurées schema.org (JSON-LD). Fonctions pures, testées.
 * Validation manuelle : https://validator.schema.org/ et le test des résultats enrichis Google.
 */

export type JsonLd = Record<string, unknown>;

const CONTEXT = "https://schema.org";

export function absoluteUrl(siteUrl: string, path: string): string {
  return new URL(path, siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).toString();
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(siteUrl: string, crumbs: readonly Crumb[]): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(siteUrl, c.path),
    })),
  };
}

type Person = { name: string; path: string };

function person(siteUrl: string, author: Person): JsonLd {
  return { "@type": "Person", name: author.name, url: absoluteUrl(siteUrl, author.path) };
}

export function articleJsonLd(input: {
  siteUrl: string;
  siteName: string;
  path: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: Person;
}): JsonLd {
  const url = absoluteUrl(input.siteUrl, input.path);
  return {
    "@context": CONTEXT,
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    inLanguage: "fr-FR",
    mainEntityOfPage: url,
    url,
    image: absoluteUrl(input.siteUrl, `${input.path}/opengraph-image`),
    author: person(input.siteUrl, input.author),
    publisher: { "@type": "Organization", name: input.siteName, url: input.siteUrl },
  };
}

/**
 * Avis sur un logiciel. Sans note terrain (outil non testé), pas de balisage Review :
 * on ne publie pas d'avis noté qu'on n'a pas fait.
 */
export function reviewJsonLd(input: {
  siteUrl: string;
  siteName: string;
  path: string;
  toolName: string;
  publisher: string;
  categoryLabel: string;
  score: number | null;
  reviewBody: string;
  verifiedAt: string;
  author: Person;
}): JsonLd | null {
  if (input.score === null) return null;
  return {
    "@context": CONTEXT,
    "@type": "Review",
    url: absoluteUrl(input.siteUrl, input.path),
    inLanguage: "fr-FR",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: input.toolName,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: input.categoryLabel,
      publisher: { "@type": "Organization", name: input.publisher },
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: input.score,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: input.reviewBody,
    dateModified: input.verifiedAt,
    author: person(input.siteUrl, input.author),
    publisher: { "@type": "Organization", name: input.siteName, url: input.siteUrl },
  };
}

export function faqJsonLd(faq: readonly { question: string; answer: string }[]): JsonLd | null {
  if (faq.length === 0) return null;
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function websiteJsonLd(input: {
  siteUrl: string;
  siteName: string;
  description: string;
}): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    name: input.siteName,
    url: input.siteUrl,
    description: input.description,
    inLanguage: "fr-FR",
  };
}

/** Sérialise pour une balise <script> : « < » échappé contre l'injection HTML. */
export function serializeJsonLd(data: JsonLd | readonly JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
