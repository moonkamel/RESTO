import { Stamp, Ticket, TicketRail } from "@/components/ticket/ticket";

const fieldCriteria = [
  {
    ref: "Critère 01",
    title: "Rapidité en coup de feu",
    body: "Combien de touches pour envoyer une table de six ? Ça rame quand ça bouchonne ?",
  },
  {
    ref: "Critère 02",
    title: "Prise en main par un extra",
    body: "Un extra arrivé à 19 h doit encaisser seul à 20 h. Sinon, c'est non.",
  },
  {
    ref: "Critère 03",
    title: "Coupure internet",
    body: "La box lâche en plein service : on encaisse toujours, ou on sort le carnet ?",
  },
  {
    ref: "Critère 04",
    title: "Tickets lisibles en cuisine",
    body: "Gros caractères, modifs en évidence, ordre d'envoi clair. Lu d'un coup d'œil.",
  },
] as const;

const categories = [
  "Logiciels de caisse",
  "Terminaux de paiement",
  "Réservation en ligne",
  "Commande en ligne",
] as const;

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
      <section aria-labelledby="titre" className="max-w-2xl">
        <p className="font-mono text-xs tracking-widest text-stamp uppercase">
          Testé en service, pas en salle de démo
        </p>
        <h1 id="titre" className="mt-3 text-4xl sm:text-6xl">
          Caisse, TPE, résa, commande en ligne&nbsp;: choisir sans se planter.
        </h1>
        <p className="mt-5 text-lg text-ink-muted">
          Écrit par un cuisinier en poste. Des critères pensés pour le coup de feu, des coûts
          calculés sur la durée, et on vous dit ce qui coince.
        </p>
      </section>

      <section aria-labelledby="criteres" className="mt-14">
        <h2 id="criteres" className="text-2xl sm:text-3xl">
          Ce qu&apos;on vérifie avant de recommander
        </h2>
        <TicketRail className="mt-6">
          <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {fieldCriteria.map((c) => (
              <li key={c.ref} className="w-64 shrink-0 snap-start sm:w-auto">
                <Ticket reference={c.ref} className="h-full">
                  <h3 className="text-xl">{c.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{c.body}</p>
                </Ticket>
              </li>
            ))}
          </ul>
        </TicketRail>
      </section>

      <section aria-labelledby="categories" className="mt-14">
        <h2 id="categories" className="text-2xl sm:text-3xl">
          Les comparatifs
        </h2>
        <Ticket reference="Au menu" meta={<Stamp>Bientôt</Stamp>} className="mt-6 max-w-md">
          <ul className="space-y-2">
            {categories.map((label) => (
              <li key={label} className="ticket-line">
                <span>{label}</span>
                <span className="text-xs text-ink-muted">en préparation</span>
              </li>
            ))}
          </ul>
        </Ticket>
      </section>
    </div>
  );
}
