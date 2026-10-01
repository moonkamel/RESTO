import { ComparisonPage, comparisonMetadata } from "@/components/comparison/comparison-page";
import { ESTABLISHMENT_PAGES } from "@/content/comparison-pages";

const page = ESTABLISHMENT_PAGES.boulangerie;

export const metadata = comparisonMetadata(page);

export default function CaisseBoulangeriePage() {
  return <ComparisonPage page={page} />;
}
