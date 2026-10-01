import {
  ArrowRight,
  Calculator,
  CalendarCheck,
  CreditCard,
  ReceiptText,
  ShoppingBag,
  Store,
  Users,
  WifiOff,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { HeroVisual } from "@/components/brand/hero-visual";
import { SpecCard } from "@/components/brand/spec-card";
import { author } from "@/config/author";
import { AUTHOR_PATH, CALCULATOR_PATH, CATEGORY_PATHS } from "@/lib/routes";

const fieldCriteria = [
  {
    ref: "N° 01",
    icon: Zap,
    title: "Rapidité en coup de feu",
    body: "Combien de touches pour envoyer une table de six ? Ça rame quand ça bouchonne ?",
  },
  {
    ref: "N° 02",
    icon: Users,
    title: "Prise en main par un extra",
    body: "Un extra arrivé à 19 h doit encaisser seul à 20 h. Sinon, c'est non.",
  },
  {
    ref: "N° 03",
    icon: WifiOff,
    title: "Coupure internet",
    body: "La box lâche en plein service : on encaisse toujours, ou on sort le carnet ?",
  },
  {
    ref: "N° 04",
    icon: ReceiptText,
    title: "Tickets lisibles en cuisine",
    body: "Gros caractères, modifs en évidence, ordre d'envoi clair. Lu d'un coup d'œil.",
  },
] as const;

const categories = [
  {
    icon: Store,
    href: CATEGORY_PATHS.caisse,
    title: "Logiciels de caisse",
    body: "Abonnement, matériel, multi-sites, mode hors ligne.",
  },
  {
    icon: CreditCard,
    href: CATEGORY_PATHS.paiement,
    title: "Terminaux de paiement",
    body: "Commission carte, location ou achat, titres-restaurant.",
  },
  {
    icon: CalendarCheck,
    href: CATEGORY_PATHS.reservation,
    title: "Réservation en ligne",
    body: "No-show, acompte, commission par couvert.",
  },
  {
    icon: ShoppingBag,
    href: CATEGORY_PATHS["commande-en-ligne"],
    title: "Commande en ligne",
    body: "Click & collect, livraison, intégration caisse.",
  },
] as const;

const commitments = [
  "Méthode de classement publique",
  "Rémunération déclarée sur chaque page",
  "Date de vérification sur chaque outil",
] as const;

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="titre" className="night dot-grid overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-night-brass">Par un restaurateur, pour les restaurateurs</p>
            <h1 id="titre" className="mt-5 text-5xl sm:text-7xl">
              Les outils qui <span className="text-shine">tiennent le coup de feu.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-night-muted">{author.pitch}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#comparatifs" className="btn-glow">
                Voir les comparatifs <ArrowRight aria-hidden className="size-4" />
              </a>
              <Link href={AUTHOR_PATH} className="btn-ghost">
                Mon parcours
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <HeroVisual />
          </div>

          <dl className="mx-auto mt-16 grid max-w-4xl gap-6 border-t border-night-line pt-10 text-center sm:grid-cols-3">
            {author.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="text-shine block font-serif text-5xl">{s.value}</span>
                  <span className="mt-2 block text-sm text-night-muted">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        {/* Méthode */}
        <section id="methode" aria-labelledby="methode-titre" className="scroll-mt-24">
          <p className="eyebrow text-brass">Notre méthode</p>
          <h2 id="methode-titre" className="mt-3 max-w-2xl text-4xl sm:text-5xl">
            Testé en service, pas en salle de démo
          </h2>
          <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-1 pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {fieldCriteria.map(({ ref, icon: Icon, title, body }) => (
              <li key={ref} className="w-72 shrink-0 snap-start sm:w-auto">
                <SpecCard
                  reference={ref}
                  meta={<Icon aria-hidden className="size-5 text-brass" />}
                  className="h-full"
                >
                  <h3 className="text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
                </SpecCard>
              </li>
            ))}
          </ul>
        </section>

        {/* Comparatifs */}
        <section
          id="comparatifs"
          aria-labelledby="comparatifs-titre"
          className="mt-24 scroll-mt-24"
        >
          <p className="eyebrow text-brass">Comparatifs</p>
          <h2 id="comparatifs-titre" className="mt-3 text-4xl sm:text-5xl">
            Les outils du service
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {categories.map(({ icon: Icon, href, title, body }) => (
              <li key={title}>
                <Link href={href} className="group block h-full">
                  <SpecCard className="flex h-full gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line text-brass">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="flex items-center justify-between gap-2 text-lg group-hover:text-brass">
                        {title}
                        <ArrowRight aria-hidden className="size-4 text-brass" />
                      </h3>
                      <p className="mt-1.5 text-sm text-ink-muted">{body}</p>
                    </div>
                  </SpecCard>
                </Link>
              </li>
            ))}
          </ul>

          <SpecCard id="calculateur" className="mt-4 scroll-mt-24">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line text-brass">
                <Calculator aria-hidden className="size-5" />
              </span>
              <div className="flex-1">
                <h3 className="text-lg">
                  Abonnement ou commission : quelle caisse vous coûte le moins ?
                </h3>
                <p className="mt-1.5 text-sm text-ink-muted">
                  Votre CA, votre part carte, votre nombre de postes : le coût réel sur 12, 24 ou 36
                  mois.
                </p>
              </div>
              <Link href={CALCULATOR_PATH} className="btn-glow self-start sm:self-center">
                Faire le calcul <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </SpecCard>
        </section>
      </div>

      {/* Parcours */}
      <section
        id="parcours"
        aria-labelledby="parcours-titre"
        className="night dot-grid scroll-mt-16"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow text-night-brass">Le parcours</p>
            <h2 id="parcours-titre" className="mt-3 text-4xl sm:text-5xl">
              Du passe au bureau, <span className="text-shine">sans quitter le terrain.</span>
            </h2>
            <figure className="glow-frame mt-10 rounded-2xl p-6">
              <blockquote className="font-serif text-2xl leading-snug text-night-ink">
                «&nbsp;{author.quote}&nbsp;»
              </blockquote>
              <figcaption className="mt-4 text-sm text-night-muted">
                <span className="text-night-ink">{author.name}</span> — {author.role}
              </figcaption>
            </figure>
          </div>

          <ol className="relative space-y-10 border-l border-night-line pl-8">
            {author.milestones.map((m) => (
              <li key={m.title} className="relative">
                <span
                  aria-hidden
                  className="absolute top-1.5 -left-[2.3rem] size-2.5 rounded-full bg-night-brass shadow-[0_0_12px_var(--night-brass)]"
                />
                <p className="eyebrow text-night-brass">{m.period}</p>
                <h3 className="mt-2 text-xl text-night-ink">{m.title}</h3>
                <p className="mt-2 leading-relaxed text-night-muted">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Engagements */}
      <section aria-label="Nos engagements" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="flex flex-col gap-3 text-sm text-ink-muted sm:flex-row sm:justify-center sm:gap-10">
          {commitments.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <span aria-hidden className="size-1.5 rounded-full bg-brass" />
              {c}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
