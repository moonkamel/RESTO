const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** 12345.6 → « 12 346 € » (arrondi à l'euro). */
export function formatEuros(value: number): string {
  return euroFormatter.format(Math.round(value));
}

/** « 2026-10-01 » → « 1 octobre 2026 ». Fuseau fixe : même rendu serveur et navigateur. */
export function formatIsoDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00Z`));
}
