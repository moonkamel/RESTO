import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpecCardProps = ComponentProps<"article"> & {
  /** Numérotation en tête, ex. « N° 01 ». */
  reference?: string;
  /** Mention à droite de l'en-tête, ex. un sceau ou une date de vérification. */
  meta?: ReactNode;
};

/**
 * Fiche technique : élément signature du site.
 * Sert de base aux fiches outils, verdicts et encadrés « Testé en service ».
 */
export function SpecCard({ reference, meta, className, children, ...props }: SpecCardProps) {
  return (
    <article className={cn("spec-card", className)} {...props}>
      {(reference || meta) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {reference && <span className="eyebrow text-brass">{reference}</span>}
          {meta}
        </header>
      )}
      {children}
    </article>
  );
}

export function Seal({ className, children, ...props }: ComponentProps<"span">) {
  return (
    <span className={cn("seal", className)} {...props}>
      {children}
    </span>
  );
}
