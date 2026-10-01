import { Info } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Bandeau de transparence : en haut de chaque page de comparaison, AVANT tout classement.
 */
export function DisclosureBanner({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Transparence sur notre rémunération"
      className={cn(
        "flex gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-muted",
        className,
      )}
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brass" />
      <p>
        <strong className="text-ink">Transparence.</strong> {siteConfig.name} touche une commission
        quand vous souscrivez par un « lien partenaire » ou quand un éditeur signe après une mise en
        relation. Ça ne change rien au classement : il est établi uniquement sur nos critères, ici
        sur le coût calculé.
      </p>
    </aside>
  );
}
