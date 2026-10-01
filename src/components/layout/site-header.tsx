import { ChefHat } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { NAV_GROUPS } from "@/content/navigation";
import { AUTHOR_PATH, CALCULATOR_PATH } from "@/lib/routes";
import { MainNav } from "./main-nav";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="night sticky top-0 z-40 border-b border-night-line">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-night-ink">
          <span
            aria-hidden
            className="glow-frame grid size-8 place-items-center rounded-full text-night-brass"
          >
            <ChefHat className="size-4" strokeWidth={1.75} />
          </span>
          <span className="font-serif text-xl tracking-tight">{siteConfig.name}</span>
        </Link>
        <div className="flex items-center gap-1">
          <MainNav groups={NAV_GROUPS} calculatorPath={CALCULATOR_PATH} authorPath={AUTHOR_PATH} />
          <ThemeToggle />
        </div>
      </div>
      <div aria-hidden className="scroll-progress" />
    </header>
  );
}
