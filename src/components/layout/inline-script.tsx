/**
 * Script inline exécuté pendant le parsing HTML (avant le premier rendu).
 * Le type change côté client pour éviter l'avertissement React sur les <script>.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
