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
  // Le thème sombre est déclaré deux fois (préférence système + data-theme).
  // Ce test garantit que les deux blocs restent identiques.
  it("déclare les mêmes variables sombres dans les deux blocs", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
    const media = css.match(/:root:not\(\[data-theme="light"\]\)\s*\{([^}]*)\}/)?.[1];
    const attr = css.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/)?.[1];
    const normalize = (block: string | undefined) =>
      (block ?? "")
        .replace(/\/\*.*?\*\//g, "")
        .split(";")
        .map((d) => d.trim())
        .filter(Boolean)
        .sort();
    expect(normalize(media).length).toBeGreaterThan(5);
    expect(normalize(media)).toEqual(normalize(attr));
  });
});
