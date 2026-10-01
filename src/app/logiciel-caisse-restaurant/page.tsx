import { ComparisonPage, comparisonMetadata } from "@/components/comparison/comparison-page";
import { CATEGORY_PAGES } from "@/content/comparison-pages";

const page = CATEGORY_PAGES.caisse;

export const metadata = comparisonMetadata(page);

export default function LogicielCaissePage() {
  return <ComparisonPage page={page} />;
}
