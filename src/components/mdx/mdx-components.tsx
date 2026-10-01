import type { ComponentProps } from "react";
import { CostCalculator as Calculator } from "@/components/calculator/cost-calculator";
import { RegulatoryNotes } from "@/components/comparison/regulatory-notes";
import { ComparisonTable as Table } from "@/components/tools/comparison-table";
import { FieldTestBox as FieldTest } from "@/components/tools/field-test-box";
import { ToolCard as Card } from "@/components/tools/tool-card";
import { getToolBySlug, tools } from "@/data/tools";
import { CATEGORY_LABELS, type EstablishmentType, type ToolCategory } from "@/data/tools.schema";
import { calculatorToolsFrom } from "@/lib/cost/cost";
import { rankTools } from "@/lib/ranking";
import type { RegulatoryTopic } from "@/lib/regulatory";

/*
 * Composants utilisables dans les articles MDX. Ils lisent toujours src/data/tools.ts :
 * un article ne contient jamais de prix en dur. Un slug inconnu fait échouer le build.
 */

function requireTool(slug: string) {
  const tool = getToolBySlug(slug);
  if (!tool) throw new Error(`Article MDX : outil inconnu « ${slug} » (src/data/tools.ts)`);
  return tool;
}

export function articleComponents(fromPath: string) {
  return {
    /** <CostCalculator /> : le calculateur abonnement ou commission. */
    CostCalculator: () => (
      <div className="not-prose my-10">
        <Calculator tools={calculatorToolsFrom(tools)} fromPath={fromPath} />
      </div>
    ),

    /** <ComparisonTable category="caisse" establishment="brasserie" /> ou slugs={["a", "b"]}. */
    ComparisonTable: ({
      category,
      establishment,
      slugs,
    }: {
      category?: ToolCategory;
      establishment?: EstablishmentType;
      slugs?: string[];
    }) => {
      const selected = slugs
        ? slugs.map(requireTool)
        : tools.filter(
            (t) =>
              (!category || t.category === category) &&
              (!establishment || t.establishmentTypes.includes(establishment)),
          );
      const label = category ? CATEGORY_LABELS[category] : "Outils";
      return (
        <div className="not-prose my-8">
          <Table tools={rankTools(selected)} caption={`${label} : tableau comparatif`} />
        </div>
      );
    },

    /** <ToolCard slug="..." /> */
    ToolCard: ({ slug }: { slug: string }) => (
      <div className="not-prose my-8 max-w-xl">
        <Card tool={requireTool(slug)} rank={1} fromPath={fromPath} showRank={false} />
      </div>
    ),

    /** <FieldTestBox slug="..." /> : le bloc « Testé en service ». */
    FieldTestBox: ({ slug }: { slug: string }) => (
      <div className="not-prose my-8">
        <FieldTest tool={requireTool(slug)} headingLevel="h3" />
      </div>
    ),

    /** <RegulatoryNote topic="certification-caisse" /> : lit src/lib/regulatory.ts. */
    RegulatoryNote: ({ topic }: { topic: RegulatoryTopic }) => (
      <div className="not-prose my-8">
        <RegulatoryNotes topics={[topic]} compact />
      </div>
    ),

    a: (props: ComponentProps<"a">) => {
      const external = props.href?.startsWith("http");
      return <a {...props} {...(external ? { rel: "noopener", target: "_blank" } : {})} />;
    },
  };
}
