import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  reviewJsonLd,
  serializeJsonLd,
} from "./jsonld";

const site = "https://site.fr";
const author = { name: "Auteur", path: "/auteur" };

describe("JSON-LD", () => {
  it("construit des URL absolues", () => {
    expect(absoluteUrl(site, "/avis/x")).toBe("https://site.fr/avis/x");
    expect(absoluteUrl(`${site}/`, "/")).toBe("https://site.fr/");
  });

  it("BreadcrumbList : positions à partir de 1, URL absolues", () => {
    expect(
      breadcrumbJsonLd(site, [
        { name: "Accueil", path: "/" },
        { name: "Avis", path: "/avis/x" },
      ]),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://site.fr/" },
        { "@type": "ListItem", position: 2, name: "Avis", item: "https://site.fr/avis/x" },
      ],
    });
  });

  it("Article : dates, auteur, image Open Graph", () => {
    const data = articleJsonLd({
      siteUrl: site,
      siteName: "Site",
      path: "/guides/a",
      title: "T",
      description: "D",
      publishedAt: "2026-01-01",
      updatedAt: "2026-02-01",
      author,
    });
    expect(data).toMatchObject({
      "@type": "Article",
      headline: "T",
      datePublished: "2026-01-01",
      dateModified: "2026-02-01",
      image: "https://site.fr/guides/a/opengraph-image",
      author: { "@type": "Person", name: "Auteur", url: "https://site.fr/auteur" },
    });
  });

  it("Review : note sur 5 ; aucun balisage sans note terrain", () => {
    const input = {
      siteUrl: site,
      siteName: "Site",
      path: "/avis/x",
      toolName: "X",
      publisher: "Éditeur",
      categoryLabel: "Logiciel de caisse",
      score: 4.3,
      reviewBody: "Avis",
      verifiedAt: "2026-01-01",
      author,
    };
    expect(reviewJsonLd(input)).toMatchObject({
      "@type": "Review",
      itemReviewed: { "@type": "SoftwareApplication", name: "X" },
      reviewRating: { ratingValue: 4.3, bestRating: 5, worstRating: 1 },
    });
    expect(reviewJsonLd({ ...input, score: null })).toBeNull();
  });

  it("FAQPage : une Question par entrée ; rien si vide", () => {
    expect(faqJsonLd([{ question: "Q ?", answer: "R." }])).toEqual({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Q ?", acceptedAnswer: { "@type": "Answer", text: "R." } },
      ],
    });
    expect(faqJsonLd([])).toBeNull();
  });

  it("échappe « < » pour la balise script", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)" })).not.toContain("<");
  });
});
