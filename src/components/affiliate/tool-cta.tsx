import { ArrowUpRight, PhoneCall } from "lucide-react";
import Link from "next/link";
import type { RestaurantTool } from "@/data/tools.schema";
import { resolveToolCta } from "@/lib/affiliate";
import { cn } from "@/lib/utils";

type ToolCtaProps = {
  tool: Pick<RestaurantTool, "slug" | "partnerProgram">;
  /** Chemin de la page qui affiche le bouton (attribution du clic). */
  fromPath: string;
  className?: string;
};

/**
 * Bouton d'action d'un outil, toujours accompagné de sa mention de transparence.
 * Affiliation → /go/ (rel="sponsored noopener") ; apport d'affaires → formulaire ; aucun → rien.
 */
export function ToolCta({ tool, fromPath, className }: ToolCtaProps) {
  const cta = resolveToolCta(tool, fromPath);
  if (!cta) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5", className)}>
      {cta.kind === "affiliate" ? (
        <a href={cta.href} rel={cta.rel} target="_blank" className="btn-glow">
          {cta.label}
          <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only">(nouvel onglet, {cta.mention.toLowerCase()})</span>
        </a>
      ) : (
        <Link href={cta.href} className="btn-glow">
          <PhoneCall aria-hidden className="size-4" />
          {cta.label}
        </Link>
      )}
      <span className="font-mono text-xs text-ink-muted">{cta.mention}</span>
    </div>
  );
}
