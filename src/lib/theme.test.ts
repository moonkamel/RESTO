import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isTheme, themeInitScript } from "./theme";

describe("isTheme", () => {
  it("accepte uniquement light et dark", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});

describe("themeInitScript", () => {
  function run(stored: string | null, throws = false) {
    const attrs: Record<string, string> = {};
    const localStorage = {
      getItem: () => {
        if (throws) throw new Error("bloqué");
        return stored;
      },
    };
    const document = {
      documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) },
    };
    new Function("localStorage", "document", themeInitScript)(localStorage, document);
    return attrs["data-theme"];
  }

  it("applique un thème enregistré valide", () => {
    expect(run("dark")).toBe("dark");
    expect(run("light")).toBe("light");
  });

  it("ignore une valeur inconnue ou absente", () => {
    expect(run("rose")).toBeUndefined();
    expect(run(null)).toBeUndefined();
  });

  it("ne plante pas si le stockage est bloqué", () => {
    expect(run(null, true)).toBeUndefined();
  });
});

describe("globals.css", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

  it("applique le thème sombre par défaut, sans dépendre de la préférence système", () => {
    expect(css).not.toContain("prefers-color-scheme");
    expect(css).toMatch(/:root:not\(\[data-theme="light"\]\)\s*\{[^}]*color-scheme: dark/);
  });

  it("ne redéfinit en sombre que des variables déclarées en clair", () => {
    const names = (block: string | undefined) =>
      new Set([...(block ?? "").matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
    const light = names(css.match(/:root\s*\{([^}]*)\}/)?.[1]);
    const dark = names(css.match(/:root:not\(\[data-theme="light"\]\)\s*\{([^}]*)\}/)?.[1]);
    expect(dark.size).toBeGreaterThan(5);
    for (const name of dark) expect(light, name).toContain(name);
  });
});
