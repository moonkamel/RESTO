@AGENTS.md

# [NOM DU SITE] — mémoire projet

Site français d'affiliation B2B : aider les restaurateurs à choisir caisse, terminal de paiement
(TPE), réservation en ligne et commande en ligne. Revenus : commissions d'affiliation (CPA) et
apport d'affaires (leads qualifiés transmis manuellement aux éditeurs).

Cible : restaurateurs indépendants, brasseries, food trucks, boulangeries, petits groupes
multi-sites, porteurs de projet. Ils lisent **sur mobile, entre deux services**.

Différenciation : l'auteur est un restaurateur passé par la cuisine qui gère aujourd'hui
plusieurs établissements à Paris. Avis « testé en service », critères pensés pour le coup de feu,
récit à la première personne. Jamais un comparatif générique.

## Stack

- Next.js 16 (App Router), React 19, TypeScript strict (+ `noUncheckedIndexedAccess`), pnpm
- Tailwind CSS v4 (config dans `src/app/globals.css`, pas de `tailwind.config`)
- shadcn/ui (style new-york, base Radix) — voir « Environnement » pour l'ajout de composants
- content-collections pour les articles MDX (phase 5)
- Zod pour la validation des données (phase 2)
- Supabase pour les leads (phase 6)
- Plausible pour l'analytics (événements serveur via l'API Events)
- Vitest pour les tests, ESLint (config Next + Prettier), Prettier (+ plugin Tailwind)
- Déploiement Vercel. Node ≥ 22.

> Le Next.js installé peut différer de tes connaissances : lis `node_modules/next/dist/docs/`
> avant d'utiliser une API (voir `AGENTS.md`).

## Commandes

```bash
pnpm dev            # serveur de dev
pnpm build          # build de production
pnpm check          # lint + typecheck + format:check + test (à lancer avant chaque commit)
pnpm test           # Vitest
pnpm typecheck      # next typegen && tsc --noEmit
pnpm format         # Prettier
```

La CI GitHub Actions (`.github/workflows/ci.yml`) lance `pnpm check` puis `pnpm build`.

## Arborescence

```
content/articles/            # P5 · articles MDX
scripts/                     # P2 · garde-fous de build (placeholders)
supabase/migrations/         # P6 · schéma + RLS
src/
  app/                       # routes (App Router)
    globals.css              # tokens de thème + composants signature
    go/[tool]/route.ts       # P2 · redirection affiliée + événement Plausible
    (comparatifs)/…          # P4 · /logiciel-caisse-restaurant, etc.
    (etablissements)/…       # P4 · /caisse-food-truck, etc.
    avis/[tool]/             # P4 · avis par outil
    calculateur-cout-caisse/ # P3
    guides/[slug]/           # P5 · articles
    mise-en-relation/        # P6 · formulaire 3 étapes
    admin/leads/             # P6 · suivi des leads (protégé)
    (legal)/…                # P7 · pages légales
  components/
    ui/                      # shadcn/ui
    layout/                  # header, footer, thème
    brand/                   # élément signature (fiche technique, sceau)
    affiliate/ tools/ calculator/ leads/ seo/   # à venir
  config/site.ts             # nom, URL (valeurs entre crochets à remplir)
  config/author.ts           # parcours, chiffres clés, citation de l'auteur (faits réels uniquement)
  data/tools.ts              # P2 · SEULE source des données outils (remplie par le propriétaire)
  lib/
    regulatory.ts            # P2 · SEULE source des affirmations réglementaires
    cost/                    # P3 · calculs purs + tests
    theme.ts utils.ts …
```

## Règles transversales (non négociables)

1. **Transparence.** Bandeau en haut de chaque page de comparaison, **avant tout classement** :
   le site perçoit des commissions, elles n'influencent pas le classement. Mention « lien
   partenaire » à côté de **chaque** bouton affilié. Liens affiliés en `rel="sponsored noopener"`,
   toujours via `/go/[tool]` (bloqué dans `robots.txt`).
