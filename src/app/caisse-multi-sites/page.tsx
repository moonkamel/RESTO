import { ComparisonPage, comparisonMetadata } from "@/components/comparison/comparison-page";
import { ESTABLISHMENT_PAGES } from "@/content/comparison-pages";

const page = ESTABLISHMENT_PAGES["multi-sites"];

export const metadata = comparisonMetadata(page);

export default function CaisseMultiSitesPage() {
  return <ComparisonPage page={page} />;
}
