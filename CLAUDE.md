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

- Next.js 16 (App Router), React 19, TypeScript strict (+ `noUncheckedIndexedAccess`), pnpm,
  `"type": "module"`
- Tailwind CSS v4 (config dans `src/app/globals.css`, pas de `tailwind.config`)
- shadcn/ui (style new-york, base Radix) — voir « Environnement » pour l'ajout de composants
- content-collections pour les articles MDX (phase 5)
- Zod 4 pour la validation des données
- Supabase pour les leads (phase 6)
- Plausible pour l'analytics (événements serveur via l'API Events)
- Vitest pour les tests, ESLint (config Next + Prettier), Prettier (+ plugin Tailwind)
- Déploiement Vercel. Node ≥ 22.

> Le Next.js installé peut différer de tes connaissances : lis `node_modules/next/dist/docs/`
> avant d'utiliser une API (voir `AGENTS.md`).

## Commandes

```bash
pnpm dev            # serveur de dev
pnpm build          # check:content puis next build
pnpm check:content  # valide les données + garde-fou placeholders (BLOCK_PLACEHOLDERS=true pour tester le blocage)
pnpm check          # lint + typecheck + format:check + test (à lancer avant chaque commit)
pnpm test           # Vitest
pnpm typecheck      # next typegen && tsc --noEmit
pnpm format         # Prettier
```

La CI GitHub Actions (`.github/workflows/ci.yml`) lance `pnpm check` puis `pnpm build`.

## Arborescence

```
content/articles/            # P5 · articles MDX
scripts/check-content.ts     # garde-fou lancé avant next build (exécuté par Node, sans build)
supabase/migrations/         # P6 · schéma + RLS
src/
  app/                       # routes (App Router)
    globals.css              # tokens de thème + composants signature
    go/[tool]/route.ts       # P2 · redirection affiliée + événement Plausible
    logiciel-caisse-restaurant/ terminal-paiement-restaurant/
    reservation-en-ligne-restaurant/ commande-en-ligne-restaurant/   # comparatifs (gabarit commun)
    caisse-food-truck/ caisse-brasserie/ caisse-boulangerie/ caisse-multi-sites/
    avis/[tool]/             # avis par outil (statique, generateStaticParams)
    auteur/                  # page auteur (parcours, adresses, protocole de test)
    calculateur-cout-caisse/ # calculateur abonnement / commission
    guides/[slug]/           # P5 · articles
    mise-en-relation/        # P6 · formulaire 3 étapes
    admin/leads/             # P6 · suivi des leads (protégé)
    (legal)/…                # P7 · pages légales
  components/
    ui/                      # shadcn/ui
    layout/                  # header, footer, thème
    brand/                   # élément signature (fiche technique, sceau)
    affiliate/               # ToolCta, DisclosureBanner
    calculator/              # CostCalculator (client), CostChart
    comparison/              # ComparisonPage (gabarit), RankingMethod, RegulatoryNotes, RelatedPages
    tools/                   # ToolCard, ComparisonTable, FieldTestBox, ScoreMeter, badges
    leads/ seo/              # à venir
  content/
    comparison-pages.ts      # textes éditoriaux des 8 pages (jamais de prix ni de taux : testé)
    navigation.ts            # menus et pied de page
  config/site.ts             # nom, URL (valeurs entre crochets à remplir)
  config/author.ts           # parcours, chiffres clés, citation de l'auteur (faits réels uniquement)
  data/tools.ts              # SEULE source des données outils (remplie par le propriétaire)
  data/tools.schema.ts       # type RestaurantTool + schéma Zod (unités documentées)
  lib/
    regulatory.ts            # SEULE source des affirmations réglementaires
    affiliate.ts             # URL d'affiliation (env), CTA selon le programme partenaire
    go-redirect.ts           # logique de /go/[tool] ; plausible.ts : API Events
    content-guard.ts         # détection des placeholders, mode strict
    cost/cost.ts             # calculateur : coûts, classement, point de bascule (testé à la main)
    format.ts                # € et dates en français
    routes.ts                # chemins internes partagés (jamais exportés d'un module client)
    theme.ts utils.ts …
```

## Règles transversales (non négociables)

1. **Transparence.** Bandeau en haut de chaque page de comparaison, **avant tout classement** :
   le site perçoit des commissions, elles n'influencent pas le classement. Mention « lien
   partenaire » à côté de **chaque** bouton affilié. Liens affiliés en `rel="sponsored noopener"`,
   toujours via `/go/[tool]` (bloqué dans `robots.txt`).
2. **Zéro donnée inventée.** Aucun prix, commission, taux, engagement ou fonctionnalité écrit en
   dur ailleurs que dans `src/data/tools.ts`, que le propriétaire remplit lui-même. Valeur factice
   = commentaire `// PLACEHOLDER` + `isPlaceholder: true`. Effet : bandeau « Brouillon » en
   développement et en preview ; **le build de production échoue** (`VERCEL_ENV=production` ou
   `BLOCK_PLACEHOLDERS=true`), tout comme un outil en affiliation sans `AFFILIATE_URL_<SLUG>`.
   Les builds locaux et CI passent avec avertissement. Même règle pour auteur, réglementaire et
   articles.
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

