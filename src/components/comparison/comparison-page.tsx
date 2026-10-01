import { ArrowRight, Calculator } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DisclosureBanner } from "@/components/affiliate/disclosure-banner";
import { SpecCard } from "@/components/brand/spec-card";
import { ComparisonTable } from "@/components/tools/comparison-table";
import { ToolCard } from "@/components/tools/tool-card";
import type { ComparisonPageDef } from "@/content/comparison-pages";
import { tools } from "@/data/tools";
import { formatIsoDate } from "@/lib/format";
import { rankTools } from "@/lib/ranking";
import { CALCULATOR_PATH } from "@/lib/routes";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { RankingMethod } from "./ranking-method";
import { RegulatoryNotes } from "./regulatory-notes";
import { RelatedPages } from "./related-pages";

export function comparisonMetadata(page: ComparisonPageDef): Metadata {
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
  });
}

/** Gabarit commun aux pages comparatif et établissement. */
export function ComparisonPage({ page }: { page: ComparisonPageDef }) {
  const ranked = rankTools(tools.filter(page.filter));
  const lastVerified = ranked
    .map((t) => t.verifiedAt)
    .sort()
    .at(-1);

  return (
    <>
      <section aria-labelledby="titre" className="night dot-grid">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-14 sm:px-6">
          <Breadcrumbs
            crumbs={[
              { name: "Accueil", path: "/" },
              { name: page.metaTitle, path: page.path },
            ]}
          />
          <p className="eyebrow mt-6 text-night-brass">{page.eyebrow}</p>
          <h1 id="titre" className="mt-4 max-w-4xl text-4xl sm:text-6xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-night-muted">{page.intro}</p>
          {lastVerified && (
            <p className="mt-6 font-mono text-xs text-night-muted">
              {ranked.length} outil{ranked.length > 1 ? "s" : ""} · dernière vérification le{" "}
              {formatIsoDate(lastVerified)}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-10 sm:px-6 sm:py-14">
        {/* Règle 1 : la transparence avant tout classement. */}
        <DisclosureBanner />

        <section aria-labelledby="criteres">
          <h2 id="criteres" className="text-3xl sm:text-4xl">
            {page.criteriaTitle}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.criteria.map((c, i) => (
              <li key={c.title}>
                <SpecCard reference={`N° ${String(i + 1).padStart(2, "0")}`} className="h-full">
                  <h3 className="text-lg">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.body}</p>
                </SpecCard>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="classement" className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-brass">Le classement</p>
              <h2 id="classement" className="mt-3 text-3xl sm:text-4xl">
                Notre sélection, testée en service
              </h2>
            </div>
            <a href="#comment-on-classe" className="text-sm text-brass underline">
              Comment on classe
            </a>
          </div>

          {ranked.length === 0 ? (
            <p className="spec-card text-ink-muted">{page.emptyMessage}</p>
          ) : (
            <>
              <ComparisonTable tools={ranked} caption={`Comparatif : ${page.metaTitle}`} />
              <ol className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {ranked.map((tool, i) => (
                  <li key={tool.slug} className="min-w-0">
                    <ToolCard tool={tool} rank={i + 1} fromPath={page.path} />
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>

        {page.showCalculator && (
          <SpecCard className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line text-brass">
              <Calculator aria-hidden className="size-5" />
            </span>
            <div className="flex-1">
              <h2 className="font-sans text-lg font-semibold tracking-normal">
                Abonnement ou commission : laquelle vous coûte le moins ?
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Entrez votre CA et votre part carte, on calcule le coût réel sur 12, 24 ou 36 mois.
              </p>
            </div>
            <Link href={CALCULATOR_PATH} className="btn-glow self-start sm:self-center">
              Faire le calcul <ArrowRight aria-hidden className="size-4" />
            </Link>
          </SpecCard>
        )}

        <RegulatoryNotes topics={page.regulatory} />
        <RankingMethod />
        <RelatedPages current={page.path} />
      </div>
    </>
  );
}
