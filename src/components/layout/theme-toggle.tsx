"use client";

import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function resolvedTheme(): Theme {
  const forced = document.documentElement.getAttribute("data-theme");
  if (forced === "light" || forced === "dark") return forced;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  function toggle() {
    const next: Theme = resolvedTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Stockage indisponible : le choix vaut pour la page en cours.
    }
  }

  // Les icônes sont pilotées par le CSS (variante dark:) : pas de décalage à l'hydratation.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Basculer entre mode clair et mode sombre"
      className="inline-flex size-11 items-center justify-center rounded-md text-night-muted transition-colors hover:bg-white/10 hover:text-night-ink"
    >
      <Moon aria-hidden className="size-5 dark:hidden" />
      <Sun aria-hidden className="hidden size-5 dark:block" />
    </button>
  );
}
