import { ComparisonPage, comparisonMetadata } from "@/components/comparison/comparison-page";
import { ESTABLISHMENT_PAGES } from "@/content/comparison-pages";

const page = ESTABLISHMENT_PAGES["food-truck"];

export const metadata = comparisonMetadata(page);

export default function CaisseFoodTruckPage() {
  return <ComparisonPage page={page} />;
}
