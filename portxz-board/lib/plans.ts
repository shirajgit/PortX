/* Mirror of the pass rules in ../portx/lib/billing.ts — keep the two in step.
   The board grants and approves passes exactly the way the main app does. */

export const PASSES = {
  launch:   { id: "launch",   label: "Launch Offer — 1 Month", days: 30 },
  month:    { id: "month",    label: "Pro — 1 Month",   days: 30 },
  halfyear: { id: "halfyear", label: "Pro — 6 Months",  days: 180 },
  year:     { id: "year",     label: "Pro — 1 Year",    days: 365 },
} as const;
export type PassId = keyof typeof PASSES;

export const LAUNCH_OFFER_LIMIT = 50;
export const LAUNCH_HOLD_MS = 15 * 60 * 1000;

export function isPro(profile: { plan: string; planExpiresAt: Date | null }): boolean {
  return profile.plan === "pro" && !!profile.planExpiresAt && profile.planExpiresAt > new Date();
}

/** Extending an active pass stacks on top of remaining time. */
export function newExpiry(current: Date | null, days: number): Date {
  const base = current && current > new Date() ? current : new Date();
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}
