import { MapPin } from "lucide-react";
import { RankingMethod } from "@/components/comparison/ranking-method";
import { author } from "@/config/author";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { AUTHOR_PATH } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: `${author.name}, ${author.role}`,
  description: `Qui teste les outils de ${siteConfig.name} : ${author.role}. Parcours, établissements et méthode de test en service.`,
  path: AUTHOR_PATH,
});

export default function AuthorPage() {
  return (
    <>
      <section aria-labelledby="titre" className="night dot-grid">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6">
          <Breadcrumbs
            crumbs={[
              { name: "Accueil", path: "/" },
              { name: "L'auteur", path: AUTHOR_PATH },
            ]}
          />
          <p className="eyebrow mt-6 text-night-brass">L&apos;auteur</p>
          <h1 id="titre" className="mt-4 text-5xl sm:text-7xl">
            {author.name}
          </h1>
          <p className="mt-3 text-xl text-night-muted">{author.role}</p>
          <dl className="mt-12 grid gap-6 border-t border-night-line pt-10 sm:grid-cols-3">
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

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-14 sm:px-6 sm:py-20">
        <section aria-labelledby="histoire" className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div>
            <p className="eyebrow text-brass">Mon histoire</p>
            <h2 id="histoire" className="mt-3 text-4xl sm:text-5xl">
              Du passe au bureau
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed">
              {author.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <figure className="spec-card mt-10">
              <blockquote className="font-serif text-2xl leading-snug">
                «&nbsp;{author.quote}&nbsp;»
              </blockquote>
            </figure>
          </div>

          <ol className="relative h-fit space-y-8 border-l border-line pl-7">
            {author.milestones.map((m) => (
              <li key={m.title} className="relative">
                <span
                  aria-hidden
                  className="absolute top-1.5 -left-[2.05rem] size-2.5 rounded-full bg-brass"
                />
                <p className="eyebrow text-brass">{m.period}</p>
                <h3 className="mt-1.5">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{m.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="adresses">
          <p className="eyebrow text-brass">Mes adresses</p>
          <h2 id="adresses" className="mt-3 text-4xl sm:text-5xl">
            Là où les outils sont testés
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {author.venues.map((v, i) => (
              <li key={`${v.name}-${i}`} className="spec-card">
                <h3 className="text-lg">{v.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{v.type}</p>
                <p className="mt-3 flex items-center gap-1.5 text-sm">
                  <MapPin aria-hidden className="size-4 text-brass" />
                  {v.area} · depuis {v.since}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="protocole">
          <p className="eyebrow text-brass">Testé en service</p>
          <h2 id="protocole" className="mt-3 text-4xl sm:text-5xl">
            Comment je teste un outil
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {author.testingProtocol.map((step, i) => (
              <li key={step} className="spec-card flex gap-4">
                <span className="font-mono text-sm text-brass">0{i + 1}</span>
                <p className="leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <RankingMethod />

        <section aria-labelledby="independance" className="spec-card">
          <h2 id="independance" className="text-3xl">
            Comment le site gagne sa vie
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-muted">
            Quand vous souscrivez par un « lien partenaire », l&apos;éditeur nous verse une
            commission. Quand vous demandez à être rappelé, nous transmettons votre demande à
            l&apos;éditeur choisi, avec votre accord, et il peut nous rémunérer s&apos;il signe.
            Vous ne payez rien de plus. Ces commissions ne décident jamais d&apos;un classement : un
            outil sans partenariat peut arriver premier, et un partenaire peut être déconseillé.
          </p>
        </section>
      </div>
    </>
  );
}
