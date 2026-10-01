import { ArrowLeft, Calculator, Check, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DisclosureBanner } from "@/components/affiliate/disclosure-banner";
import { ToolCta } from "@/components/affiliate/tool-cta";
import { SpecCard } from "@/components/brand/spec-card";
import { PlaceholderBadge, VerifiedDate } from "@/components/tools/badges";
import { FieldTestBox } from "@/components/tools/field-test-box";
import { FieldScore } from "@/components/tools/score";
import { author } from "@/config/author";
import { getToolBySlug, tools } from "@/data/tools";
import { CATEGORY_LABELS, ESTABLISHMENT_LABELS, PRICING_MODEL_LABELS } from "@/data/tools.schema";
import { isCalculatorTool } from "@/lib/cost/cost";
import { fieldScore } from "@/lib/ranking";
import { AUTHOR_PATH, CALCULATOR_PATH, CATEGORY_PATHS, reviewPath } from "@/lib/routes";
import {
  formatCommission,
  formatCommitment,
  formatHardware,
  formatSubscription,
} from "@/lib/tool-format";

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({ params }: PageProps<"/avis/[tool]">): Promise<Metadata> {
  const tool = getToolBySlug((await params).tool);
  if (!tool) return {};
  return {
    title: `Avis ${tool.name} : testé en service`,
    description: `Notre avis terrain sur ${tool.name} (${CATEGORY_LABELS[tool.category].toLowerCase()}) : rapidité en coup de feu, prise en main, coupure internet, tickets cuisine, prix vérifiés.`,
    alternates: { canonical: reviewPath(tool.slug) },
  };
}

export default async function ReviewPage({ params }: PageProps<"/avis/[tool]">) {
  const tool = getToolBySlug((await params).tool);
  if (!tool) notFound();
  const path = reviewPath(tool.slug);
  const categoryPath = CATEGORY_PATHS[tool.category];

  const facts: [string, string][] = [
    ["Modèle", PRICING_MODEL_LABELS[tool.pricingModel]],
    ["Abonnement", formatSubscription(tool)],
    ["Commission carte", formatCommission(tool)],
    ["Matériel", formatHardware(tool)],
    ["Engagement", formatCommitment(tool)],
  ];
  const features: [string, boolean][] = [
    ["Fonctionne hors ligne", tool.worksOffline],
    ["Multi-sites", tool.multiSite],
    ["Titres-restaurant", tool.mealVouchers],
  ];

  return (
    <>
      <section aria-labelledby="titre" className="night dot-grid">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-14 sm:px-6 sm:pt-14">
          <Link
            href={categoryPath}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-night-muted hover:text-night-ink"
          >
            <ArrowLeft aria-hidden className="size-4" />
            {CATEGORY_LABELS[tool.category]} : le comparatif
          </Link>
          <p className="eyebrow mt-4 text-night-brass">Avis · {CATEGORY_LABELS[tool.category]}</p>
          <h1 id="titre" className="mt-4 text-4xl sm:text-6xl">
            {tool.name}
          </h1>
          <p className="mt-3 text-lg text-night-muted">par {tool.publisher}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 [&_.font-mono]:text-night-muted [&_p]:text-night-muted">
            <FieldScore score={fieldScore(tool)} />
            <VerifiedDate date={tool.verifiedAt} />
            {tool.isPlaceholder && (
              <PlaceholderBadge className="border-night-alert text-night-alert" />
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
        <DisclosureBanner />

        <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div className="min-w-0 space-y-8">
            <FieldTestBox tool={tool} />

            <section aria-labelledby="avis" className="spec-card">
              <p className="eyebrow text-brass">Notre avis terrain</p>
              <h2 id="avis" className="mt-2 text-2xl sm:text-3xl">
                Ce qu&apos;on en pense, sans détour
              </h2>
              <p className="mt-4 text-lg leading-relaxed">{tool.fieldReview}</p>
              <p className="mt-4 text-sm text-ink-muted">
                Par{" "}
                <Link href={AUTHOR_PATH} className="text-brass underline">
                  {author.name}
                </Link>
                , {author.role.charAt(0).toLowerCase() + author.role.slice(1)}.
              </p>
            </section>

            <div className="grid gap-6 sm:grid-cols-2">
              <section aria-labelledby="forts" className="spec-card">
                <h2 id="forts" className="font-sans text-lg font-semibold tracking-normal text-go">
                  Points forts
                </h2>
                <ul className="mt-3 space-y-2">
                  {tool.strengths.map((s) => (
                    <li key={s} className="flex gap-2">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-go" />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="vigilance" className="spec-card">
                <h2
                  id="vigilance"
                  className="font-sans text-lg font-semibold tracking-normal text-destructive"
                >
                  Points de vigilance
                </h2>
                <ul className="mt-3 space-y-2">
                  {tool.watchouts.map((w) => (
                    <li key={w} className="flex gap-2">
                      <X aria-hidden className="mt-1 size-4 shrink-0 text-destructive" />
                      {w}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <aside aria-label="Fiche technique" className="space-y-6 lg:sticky lg:top-24">
            <SpecCard reference="Fiche technique">
              <dl className="space-y-2.5 text-sm">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-ink-muted">{label}</dt>
                    <dd className="font-mono text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-5 space-y-1.5 border-t border-line pt-4 text-sm">
                {features.map(([label, ok]) => (
                  <li key={label} className="flex items-center gap-2">
                    {ok ? (
                      <Check aria-hidden className="size-4 text-go" />
                    ) : (
                      <X aria-hidden className="size-4 text-ink-muted" />
                    )}
                    <span className={ok ? "" : "text-ink-muted"}>{label}</span>
                    <span className="sr-only">{ok ? " : oui" : " : non"}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink-muted">
                Pour : {tool.establishmentTypes.map((t) => ESTABLISHMENT_LABELS[t]).join(", ")}.
                {tool.deliveryIntegrations.length > 0 &&
                  ` Livraison : ${tool.deliveryIntegrations.join(", ")}.`}
              </p>
              <VerifiedDate date={tool.verifiedAt} className="mt-4" />
              <ToolCta tool={tool} fromPath={path} className="mt-5" />
            </SpecCard>

            {isCalculatorTool(tool) && (
              <Link
                href={CALCULATOR_PATH}
                className="spec-card flex items-center gap-3 text-sm hover:text-brass"
              >
                <Calculator aria-hidden className="size-5 shrink-0 text-brass" />
                Combien il vous coûterait vraiment ? Faites le calcul avec vos chiffres.
              </Link>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
