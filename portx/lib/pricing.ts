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
  USD: { launch: 1.49, month: 4.99, halfyear: 19, year: 29 },
  EUR: { launch: 1.49, month: 4.99, halfyear: 19, year: 29 },
  GBP: { launch: 1.29, month: 3.99, halfyear: 15, year: 25 },
};

/* ── Launch offer ── the "launch" pass: one month of Pro at PRICES.launch (₹49) for the
   first LAUNCH_OFFER_LIMIT buyers, once per user. The sale below never changes its price.

   ── Launch sale ── half price on the regular plans until the end of 17 Nov 2026 (India time).
   After SALE.endsAt the regular PRICES apply on their own. */

/** Passes that can be bought. */
export const SELLABLE_PASSES = ["launch", "month", "halfyear", "year"] as const;
export type SellablePass = (typeof SELLABLE_PASSES)[number];
/** Passes the launch sale discounts. */
export type SalePass = Exclude<SellablePass, "launch">;

export const SALE = {
  percent: 50,
  endsAt: new Date("2026-11-17T23:59:59.999+05:30"),
  /** Shown in the UI, e.g. "until 17 Nov". */
  endsLabel: "17 Nov",
};

/** Half price, rounded to amounts that look natural in each currency. */
export const SALE_PRICES: Record<Currency, Record<SalePass, number>> = {
  INR: { month: 75, halfyear: 325, year: 499 },
  USD: { month: 2.49, halfyear: 9.49, year: 14.49 },
  EUR: { month: 2.49, halfyear: 9.49, year: 14.49 },
  GBP: { month: 1.99, halfyear: 7.49, year: 12.49 },
};

export const saleActive = (now: Date = new Date()) => now < SALE.endsAt;

/** What a pass costs right now. The order API uses this, so the sale ends server-side too. */
export function priceOf(pass: SellablePass, currency: Currency, now: Date = new Date()): number {
  if (pass === "launch") return PRICES[currency].launch;
  return saleActive(now) ? SALE_PRICES[currency][pass] : PRICES[currency][pass];
}

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
