"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Cpu, 
  AlertCircle, 
  RefreshCw, 
  Play, 
  Gauge, 
  HelpCircle,
  CheckCircle2, 
  AlertTriangle, 
  XCircle 
} from "lucide-react";

type Category = { name: string; score: number; verdict: "good" | "needs_work" | "missing"; fixes: string[] };
type Result = { score: number; summary: string; categories: Category[] };

const VERDICT = {
  good: { label: "Passed System Check", color: "#39D98A", bg: "rgba(57,217,138,0.06)", border: "rgba(57,217,138,0.2)", icon: CheckCircle2 },
  needs_work: { label: "Warning Flag", color: "#FFB454", bg: "rgba(255,180,84,0.06)", border: "rgba(255,180,84,0.2)", icon: AlertTriangle },
  missing: { label: "Critical Fail", color: "#FF6B6B", bg: "rgba(255,107,107,0.06)", border: "rgba(255,107,107,0.2)", icon: XCircle },
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
          ? "AI is not configured — add the API key to your environment variables."
          : `Review failed (HTTP ${res.status}): ${JSON.stringify(body.error ?? body)}`
      );
      return;
    }
    setResult(await res.json());
  }

  const scoreColor = (s: number) => (s >= 75 ? "#39D98A" : s >= 40 ? "#FFB454" : "#FF6B6B");

  return (
    <div className="w-full max-w-none space-y-6 transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="border-b border-[#1E2C52]/50 pb-5 light:border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900 flex items-center gap-2">
            <Cpu className="h-6 w-6 text-[#4DA6FF]" /> AI ATS & Profile Audit
            <span className="ml-1 rounded bg-[#FFB454]/10 px-2 py-0.5 font-mono text-xs text-[#FFB454] font-bold">PRO</span>
          </h1>
          <p className="mt-1 text-sm text-[#8B98B8] light:text-slate-500">
            Executes a deep-rubric neural parsing sweep checking for keyword match density, structural anomalies, and impact metrics.
          </p>
        </div>

        <button 
          onClick={run} 
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4DA6FF] px-5 py-3 text-sm font-bold text-[#04101F] transition hover:bg-opacity-90 disabled:opacity-40 shrink-0 shadow-md shadow-blue-500/5"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Compiling Telemetry...
            </>
          ) : result ? (
            <>
              <RefreshCw className="h-4 w-4" /> Re-Run AI Audit
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" /> Initialize Neural Audit
            </>
          )}
        </button>
      </div>

      {/* Exception Error Flags */}
      {error && (
        <div className="w-full flex items-center gap-3 rounded-xl border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B] light:bg-red-50 light:border-red-200 light:text-red-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Realtime Engine Analysis Loading Blocks */}
      {loading && (
        <div className="w-full rounded-xl border border-dashed border-[#1E2C52] bg-[#0F1730] p-8 text-center space-y-3 light:bg-slate-50/50 light:border-slate-200">
          <div className="inline-block relative">
            <div className="h-10 w-10 rounded-full border-2 border-t-[#4DA6FF] border-r-transparent border-b-transparent border-l-transparent animate-spin mx-auto" />
            <Sparkles className="h-4 w-4 text-[#FFB454] absolute top-3 left-3 animate-pulse" />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs text-white light:text-slate-700 uppercase tracking-widest font-semibold">Running Script Routines</p>
            <p className="text-xs text-[#8B98B8] light:text-slate-400 font-mono">analyzing structural trees · parsing terminology matrices · tracking syntax errors...</p>
          </div>
        </div>
      )}

      {/* Core Audit Evaluation Results Display Layout */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Diagnostic Global Score Summary Card Layout */}
          <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-6 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 light:bg-white light:border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 text-[#1E2C52]/10 pointer-events-none light:text-slate-50">
              <Gauge className="h-32 w-32 translate-x-6 -translate-y-6" />
            </div>

            {/* Radial Conic Score Metric Shield */}
            <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full shadow-inner"
              style={{ background: `conic-gradient(${scoreColor(result.score)} ${result.score * 3.6}deg, #1E2C52 0deg)` }}>
              <div className="grid h-[78px] w-[78px] place-items-center rounded-full bg-[#0F1730] light:bg-white">
                <span className="text-3xl font-black tracking-tighter" style={{ color: scoreColor(result.score) }}>
                  {result.score}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 max-w-2xl relative">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4DA6FF] bg-blue-500/10 px-2 py-0.5 rounded">
                Parser Registry Integrity
              </span>
              <p className="text-sm text-slate-300 light:text-slate-600 leading-relaxed font-medium pt-1">
                {result.summary}
              </p>
            </div>
          </div>

          {/* Subcategory Diagnostic Checklist Cards */}
          <div className="grid grid-cols-1 gap-4">
            {result.categories.map((c) => {
              const v = VERDICT[c.verdict] ?? VERDICT.needs_work;
              const VerdictIcon = v.icon;

              return (
                <div key={c.name} 
                  className="rounded-2xl border bg-[#111A36] p-5 light:bg-white light:border-slate-200 flex flex-col md:flex-row gap-4 items-start justify-between"
                  style={{ borderColor: `var(--light-border, ${v.border})` }}
                >
                  <div className="space-y-3 flex-1 w-full">
                    {/* Category Title Header Area */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-bold text-white light:text-slate-800 text-base tracking-tight">{c.name}</p>
                      
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
                        style={{ color: v.color, backgroundColor: v.bg, border: `1px solid ${v.border}` }}>
                        <VerdictIcon className="h-3.5 w-3.5" />
                        <span>{v.label} · {c.score}%</span>
                      </div>
                    </div>

                    {/* Linear Micro Metric Gauge bar */}
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#1E2C52] light:bg-slate-100 w-full">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${c.score}%`, background: v.color }} />
                    </div>

                    {/* Action Item Refactoring Sublists */}
                    {c.fixes.length > 0 ? (
                      <div className="pt-2 space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B98B8] light:text-slate-400 font-bold block">
                          Required Optimization Pipeline
                        </span>
                        <ul className="space-y-2 text-sm text-[#8B98B8] light:text-slate-600 font-sans">
                          {c.fixes.map((f, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#4DA6FF] shrink-0 mt-2" />
                              <span className="leading-relaxed">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs text-[#39D98A] font-mono flex items-center gap-1.5 pt-1">
                        ✓ Section verification clean. No optimization warnings flagged by neural runtime.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification Advisory Footer Label */}
          <div className="rounded-xl border border-dashed border-[#1E2C52] p-4 bg-[#0F1730] light:bg-slate-50 light:border-slate-200 flex gap-2.5 text-xs text-[#8B98B8] light:text-slate-500">
            <HelpCircle className="h-4 w-4 text-[#4DA6FF] shrink-0 mt-0.5" />
            <p>
              Strategic Protocol: Eliminate warning indicators and critical faults sequentially. Re-run telemetry passes continuously to inspect your score vectors. Aim to cross a baseline metric index threshold of <strong>85%+</strong> before initiating application distribution routes.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}