2. **Zéro donnée inventée.** Aucun prix, commission, taux, engagement ou fonctionnalité écrit en
   dur ailleurs que dans `src/data/tools.ts`, que le propriétaire remplit lui-même. Valeur factice
   = commentaire `// PLACEHOLDER` + `isPlaceholder: true`. Effet : avertissement visible en
   développement et en preview ; **le build de production échoue** (`VERCEL_ENV=production`, ou
   `NODE_ENV=production` hors Vercel). Même règle pour les articles marqués placeholder.
3. **Réglementaire centralisé.** Toute affirmation réglementaire (certification des caisses,
   facturation électronique, titres-restaurant…) vit dans `src/lib/regulatory.ts` avec une
   **source** et une **date de vérification**. Les pages l'importent, ne la réécrivent jamais.
   Claude n'écrit pas de contenu réglementaire de lui-même : il crée l'entrée marquée
   « À VÉRIFIER » et le propriétaire la valide.
4. **Parcours de l'auteur vérifiable.** Nombre d'établissements, CA, années, postes : uniquement
   des faits réels, centralisés dans `src/config/author.ts`. Claude n'invente jamais ces chiffres
   (pratique commerciale trompeuse) : il laisse des crochets `[N]`, `[X] M€`. `isPlaceholder: true`
   bloque le build de production comme pour les outils.
5. **Fraîcheur affichée.** Chaque outil affiche publiquement sa date de dernière vérification.

Décisions prises :

- Le calculateur (P3) compare des offres « caisse + encaissement » (abonnement + matériel +
  commission carte), car la commission vient surtout du TPE.
- Outils en apport d'affaires (sans lien d'affiliation) : le bouton mène au formulaire
  `/mise-en-relation`, jamais à `/go/`.
- Aucune transmission automatique de lead : validation manuelle par le propriétaire.

## Conventions de code

- Server Components par défaut ; `"use client"` seulement pour l'interactivité.
- Logique métier = fonctions pures dans `src/lib/`, testées avec Vitest (`*.test.ts` à côté du
  fichier). Les pages ne font qu'afficher.
- Imports via l'alias `@/`. `import type` pour les types (règle ESLint).
- Noms de fichiers en kebab-case, composants en PascalCase, URL publiques en français.
- Pas de couleur en dur dans les composants : utiliser les tokens (`bg-canvas`, `bg-surface`,
  `text-ink`, `text-ink-muted`, `text-brass`, `text-go`, `border-line`, `night`) ou ceux de shadcn.
- **Aucune nouvelle dépendance sans l'annoncer au propriétaire** (nom + raison) avant
  l'installation.
- Performance : Lighthouse mobile > 95. Polices via `next/font` (auto-hébergées), pas de script
  tiers bloquant, graphiques en SVG maison.
- Accessibilité : contrastes WCAG AA minimum, cibles tactiles ≥ 44 px, focus visible, tout
  fonctionne à 360 px de large, tableaux dans un conteneur à défilement horizontal.

## Direction visuelle — « Ardoise & Laiton », version lumineuse

Inspiration : sites tech sombres à cadres néon (grille de points, maquettes d'écrans qui
brillent), traduits en ardoise et laiton. Haut de gamme, moderne, qui inspire confiance.

| Token           | Clair     | Sombre    | Usage                                  |
| --------------- | --------- | --------- | -------------------------------------- |
| `--canvas`      | `#f4f3ef` | `#0b0f14` | fond de page                           |
| `--surface`     | `#ffffff` | `#131a22` | cartes                                 |
| `--ink`         | `#0e1318` | `#eceae4` | texte                                  |
| `--ink-muted`   | `#4a5260` | `#9aa3ae` | texte secondaire                       |
| `--brass`       | `#7a5c24` | `#d2b07a` | accent, surtitres, focus               |
| `--go`          | `#2e6b4a` | `#7cc39b` | validé / positif                       |
| `--line`        | `#dcd9d1` | `#222b35` | filets                                 |
| `--night`       | `#0e1318` | `#070a0e` | bandeaux sombres (en-tête, hero, pied) |
| `--night-steel` | `#8fa3b8` | idem      | second ton des dégradés lumineux       |

