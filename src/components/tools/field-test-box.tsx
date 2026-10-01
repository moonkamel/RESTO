import { Flame } from "lucide-react";
import { FIELD_CRITERIA, FIELD_CRITERIA_LABELS, type RestaurantTool } from "@/data/tools.schema";
import { formatIsoDate } from "@/lib/format";
import { fieldScore } from "@/lib/ranking";
import { cn } from "@/lib/utils";
import { FieldScore, ScoreMeter } from "./score";

/** Bloc « Testé en service » : les 4 critères du coup de feu, notés et commentés. */
export function FieldTestBox({
  tool,
  className,
}: {
  tool: Pick<RestaurantTool, "name" | "fieldTest">;
  className?: string;
}) {
  const test = tool.fieldTest;
  return (
    <section aria-labelledby="teste-en-service" className={cn("spec-card", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow inline-flex items-center gap-2 text-brass">
            <Flame aria-hidden className="size-4" /> Testé en service
          </p>
          <h2 id="teste-en-service" className="mt-2 text-2xl sm:text-3xl">
            {tool.name} en plein coup de feu
          </h2>
        </div>
        <FieldScore score={fieldScore(tool)} />
      </div>

      {test ? (
        <>
          <p className="mt-3 text-sm text-ink-muted">
            {test.context} — testé le{" "}
            <time dateTime={test.testedAt}>{formatIsoDate(test.testedAt)}</time>.
          </p>
          <dl className="mt-6 divide-y divide-line">
            {FIELD_CRITERIA.map((key) => (
              <div key={key} className="grid gap-2 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt className="space-y-1.5">
                  <span className="block font-semibold">{FIELD_CRITERIA_LABELS[key]}</span>
                  <ScoreMeter score={test[key].score} />
                </dt>
                <dd className="text-ink-muted">{test[key].verdict}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p className="mt-4 text-ink-muted">
          On ne l&apos;a pas encore fait tourner en service. Tant que ce n&apos;est pas fait, pas de
          note terrain : l&apos;outil est classé après ceux qu&apos;on a testés.
        </p>
      )}
    </section>
  );
}
