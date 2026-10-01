import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="night border-b border-night-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-serif text-xl tracking-tight text-night-ink">
          {siteConfig.name}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
