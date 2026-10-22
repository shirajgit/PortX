import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/* Small server-safe building blocks shared by the board pages. */

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-medium">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, hint, icon: Icon, tone = "accent" }: {
  label: string; value: React.ReactNode; hint?: React.ReactNode; icon: LucideIcon; tone?: "accent" | "green" | "warning";
}) {
  const tones = { accent: "bg-accent-soft text-accent", green: "bg-green/10 text-green", warning: "bg-warning/10 text-warning" };
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{label}</p>
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${tones[tone]}`}><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-subtle">{hint}</p>}
    </div>
  );
}

const BADGE = {
  green: "bg-green/10 text-green",
  accent: "bg-accent-soft text-accent",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  muted: "bg-surface-2 text-muted",
};
export function Badge({ tone, children }: { tone: keyof typeof BADGE; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${BADGE[tone]}`}>{children}</span>;
}

export const STATUS_TONE: Record<string, keyof typeof BADGE> = {
  approved: "green", pending: "warning", rejected: "danger", created: "muted",
};
export const STATUS_LABEL: Record<string, string> = {
  approved: "Paid", pending: "Needs review", rejected: "Rejected", created: "Unpaid checkout",
};

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-subtle">{children}</p>;
}

/** Table wrapper that scrolls sideways on small screens instead of squashing columns. */
export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-subtle">
            {head.map((h) => <th key={h} className="whitespace-nowrap px-5 py-2.5 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

/** Pill links for filters; keeps the other query params. */
export function Filters({ name, options, current, params, base }: {
  name: string; options: [string, string][]; current: string; params: Record<string, string | undefined>; base: string;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-surface p-1">
      {options.map(([value, label]) => {
        const q = new URLSearchParams(Object.entries({ ...params, [name]: value, page: undefined })
          .filter((e): e is [string, string] => !!e[1] && e[1] !== "all"));
        return (
          <Link key={value} href={`${base}${q.size ? `?${q}` : ""}`}
            className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${current === value ? "bg-surface-2 text-text" : "text-muted hover:text-text"}`}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export function Pager({ page, pages, params, base }: { page: number; pages: number; params: Record<string, string | undefined>; base: string }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const q = new URLSearchParams(Object.entries({ ...params, page: p > 1 ? String(p) : undefined })
      .filter((e): e is [string, string] => !!e[1] && e[1] !== "all"));
    return `${base}${q.size ? `?${q}` : ""}`;
  };
  const btn = "rounded-lg border border-border px-3 py-1.5 text-xs transition-colors hover:border-border-strong";
  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted">
      <span>Page {page} of {pages}</span>
      <div className="flex gap-2">
        {page > 1 && <Link href={href(page - 1)} className={btn}>Previous</Link>}
        {page < pages && <Link href={href(page + 1)} className={btn}>Next</Link>}
      </div>
    </div>
  );
}
