import { serializeJsonLd, type JsonLd as JsonLdData } from "@/lib/seo/jsonld";

/** Balise JSON-LD. Les entrées null (ex. avis sans note) sont ignorées. */
export function JsonLd({ data }: { data: (JsonLdData | null)[] }) {
  const items = data.filter((d): d is JsonLdData => d !== null);
  if (items.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(items.length === 1 ? items[0]! : items) }}
    />
  );
}
