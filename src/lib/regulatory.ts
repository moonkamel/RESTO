import { z } from "zod";

/*
 * SOURCE UNIQUE des affirmations réglementaires destinées aux restaurateurs.
 * Les pages importent ces entrées, elles ne réécrivent jamais une règle.
 *
 * Claude ne rédige pas ces affirmations : chaque entrée est créée « À VÉRIFIER »
 * (isPlaceholder: true) et le propriétaire la rédige à partir d'une source officielle.
 * Exécuté aussi par scripts/check-content.ts : imports relatifs uniquement.
 */

export const REGULATORY_TOPICS = [
  "certification-caisse",
  "facturation-electronique",
  "titres-restaurant",
] as const;

const regulatoryClaimSchema = z
  .object({
    id: z.enum(REGULATORY_TOPICS),
    title: z.string().trim().min(1),
    /** L'affirmation, en une ou deux phrases destinées au restaurateur. */
    claim: z.string().trim().min(1),
    sourceLabel: z.string().trim().min(1),
    /** URL de la source officielle. Vide autorisé seulement pour un placeholder. */
    sourceUrl: z.union([z.url({ protocol: /^https$/ }), z.literal("")]),
    verifiedAt: z.iso.date(),
    isPlaceholder: z.boolean(),
  })
  .strict()
  .refine((c) => c.isPlaceholder || c.sourceUrl !== "", {
    path: ["sourceUrl"],
    message: "Source obligatoire pour une affirmation publiée",
  });

export type RegulatoryTopic = (typeof REGULATORY_TOPICS)[number];
export type RegulatoryClaim = z.infer<typeof regulatoryClaimSchema>;

const data: RegulatoryClaim[] = [
  {
    id: "certification-caisse",
    title: "Certification des logiciels de caisse",
    claim: "[À RÉDIGER ET VÉRIFIER — obligations applicables aux logiciels de caisse]",
    sourceLabel: "[SOURCE OFFICIELLE]",
    sourceUrl: "",
    verifiedAt: "2026-10-01",
    isPlaceholder: true, // PLACEHOLDER
  },
  {
    id: "facturation-electronique",
    title: "Facturation électronique",
    claim: "[À RÉDIGER ET VÉRIFIER — calendrier et impact pour un restaurant]",
    sourceLabel: "[SOURCE OFFICIELLE]",
    sourceUrl: "",
    verifiedAt: "2026-10-01",
    isPlaceholder: true, // PLACEHOLDER
  },
  {
    id: "titres-restaurant",
    title: "Titres-restaurant",
    claim: "[À RÉDIGER ET VÉRIFIER — règles d'acceptation des titres-restaurant]",
    sourceLabel: "[SOURCE OFFICIELLE]",
    sourceUrl: "",
    verifiedAt: "2026-10-01",
    isPlaceholder: true, // PLACEHOLDER
  },
];

export const regulatoryClaims: readonly RegulatoryClaim[] = z
  .array(regulatoryClaimSchema)
  .refine((list) => new Set(list.map((c) => c.id)).size === list.length, "Sujet en double")
  .parse(data);

export function getRegulatoryClaim(id: RegulatoryTopic): RegulatoryClaim {
  const claim = regulatoryClaims.find((c) => c.id === id);
  if (!claim) throw new Error(`Affirmation réglementaire absente : ${id}`);
  return claim;
}
