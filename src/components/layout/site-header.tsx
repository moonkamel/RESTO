import { Calculator, ChefHat, LayoutGrid, Route, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "./theme-toggle";

// Ancres de l'accueil en attendant les pages de la phase 4.
const nav = [
  { href: "/#methode", label: "Méthode", icon: ShieldCheck },
  { href: "/#comparatifs", label: "Comparatifs", icon: LayoutGrid },
  { href: "/#parcours", label: "Parcours", icon: Route },
  { href: "/calculateur-cout-caisse", label: "Calculateur", icon: Calculator },
] as const;

export function SiteHeader() {
  return (
    <header className="night sticky top-0 z-40 border-b border-night-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-night-ink">
          <span
            aria-hidden
            className="glow-frame grid size-8 place-items-center rounded-full text-night-brass"
          >
            <ChefHat className="size-4" strokeWidth={1.75} />
          </span>
          <span className="font-serif text-xl tracking-tight">{siteConfig.name}</span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 text-sm text-night-muted transition-colors hover:bg-white/5 hover:text-night-ink"
                >
                  <Icon aria-hidden className="size-4 text-night-brass" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
      <div aria-hidden className="scroll-progress" />
    </header>
  );
}