- Le calculateur compare les offres des catégories `caisse` et `paiement` : abonnement (1er poste
  - postes supplémentaires) + matériel par poste + frais carte (taux % + frais fixes par
    transaction). Une caisse sans paiement intégré n'est comparée que si l'utilisateur saisit son
    taux carte actuel. Le classement ne dépend QUE du coût calculé.
- Outils en apport d'affaires (sans lien d'affiliation) : le bouton mène au formulaire
  `/mise-en-relation`, jamais à `/go/`.
- Aucune transmission automatique de lead : validation manuelle par le propriétaire.

## Classement éditorial (pages comparatif et établissement)

- Note terrain = moyenne des critères « Testé en service » notés (1 à 5, `null` = sans objet),
  arrondie au dixième (`src/lib/ranking.ts`). Outils non testés (`fieldTest: null`) classés
  après. Égalité : vérification la plus récente, puis ordre alphabétique.
- Le programme partenaire n'intervient JAMAIS dans le classement. La règle est affichée par
  `<RankingMethod />` (« Comment on classe ») sur chaque page comparatif et sur la page auteur.
- Toute page qui classe des outils commence par `<DisclosureBanner />`, avant le classement.
- Pages établissement : caisses ET terminaux (`caisse` + `paiement`) du type concerné ;
  multi-sites = caisses avec `multiSite: true`.
- Tableaux : `<ComparisonTable />` dans une zone à défilement horizontal focalisable, première
  colonne figée. Chaque outil affiche sa date de vérification (`<VerifiedDate />`).

## Calculateur

- Formules : `coût = fixe + pente × CA mensuel`, avec
  `fixe = (abonnement + poste supp. × (postes − 1)) × mois + matériel × postes` et
  `pente = mois × part carte × (taux + frais fixes / ticket moyen)`. Frais carte hors TVA,
  abonnement et matériel HT. Toute modification de formule = nouveau cas vérifié à la main dans
  `cost.test.ts` (calcul écrit en commentaire).
- Point de bascule : CA où l'offre à la commission la moins chère et l'offre avec abonnement
  (abonnement ou mixte) la moins chère coûtent autant.
- Résultat : recommandation + « Voir l'offre » (affiliation) + « Être rappelé par l'éditeur »
  (formulaire) ; pas de bouton si `partnerProgram: "aucun"`.
- Graphique : barres empilées, couleurs `--chart-1..3` validées par le script de la skill
  dataviz (daltonisme + contraste, clair et sombre). Le tableau de détail est la version
  accessible.

## Liens partenaires et analytics

- Une variable `AFFILIATE_URL_<SLUG>` par outil en affiliation (slug en majuscules, `-` → `_`),
  https obligatoire. Liste documentée dans `.env.example` : la tenir à jour à chaque outil ajouté.
- Les boutons passent toujours par `<ToolCta tool fromPath />` (`src/components/affiliate/`) :
  affiliation → `/go/<slug>?from=<page>` avec `rel="sponsored noopener"` et « Lien partenaire » ;
  apport d'affaires → `/mise-en-relation?outil=<slug>` avec « Mise en relation rémunérée » ;
  aucun → pas de bouton.
- `/go/[tool]` : 302 vers l'URL partenaire, 404 sinon, `noindex` + `no-store`. L'événement
  Plausible « Affiliate Click » (props `tool`, `page`) part via `after()` : la redirection
  n'attend jamais l'analytics.

## Conventions de code

- Server Components par défaut ; `"use client"` seulement pour l'interactivité.
- Logique métier = fonctions pures dans `src/lib/`, testées avec Vitest (`*.test.ts` à côté du
  fichier). Les pages ne font qu'afficher.
- Imports via l'alias `@/`. `import type` pour les types (règle ESLint).
- **Exception** : les modules lus par `scripts/check-content.ts` (`src/data/*`, `src/config/*`,
  `src/lib/regulatory.ts`, `affiliate.ts`, `content-guard.ts` et leurs dépendances) sont
  exécutés directement par Node : imports relatifs avec extension `.ts`, pas d'alias, pas de
  syntaxe TypeScript non effaçable (enum, namespace). `pnpm check:content` le vérifie.
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
- Thème : **sombre par défaut** (décision du propriétaire, ne suit pas la préférence système).
  Le mode clair s'active via le bouton (`data-theme="light"` sur `<html>`, mémorisé en
  `localStorage`, appliqué avant le premier rendu par un script inline). Variante Tailwind
  `dark:` = « pas en mode clair ».
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
- [x] Phase 2 — Modèle de données et liens d'affiliation
- [x] Phase 3 — Calculateur de coût réel
- [x] Phase 4 — Pages comparatif et avis
- [ ] Phase 5 — Articles MDX et SEO
- [ ] Phase 6 — Formulaire de mise en relation
- [ ] Phase 7 — Pages légales
