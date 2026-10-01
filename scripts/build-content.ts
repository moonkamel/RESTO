/*
 * Génère les articles (content-collections) sans passer par Next : utilisé par le
 * typecheck, la CI et scripts/check-content.ts. Échoue si un article est invalide.
 */
import { createBuilder } from "@content-collections/core";

export async function buildContent(): Promise<void> {
  const errors: string[] = [];
  const builder = await createBuilder(
    new URL("../content-collections.ts", import.meta.url).pathname,
  );
  // Toute erreur de lecture, de frontmatter ou de compilation MDX fait échouer.
  builder.on("_error", (event) => {
    const { error, file } = event as { error?: { message?: string }; file?: { path?: string } };
    errors.push(`content/articles/${file?.path ?? "?"} :\n${error?.message ?? String(error)}`);
  });
  await builder.build();
  if (errors.length > 0) {
    throw new Error(`Articles invalides :\n${errors.join("\n")}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await buildContent();
  console.log("✓ Articles générés (.content-collections).");
}