- Les bandeaux `.night` (en-tête, hero, parcours, pied de page) restent sombres dans les deux
  modes, avec leurs tokens `--night-ink`, `--night-muted`, `--night-brass`, `--night-line`.
- Effets (tous en CSS, sans image ni JS) : `.dot-grid` (grille de points estompée), `.aura`
  (halo laiton/inox), `.glow-frame` (bordure dégradé laiton → inox + halo), `.screen` /
  `.screen-bar` / `.skeleton` / `.pill-glow` (maquettes d'écran), `.floor` (reflet),
  `.text-shine` (texte en dégradé), `.btn-glow` / `.btn-ghost` (boutons),
  `.scroll-progress` (barre de lecture sous l'en-tête, `animation-timeline`).
- Les maquettes (`src/components/brand/hero-visual.tsx`) sont décoratives (`aria-hidden`) :
  squelettes et icônes uniquement, **jamais de chiffre ni d'interface d'un outil réel**.
- Typographies : **Instrument Serif** (h1, h2), **Geist** (texte, h3 en 600), **Geist Mono**
  (prix, taux, dates, surtitres `.eyebrow`).
- Thème : préférence système par défaut, forçable via `data-theme` sur `<html>` (bouton en
  en-tête, mémorisé en `localStorage`, appliqué avant le premier rendu par un script inline).
  Les variables sombres sont déclarées **deux fois** dans `globals.css` (media query + attribut) :
  un test Vitest vérifie qu'elles restent identiques.
- Composants signature (`src/components/brand/`) : `SpecCard` (fiche technique, bordure en
  dégradé et halo), `Seal` (sceau lumineux), `HeroVisual`, classe `.spec-line`.

## Ton éditorial

Direct, concret, vocabulaire du métier, phrases courtes. On parle à un pro qui lit sur son
téléphone entre le service du midi et la mise en place du soir. L'auteur parle à la première
personne quand il raconte son vécu (« je l'ai vu tourner un samedi soir »), au « nous » pour la
méthode.

- ✅ « La box lâche en plein service : on encaisse toujours, ou on sort le carnet ? »
- ✅ « Un extra arrivé à 19 h doit encaisser seul à 20 h. »
- ❌ « Découvrez notre sélection des meilleures solutions innovantes pour digitaliser votre
  établissement. »
- Vocabulaire : coup de feu, envoi, bon, passe, extra, couverts, rotation, mise en place, coupure.
- Toujours dire ce qui coince (points de vigilance), pas seulement les points forts.
- Vouvoiement du lecteur. Pas de superlatifs non étayés, pas de « meilleur » sans critère.

## Environnement (sessions cloud Claude Code)

- Le registre shadcn (`ui.shadcn.com`) est bloqué par la politique réseau de l'environnement
  cloud : `shadcn init/add` échoue. shadcn a été configuré à la main (`components.json`,
  `src/lib/utils.ts`, tokens dans `globals.css`). Pour ajouter un composant, reprendre le code
  source officiel du composant dans `src/components/ui/` et annoncer ses dépendances Radix.
- `plausible.io` est aussi bloqué depuis l'environnement cloud (sans impact en production).

## Avancement

- [x] Phase 1 — Fondations (outillage, CLAUDE.md, direction visuelle « Ardoise & Laiton », thème clair/sombre)
- [ ] Phase 2 — Modèle de données et liens d'affiliation
- [ ] Phase 3 — Calculateur de coût réel
- [ ] Phase 4 — Pages comparatif et avis
- [ ] Phase 5 — Articles MDX et SEO
- [ ] Phase 6 — Formulaire de mise en relation
- [ ] Phase 7 — Pages légales
