import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo/jsonld";
import { cn } from "@/lib/utils";
import { JsonLd } from "./json-ld";

/** Fil d'Ariane visible + BreadcrumbList JSON-LD. Le dernier élément est la page courante. */
export function Breadcrumbs({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  return (
    <>
      <nav aria-label="Fil d'Ariane" className={cn("text-sm text-night-muted", className)}>
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-night-ink">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={c.path}
                      className="inline-flex min-h-11 items-center hover:text-night-ink"
                    >
                      {c.name}
                    </Link>
                    <ChevronRight aria-hidden className="size-3.5" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={[breadcrumbJsonLd(siteConfig.url, crumbs)]} />
    </>
  );
}
