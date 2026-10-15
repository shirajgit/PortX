"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Check, CheckCircle2, ClipboardPaste, Download, Lightbulb, Loader2, Lock, RotateCcw, ScanSearch,
  ShieldCheck, Sparkles, Target, Wand2, X,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Notice, btn } from "@/components/ui";
import { Resume } from "@/components/templates/resume/Resume";
import type { PortfolioData } from "@/components/templates/types";
import { applyTailoring, type TailorResponse } from "@/lib/tailor";
import { usePlan } from "@/lib/usePlan";

const STORE_KEY = "portxz:tailor";
const MIN_JOB = 80;
const MAX_JOB = 8000;

type Saved = {
  job: string;
  result: TailorResponse;
  data: PortfolioData;
  accepted: string[];
  useSummary: boolean;
  remaining: number | null;
};

const ERRORS: Record<string, string> = {
  job_too_short: `Paste the full job description (at least ${MIN_JOB} characters) so we can compare it properly.`,
  profile_too_empty: "Add some experience, projects or skills to your profile first. There's nothing to tailor yet.",
  pro_limit_reached: "You've reached this month's fair-use limit for tailoring. More unlock as older ones roll off.",
  ai_not_configured: "The AI service isn't set up yet. Please try again later.",
};

function readSaved(): Saved | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function writeSaved(s: Saved | null) {
  try {
    if (s) localStorage.setItem(STORE_KEY, JSON.stringify(s));
    else localStorage.removeItem(STORE_KEY);
  } catch {}
}

const scoreTone = (n: number) =>
  n >= 75 ? { ring: "var(--lp-green)", text: "text-lp-green", label: "Strong match" }
  : n >= 50 ? { ring: "var(--lp-accent)", text: "text-lp-accent", label: "Good start" }
  : { ring: "var(--lp-warning)", text: "text-lp-warning", label: "Needs tailoring" };

