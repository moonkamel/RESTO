export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/**
 * Script exécuté avant le premier rendu : applique le thème choisi par
 * l'utilisateur (localStorage) pour éviter un flash. Sans choix enregistré,
 * le CSS affiche le thème sombre (thème par défaut).
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
