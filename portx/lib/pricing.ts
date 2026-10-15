import type { PassId } from "./billing";

/* ── Country pricing ───────────────────────────────────────────────────
   Shared by server and browser. The server picks the currency from the visitor's
   IP country (Vercel's x-vercel-ip-country header) when it creates the order, so the
   amount charged never comes from the browser. The middleware copies the same currency
   into a cookie, which the UI reads to show matching prices. */

export const CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Prices in each currency's major unit (rupees, dollars…). */
export const PRICES: Record<Currency, Record<PassId, number>> = {
  INR: { launch: 49, month: 149, halfyear: 649, year: 999 },
  USD: { launch: 2.99, month: 4.99, halfyear: 19, year: 29 },
  EUR: { launch: 2.99, month: 4.99, halfyear: 19, year: 29 },
  GBP: { launch: 2.49, month: 3.99, halfyear: 15, year: 25 },
};

export const CURRENCY_COOKIE = "pxz_cur";

// Eurozone plus the microstates that use the euro.
const EURO_COUNTRIES = new Set([
  "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU",
  "MT", "NL", "PT", "SK", "SI", "ES", "AD", "MC", "SM", "VA", "ME", "XK",
]);

/** No country (local dev, unknown IP) counts as India — the home market. */
export function currencyForCountry(country: string | null | undefined): Currency {
  const c = country?.toUpperCase();
  if (!c || c === "IN") return "INR";
  if (c === "GB") return "GBP";
  if (EURO_COUNTRIES.has(c)) return "EUR";
  return "USD";
}

/** Visitor's currency from request headers. DEV_COUNTRY overrides it for local testing. */
export function currencyFromHeaders(headers: Headers): Currency {
  return currencyForCountry(process.env.DEV_COUNTRY || headers.get("x-vercel-ip-country"));
}

export function isCurrency(v: unknown): v is Currency {
  return CURRENCIES.includes(v as Currency);
}

/** "₹149", "$4.99", "$19" — decimals only when the amount has them. */
export function formatPrice(amount: number, currency: Currency): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
}

/** Smallest unit (paise, cents, pence) — what Razorpay expects. All four currencies use 2 decimals. */
export const toMinorUnits = (amount: number) => Math.round(amount * 100);

/** Price per 30 days, rounded the way the currency is usually shown. */
export function perMonth(amount: number, days: number, currency: Currency): number {
  const v = amount / (days / 30);
  return currency === "INR" ? Math.round(v) : Math.round(v * 100) / 100;
}
