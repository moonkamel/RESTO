import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TicketProps = ComponentProps<"article"> & {
  /** Référence imprimée en tête, ex. « CMD 07 ». */
  reference?: string;
  /** Mention à droite de l'en-tête, ex. une date de vérification. */
  meta?: ReactNode;
};

/**
 * Bon de commande : élément signature du site.
 * Sert de base aux fiches outils, verdicts et encadrés « Testé en service ».
 */
export function Ticket({ reference, meta, className, children, ...props }: TicketProps) {
  return (
    <div className="ticket-shadow">
      <article className={cn("ticket px-5", className)} {...props}>
        {(reference || meta) && (
          <header className="mb-3 flex items-baseline justify-between gap-3 border-b border-dashed border-steel pb-2 font-mono text-xs tracking-wider text-ink-muted uppercase">
            {reference && <span>{reference}</span>}
            {meta && <span>{meta}</span>}
          </header>
        )}
        {children}
      </article>
    </div>
  );
}

export function TicketRail({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("ticket-rail", className)} {...props}>
      {children}
    </div>
  );
}

export function Stamp({ className, children, ...props }: ComponentProps<"span">) {
  return (
    <span className={cn("stamp", className)} {...props}>
      {children}
    </span>
  );
}
