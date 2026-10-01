"use client";

import { useState } from "react";
import type { RankedTool } from "@/lib/cost/cost";
import { formatEuros } from "@/lib/format";

const SERIES = [
  { key: "subscription", label: "Abonnement", color: "var(--chart-1)" },
  { key: "hardware", label: "Matériel", color: "var(--chart-2)" },
  { key: "cardFees", label: "Frais carte", color: "var(--chart-3)" },
] as const;

/**
 * Coût total par offre, en barres horizontales empilées (abonnement, matériel, frais carte).
 * Légende + total sur chaque ligne + infobulle au survol. Le graphique est masqué aux lecteurs
 * d'écran : le tableau de détail porte les mêmes valeurs.
 */
export function CostChart({ ranked, months }: { ranked: RankedTool[]; months: number }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...ranked.map((r) => r.cost.total), 1);

  return (
    <figure>
      <figcaption className="text-sm font-semibold">
        Coût total sur {months} mois, en € HT
      </figcaption>

      <ul aria-hidden className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>

      <ol aria-hidden className="mt-5 space-y-4" onMouseLeave={() => setActive(null)}>
        {ranked.map((r, i) => (
          <li key={r.tool.slug} className="relative" onMouseEnter={() => setActive(i)}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate">
                <span className="font-mono text-xs text-ink-muted">{i + 1}.</span> {r.tool.name}
              </span>
              <span className="shrink-0 font-mono">{formatEuros(r.cost.total)}</span>
            </div>
            <div className="mt-1.5 flex h-5 w-full">
              <div
                className="flex h-full gap-[2px]"
                style={{ width: `${(r.cost.total / max) * 100}%` }}
              >
                {SERIES.filter((s) => r.cost[s.key] > 0).map((s, j, visible) => (
                  <span
                    key={s.key}
                    className={j === visible.length - 1 ? "h-full rounded-r-[4px]" : "h-full"}
                    style={{ flexGrow: r.cost[s.key], flexBasis: 0, background: s.color }}
                  />
                ))}
              </div>
            </div>
            {active === i && (
              <div className="absolute top-full right-0 z-10 mt-2 w-56 rounded-lg border border-line bg-surface p-3 text-xs shadow-lg">
                {SERIES.map((s) => (
                  <div key={s.key} className="flex items-center justify-between gap-3 py-0.5">
                    <span className="flex items-center gap-1.5 text-ink-muted">
                      <span className="size-2 rounded-sm" style={{ background: s.color }} />
                      {s.label}
                    </span>
                    <span className="font-mono">{formatEuros(r.cost[s.key])}</span>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>

      <details className="mt-6 text-sm">
        <summary className="cursor-pointer text-ink-muted hover:text-ink">
          Voir le détail des coûts
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left">
            <caption className="sr-only">Détail du coût total par offre, sur {months} mois</caption>
            <thead className="text-xs text-ink-muted">
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pr-3 font-medium">
                  Offre
                </th>
                {SERIES.map((s) => (
                  <th key={s.key} scope="col" className="py-2 pr-3 text-right font-medium">
                    {s.label}
                  </th>
                ))}
                <th scope="col" className="py-2 text-right font-medium">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {ranked.map((r) => (
                <tr key={r.tool.slug} className="border-b border-line last:border-0">
                  <th scope="row" className="py-2 pr-3 font-sans font-normal">
                    {r.tool.name}
                  </th>
                  {SERIES.map((s) => (
                    <td key={s.key} className="py-2 pr-3 text-right">
                      {formatEuros(r.cost[s.key])}
                    </td>
                  ))}
                  <td className="py-2 text-right font-semibold">{formatEuros(r.cost.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
