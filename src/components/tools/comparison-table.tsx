import { Check, Minus } from "lucide-react";
import Link from "next/link";
import { PRICING_MODEL_LABELS, type RestaurantTool } from "@/data/tools.schema";
import { formatIsoDate } from "@/lib/format";
import { fieldScore } from "@/lib/ranking";
import { reviewPath } from "@/lib/routes";
import {
  formatCommission,
  formatCommitment,
  formatHardware,
  formatSubscription,
} from "@/lib/tool-format";

const decimal = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function YesNo({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 text-go">
      <Check aria-hidden className="size-4" />
      Oui
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-ink-muted">
      <Minus aria-hidden className="size-4" />
      Non
    </span>
  );
}

/**
 * Tableau comparatif. Défile horizontalement sur mobile (zone focalisable au clavier),
 * première colonne figée.
 */
export function ComparisonTable({ tools, caption }: { tools: RestaurantTool[]; caption: string }) {
  return (
    <div
      role="region"
      aria-label={`${caption} (défilement horizontal)`}
      tabIndex={0}
      className="overflow-x-auto rounded-xl border border-line bg-surface"
    >
      <table className="w-full min-w-[56rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="text-xs text-ink-muted">
          <tr className="border-b border-line">
            <th scope="col" className="sticky left-0 bg-surface px-4 py-3 font-medium">
              Outil
            </th>
            {[
              "Note terrain",
              "Modèle",
              "Abonnement",
              "Commission carte",
              "Matériel",
              "Engagement",
              "Hors ligne",
              "Multi-sites",
              "Titres-resto",
              "Vérifié le",
            ].map((h) => (
              <th key={h} scope="col" className="px-3 py-3 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tools.map((tool, i) => {
            const score = fieldScore(tool);
            return (
              <tr key={tool.slug} className="border-b border-line align-top last:border-0">
                <th
                  scope="row"
                  className="sticky left-0 min-w-36 bg-surface px-4 py-3 font-semibold"
                >
                  <span className="font-mono text-xs text-ink-muted">{i + 1}. </span>
                  <Link href={reviewPath(tool.slug)} className="hover:text-brass hover:underline">
                    {tool.name}
                  </Link>
                </th>
                <td className="px-3 py-3 font-mono whitespace-nowrap">
                  {score === null ? (
                    <span className="text-ink-muted">Non testé</span>
                  ) : (
                    `${decimal.format(score)}/5`
                  )}
                </td>
                <td className="px-3 py-3">{PRICING_MODEL_LABELS[tool.pricingModel]}</td>
                <td className="min-w-48 px-3 py-3 font-mono text-xs">{formatSubscription(tool)}</td>
                <td className="min-w-40 px-3 py-3 font-mono text-xs">{formatCommission(tool)}</td>
                <td className="px-3 py-3 font-mono text-xs">{formatHardware(tool)}</td>
                <td className="px-3 py-3 whitespace-nowrap">{formatCommitment(tool)}</td>
                <td className="px-3 py-3">
                  <YesNo value={tool.worksOffline} />
                </td>
                <td className="px-3 py-3">
                  <YesNo value={tool.multiSite} />
                </td>
                <td className="px-3 py-3">
                  <YesNo value={tool.mealVouchers} />
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <time dateTime={tool.verifiedAt}>{formatIsoDate(tool.verifiedAt)}</time>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
