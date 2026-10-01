import Script from "next/script";

/** Script de mesure d'audience Plausible (sans cookie). Inactif sans NEXT_PUBLIC_PLAUSIBLE_DOMAIN. */
export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC || "https://plausible.io/js/script.js";
  return <Script src={src} data-domain={domain} strategy="afterInteractive" />;
}
