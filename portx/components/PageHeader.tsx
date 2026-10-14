/* Shared dashboard page header — eyebrow, title, description, right-side actions. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-lp-border pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-[13px] font-medium text-lp-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[2.1rem]">{title}</h1>
        {description && <div className="mt-2 max-w-2xl text-[15px] leading-relaxed text-lp-muted">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