export default function TailorPage() {
  const { loading: planLoading, pro } = usePlan();
  // The page shows a loader until the plan loads (server and client alike), so reading
  // localStorage in the initialisers can't cause a hydration mismatch.
  const [saved] = useState(readSaved);
  const [job, setJob] = useState(saved?.job ?? "");
  const [result, setResult] = useState<TailorResponse | null>(saved?.result ?? null);
  const [data, setData] = useState<PortfolioData | null>(saved?.data ?? null);
  const [accepted, setAccepted] = useState<Set<string>>(new Set(saved?.accepted ?? []));
  const [useSummary, setUseSummary] = useState(saved?.useSummary ?? true);
  const [remaining, setRemaining] = useState<number | null>(saved?.remaining ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persist = (patch: Partial<Saved>) => {
    const base = { job, result, data, accepted: [...accepted], useSummary, remaining };
    const next = { ...base, ...patch };
    if (next.result && next.data) writeSaved(next as Saved);
  };

  async function analyze() {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/ai/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.error ?? "server_error");
      const res = body.result as TailorResponse;
      const ids = res.rewrites.map((w) => w.id);
      setResult(res);
      setData(body.data);
      setAccepted(new Set(ids));
      setUseSummary(!!res.summary);
      setRemaining(body.remaining ?? null);
      writeSaved({ job, result: res, data: body.data, accepted: ids, useSummary: !!res.summary, remaining: body.remaining ?? null });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(ERRORS[(e as Error).message] ?? "We couldn't analyse that job right now. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  function toggle(id: string) {
    const next = new Set(accepted);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setAccepted(next);
    persist({ accepted: [...next] });
  }

  function setAll(on: boolean) {
    const next = new Set(on ? result?.rewrites.map((w) => w.id) : []);
    setAccepted(next);
    persist({ accepted: [...next] });
  }

  function startOver() {
    setResult(null);
    setData(null);
    setError(null);
    writeSaved(null);
  }

  const tailored = useMemo(() => {
    if (!result || !data) return null;
    return applyTailoring(data, {
      summary: useSummary ? result.summary : null,
      rewrites: result.rewrites.filter((w) => accepted.has(w.id)),
      highlightSkills: result.highlightSkills,
    });
  }, [result, data, accepted, useSummary]);

  function downloadPdf() {
    if (!tailored) return;
    const prevTitle = document.title;
    // The browser uses the page title as the PDF file name.
    document.title = [tailored.profile.fullName, "Resume", result?.role].filter(Boolean).join(" - ");
    document.body.classList.add("printing-tailor");
    const done = () => {
      document.body.classList.remove("printing-tailor");
      document.title = prevTitle;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
  }

  if (planLoading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Share · AI" title="Tailor to a job" />
        <div className="h-64 animate-pulse rounded-2xl border border-lp-border bg-lp-surface" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Share · AI"
        title={<>Tailor your resume <span className="lp-gradient-text">to any job</span></>}
        description="Paste a job post. See how well you match, which keywords you're missing, and get a resume rewritten in the job's language, using only facts from your profile."
        actions={result && (
          <button onClick={startOver} className={btn("secondary")}><RotateCcw className="h-4 w-4" /> New job</button>
        )}
      />

      {!pro ? (
        <ProGate />
      ) : !result || !tailored ? (
        <JobInput job={job} setJob={setJob} busy={busy} error={error} onAnalyze={analyze} />
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* ── suggestions ── */}
          <div className="space-y-5">
            <ScoreCard result={result} remaining={remaining} />

            <Card title="Keywords" description="What the job asks for, compared with your profile.">
              <div className="space-y-4">
                <ChipRow icon={<Check className="h-3.5 w-3.5" />} label="You have" items={result.matched} tone="green" empty="No clear matches found." />
                <ChipRow icon={<X className="h-3.5 w-3.5" />} label="Missing from your profile" items={result.missing} tone="warning" empty="Nothing important missing. Nice!" />
                {result.missing.length > 0 && (
                  <p className="flex items-start gap-2 rounded-lg bg-lp-surface-2/70 px-3 py-2.5 text-[13px] leading-relaxed text-lp-muted">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-lp-accent" />
                    Only add these to your profile if they&apos;re true. Interviewers ask about everything on your resume.
                  </p>
                )}
              </div>
            </Card>

            {result.summary && (
              <Card title="Tailored summary" action={<Switch on={useSummary} onChange={(v) => { setUseSummary(v); persist({ useSummary: v }); }} label="Use tailored summary" />}>
                <p className={`text-[15px] leading-relaxed ${useSummary ? "text-lp-text" : "text-lp-subtle"}`}>{result.summary}</p>
              </Card>
            )}

            {result.rewrites.length > 0 && (
              <Card
                title={`Suggested rewrites · ${accepted.size} of ${result.rewrites.length} on`}
                description="Each line is your own experience, phrased the way this job describes it."
                action={
                  <button onClick={() => setAll(accepted.size !== result.rewrites.length)} className={btn("ghost", "sm")}>
                    {accepted.size === result.rewrites.length ? "Turn all off" : "Turn all on"}
                  </button>
                }
              >
                <ul className="space-y-3">
                  {result.rewrites.map((w) => {
                    const on = accepted.has(w.id);
                    return (
                      <li key={w.id}>
                        <button onClick={() => toggle(w.id)} aria-pressed={on}
                          className={`w-full rounded-xl border p-4 text-left transition ${
                            on ? "border-lp-accent/50 bg-lp-accent-soft/60" : "border-lp-border hover:border-lp-border-strong"}`}>
                          <span className="flex items-start justify-between gap-3">
                            <span className="min-w-0 text-xs font-medium text-lp-muted">{w.label}</span>
                            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                              on ? "border-lp-accent bg-lp-accent text-lp-on-accent" : "border-lp-border-strong"}`}>
                              {on && <Check className="h-3 w-3" />}
                            </span>
                          </span>
                          <span className="mt-2 block text-[13px] leading-relaxed text-lp-subtle line-through decoration-lp-subtle/50">{w.original}</span>
                          <span className="mt-1.5 flex gap-2 text-[14px] leading-relaxed text-lp-text">
                            <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-lp-accent" />
                            {w.suggestion}
                          </span>
                          {w.reason && (
                            <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-lp-surface-2 px-2 py-0.5 text-[11px] font-medium text-lp-muted">
                              <Target className="h-3 w-3" /> {w.reason}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            )}

            {result.tips.length > 0 && (
              <Card title="To close the gap">
                <ul className="space-y-2.5">
                  {result.tips.map((t, i) => (
                    <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-lp-muted">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-lp-warning" /> {t}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* ── tailored resume ── */}
          <div className="space-y-3 xl:sticky xl:top-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-lp-text">Your tailored resume</h2>
                <p className="text-[13px] text-lp-muted">Updates live as you turn suggestions on and off. Your saved profile stays unchanged.</p>
              </div>
              <button onClick={downloadPdf} className={btn("primary")}>
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
            <div className="lp-card lp-scroll max-h-[78vh] overflow-auto rounded-2xl bg-lp-surface-2/60 p-3 sm:p-5">
              <div id="tailor-print" className="mx-auto max-w-[760px] overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-black/5">
                <Resume data={tailored} />
              </div>
            </div>
            <p className="text-center text-[12px] text-lp-subtle">
              In the print window, choose <strong>Save as PDF</strong> as the destination.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProGate() {
  return (
    <section className="lp-gradient-border relative overflow-hidden rounded-2xl p-6 sm:p-10">
      <div className="lp-grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative max-w-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lp-accent-soft px-2.5 py-1 text-xs font-medium text-lp-accent">
          <Lock className="h-3.5 w-3.5" /> Pro feature
        </span>
        <h2 className="mt-4 text-[1.4rem] font-semibold tracking-[-0.02em]">Stop sending the same resume everywhere</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-lp-muted">
          Hiring software filters resumes by the words in the job post. Tailoring helps you get past it, and Pro does it in seconds.
        </p>
        <ul className="mt-5 space-y-2 text-[14px] text-lp-muted">
          {["A match score for every job", "The keywords you're missing", "Your bullets rewritten in the job's language", "A tailored PDF, ready to send"].map((t) => (
            <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-lp-green" /> {t}</li>
          ))}
        </ul>
        <Link href="/dashboard/billing" className={btn("primary", "lg", "mt-7")}>
          <Sparkles className="h-4 w-4" /> Unlock with Pro
        </Link>
      </div>
    </section>
  );
}

function JobInput({ job, setJob, busy, error, onAnalyze }: {
  job: string; setJob: (v: string) => void; busy: boolean; error: string | null; onAnalyze: () => void;
}) {
  const len = job.trim().length;
  const ready = len >= MIN_JOB;
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Card>
        <label className="block">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-lp-text">Job description</span>
            <span className={`text-xs tabular-nums ${len > MAX_JOB ? "text-lp-danger" : "text-lp-subtle"}`}>{len.toLocaleString()} / {MAX_JOB.toLocaleString()}</span>
          </span>
          <textarea value={job} onChange={(e) => setJob(e.target.value.slice(0, MAX_JOB + 200))} rows={14} disabled={busy}
            placeholder={"Paste the whole job post here: title, responsibilities and requirements.\n\nTip: copy it straight from LinkedIn, Naukri or the company's careers page."}
            className="lp-scroll mt-2 w-full resize-y rounded-xl border border-lp-border bg-lp-surface px-4 py-3.5 text-[14px] leading-relaxed text-lp-text outline-none transition placeholder:text-lp-subtle hover:border-lp-border-strong focus:border-lp-accent focus:ring-4 focus:ring-lp-accent-soft disabled:opacity-60" />
        </label>

        {error && <Notice tone="error" className="mt-4">{error}</Notice>}

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" disabled={busy}
            onClick={async () => { try { setJob((await navigator.clipboard.readText()).slice(0, MAX_JOB)); } catch {} }}
            className={btn("ghost")}>
            <ClipboardPaste className="h-4 w-4" /> Paste from clipboard
          </button>
          <button onClick={onAnalyze} disabled={!ready || busy || len > MAX_JOB} className={btn("primary", "lg")}>
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Analysing the job…</> : <><ScanSearch className="h-4 w-4" /> Analyse my match</>}
          </button>
        </div>
        {!ready && len > 0 && (
          <p className="mt-3 text-[13px] text-lp-muted">Keep going: paste at least {MIN_JOB} characters for a useful comparison.</p>
        )}
      </Card>

      <div className="lp-card rounded-2xl p-5">
        <p className="text-sm font-semibold text-lp-text">How it works</p>
        <ol className="mt-4 space-y-4">
          {[
            [ScanSearch, "We compare the job with your profile", "Skills, experience and the words recruiters search for."],
            [Wand2, "You pick the rewrites you like", "Every suggestion is your own experience, phrased for this role."],
            [Download, "Download a tailored PDF", "Your saved profile and public page stay exactly as they are."],
          ].map(([Icon, title, text], i) => {
            const I = Icon as typeof ScanSearch;
            return (
              <li key={i} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lp-accent-soft text-lp-accent"><I className="h-4 w-4" /></span>
                <span>
                  <span className="block text-[13px] font-medium text-lp-text">{title as string}</span>
                  <span className="block text-[13px] leading-relaxed text-lp-muted">{text as string}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 flex items-start gap-2 border-t border-lp-border pt-4 text-[12px] leading-relaxed text-lp-subtle">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" /> We never add skills or results you don&apos;t have. Gaps are shown to you instead.
        </p>
      </div>
    </div>
  );
}

function ScoreCard({ result, remaining }: { result: TailorResponse; remaining: number | null }) {
  const tone = scoreTone(result.score);
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <section className="lp-card relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[var(--lp-glow)] blur-3xl" aria-hidden />
      <div className="relative flex items-center gap-5">
        <div className="relative h-[84px] w-[84px] shrink-0" role="img" aria-label={`Match score ${result.score} out of 100`}>
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--lp-surface-2)" strokeWidth="7" />
            <motion.circle cx="40" cy="40" r={r} fill="none" stroke={tone.ring} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - result.score / 100) }}
              transition={{ duration: 0.9, ease: "easeOut" }} />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[1.45rem] font-semibold tabular-nums tracking-tight">{result.score}</span>
        </div>
        <div className="min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-wide ${tone.text}`}>{tone.label}</p>
          {result.role && <p className="mt-0.5 truncate text-[15px] font-semibold text-lp-text">{result.role}</p>}
          <p className="mt-1 text-[14px] leading-relaxed text-lp-muted">{result.verdict}</p>
        </div>
      </div>
      {remaining !== null && (
        <p className="relative mt-4 border-t border-lp-border pt-3 text-[12px] text-lp-subtle">{Math.max(0, remaining)} tailoring runs left this month</p>
      )}
    </section>
  );
}

function ChipRow({ icon, label, items, tone, empty }: {
  icon: React.ReactNode; label: string; items: string[]; tone: "green" | "warning"; empty: string;
}) {
  const cls = tone === "green"
    ? "border-lp-green/25 bg-lp-green/10 text-lp-green"
    : "border-lp-warning/25 bg-lp-warning/10 text-lp-warning";
  return (
    <div>
      <p className="mb-2 text-[13px] font-medium text-lp-text">{label} <span className="font-normal text-lp-subtle">· {items.length}</span></p>
      {items.length ? (
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence initial>
            {items.map((k, i) => (
              <motion.span key={k} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium ${cls}`}>
                {icon}{k}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-[13px] text-lp-subtle">{empty}</p>
      )}
    </div>
  );
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-lp-accent" : "bg-lp-border-strong"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}
