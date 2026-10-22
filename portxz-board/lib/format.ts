export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://portxz.xyz").replace(/\/+$/, "");

export function money(amount: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency", currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2,
  }).format(amount);
}

export const num = (n: number) => new Intl.NumberFormat("en-IN").format(n);

export const date = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });

export const dateTime = (d: Date) =>
  d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

/** "3d ago", "5h ago" — for recent activity lists. */
export function ago(d: Date): string {
  const s = Math.max(0, (Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return date(d);
}

/** Day key in India time, e.g. "2026-10-22" — charts bucket by this. */
export const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/** The last `n` day keys, oldest first, ending today. */
export function lastDays(n: number): string[] {
  const out: string[] = [];
  for (let k = n - 1; k >= 0; k--) out.push(dayKey(new Date(Date.now() - k * 86400000)));
  return out;
}

/** The moment `n` days ago — for "last 30 days" queries. */
export const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);
