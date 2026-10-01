"use client";

import { Minus, PhoneCall, Plus, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useState, type ReactNode } from "react";
import { ToolCta } from "@/components/affiliate/tool-cta";
import { PlaceholderBadge, VerifiedDate } from "@/components/tools/badges";
import { LEAD_FORM_PATH } from "@/lib/affiliate";
import {
  compareTools,
  DURATIONS,
  validateInputs,
  type Comparison,
  type CostInputs,
  type CostTool,
  type InputErrors,
  type RawInputs,
} from "@/lib/cost/cost";
import { formatEuros } from "@/lib/format";
import { CALCULATOR_PATH } from "@/lib/routes";
import { CostChart } from "./cost-chart";

// Valeurs de départ du formulaire : un exemple à modifier, pas une statistique.
const DEFAULTS: RawInputs = {
  monthlyRevenue: "30000",
  cardSharePercent: "80",
  stations: "1",
  months: "24",
  averageTicket: "25",
  externalCardRate: "",
  externalCardFixedFee: "",
};

export function CostCalculator({
  tools,
  fromPath = CALCULATOR_PATH,
}: {
  tools: CostTool[];
  /** Page qui affiche le calculateur (attribution des clics partenaires). */
  fromPath?: string;
}) {
  const [raw, setRaw] = useState<RawInputs>(DEFAULTS);
  const validation = useMemo(() => validateInputs(raw), [raw]);
  const errors: InputErrors = validation.ok ? {} : validation.errors;
  const set = (key: keyof RawInputs) => (value: string) => setRaw((r) => ({ ...r, [key]: value }));

  const shown = useMemo(
    () =>
      validation.ok
        ? { inputs: validation.inputs, comparison: compareTools(tools, validation.inputs) }
        : null,
    [validation, tools],
  );

  const stations = Number(raw.stations) || 1;

  return (
    // Mise en page selon la largeur disponible (page calculateur ou colonne d'article).
    <div className="@container">
      <div className="grid gap-8 @4xl:grid-cols-[22rem_1fr] @4xl:items-start">
        <form
          className="spec-card space-y-6 @4xl:sticky @4xl:top-24"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Vos chiffres"
        >
          <p className="eyebrow text-brass">Vos chiffres</p>

          <NumberField
            label="CA mensuel encaissé"
            suffix="€ TTC"
            value={raw.monthlyRevenue}
            onChange={set("monthlyRevenue")}
            error={errors.monthlyRevenue}
          />

          <RangeField
            label="Part payée par carte"
            value={raw.cardSharePercent}
            onChange={set("cardSharePercent")}
            error={errors.cardSharePercent}
          />

          <Field label="Nombre de postes d'encaissement" error={errors.stations}>
            {(id, describedBy) => (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-outline size-12 shrink-0 px-0"
                  onClick={() => set("stations")(String(Math.max(1, stations - 1)))}
                  aria-label="Un poste de moins"
                >
                  <Minus aria-hidden className="size-4" />
                </button>
                <input
                  id={id}
                  className="field-input text-center"
                  inputMode="numeric"
                  value={raw.stations}
                  onChange={(e) => set("stations")(e.target.value)}
                  aria-invalid={Boolean(errors.stations)}
                  aria-describedby={describedBy}
                />
                <button
                  type="button"
                  className="btn-outline size-12 shrink-0 px-0"
                  onClick={() => set("stations")(String(Math.min(50, stations + 1)))}
                  aria-label="Un poste de plus"
                >
                  <Plus aria-hidden className="size-4" />
                </button>
              </div>
            )}
          </Field>

          <fieldset>
            <legend className="field-label">Durée comparée</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <label
                  key={d}
                  className="flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-line-strong font-mono text-sm has-checked:border-brass has-checked:bg-brass has-checked:text-canvas has-focus-visible:outline-2 has-focus-visible:outline-ring"
                >
                  <input
                    type="radio"
                    name="months"
                    value={d}
                    checked={raw.months === String(d)}
                    onChange={() => set("months")(String(d))}
                    className="sr-only"
                  />
                  {d} mois
                </label>
              ))}
            </div>
          </fieldset>

          <NumberField
            label="Ticket moyen payé par carte"
            suffix="€ TTC"
            hint="Sert aux frais fixes par transaction."
            value={raw.averageTicket}
            onChange={set("averageTicket")}
            error={errors.averageTicket}
          />

          <fieldset className="space-y-4 border-t border-line pt-5">
            <legend className="sr-only">Caisse sans paiement intégré</legend>
            <p className="field-hint">
              <strong className="text-ink">Caisse sans paiement intégré ?</strong> Indiquez ce que
              vous paie aujourd&apos;hui votre banque ou votre TPE pour la comparer aux autres.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Taux actuel"
                suffix="%"
                value={raw.externalCardRate}
                onChange={set("externalCardRate")}
                error={errors.externalCardRate}
                placeholder="1,2"
              />
              <NumberField
                label="Frais fixes"
                suffix="€"
                value={raw.externalCardFixedFee}
                onChange={set("externalCardFixedFee")}
                error={errors.externalCardFixedFee}
                placeholder="0,05"
              />
            </div>
          </fieldset>
        </form>

        <section aria-labelledby="resultat" aria-live="polite" className="min-w-0 space-y-6">
          <h2 id="resultat" className="sr-only">
            Résultat
          </h2>
          {shown && shown.comparison.ranked.length > 0 ? (
            <Results inputs={shown.inputs} comparison={shown.comparison} fromPath={fromPath} />
          ) : (
            <div className="spec-card text-ink-muted">
              {shown
                ? "Aucune offre comparable avec ces chiffres. Indiquez votre taux carte actuel pour comparer les caisses sans paiement intégré."
                : "Corrigez les champs signalés pour voir le calcul."}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Results({
  inputs,
  comparison,
  fromPath,
}: {
  inputs: CostInputs;
  comparison: Comparison;
  fromPath: string;
}) {
  const [best, second] = comparison.ranked;
  if (!best) return null;
  const { breakEven, incomplete } = comparison;

  return (
    <>
      {/* Recommandation */}
      <div className="spec-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow text-brass">Le moins cher pour vous</p>
          {best.tool.isPlaceholder && <PlaceholderBadge />}
        </div>
        <h3 className="mt-3 font-serif text-3xl font-normal sm:text-4xl">{best.tool.name}</h3>
        <p className="mt-1 text-sm text-ink-muted">{best.tool.publisher}</p>
        <p className="mt-5 text-lg">
          <span className="font-mono text-2xl font-semibold">
            {formatEuros(best.cost.total)} HT
          </span>{" "}
          sur {inputs.months} mois, soit{" "}
          <span className="font-mono">{formatEuros(best.cost.total / inputs.months)}</span> par
          mois.
        </p>
        {second && (
          <p className="mt-2 text-ink-muted">
            {formatEuros(second.cost.total - best.cost.total)} de moins que {second.tool.name}, la 2
            <sup>e</sup> offre.
          </p>
        )}
        <ul className="mt-4 space-y-1 text-sm text-ink-muted">
          {best.cost.cardFeesSource === "externe" && (
            <li>
              Frais carte calculés avec votre taux actuel : la caisse n&apos;intègre pas le
              paiement.
            </li>
          )}
          <li>
            Engagement :{" "}
            {best.tool.commitmentMonths === 0
              ? "sans engagement"
              : `${best.tool.commitmentMonths} mois`}
            .
          </li>
        </ul>
        <VerifiedDate date={best.tool.verifiedAt} className="mt-3" />
        <RecommendationActions tool={best.tool} fromPath={fromPath} />
      </div>

      {/* Point de bascule */}
      {breakEven && (
        <div className="spec-card flex gap-4">
          <TrendingDown aria-hidden className="mt-1 size-5 shrink-0 text-brass" />
          <div>
            <p className="eyebrow text-brass">Point de bascule</p>
            <p className="mt-2">
              À partir de <strong className="font-mono">{formatEuros(breakEven.revenue)}</strong> de
              CA mensuel,{" "}
              {breakEven.cheaperBelow === "commission" ? (
                <>
                  l&apos;offre avec abonnement ({breakEven.subscription.name}) devient moins chère
                  que l&apos;offre à la commission ({breakEven.commission.name}).
                </>
              ) : (
                <>
                  l&apos;offre à la commission ({breakEven.commission.name}) devient moins chère que
                  l&apos;offre avec abonnement ({breakEven.subscription.name}).
                </>
              )}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Vous êtes à {formatEuros(inputs.monthlyRevenue)} :{" "}
              {inputs.monthlyRevenue >= breakEven.revenue ? "au-dessus" : "en dessous"} du seuil.
            </p>
          </div>
        </div>
      )}

      {/* Graphique */}
      <div className="spec-card">
        <CostChart ranked={comparison.ranked} months={inputs.months} />
      </div>

      {incomplete.length > 0 && (
        <p className="text-sm text-ink-muted">
          {incomplete.length === 1
            ? "1 caisse sans paiement intégré n'est pas comparée"
            : `${incomplete.length} caisses sans paiement intégré ne sont pas comparées`}{" "}
          ({incomplete.map((t) => t.name).join(", ")}) : indiquez votre taux carte actuel dans le
          formulaire.
        </p>
      )}
    </>
  );
}

function RecommendationActions({ tool, fromPath }: { tool: CostTool; fromPath: string }) {
  if (tool.partnerProgram === "aucun") {
    return (
      <p className="mt-6 text-sm text-ink-muted">
        Pas de partenariat avec cet éditeur : contactez-le directement.
      </p>
    );
  }
  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
      <ToolCta tool={tool} fromPath={fromPath} />
      {tool.partnerProgram === "affiliation" && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Link
            href={`${LEAD_FORM_PATH}?outil=${encodeURIComponent(tool.slug)}`}
            className="btn-outline"
          >
            <PhoneCall aria-hidden className="size-4" />
            Être rappelé par l&apos;éditeur
          </Link>
          <span className="font-mono text-xs text-ink-muted">Mise en relation rémunérée</span>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: (id: string, describedBy: string | undefined) => ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children(id, describedBy)}
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

function NumberField({
  label,
  suffix,
  hint,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  suffix: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(id, describedBy) => (
        <div className="relative">
          <input
            id={id}
            className="field-input pr-14"
            inputMode="decimal"
            autoComplete="off"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-xs text-ink-muted">
            {suffix}
          </span>
        </div>
      )}
    </Field>
  );
}

function RangeField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      {(id, describedBy) => (
        <div className="flex items-center gap-4">
          <input
            id={id}
            type="range"
            min={0}
            max={100}
            step={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-valuetext={`${value} %`}
            aria-describedby={describedBy}
            className="h-11 w-full accent-[var(--brass)]"
          />
          <output htmlFor={id} className="w-12 shrink-0 text-right font-mono">
            {value} %
          </output>
        </div>
      )}
    </Field>
  );
}
