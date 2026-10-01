import { Beer, Check, Coffee, Croissant, Salad, UtensilsCrossed, Wine } from "lucide-react";

const tiles = [Coffee, Beer, Wine, Salad, Croissant, UtensilsCrossed] as const;

/**
 * Visuel d'accueil : deux écrans (caisse et pilotage) en lévitation.
 * Purement décoratif : aucun chiffre, aucune donnée d'outil réel.
 */
export function HeroVisual() {
  return (
    <div aria-hidden className="relative isolate select-none [perspective:1600px]">
      <div className="aura" />
      <div className="grid items-center gap-5 md:grid-cols-[1.15fr_1fr]">
        {/* Écran caisse */}
        <div className="glow-frame screen md:[transform:rotateY(9deg)_rotateX(2deg)]">
          <div className="screen-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="grid grid-cols-[1fr_0.8fr] gap-3 p-3 sm:p-4">
            <div className="grid grid-cols-3 gap-2">
              {tiles.map((Icon, i) => (
                <div
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-night-line bg-white/[0.03]"
                >
                  <Icon className="size-5 text-night-brass" strokeWidth={1.5} />
                  <div className="skeleton w-3/5" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5 rounded-lg border border-night-line bg-white/[0.02] p-3">
              <div className="skeleton w-1/2 bg-night-brass/60" />
              <div className="mt-1 space-y-2">
                {[80, 65, 90, 55, 70].map((w, i) => (
                  <div key={i} className="flex justify-between gap-2">
                    <div className="skeleton" style={{ width: `${w}%` }} />
                    <div className="skeleton w-3" />
                  </div>
                ))}
              </div>
              <div className="pill-glow mt-auto" />
            </div>
          </div>
        </div>

        {/* Écran pilotage */}
        <div className="glow-frame screen hidden sm:block md:[transform:rotateY(-9deg)_rotateX(2deg)]">
          <div className="screen-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2 rounded-lg border border-night-line p-2.5">
                  <div className="skeleton w-2/3" />
                  <div className="skeleton h-2 w-1/2 bg-night-ink/30" />
                </div>
              ))}
            </div>
            <svg viewBox="0 0 300 110" className="w-full">
              <defs>
                <linearGradient id="hv-stroke" x1="0" x2="1">
                  <stop offset="0" stopColor="#d2b07a" />
                  <stop offset="1" stopColor="#8fa3b8" />
                </linearGradient>
                <linearGradient id="hv-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#d2b07a" stopOpacity="0.28" />
                  <stop offset="1" stopColor="#d2b07a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 92 C30 88 45 70 75 72 S120 40 150 46 S200 22 230 30 S275 12 300 8 V110 H0Z"
                fill="url(#hv-fill)"
              />
              <path
                d="M0 92 C30 88 45 70 75 72 S120 40 150 46 S200 22 230 30 S275 12 300 8"
                fill="none"
                stroke="url(#hv-stroke)"
                strokeWidth="2.5"
              />
            </svg>
            <div className="flex items-end gap-1.5">
              {[40, 55, 35, 70, 60, 85, 75].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-night-steel/20 to-night-steel/60"
                  style={{ height: `${h * 0.5}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="floor" />

      {/* Bon envoyé, posé sur le visuel */}
      <div className="glow-frame absolute -bottom-2 left-4 flex items-center gap-2 rounded-full px-3.5 py-2 text-xs text-night-ink sm:left-10">
        <span className="grid size-5 place-items-center rounded-full bg-night-brass text-night">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        Envoyé en cuisine
      </div>
    </div>
  );
}
