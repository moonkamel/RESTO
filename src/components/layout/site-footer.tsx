import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-ticket">
      <div className="mx-auto max-w-5xl space-y-2 px-4 py-8 text-sm text-ink-muted">
        <p>
          {siteConfig.name} est financé par des commissions d&apos;affiliation et d&apos;apport
          d&apos;affaires. Elles n&apos;influencent pas nos classements.
        </p>
        <p className="font-mono text-xs">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
