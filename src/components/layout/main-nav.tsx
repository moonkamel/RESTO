"use client";

import { Calculator, ChevronDown, LayoutGrid, Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type NavGroup = { title: string; links: readonly { href: string; label: string }[] };

/**
 * Navigation principale. Menus en <details> (fonctionnent sans JS) ; le JS ne sert qu'à
 * les refermer après une navigation et au clic à l'extérieur.
 */
export function MainNav({
  groups,
  calculatorPath,
  authorPath,
}: {
  groups: readonly NavGroup[];
  calculatorPath: string;
  authorPath: string;
}) {
  const pathname = usePathname();
  const desktopMenu = useRef<HTMLDetailsElement>(null);
  const mobileMenu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    for (const d of [desktopMenu.current, mobileMenu.current]) if (d) d.open = false;
  }, [pathname]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      for (const d of [desktopMenu.current, mobileMenu.current]) {
        if (d?.open && !d.contains(e.target as Node)) d.open = false;
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  const itemClass =
    "inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 text-sm text-night-muted transition-colors hover:bg-white/5 hover:text-night-ink";
  const linkClass = (href: string) =>
    cn(
      "flex min-h-11 items-center rounded-lg px-3 text-sm hover:bg-white/5 hover:text-night-ink",
      pathname === href ? "text-night-brass" : "text-night-muted",
    );

  return (
    <>
      {/* Bureau */}
      <nav aria-label="Navigation principale" className="hidden md:block">
        <ul className="flex items-center gap-1">
          <li>
            <details ref={desktopMenu} className="group relative">
              <summary className={cn(itemClass, "cursor-pointer list-none")}>
                <LayoutGrid aria-hidden className="size-4 text-night-brass" />
                Comparatifs
                <ChevronDown
                  aria-hidden
                  className="size-4 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="glow-frame absolute right-0 z-50 mt-2 grid w-[34rem] grid-cols-2 gap-4 rounded-xl p-4">
                {groups.map((g) => (
                  <div key={g.title}>
                    <p className="eyebrow px-3 pb-1 text-night-brass">{g.title}</p>
                    <ul>
                      {g.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className={linkClass(l.href)}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </li>
          <li>
            <Link href={calculatorPath} className={itemClass}>
              <Calculator aria-hidden className="size-4 text-night-brass" />
              Calculateur
            </Link>
          </li>
          <li>
            <Link href={authorPath} className={itemClass}>
              <UserRound aria-hidden className="size-4 text-night-brass" />
              L&apos;auteur
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile */}
      <details ref={mobileMenu} className="group md:hidden">
        <summary
          className="grid size-11 cursor-pointer list-none place-items-center rounded-md text-night-muted hover:text-night-ink"
          aria-label="Menu"
        >
          <Menu aria-hidden className="size-5" />
        </summary>
        <nav
          aria-label="Navigation principale"
          className="night absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-night-line px-4 pt-2 pb-6"
        >
          {groups.map((g) => (
            <div key={g.title} className="mt-4">
              <p className="eyebrow px-3 pb-1 text-night-brass">{g.title}</p>
              <ul>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass(l.href)}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <ul className="mt-4 border-t border-night-line pt-4">
            <li>
              <Link href={calculatorPath} className={linkClass(calculatorPath)}>
                Calculateur abonnement ou commission
              </Link>
            </li>
            <li>
              <Link href={authorPath} className={linkClass(authorPath)}>
                L&apos;auteur
              </Link>
            </li>
          </ul>
        </nav>
      </details>
    </>
  );
}
