import { Seal, SpecCard } from "@/components/brand/spec-card";

const fieldCriteria = [
  {
    ref: "N° 01",
    title: "Rapidité en coup de feu",
    body: "Combien de touches pour envoyer une table de six ? Ça rame quand ça bouchonne ?",
  },
  {
    ref: "N° 02",
    title: "Prise en main par un extra",
    body: "Un extra arrivé à 19 h doit encaisser seul à 20 h. Sinon, c'est non.",
  },
  {
    ref: "N° 03",
    title: "Coupure internet",
    body: "La box lâche en plein service : on encaisse toujours, ou on sort le carnet ?",
  },
  {
    ref: "N° 04",
    title: "Tickets lisibles en cuisine",
    body: "Gros caractères, modifs en évidence, ordre d'envoi clair. Lu d'un coup d'œil.",
  },
] as const;

const commitments = [
  "Méthode de classement publique",
  "Rémunération déclarée sur chaque page",
  "Date de vérification sur chaque outil",
] as const;

const categories = [
  "Logiciels de caisse",
  "Terminaux de paiement",
  "Réservation en ligne",
  "Commande en ligne",
] as const;

export default function Home() {
  return (
    <>
      <section aria-labelledby="titre" className="night night-grid border-b border-night-line">
        <div className="mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 sm:pt-24 sm:pb-24">
          <p className="eyebrow text-night-brass">Testé en service, pas en salle de démo</p>
          <h1 id="titre" className="mt-5 max-w-3xl text-5xl sm:text-7xl">
            Caisse, TPE, réservation&nbsp;: choisir sans se tromper.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-night-muted">
            Écrit par un cuisinier en poste. Des critères pensés pour le coup de feu, des coûts
            calculés sur la durée, et on vous dit ce qui coince.
          </p>
          <ul className="mt-10 flex flex-col gap-3 border-t border-night-line pt-6 text-sm text-night-muted sm:flex-row sm:gap-8">
            {commitments.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-night-brass" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <section aria-labelledby="criteres">
          <p className="eyebrow text-brass">Notre méthode</p>
          <h2 id="criteres" className="mt-3 text-4xl sm:text-5xl">
            Ce qu&apos;on vérifie avant de recommander
          </h2>
          <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {fieldCriteria.map((c) => (
              <li key={c.ref} className="w-72 shrink-0 snap-start sm:w-auto">
                <SpecCard reference={c.ref} className="h-full">
                  <h3 className="text-lg">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.body}</p>
                </SpecCard>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="categories" className="mt-20">
          <p className="eyebrow text-brass">Comparatifs</p>
          <h2 id="categories" className="mt-3 text-4xl sm:text-5xl">
            Les outils du service
          </h2>
          <SpecCard reference="Au sommaire" meta={<Seal>Bientôt</Seal>} className="mt-10 max-w-xl">
            <ul className="space-y-3">
              {categories.map((label) => (
                <li key={label} className="spec-line">
                  <span>{label}</span>
                  <span className="text-xs text-ink-muted">en préparation</span>
                </li>
              ))}
            </ul>
          </SpecCard>
        </section>
      </div>
    </>
  );
}
