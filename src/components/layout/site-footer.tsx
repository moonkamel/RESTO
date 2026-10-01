import Link from "next/link";
import { siteConfig } from "@/config/site";
import { NAV_GROUPS } from "@/content/navigation";
import { AUTHOR_PATH, CALCULATOR_PATH } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="night mt-auto border-t border-night-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm text-night-muted sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="font-serif text-lg text-night-ink">{siteConfig.name}</p>
          <p className="max-w-xs">
            Site indépendant financé par des commissions d&apos;affiliation et d&apos;apport
            d&apos;affaires. Elles n&apos;influencent pas nos classements.
          </p>
          <p className="font-mono text-xs">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
        {NAV_GROUPS.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <p className="eyebrow text-night-brass">{g.title}</p>
            <ul className="mt-3">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-10 items-center hover:text-night-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <nav aria-label="Outils et à propos">
          <p className="eyebrow text-night-brass">Outils</p>
          <ul className="mt-3">
            <li>
              <Link
                href={CALCULATOR_PATH}
                className="inline-flex min-h-10 items-center hover:text-night-ink"
              >
                Calculateur de coût
              </Link>
            </li>
            <li>
              <Link
                href={AUTHOR_PATH}
                className="inline-flex min-h-10 items-center hover:text-night-ink"
              >
                L&apos;auteur et la méthode
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
