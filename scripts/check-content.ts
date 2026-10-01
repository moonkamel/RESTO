/*
 * Lancé avant `next build` (voir package.json). Exécuté directement par Node (≥ 22.18).
 * - Les schémas Zod sont évalués à l'import : un outil incomplet fait échouer le build partout.
 * - En production (VERCEL_ENV=production ou BLOCK_PLACEHOLDERS=true), tout contenu factice
 *   ou lien d'affiliation manquant fait aussi échouer le build.
 */
import { buildContent } from "./build-content.ts";
import { author } from "../src/config/author.ts";
import { tools } from "../src/data/tools.ts";
import { checkContent } from "../src/lib/content-guard.ts";
import { regulatoryClaims } from "../src/lib/regulatory.ts";

// Génère et valide les articles : un frontmatter invalide fait échouer ici.
await buildContent();
const { allArticles } = (await import("../.content-collections/generated/index.js")) as {
  allArticles: { title: string; slug: string; isPlaceholder: boolean }[];
};

const { strict, errors, warnings } = checkContent(
  { tools, author, regulatory: regulatoryClaims, articles: allArticles },
  process.env,
);

for (const w of warnings) console.warn(`⚠ ${w}`);
if (warnings.length > 0) {
  console.warn(`⚠ ${warnings.length} point(s) à régler avant la mise en production.`);
}

if (errors.length > 0) {
  for (const e of errors) console.error(`✖ ${e}`);
  console.error(`✖ Build de production bloqué : ${errors.length} problème(s).`);
  process.exit(1);
}

console.log(
  `✓ Contenu valide (${tools.length} outils, ${allArticles.length} articles, mode ${strict ? "production" : "brouillon"}).`,
);
