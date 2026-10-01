import { ComparisonPage, comparisonMetadata } from "@/components/comparison/comparison-page";
import { CATEGORY_PAGES } from "@/content/comparison-pages";

const page = CATEGORY_PAGES.reservation;

export const metadata = comparisonMetadata(page);

export default function ReservationPage() {
  return <ComparisonPage page={page} />;
}
