"use client";
/* ── Portxz dashboard UI kit ─────────────────────────────────────────
   Small, friendly building blocks so every page looks and behaves the
   same: labelled fields with hints, a slide-in editor panel, item cards
   with a confirm-before-delete, plain-language notices.              */
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, CheckCircle2, Info, Pencil, Trash2, X, XCircle, type LucideIcon,
} from "lucide-react";

/* ── buttons ── */
type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";
const VARIANTS: Record<Variant, string> = {
  primary: "lp-btn-primary",
  success: "lp-btn-success",
  secondary: "border border-lp-border bg-lp-surface text-lp-text shadow-sm hover:border-lp-border-strong hover:bg-lp-surface-2/60",
  ghost: "text-lp-muted hover:bg-lp-surface-2 hover:text-lp-text",
  danger: "border border-lp-danger/30 bg-lp-danger/10 text-lp-danger hover:bg-lp-danger/15",
};
const SIZES: Record<Size, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-[13px]",
  md: "h-10 gap-2 rounded-xl px-4 text-sm",
  lg: "h-12 gap-2 rounded-xl px-6 text-[15px]",
};
export function btn(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `inline-flex shrink-0 items-center justify-center font-medium transition disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

/* ── form fields ── */
export const inputCls =
  "w-full rounded-xl border border-lp-border bg-lp-surface px-3.5 py-2.5 text-[15px] text-lp-text outline-none transition placeholder:text-lp-subtle hover:border-lp-border-strong focus:border-lp-accent focus:ring-4 focus:ring-lp-accent-soft";

/* Wraps a single input in a <label>. Pass `group` when the field holds
   several controls (tag input, bullet editor) — a <label> would forward
   clicks on its text to the first button inside. */
export function Field({
  label, hint, optional, group, children, className,
}: {
  label: string; hint?: React.ReactNode; optional?: boolean; group?: boolean;
  children: React.ReactNode; className?: string;
}) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className={`block ${className ?? ""}`} {...(group ? { role: "group", "aria-label": label } : {})}>
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-lp-text">{label}</span>
        {optional && <span className="text-xs text-lp-subtle">Optional</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[13px] leading-relaxed text-lp-muted">{hint}</span>}
    </Tag>
  );
}

/* Type a word and press Enter (or comma) to add it as a tag. */
export function TagInput({
  value, onChange, placeholder, max = 30,
}: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; max?: number }) {
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const parts = raw.split(",").map((t) => t.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...value];
    for (const p of parts) if (!next.some((v) => v.toLowerCase() === p.toLowerCase()) && next.length < max) next.push(p);
    onChange(next);
    setDraft("");
  };
  return (
    <div className="flex min-h-[46px] w-full flex-wrap items-center gap-1.5 rounded-xl border border-lp-border bg-lp-surface px-2 py-1.5 transition focus-within:border-lp-accent focus-within:ring-4 focus-within:ring-lp-accent-soft hover:border-lp-border-strong">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-lg bg-lp-accent-soft py-1 pl-2.5 pr-1 text-[13px] font-medium text-lp-accent">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((v) => v !== t))}
            className="rounded p-0.5 transition hover:bg-lp-accent/15">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); add(draft); }
          if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={() => add(draft)}
        placeholder={value.length ? "Add another…" : placeholder}
        className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 text-[15px] text-lp-text outline-none placeholder:text-lp-subtle"
      />
    </div>
  );
}

export function Toggle({
  checked, onChange, label, description,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-lp-border bg-lp-surface px-4 py-3 text-left transition hover:border-lp-border-strong">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-[13px] text-lp-muted">{description}</span>}
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-lp-accent" : "bg-lp-border-strong"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

/* ── cards ── */
export function Card({
  title, description, children, className, action,
}: { title?: string; description?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <section className={`lp-card rounded-2xl p-5 sm:p-6 ${className ?? ""}`}>
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-[15px] font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-lp-muted">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/* A saved item (project, job, school…) with always-visible Edit and a
   two-step Delete so nothing disappears by accident. */
export function ItemCard({
  icon: Icon, title, subtitle, children, onEdit, onDelete,
}: {
  icon: LucideIcon | ((p: { className?: string }) => React.ReactNode);
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  onEdit: () => void;
  onDelete: () => Promise<void> | void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="lp-card flex flex-col gap-4 rounded-2xl p-4 transition hover:border-lp-border-strong sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-lp-border bg-lp-surface-2 text-lp-accent">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug">{title}</p>
          {subtitle && <p className="mt-0.5 text-sm text-lp-muted">{subtitle}</p>}
          {children && <div className="mt-2.5">{children}</div>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:justify-end">
        {confirming ? (
          <>
            <span className="mr-1 text-sm text-lp-muted">Delete this?</span>
            <button type="button" className={btn("ghost", "sm")} onClick={() => setConfirming(false)} disabled={deleting}>Keep</button>
            <button type="button" className={btn("danger", "sm")} disabled={deleting}
              onClick={async () => { setDeleting(true); await onDelete(); setDeleting(false); setConfirming(false); }}>
              {deleting ? "Deleting…" : "Yes, delete"}
            </button>
          </>
        ) : (
          <>
            <button type="button" className={btn("secondary", "sm")} onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button type="button" aria-label="Delete" title="Delete" className={btn("ghost", "sm", "w-8 px-0 hover:text-lp-danger")}
              onClick={() => setConfirming(true)}>
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function Tags({ items, max = 6 }: { items: string[]; max?: number }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, max).map((t) => (
        <span key={t} className="rounded-md border border-lp-border bg-lp-surface-2 px-2 py-0.5 text-xs text-lp-muted">{t}</span>
      ))}
      {items.length > max && <span className="px-1 py-0.5 text-xs text-lp-subtle">+{items.length - max} more</span>}
    </div>
  );
}

/* ── notices ── */
const TONES = {
  error: { icon: XCircle, cls: "border-lp-danger/30 bg-lp-danger/10 text-lp-danger" },
  warning: { icon: AlertTriangle, cls: "border-lp-warning/30 bg-lp-warning/10 text-lp-warning" },
  success: { icon: CheckCircle2, cls: "border-lp-green/30 bg-lp-green/10 text-lp-green" },
  info: { icon: Info, cls: "border-lp-accent/25 bg-lp-accent-soft text-lp-accent" },
} as const;

export function Notice({
  tone = "info", children, action, className,
}: { tone?: keyof typeof TONES; children: React.ReactNode; action?: React.ReactNode; className?: string }) {
  const t = TONES[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"}
      className={`flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm sm:flex-row sm:items-center ${t.cls} ${className ?? ""}`}>
      <span className="flex flex-1 items-start gap-2.5">
        <t.icon className="mt-0.5 h-4 w-4 shrink-0" />
        <span className="leading-relaxed">{children}</span>
      </span>
      {action}
    </div>
  );
}

/* Turns an API failure into a sentence a non-technical person can act on.
   `thing` is the plural noun, e.g. "projects". */
export async function friendlyError(res: Response, thing = "items"): Promise<{ message: string; upgrade: boolean }> {
  const body = await res.json().catch(() => ({} as Record<string, unknown>));
  const err = (body as { error?: unknown }).error;
  if (err === "free_limit_reached") {
    const limit = (body as { limit?: number }).limit;
    return { message: `The free plan includes up to ${limit ?? "a few"} ${thing}. Upgrade to Pro to add as many as you like.`, upgrade: true };
  }
  if (err === "pro_required") return { message: "This is a Pro feature. Upgrade to unlock it.", upgrade: true };
  if (res.status === 401 || res.status === 403) return { message: "Your session has expired. Please refresh the page and sign in again.", upgrade: false };
  if (res.status >= 500) return { message: "Something went wrong on our side. Please try again in a moment.", upgrade: false };
  const fields = err && typeof err === "object" && "fieldErrors" in err
    ? Object.keys((err as { fieldErrors: Record<string, unknown> }).fieldErrors)
    : [];
  if (fields.length) return { message: `Please check these fields: ${fields.join(", ")}.`, upgrade: false };
  return { message: "We couldn't save that. Please check the details and try again.", upgrade: false };
}

export function UpgradeLink() {
  return <Link href="/dashboard/billing" className={btn("primary", "sm")}>See Pro</Link>;
}

/* ── slide-in editor panel ── */
export function Sheet({
  open, onClose, title, description, children, footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="lp absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-lp-border bg-lp-bg shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-lp-border px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-lp-muted">{description}</p>}
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className={btn("ghost", "sm", "w-8 px-0")}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="lp-scroll flex-1 space-y-5 overflow-y-auto px-6 py-6">{children}</div>
            {footer && <div className="flex items-center justify-end gap-2 border-t border-lp-border bg-lp-surface/60 px-6 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* "3 of 5 projects used on the free plan · Upgrade" — hidden for Pro. */
export function UsageNote({ used, limit, pro, thing }: { used: number; limit: number; pro: boolean; thing: string }) {
  if (pro) return null;
  const full = used >= limit;
  return (
    <p className={`text-[13px] ${full ? "text-lp-warning" : "text-lp-subtle"}`}>
      {used} of {limit} {thing} used on the free plan
      {full && <> · <Link href="/dashboard/billing" className="font-medium underline underline-offset-2">Upgrade for unlimited</Link></>}
    </p>
  );
}

