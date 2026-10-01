import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import { SpecCard } from "@/components/brand/spec-card";
import { ToolCta } from "@/components/affiliate/tool-cta";
import { PRICING_MODEL_LABELS, type RestaurantTool } from "@/data/tools.schema";
import { fieldScore } from "@/lib/ranking";
import { reviewPath } from "@/lib/routes";
import {
  formatCommission,
  formatCommitment,
  formatHardware,
  formatSubscription,
} from "@/lib/tool-format";
import { PlaceholderBadge, VerifiedDate } from "./badges";
import { FieldScore } from "./score";

export function ToolCard({
  tool,
  rank,
  fromPath,
  showRank = true,
}: {
  tool: RestaurantTool;
  rank: number;
  fromPath: string;
  /** false hors d'un classement (ex. carte isolée dans un article). */
  showRank?: boolean;
}) {
  const features = [
    { label: "Hors ligne", ok: tool.worksOffline },
    { label: "Multi-sites", ok: tool.multiSite },
    { label: "Titres-restaurant", ok: tool.mealVouchers },
  ];

  return (
    <SpecCard
      reference={showRank ? `N° ${rank}` : "Fiche outil"}
      meta={tool.isPlaceholder ? <PlaceholderBadge /> : undefined}
      className="flex h-full flex-col"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl">{tool.name}</h3>
          <p className="text-sm text-ink-muted">
            {tool.publisher} · {PRICING_MODEL_LABELS[tool.pricingModel]}
          </p>
        </div>
        <FieldScore score={fieldScore(tool)} />
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        {[
          ["Abonnement", formatSubscription(tool)],
          ["Commission", formatCommission(tool)],
          ["Matériel", formatHardware(tool)],
          ["Engagement", formatCommitment(tool)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 border-b border-line pb-2 last:border-0"
          >
            <dt className="shrink-0 text-ink-muted">{label}</dt>
            <dd className="text-right font-mono text-xs leading-5">{value}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-4 flex flex-wrap gap-2 text-xs">
        {features.map((f) => (
          <li
            key={f.label}
            className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1"
          >
            {f.ok ? (
              <Check aria-hidden className="size-3.5 text-go" />
            ) : (
              <X aria-hidden className="size-3.5 text-ink-muted" />
            )}
            <span className={f.ok ? "" : "text-ink-muted line-through"}>{f.label}</span>
            <span className="sr-only">{f.ok ? " : oui" : " : non"}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <p>
          <span className="block text-xs font-semibold text-go">Le plus</span>
          {tool.strengths[0]}
        </p>
        <p>
          <span className="block text-xs font-semibold text-destructive">Ce qui coince</span>
          {tool.watchouts[0]}
        </p>
      </div>

      <div className="mt-auto space-y-4 pt-6">
        <VerifiedDate date={tool.verifiedAt} />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <ToolCta tool={tool} fromPath={fromPath} />
          <Link
            href={reviewPath(tool.slug)}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brass hover:underline"
          >
            Lire l&apos;avis <ArrowRight aria-hidden className="size-4" />
            <span className="sr-only"> sur {tool.name}</span>
          </Link>
        </div>
      </div>
    </SpecCard>
  );
}
