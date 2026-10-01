import { ComparisonPage, comparisonMetadata } from "@/components/comparison/comparison-page";
import { CATEGORY_PAGES } from "@/content/comparison-pages";

const page = CATEGORY_PAGES["commande-en-ligne"];

export const metadata = comparisonMetadata(page);

export default function CommandeEnLignePage() {
  return <ComparisonPage page={page} />;
}
