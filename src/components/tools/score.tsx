import { cn } from "@/lib/utils";

const decimal = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Jauge de 1 à 5 (null = sans objet). */
export function ScoreMeter({ score, className }: { score: number | null; className?: string }) {
  if (score === null) {
    return <span className={cn("font-mono text-xs text-ink-muted", className)}>Sans objet</span>;
  }
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className="flex gap-[3px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={cn("h-2 w-4 rounded-[2px]", i <= score ? "bg-brass" : "bg-line")}
          />
        ))}
      </span>
      <span className="font-mono text-sm">
        {score}
        <span className="text-ink-muted">/5</span>
      </span>
    </span>
  );
}

/** Note terrain globale, ou mention « pas encore testé en service ». */
export function FieldScore({ score, className }: { score: number | null; className?: string }) {
  if (score === null) {
    return (
      <span className={cn("text-sm text-ink-muted", className)}>Pas encore testé en service</span>
    );
  }
  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className="text-shine font-serif text-3xl leading-none">{decimal.format(score)}</span>
      <span className="font-mono text-xs text-ink-muted">/5 note terrain</span>
    </span>
  );
}
