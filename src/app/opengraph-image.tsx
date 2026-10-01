import { siteConfig } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/seo/og-image";

export const alt = `${siteConfig.name} — caisse, TPE, réservation, commande en ligne testés en service`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Par un restaurateur, pour les restaurateurs",
    title: "Les outils qui tiennent le coup de feu.",
  });
}
