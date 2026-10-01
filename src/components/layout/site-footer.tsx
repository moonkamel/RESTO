import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="night mt-auto border-t border-night-line">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-10 text-sm text-night-muted sm:px-6">
        <p className="font-serif text-lg text-night-ink">{siteConfig.name}</p>
        <p className="max-w-xl">
          Site indépendant financé par des commissions d&apos;affiliation et d&apos;apport
          d&apos;affaires. Elles n&apos;influencent pas nos classements.
        </p>
        <p className="font-mono text-xs">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
