"use client";
import { useState } from "react";

type Category = { name: string; score: number; verdict: "good" | "needs_work" | "missing"; fixes: string[] };
type Result = { score: number; summary: string; categories: Category[] };

const VERDICT = {
  good: { label: "✓ good", color: "#39D98A" },
  needs_work: { label: "△ needs work", color: "#FFB454" },
  missing: { label: "✗ missing", color: "#FF6B6B" },
} as const;

export default function ReviewPage() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          ? "AI Review is a Pro feature — upgrade from ₹149 on the Billing page."
          : body.error === "ai_not_configured"
          ? "AI is not configured — add the API key to your environment."
          : `Review failed (HTTP ${res.status}): ${JSON.stringify(body.error ?? body)}`
      );
      return;
    }
    setResult(await res.json());
  }

  const scoreColor = (s: number) => (s >= 75 ? "#39D98A" : s >= 40 ? "#FFB454" : "#FF6B6B");

  return (
    <div className="w-full max-w-none">
      <h1 className="text-2xl font-bold">AI Portfolio Review <span className="ml-1 rounded bg-[#FFB454]/15 px-2 py-0.5 font-mono text-xs text-[#FFB454]">PRO</span></h1>
      <p className="mt-1 text-sm text-[#8B98B8]">
        A strict rubric review of your whole profile — projects, impact, completeness — with specific fixes.
        It only judges what you've entered; it never invents facts.
      </p>

      <button onClick={run} disabled={loading}
        className="mt-6 rounded-lg bg-[#4DA6FF] px-6 py-2.5 text-sm font-semibold text-[#04101F] disabled:opacity-40">
        {loading ? "Reviewing…" : result ? "Run again" : "Run review"}
      </button>

      {error && (
        <p className="mt-4 rounded-lg border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">
          {error}
        </p>
      )}

      {loading && (
        <p className="mt-6 font-mono text-sm text-[#8B98B8]">analyzing profile · scoring rubric · writing fixes…</p>
      )}

      {result && (
        <div className="mt-8">
          {/* score header */}
          <div className="flex items-center gap-6 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6">
            <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full"
              style={{ background: `conic-gradient(${scoreColor(result.score)} ${result.score * 3.6}deg, #1E2C52 0deg)` }}>
              <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-[#0F1730]">
                <span className="text-2xl font-bold" style={{ color: scoreColor(result.score) }}>
                  {result.score}
                </span>
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#8B98B8]">Portfolio readiness</p>
              <p className="mt-1 text-sm leading-relaxed">{result.summary}</p>
            </div>
          </div>

          {/* categories */}
          <div className="mt-4 space-y-3">
            {result.categories.map((c) => {
              const v = VERDICT[c.verdict] ?? VERDICT.needs_work;
              return (
                <div key={c.name} className="rounded-xl border border-[#1E2C52] bg-[#111A36] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold">{c.name}</p>
                    <p className="font-mono text-xs" style={{ color: v.color }}>
                      {v.label} · {c.score}
                    </p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1E2C52]">
                    <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: v.color }} />
                  </div>
                  {c.fixes.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm text-[#8B98B8]">
                      {c.fixes.map((f, i) => (
                        <li key={i} className="relative pl-4 before:absolute before:left-0 before:text-[#4DA6FF] before:content-['→']">
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-[#8B98B8]">
            Fix the reds first, re-run, watch the score climb. Aim for 85+ before sharing widely.
          </p>
        </div>
      )}
    </div>
  );
}
