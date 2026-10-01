import { allArticles } from "content-collections";
import { author } from "@/config/author";
import { tools } from "@/data/tools";
import { collectPlaceholders, isStrictBuild } from "@/lib/content-guard";
import { regulatoryClaims } from "@/lib/regulatory";

/**
 * Avertissement visible en développement et en preview tant qu'il reste du contenu factice.
 * En production réelle, il n'apparaît jamais : le build échoue avant (scripts/check-content.ts).
 */
export function PlaceholderBanner() {
  if (isStrictBuild(process.env)) return null;
  const items = collectPlaceholders({
    tools,
    author,
    regulatory: regulatoryClaims,
    articles: allArticles,
  });
  if (items.length === 0) return null;

  return (
    <details className="border-b border-amber-500/40 bg-amber-950 px-4 py-2 text-sm text-amber-100">
      <summary className="mx-auto max-w-6xl cursor-pointer">
        <strong>Brouillon :</strong> {items.length} contenu(s) factice(s). Le build de production
        sera bloqué tant qu&apos;ils ne sont pas remplacés.
      </summary>
      <ul className="mx-auto mt-2 max-w-6xl list-disc space-y-0.5 pl-5 font-mono text-xs">
        {items.map((item) => (
          <li key={`${item.kind}-${item.label}`}>
            {item.kind} — {item.label}
          </li>
        ))}
      </ul>
    </details>
  );
}
