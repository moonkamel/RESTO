import { CalendarCheck } from "lucide-react";
import { formatIsoDate } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Signale une donnée factice (visible uniquement hors production : le build y est bloqué). */
export function PlaceholderBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-destructive px-2.5 py-0.5 font-mono text-[0.6875rem] tracking-wider whitespace-nowrap text-destructive uppercase",
        className,
      )}
    >
      Données factices
    </span>
  );
}

/** Date de dernière vérification, affichée publiquement pour chaque outil. */
export function VerifiedDate({ date, className }: { date: string; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-1.5 text-xs text-ink-muted", className)}>
      <CalendarCheck aria-hidden className="size-3.5 text-brass" />
      Vérifié le <time dateTime={date}>{formatIsoDate(date)}</time>
    </p>
  );
}
