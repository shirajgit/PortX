"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CreditCard, FileText, Mail, Palette, Phone, Plus, Rocket, Search, UserRound, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HELP_TOPICS } from "@/lib/help";
import { BUSINESS, LEGAL_LINKS } from "@/lib/site";

/* ═══ Help Center ═══ searchable how-to answers grouped by topic, plus ways to reach us.
   Uses the landing page's lp-* tokens so it matches in both themes. */

const ease = [0.22, 1, 0.36, 1] as const;
const CONTAINER = "mx-auto w-full max-w-4xl px-5 sm:px-8";
const TOPIC_ICONS: Record<string, typeof Rocket> = {
  "getting-started": Rocket,
  portfolio: Palette,
  resume: FileText,
  billing: CreditCard,
  account: UserRound,
};

export function HelpCenter() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const topics = useMemo(() => {
    if (!q) return HELP_TOPICS;
    const words = q.split(/\s+/);
    return HELP_TOPICS
      .map((t) => ({ ...t, articles: t.articles.filter((a) => words.every((w) => `${a.q} ${a.a}`.toLowerCase().includes(w))) }))
      .filter((t) => t.articles.length > 0);
  }, [q]);
  const matches = topics.reduce((n, t) => n + t.articles.length, 0);

  return (
    <MotionConfig reducedMotion="user">
      <main className="lp lp-landing relative min-h-screen overflow-x-clip">
        <header className="sticky top-0 z-40 border-b border-lp-border bg-lp-bg/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
            <Link href="/" aria-label="Portxz home"><Logo size="sm" /></Link>
            <div className="flex items-center gap-2">
              <Link href="/" className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-lp-muted transition hover:text-lp-text sm:inline-flex">
                <ArrowLeft className="h-3.5 w-3.5" /> Home
              </Link>
              <ThemeToggle />
              <Link href="/dashboard" className="lp-btn-primary rounded-lg px-4 py-2 text-sm font-medium">Dashboard</Link>
            </div>
          </div>
        </header>

        {/* hero + search */}
        <section className="relative pb-10 pt-16 sm:pt-24">
          <div aria-hidden className="lp-grid-bg pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-260px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
          <motion.div initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease }} className={`${CONTAINER} relative text-center`}>
            <p className="lp-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-lp-accent">
              <span className="h-px w-5 bg-lp-accent/60" />help center
            </p>
            <h1 className="mt-4 text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              How can we <span className="lp-serif lp-gradient-text pr-1">help</span>?
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-lp-muted sm:text-lg">
              Answers about setting up your portfolio, resumes, job tailoring and billing.
            </p>

            <label className="relative mx-auto mt-8 block max-w-xl">
              <span className="sr-only">Search help articles</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-lp-subtle" />
              <input value={query} onChange={(e) => { setQuery(e.target.value); setOpen(null); }}
                placeholder="Search, e.g. “download PDF” or “refund”" type="search"
                className="w-full rounded-2xl border border-lp-border bg-lp-surface py-4 pl-12 pr-12 text-[15px] text-lp-text shadow-[var(--lp-shadow)] outline-none transition focus:border-lp-accent focus:ring-4 focus:ring-lp-accent-soft [&::-webkit-search-cancel-button]:hidden" />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-lp-muted transition hover:bg-lp-surface-2 hover:text-lp-text">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            {q && (
              <p className="mt-3 text-sm text-lp-muted" aria-live="polite">
                {matches === 0 ? "No articles match that." : `${matches} article${matches === 1 ? "" : "s"} found`}
              </p>
            )}
          </motion.div>
        </section>

        {/* topic shortcuts */}
        {!q && (
          <section className={`${CONTAINER} pb-6`}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {HELP_TOPICS.map((t, k) => {
                const Icon = TOPIC_ICONS[t.id] ?? Rocket;
                return (
                  <motion.a key={t.id} href={`#${t.id}`}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 + k * 0.05, ease }}
                    whileHover={{ y: -3, transition: { duration: 0.25, ease } }}
                    className="lp-card rounded-2xl p-4 transition-colors hover:border-lp-border-strong">
                    <Icon className="h-5 w-5 text-lp-accent" />
                    <p className="mt-3 text-sm font-medium">{t.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-lp-muted">{t.blurb}</p>
                  </motion.a>
                );
              })}
            </div>
          </section>
        )}

        {/* articles */}
        <section className={`${CONTAINER} pb-16 pt-6`}>
          {topics.map((t) => (
            <div key={t.id} id={t.id} className="scroll-mt-24 pt-8">
              <h2 className="text-lg font-semibold tracking-tight">{t.title}</h2>
              <div className="mt-3 divide-y divide-lp-border border-y border-lp-border">
                {t.articles.map((a) => {
                  const key = `${t.id}:${a.q}`;
                  const isOpen = open === key || (!!q && matches <= 3);
                  return (
                    <div key={key}>
                      <button onClick={() => setOpen(open === key ? null : key)} aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-6 py-4 text-left text-[15px] font-medium transition hover:text-lp-accent">
                        {a.q}
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-lp-border transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                          <Plus className="h-3.5 w-3.5" />
                        </span>
                      </button>
                      {/* Always in the HTML (just collapsed) so search engines can read every answer. */}
                      <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                        transition={{ duration: 0.3, ease }} className="overflow-hidden" aria-hidden={!isOpen}>
                        <p className="max-w-2xl pb-5 pr-10 text-[15px] leading-relaxed text-lp-muted">{a.a}</p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* contact */}
        <section className={`${CONTAINER} pb-20 sm:pb-28`}>
          <div className="lp-gradient-border relative overflow-hidden rounded-3xl p-6 sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
            <h2 className="relative text-2xl font-semibold tracking-tight sm:text-3xl">Still need help?</h2>
            <p className="relative mt-2 max-w-lg text-lp-muted">
              Write or call us and we&apos;ll get back to you within 2 business days. For payment questions, include your
              username and the payment reference from your Billing page.
            </p>
            <div className="relative mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Mail, label: "Support", value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
                { icon: Mail, label: "Founder", value: BUSINESS.altEmail, href: `mailto:${BUSINESS.altEmail}` },
                { icon: Phone, label: "Phone", value: BUSINESS.phone, href: `tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}` },
              ].filter((c) => c.value).map((c) => (
                <a key={c.label} href={c.href}
                  className="group flex items-center gap-3 rounded-2xl border border-lp-border bg-lp-surface-2/60 p-4 transition hover:border-lp-border-strong">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lp-accent-soft text-lp-accent">
                    <c.icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-lp-muted">{c.label}</span>
                    <span className="block truncate text-sm font-medium group-hover:text-lp-accent">{c.value}</span>
                  </span>
                </a>
              ))}
            </div>
            <Link href="/contact" className="relative mt-6 inline-flex items-center gap-1.5 text-sm text-lp-muted transition hover:text-lp-text">
              All contact details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        <footer className="border-t border-lp-border">
          <div className={`${CONTAINER} flex flex-col gap-4 py-8 text-xs text-lp-subtle sm:flex-row sm:items-center sm:justify-between`}>
            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="transition hover:text-lp-text">{l.label}</Link>
              ))}
            </nav>
            <p>© {new Date().getFullYear()} Portxz</p>
          </div>
        </footer>
      </main>
    </MotionConfig>
  );
}
