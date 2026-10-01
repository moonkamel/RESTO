import { FIELD_CRITERIA, FIELD_CRITERIA_LABELS } from "@/data/tools.schema";
import { CALCULATOR_PATH } from "@/lib/routes";

/** Section « Comment on classe » : la règle de classement, publique et identique partout. */
export function RankingMethod() {
  return (
    <section
      id="comment-on-classe"
      aria-labelledby="comment-on-classe-titre"
      className="scroll-mt-24"
    >
      <p className="eyebrow text-brass">Comment on classe</p>
      <h2 id="comment-on-classe-titre" className="mt-3 text-3xl sm:text-4xl">
        Une règle, la même pour tous
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="spec-card">
          <h3>1. La note terrain</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Chaque outil passe un vrai service. On note de 1 à 5 :{" "}
            {FIELD_CRITERIA.map((c) => FIELD_CRITERIA_LABELS[c].toLowerCase()).join(", ")}. La note
            terrain est la moyenne des critères qui s&apos;appliquent.
          </p>
        </div>
        <div className="spec-card">
          <h3>2. Les non-testés après</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Un outil qu&apos;on n&apos;a pas fait tourner en service passe derrière ceux qu&apos;on
            a testés, et on l&apos;écrit. À note égale, le plus récemment vérifié passe devant.
          </p>
        </div>
        <div className="spec-card">
          <h3>3. Jamais la commission</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Qu&apos;on touche une commission ou non ne change rien à la place d&apos;un outil. Le
            calculateur, lui, classe uniquement sur le coût.{" "}
            <a href={CALCULATOR_PATH} className="text-brass underline">
              Faire le calcul
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
