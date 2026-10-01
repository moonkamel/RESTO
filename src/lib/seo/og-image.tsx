import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/*
 * Images Open Graph (1200 × 630), générées au build. Couleurs de la direction « Ardoise &
 * Laiton » : next/og ne lit pas les variables CSS, d'où les valeurs reprises de globals.css.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const NIGHT = "#070a0e";
const INK = "#eceae4";
const MUTED = "#9aa3ae";
const BRASS = "#d2b07a";
const STEEL = "#8fa3b8";

export async function renderOgImage(input: { eyebrow: string; title: string; footer?: string }) {
  const serif = await readFile(join(process.cwd(), "src/assets/fonts/InstrumentSerif-Regular.ttf"));
  const titleSize = input.title.length > 60 ? 64 : input.title.length > 35 ? 76 : 92;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: NIGHT,
        backgroundImage: `radial-gradient(circle at 85% 10%, rgba(210,176,122,0.28), transparent 45%), radial-gradient(circle at 10% 100%, rgba(143,163,184,0.22), transparent 45%)`,
        color: INK,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: BRASS,
            boxShadow: `0 0 18px ${BRASS}`,
          }}
        />
        <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: BRASS }}>
          {input.eyebrow}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Instrument Serif",
          fontSize: titleSize,
          lineHeight: 1.05,
          letterSpacing: -1,
          maxWidth: 1000,
        }}
      >
        {input.title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `2px solid ${STEEL}55`,
          paddingTop: 28,
          fontSize: 26,
          color: MUTED,
        }}
      >
        <div style={{ fontFamily: "Instrument Serif", fontSize: 36, color: INK }}>
          {siteConfig.name}
        </div>
        <div>{input.footer ?? "Testé en service, pas en salle de démo"}</div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [{ name: "Instrument Serif", data: serif, weight: 400, style: "normal" }],
    },
  );
}
