/* ── Billing: manual UPI passes ─────────────────────────────────────── */

export const PASSES = {
  launch:   { id: "launch",   label: "🚀 Launch Offer — 1 Month", price: 49, days: 30 },
  month:    { id: "month",    label: "Pro — 1 Month",   price: 149, days: 30 },
  halfyear: { id: "halfyear", label: "Pro — 6 Months",  price: 649, days: 180 },
  year:     { id: "year",     label: "Pro — 1 Year",    price: 999, days: 365 },
} as const;

export type PassId = keyof typeof PASSES;

/** Launch offer: first N buyers (pending + approved hold slots). */
export const LAUNCH_OFFER_LIMIT = 50;

/** Free-tier monthly AI allowances. Pro = unlimited. AI Review (critic) is Pro-only. */
export const FREE_AI_LIMITS = { enhance: 5 } as const;

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

export const PRO_TEMPLATES = new Set(["cli", "glass", "executive", "noir", "aurora"]);
