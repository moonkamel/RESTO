import { DisclosureBanner } from "@/components/affiliate/disclosure-banner";
import { RegulatoryNotes } from "@/components/comparison/regulatory-notes";
import { CostCalculator } from "@/components/calculator/cost-calculator";
import { tools } from "@/data/tools";
import { calculatorToolsFrom } from "@/lib/cost/cost";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CALCULATOR_PATH } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Abonnement ou commission : quelle caisse vous coûte le moins ?",
  description:
    "Calculez le coût réel de votre caisse et de votre terminal de paiement sur 12, 24 ou 36 mois : abonnement, matériel et frais carte, selon votre CA.",
  path: CALCULATOR_PATH,
});

const method = [
  {
    title: "Abonnement",
    body: "Prix du premier poste + prix de chaque poste supplémentaire, multipliés par la durée. En € HT.",
  },
  {
    title: "Matériel",
    body: "Prix d'achat par poste équipé, payé une fois. 0 € si le matériel est fourni.",
  },
  {
    title: "Frais carte",
    body: "CA payé par carte × taux de commission, + nombre de transactions (CA carte ÷ ticket moyen) × frais fixes, sur la durée.",
  },
  {
    title: "Point de bascule",
    body: "Le CA mensuel à partir duquel l'offre avec abonnement la moins chère coûte moins que l'offre à la commission la moins chère (ou l'inverse).",
  },
] as const;

export default function CalculatorPage() {
  return (
    <>
      <section aria-labelledby="titre" className="night dot-grid">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-14 sm:px-6">
          <Breadcrumbs
            crumbs={[
              { name: "Accueil", path: "/" },
              { name: "Calculateur", path: CALCULATOR_PATH },
            ]}
          />
          <p className="eyebrow mt-6 text-night-brass">Calculateur</p>
          <h1 id="titre" className="mt-4 max-w-3xl text-4xl sm:text-6xl">
            Abonnement ou commission&nbsp;:{" "}
            <span className="text-shine">quelle caisse vous coûte le moins&nbsp;?</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-night-muted">
            Votre CA, votre part carte, vos postes. On calcule le coût réel sur la durée,
            abonnement, matériel et frais carte compris.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
        <DisclosureBanner />
        <CostCalculator tools={calculatorToolsFrom(tools)} />

        <section aria-labelledby="methode" className="pt-8">
          <p className="eyebrow text-brass">Comment on calcule</p>
          <h2 id="methode" className="mt-3 text-3xl sm:text-4xl">
            Le calcul, ligne par ligne
          </h2>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {method.map((m) => (
              <div key={m.title} className="spec-card">
                <dt className="font-semibold">{m.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{m.body}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-3xl text-sm text-ink-muted">
            Tous les montants sont comparés hors TVA. Ce que le calcul n&apos;inclut pas : frais
            d&apos;installation ou de formation, options, frais de résiliation, location du
            matériel, commissions sur les titres-restaurant. Lisez toujours le contrat avant de
            signer.
          </p>
        </section>

        <RegulatoryNotes topics={["tva-frais-encaissement"]} />
      </div>
    </>
  );
}
