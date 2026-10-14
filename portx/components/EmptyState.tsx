import type { LucideIcon } from "lucide-react";

/* Shared dashboard empty state — icon tile, title, one line of help. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-dashed border-lp-border-strong px-6 py-12 text-center ${className ?? ""}`}>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)] opacity-60" />
      <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-lp-border bg-lp-surface text-lp-accent shadow-sm">
        <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
      </span>
      <p className="relative mt-4 font-semibold">{title}</p>
      <p className="relative mx-auto mt-1 max-w-sm text-sm text-lp-muted">{description}</p>
    </div>
  );
}
