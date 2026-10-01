import { MDXContent } from "@content-collections/mdx/react";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DisclosureBanner } from "@/components/affiliate/disclosure-banner";
import { articleComponents } from "@/components/mdx/mdx-components";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { PlaceholderBadge } from "@/components/tools/badges";
import { author } from "@/config/author";
import { siteConfig } from "@/config/site";
import { getArticle, getArticles } from "@/lib/articles";
import { formatIsoDate } from "@/lib/format";
import { articlePath, AUTHOR_PATH, GUIDES_PATH } from "@/lib/routes";
import { articleJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: articlePath(article.slug),
    image: `${articlePath(article.slug)}/opengraph-image`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export default async function ArticlePage({ params }: PageProps<"/guides/[slug]">) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const path = articlePath(article.slug);

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            siteUrl: siteConfig.url,
            siteName: siteConfig.name,
            path,
            title: article.title,
            description: article.description,
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt,
            author: { name: author.name, path: AUTHOR_PATH },
          }),
          faqJsonLd(article.faq),
        ]}
      />
      <section aria-labelledby="titre" className="night dot-grid">
        <div className="mx-auto max-w-3xl px-4 pt-6 pb-14 sm:px-6 sm:pb-16">
          <Breadcrumbs
            crumbs={[
              { name: "Accueil", path: "/" },
              { name: "Guides", path: GUIDES_PATH },
              { name: article.title, path },
            ]}
          />
          <h1 id="titre" className="mt-6 text-4xl sm:text-6xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg text-night-muted">{article.description}</p>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-night-muted">
            <span>
              Par{" "}
              <Link href={AUTHOR_PATH} className="text-night-ink underline">
                {author.name}
              </Link>
            </span>
            <span aria-hidden>·</span>
            <span>
              Mis à jour le{" "}
              <time dateTime={article.updatedAt}>{formatIsoDate(article.updatedAt)}</time>
            </span>
            {article.isPlaceholder && (
              <PlaceholderBadge className="border-night-alert text-night-alert" />
            )}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
        <DisclosureBanner />

        <article className="prose-article">
          <MDXContent code={article.mdx} components={articleComponents(path)} />
        </article>

        {article.faq.length > 0 && (
          <section aria-labelledby="faq" className="space-y-4">
            <h2 id="faq" className="text-3xl">
              Questions fréquentes
            </h2>
            {article.faq.map((f) => (
              <details key={f.question} className="spec-card group">
                <summary className="cursor-pointer font-semibold">{f.question}</summary>
                <p className="mt-3 leading-relaxed text-ink-muted">{f.answer}</p>
              </details>
            ))}
          </section>
        )}

        <section
          aria-labelledby="sources"
          className="border-t border-line pt-6 text-sm text-ink-muted"
        >
          <h2 id="sources" className="font-sans text-base font-semibold tracking-normal text-ink">
            Sources
          </h2>
          <ul className="mt-2 space-y-1">
            {article.sources.map((s) => (
              <li key={s.label}>
                {s.url ? (
                  <a
                    href={s.url}
                    rel="noopener"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-brass underline"
                  >
                    {s.label}
                    <ExternalLink aria-hidden className="size-3" />
                  </a>
                ) : (
                  s.label
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Publié le{" "}
            <time dateTime={article.publishedAt}>{formatIsoDate(article.publishedAt)}</time>, mis à
            jour le <time dateTime={article.updatedAt}>{formatIsoDate(article.updatedAt)}</time>.
          </p>
        </section>
      </div>
    </>
  );
}
