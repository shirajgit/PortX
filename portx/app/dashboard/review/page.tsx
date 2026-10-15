"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle, CheckCircle2, Lightbulb, Loader2, MessageSquareText, RefreshCw, Sparkles, Target, XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Notice, UpgradeLink, btn } from "@/components/ui";

type Category = { name: string; score: number; verdict: "good" | "needs_work" | "missing"; fixes: string[] };
type Result = { score: number; summary: string; categories: Category[] };

const VERDICT = {
  good: { label: "Looks great", tone: "text-lp-green bg-lp-green/10", bar: "var(--lp-green)", icon: CheckCircle2 },
  needs_work: { label: "Could be better", tone: "text-lp-warning bg-lp-warning/10", bar: "var(--lp-warning)", icon: AlertTriangle },
  missing: { label: "Missing", tone: "text-lp-danger bg-lp-danger/10", bar: "var(--lp-danger)", icon: XCircle },
} as const;

const CHECKS = [
  { icon: Target, title: "Impact", text: "Do your highlights show results, not just tasks?" },
  { icon: MessageSquareText, title: "Clarity", text: "Is it easy to understand who you are in 10 seconds?" },
  { icon: CheckCircle2, title: "Completeness", text: "Is anything important missing that recruiters expect?" },
];

const scoreColor = (s: number) => (s >= 75 ? "var(--lp-green)" : s >= 40 ? "var(--lp-warning)" : "var(--lp-danger)");
const scoreWords = (s: number) =>
  s >= 85 ? "Ready to share" : s >= 70 ? "Almost there" : s >= 40 ? "Good start — a few fixes to make" : "Needs some work";

export default function ReviewPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; upgrade: boolean } | null>(null);

  async function run() {
    setError(null);
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/ai/critic", { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(
        body.error === "pro_required"
          ? { message: "AI feedback is part of Pro.", upgrade: true }
          : body.error === "pro_limit_reached"
          ? { message: `You've run ${body.limit ?? 30} reviews in the last 30 days, the monthly fair-use limit. More reviews unlock as older ones roll off.`, upgrade: false }
          : { message: "We couldn't run the review right now. Please try again in a few minutes.", upgrade: false }
      );
      return;
    }
    setResult(await res.json());
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Share"
        title="AI feedback"
        description="Get an honest review of your portfolio with a score and simple, specific things to improve."
        actions={
          <button onClick={run} disabled={loading} className={btn("primary", "lg")}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Reviewing…</>
              : result ? <><RefreshCw className="h-4 w-4" /> Review again</>
              : <><Sparkles className="h-4 w-4" /> Review my portfolio</>}
          </button>
        }
      />

      {error && <Notice tone={error.upgrade ? "info" : "error"} action={error.upgrade ? <UpgradeLink /> : undefined}>{error.message}</Notice>}

      {/* before the first run — explain what happens */}
      {!result && !loading && (
        <Card title="What the review looks at" description="It takes about 20 seconds and reads everything you've added.">
          <div className="grid gap-3 sm:grid-cols-3">
            {CHECKS.map((c) => (
              <div key={c.title} className="rounded-xl border border-lp-border bg-lp-surface-2/50 p-4">
                <c.icon className="h-5 w-5 text-lp-accent" />
                <p className="mt-3 font-medium">{c.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-lp-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {loading && (
        <Card>
          <div className="flex flex-col items-center py-8 text-center">
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-lp-accent-soft text-lp-accent">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </span>
            <p className="mt-4 font-medium">Reading your portfolio…</p>
            <p className="mt-1 text-sm text-lp-muted">Checking your highlights, wording and what might be missing.</p>
          </div>
        </Card>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* overall score */}
            <Card>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full"
                  style={{ background: `conic-gradient(${scoreColor(result.score)} ${result.score * 3.6}deg, var(--lp-border-strong) 0deg)` }}>
                  <div className="grid h-[96px] w-[96px] place-items-center rounded-full bg-lp-surface">
                    <span className="text-center">
                      <span className="block text-3xl font-semibold tracking-tight">{result.score}</span>
                      <span className="block text-[11px] text-lp-muted">out of 100</span>
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">{scoreWords(result.score)}</p>
                  <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-lp-muted">{result.summary}</p>
                </div>
              </div>
            </Card>

            {/* each area */}
            {result.categories.map((c) => {
              const v = VERDICT[c.verdict] ?? VERDICT.needs_work;
              return (
                <Card key={c.name}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold">{c.name}</p>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${v.tone}`}>
                      <v.icon className="h-3.5 w-3.5" /> {v.label} · {c.score}/100
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-lp-surface-2">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.score}%`, background: v.bar }} />
                  </div>
                  {c.fixes.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-sm font-medium">What to improve</p>
                      <ul className="mt-2 space-y-2">
                        {c.fixes.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-lp-muted">
                            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-lp-accent" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-4 inline-flex items-center gap-2 text-sm text-lp-green">
                      <CheckCircle2 className="h-4 w-4" /> Nothing to fix here — nice work.
                    </p>
                  )}
                </Card>
              );
            })}

            <Notice tone="info">
              Make the suggested changes, then click <strong>Review again</strong>. A score of 85 or more means your portfolio is ready to share.
            </Notice>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
