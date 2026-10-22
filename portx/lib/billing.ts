/* ── Billing: manual UPI passes ─────────────────────────────────────── */

/* Prices per currency (and the launch sale) live in lib/pricing.ts. */
export const PASSES = {
  launch:   { id: "launch",   label: "Launch Offer — 1 Month", days: 30 },
  month:    { id: "month",    label: "Pro — 1 Month",   days: 30 },
  halfyear: { id: "halfyear", label: "Pro — 6 Months",  days: 180 },
  year:     { id: "year",     label: "Pro — 1 Year",    days: 365 },
} as const;

export type PassId = keyof typeof PASSES;

/** Launch offer: first N buyers, once per user. */
export const LAUNCH_OFFER_LIMIT = 50;

/** An unpaid launch checkout holds its slot this long. */
export const LAUNCH_HOLD_MS = 15 * 60 * 1000;

/** Free-tier monthly AI allowances. AI Review (critic) is Pro-only. */
export const FREE_AI_LIMITS = { enhance: 5 } as const;

/** Pro fair-use AI allowances per 30 days — keeps one heavy account from running up the AI bill. */
export const PRO_AI_LIMITS = { enhance: 200, critic: 30, tailor: 60 } as const;

/** Free-tier content caps. Pro = unlimited. skillItems = total items across all groups. */
export const FREE_LIMITS = {
  projects: 5,
  experiences: 5,
  educations: 5,
  links: 5,
  skillItems: 10,
} as const;

export function isPro(profile: { plan: string; planExpiresAt: Date | null }): boolean {
  return profile.plan === "pro" && !!profile.planExpiresAt && profile.planExpiresAt > new Date();
}

/** Extending an active pass stacks on top of remaining time. */
export function newExpiry(current: Date | null, days: number): Date {
  const base = current && current > new Date() ? current : new Date();
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

export const PRO_TEMPLATES = new Set(["cli", "glass", "editorial", "noir", "bento", "executive", "aurora"]);
