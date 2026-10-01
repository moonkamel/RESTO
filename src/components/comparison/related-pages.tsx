import Link from "next/link";
import { CATEGORY_PAGES, ESTABLISHMENT_PAGES } from "@/content/comparison-pages";
import { CALCULATOR_PATH } from "@/lib/routes";
import { cn } from "@/lib/utils";

const groups = [
  {
    title: "Comparatifs",
    links: Object.values(CATEGORY_PAGES).map((p) => ({ href: p.path, label: p.metaTitle })),
  },
  {
    title: "Par établissement",
    links: Object.values(ESTABLISHMENT_PAGES).map((p) => ({ href: p.path, label: p.metaTitle })),
  },
];

/** Maillage interne entre pages comparatif. */
export function RelatedPages({ current }: { current?: string }) {
  return (
    <nav
      aria-label="Autres comparatifs"
      className="grid gap-8 border-t border-line pt-10 sm:grid-cols-2"
    >
      {groups.map((g) => (
        <div key={g.title}>
          <p className="eyebrow text-brass">{g.title}</p>
          <ul className="mt-3 space-y-1">
            {g.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={l.href === current ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center text-sm hover:text-brass",
                    l.href === current ? "font-semibold text-brass" : "text-ink-muted",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-sm text-ink-muted sm:col-span-2">
        Et pour chiffrer votre cas :{" "}
        <Link href={CALCULATOR_PATH} className="text-brass underline">
          le calculateur abonnement ou commission
        </Link>
        .
      </p>
    </nav>
  );
}
