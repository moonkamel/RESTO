import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SpecCard } from "@/components/brand/spec-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PlaceholderBadge } from "@/components/tools/badges";
import { getArticles } from "@/lib/articles";
import { formatIsoDate } from "@/lib/format";
import { articlePath, GUIDES_PATH } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Guides pour restaurateurs : caisse, TPE, réservation",
  description:
    "Nos guides de terrain pour choisir et faire tourner vos outils : ouvrir un établissement, calculer le vrai coût d'une caisse, éviter les pièges des contrats.",
  path: GUIDES_PATH,
});

export default function GuidesPage() {
  const articles = getArticles();
  return (
    <>
      <section aria-labelledby="titre" className="night dot-grid">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-14 sm:px-6 sm:pb-16">
          <Breadcrumbs
            crumbs={[
              { name: "Accueil", path: "/" },
              { name: "Guides", path: GUIDES_PATH },
            ]}
          />
          <p className="eyebrow mt-6 text-night-brass">Guides</p>
          <h1 id="titre" className="mt-4 max-w-3xl text-4xl sm:text-6xl">
            Ce qu&apos;on apprend en service,{" "}
            <span className="text-shine">écrit noir sur blanc.</span>
          </h1>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <li key={a.slug} className="min-w-0">
              <Link href={articlePath(a.slug)} className="group block h-full">
                <SpecCard
                  reference={`Mis à jour le ${formatIsoDate(a.updatedAt)}`}
                  meta={a.isPlaceholder ? <PlaceholderBadge /> : undefined}
                  className="h-full"
                >
                  <h2 className="font-sans text-xl font-semibold tracking-normal group-hover:text-brass">
                    {a.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{a.description}</p>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brass">
                    Lire le guide <ArrowRight aria-hidden className="size-4" />
                  </p>
                </SpecCard>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
