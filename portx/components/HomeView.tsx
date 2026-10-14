"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronDown, Copy, Download, Eye, FileText, Palette,
  Sparkles, SquarePlus, TrendingUp, type LucideIcon,
} from "lucide-react";
import { ViewsChart } from "@/components/views-chart";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/BrandIcons";
import { SITE_URL } from "@/lib/site";

/* Dashboard Home — presentational only; app/dashboard/page.tsx loads the data. */

export type ChecklistItem = { done: boolean; label: string; why: string; href: string; cta: string };
export type HomeData = {
  greeting: string;
  dateLabel: string;
  firstName: string;
  username: string;
  published: boolean;
  pro: boolean;
  proUntil: string | null;
  stats: { views: number; weekViews: number; downloads: number };
  chartData: { date: string; views: number }[];
  checklist: ChecklistItem[];
};

const HOST = SITE_URL.replace(/^https?:\/\//, "");

function useCopy() {
  const [copied, setCopied] = useState(false);
  return {
    copied,
    copy: async (text: string) => {
      try { await navigator.clipboard.writeText(text); } catch { return; }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
  };
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35ZM12.04 21.5h-.01a9.43 9.43 0 0 1-4.81-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.42 9.42 0 1 1 8.02 4.43Zm8.02-17.45A11.27 11.27 0 0 0 1.73 17.66L.13 23.5l5.98-1.57a11.25 11.25 0 0 0 5.92 1.5h.01A11.27 11.27 0 0 0 20.06 4.05Z" />
    </svg>
  );
}

export function HomeView({ d }: { d: HomeData }) {
  const pageUrl = `${SITE_URL}/${d.username}`;
  const { copied, copy } = useCopy();
  const [showDone, setShowDone] = useState(false);

  const doneCount = d.checklist.filter((c) => c.done).length;
  const total = d.checklist.length;
  const pct = Math.round((doneCount / total) * 100);
  const next = d.checklist.find((c) => !c.done);
  const todo = d.checklist.filter((c) => !c.done);
  const done = d.checklist.filter((c) => c.done);

  const shareText = encodeURIComponent(`Here's my portfolio: ${pageUrl}`);
  const SHARES: { name: string; icon: (p: { className?: string }) => React.ReactNode; href: string }[] = [
    { name: "WhatsApp", icon: WhatsappIcon, href: `https://wa.me/?text=${shareText}` },
    { name: "LinkedIn", icon: LinkedinIcon, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}` },
    { name: "X", icon: XIcon, href: `https://twitter.com/intent/tweet?text=${shareText}` },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── welcome + your link ─────────────────────────────────── */}
      <section className="lp-card relative overflow-hidden rounded-3xl p-5 sm:p-7">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] text-lp-muted">{d.dateLabel}</p>
            <h1 className="mt-1 text-[1.65rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[2.1rem]">
              {d.greeting}, <span className="lp-serif lp-gradient-text pr-1">{d.firstName}</span>
            </h1>
          </div>
          {d.pro ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lp-green/10 px-3 py-1.5 text-xs font-medium text-lp-green">
              <BadgeCheck className="h-3.5 w-3.5" /> Pro{d.proUntil ? ` · until ${d.proUntil}` : ""}
            </span>
          ) : (
            <Link href="/dashboard/billing"
              className="inline-flex items-center gap-1.5 rounded-full border border-lp-border bg-lp-surface px-3 py-1.5 text-xs font-medium transition hover:border-lp-accent/40 hover:text-lp-accent">
              <Sparkles className="h-3.5 w-3.5 text-lp-accent" /> Upgrade
            </Link>
          )}
        </div>

        {/* link row — stacks on phones */}
        <div className="relative mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex h-11 min-w-0 items-center gap-2.5 rounded-xl border border-lp-border bg-lp-bg/60 px-3.5 sm:flex-1">
            <span className="relative flex h-2 w-2 shrink-0">
              {d.published && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lp-green opacity-50" />}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${d.published ? "bg-lp-green" : "bg-lp-warning"}`} />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">
              <span className="text-lp-subtle">{HOST}/</span><span className="font-medium">{d.username}</span>
            </span>
            <span className={`hidden shrink-0 text-xs font-medium sm:inline ${d.published ? "text-lp-green" : "text-lp-warning"}`}>
              {d.published ? "Live" : "Not published"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button type="button" onClick={() => copy(pageUrl)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-lp-border bg-lp-surface px-4 text-sm font-medium shadow-sm transition hover:border-lp-border-strong">
              {copied ? <><Check className="h-4 w-4 text-lp-green" /> Copied</> : <><Copy className="h-4 w-4" /> Copy link</>}
            </button>
            {d.published ? (
              <a href={`/${d.username}`} target="_blank"
                className="lp-btn-primary inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium">
                View page <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : (
              <Link href="/dashboard/template"
                className="lp-btn-primary inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium">
                Publish <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── next step ───────────────────────────────────────────── */}
      {next && (
        <section className="lp-gradient-border relative overflow-hidden rounded-3xl p-5 sm:p-7">
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-medium text-lp-accent">Your next step</p>
              <p className="text-xs text-lp-muted">{doneCount} of {total} done</p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lp-surface-2">
              <div className="h-full rounded-full bg-gradient-to-r from-lp-accent to-lp-violet transition-all duration-700" style={{ width: `${Math.max(pct, 4)}%` }} />
            </div>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{next.label}</h2>
                <p className="mt-1 max-w-lg text-sm leading-relaxed text-lp-muted sm:text-[15px]">{next.why}</p>
              </div>
              <Link href={next.href}
                className="lp-btn-primary inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-medium">
                {next.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── stats — three compact tiles, one row even on phones ──── */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <Stat label="Total views" value={d.stats.views} icon={Eye} tone="text-lp-accent bg-lp-accent-soft" />
        <Stat label="This week" value={d.stats.weekViews} icon={TrendingUp} tone="text-lp-green bg-lp-green/10" />
        <Stat label="Resume downloads" short="Downloads" value={d.stats.downloads} icon={Download} tone="text-lp-violet bg-lp-violet/10" />
      </div>

      {/* ── chart + shortcuts ───────────────────────────────────── */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <section className="lp-card rounded-3xl p-5 sm:p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-semibold">Visitors</h2>
              <p className="mt-0.5 text-[13px] text-lp-muted sm:text-sm">People who opened your page, last 7 days</p>
            </div>
            <span className="shrink-0 whitespace-nowrap rounded-md bg-lp-surface-2 px-2 py-1 text-[11px] font-medium text-lp-muted">7 days</span>
          </div>
          <div className="mt-5 h-[170px] w-full sm:h-[220px]">
            <ViewsChart data={d.chartData} />
          </div>
        </section>

        <section className="lp-card rounded-3xl p-5 sm:p-6">
          <h2 className="text-[15px] font-semibold">Shortcuts</h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-1 lg:gap-1.5">
            <Shortcut href="/dashboard/review" label="AI feedback" sub="See what to improve" icon={Sparkles} />
            <Shortcut href="/dashboard/resume" label="Resume" sub="Download a PDF" icon={FileText} />
            <Shortcut href="/dashboard/template" label="Design" sub="Change your look" icon={Palette} />
            <Shortcut href="/dashboard/sections" label="Add section" sub="Awards, languages…" icon={SquarePlus} />
          </div>
        </section>
      </div>

      {/* ── share (once live) ───────────────────────────────────── */}
      {d.published && (
        <section className="lp-card rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[15px] font-semibold">Share your page</h2>
              <p className="mt-0.5 text-[13px] text-lp-muted sm:text-sm">Every visit shows up in your stats above.</p>
            </div>
            <div className="grid grid-cols-4 gap-2 md:flex">
              {SHARES.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={`Share on ${s.name}`}
                  className="inline-flex h-11 flex-col items-center justify-center gap-0.5 rounded-xl border border-lp-border bg-lp-surface text-lp-muted transition hover:border-lp-border-strong hover:text-lp-text md:h-10 md:flex-row md:gap-2 md:px-4">
                  <s.icon className="h-4 w-4" />
                  <span className="text-[10px] font-medium md:text-sm">{s.name}</span>
                </a>
              ))}
              <button type="button" onClick={() => copy(pageUrl)} aria-label="Copy link"
                className="inline-flex h-11 flex-col items-center justify-center gap-0.5 rounded-xl border border-lp-border bg-lp-surface text-lp-muted transition hover:border-lp-border-strong hover:text-lp-text md:h-10 md:flex-row md:gap-2 md:px-4">
                {copied ? <Check className="h-4 w-4 text-lp-green" /> : <Copy className="h-4 w-4" />}
                <span className="text-[10px] font-medium md:text-sm">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── setup checklist (until complete) ─────────────────────── */}
      {pct < 100 && (
        <section className="lp-card rounded-3xl p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <ProgressRing pct={pct} />
            <div>
              <h2 className="text-[15px] font-semibold">Finish setting up</h2>
              <p className="mt-0.5 text-[13px] text-lp-muted sm:text-sm">{total - doneCount} step{total - doneCount === 1 ? "" : "s"} left. Tap one to jump to it.</p>
            </div>
          </div>
          <ul className="mt-5 grid gap-2 md:grid-cols-2">
            {todo.map((c) => <ChecklistRow key={c.label} c={c} />)}
            {showDone && done.map((c) => <ChecklistRow key={c.label} c={c} />)}
          </ul>
          {done.length > 0 && (
            <button type="button" onClick={() => setShowDone(!showDone)}
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-lp-muted transition hover:text-lp-text">
              {showDone ? "Hide" : "Show"} {done.length} completed
              <ChevronDown className={`h-4 w-4 transition-transform ${showDone ? "rotate-180" : ""}`} />
            </button>
          )}
        </section>
      )}
    </div>
  );
}

function Stat({ label, short, value, icon: Icon, tone }: { label: string; short?: string; value: number; icon: LucideIcon; tone: string }) {
  return (
    <div className="lp-card rounded-2xl p-3.5 sm:rounded-3xl sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-lg sm:h-8 sm:w-8 ${tone}`}>
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums sm:mt-4 sm:text-3xl">{value.toLocaleString("en-IN")}</p>
      <p className="mt-0.5 truncate text-[11px] text-lp-muted sm:text-sm">
        {short ? <><span className="sm:hidden">{short}</span><span className="hidden sm:inline">{label}</span></> : label}
      </p>
    </div>
  );
}

function Shortcut({ href, label, sub, icon: Icon }: { href: string; label: string; sub: string; icon: LucideIcon | typeof GithubIcon }) {
  return (
    <Link href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-lp-border bg-lp-bg/40 p-3.5 transition hover:border-lp-border-strong hover:bg-lp-surface-2/60 lg:flex-row lg:items-center lg:gap-3 lg:rounded-xl lg:border-transparent lg:bg-transparent lg:px-2.5 lg:py-2.5 lg:hover:border-lp-border">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lp-accent-soft text-lp-accent">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block truncate text-xs text-lp-muted">{sub}</span>
      </span>
      <ArrowRight className="hidden h-4 w-4 text-lp-subtle transition group-hover:translate-x-0.5 group-hover:text-lp-text lg:block" />
    </Link>
  );
}

function ChecklistRow({ c }: { c: ChecklistItem }) {
  return (
    <li>
      <Link href={c.href}
        className="group flex min-h-12 items-center gap-3 rounded-xl border border-lp-border bg-lp-bg/40 px-4 py-3 transition hover:border-lp-border-strong hover:bg-lp-surface-2/60">
        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${c.done ? "bg-lp-green text-white" : "border-2 border-lp-border-strong"}`}>
          {c.done && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
        <span className={`flex-1 text-sm ${c.done ? "text-lp-subtle line-through decoration-lp-subtle/50" : ""}`}>{c.label}</span>
        <ArrowRight className="h-4 w-4 shrink-0 text-lp-subtle transition group-hover:translate-x-0.5 group-hover:text-lp-text" />
      </Link>
    </li>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const C = 2 * Math.PI * 15.5;
  return (
    <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--lp-border-strong)" strokeWidth="3" />
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--lp-accent)" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} className="transition-[stroke-dashoffset] duration-700" />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[11px] font-semibold tabular-nums sm:text-xs">{pct}%</span>
    </div>
  );
}
