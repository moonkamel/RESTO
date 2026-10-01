import { ExternalLink, Scale } from "lucide-react";
import { PlaceholderBadge } from "@/components/tools/badges";
import { formatIsoDate } from "@/lib/format";
import { getRegulatoryClaim, type RegulatoryClaim, type RegulatoryTopic } from "@/lib/regulatory";

/** Affirmations réglementaires, toujours lues dans src/lib/regulatory.ts, avec source et date. */
export function RegulatoryNotes({
  topics,
  compact = false,
}: {
  topics: readonly RegulatoryTopic[];
  /** true dans un article : cartes seules, sans titre de section. */
  compact?: boolean;
}) {
  if (topics.length === 0) return null;
  const cards = topics
    .map(getRegulatoryClaim)
    .map((claim) => <RegulatoryCard key={claim.id} claim={claim} />);
  if (compact) return <div className="grid gap-4">{cards}</div>;
  return (
    <section aria-labelledby="reglementation" className="space-y-4">
      <p className="eyebrow inline-flex items-center gap-2 text-brass">
        <Scale aria-hidden className="size-4" /> Réglementation
      </p>
      <h2 id="reglementation" className="text-3xl sm:text-4xl">
        Ce que la loi impose
      </h2>
      <div className="grid gap-4 md:grid-cols-2">{cards}</div>
    </section>
  );
}

function RegulatoryCard({ claim }: { claim: RegulatoryClaim }) {
  return (
    <article className="spec-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3>{claim.title}</h3>
        {claim.isPlaceholder && <PlaceholderBadge />}
      </div>
      <p className="mt-2 text-sm leading-relaxed">{claim.claim}</p>
      <p className="mt-4 text-xs text-ink-muted">
        Source :{" "}
        {claim.sourceUrl ? (
          <a
            href={claim.sourceUrl}
            rel="noopener"
            target="_blank"
            className="inline-flex items-center gap-1 text-brass underline"
          >
            {claim.sourceLabel}
            <ExternalLink aria-hidden className="size-3" />
          </a>
        ) : (
          claim.sourceLabel
        )}{" "}
        · vérifié le <time dateTime={claim.verifiedAt}>{formatIsoDate(claim.verifiedAt)}</time>
      </p>
    </article>
  );
}
