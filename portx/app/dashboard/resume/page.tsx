"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Download, Eye, Terminal, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ResumePage() {
  const [username, setUsername] = useState("");
  const [published, setPublished] = useState(false);
  const [pro, setPro] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      if (!r.ok) { setLoaded(true); return; }
      const p = await r.json();
      setUsername(p.username ?? "");
      setPublished(p.isPublished ?? false);
      setPro(p.plan === "pro" && p.planExpiresAt && new Date(p.planExpiresAt) > new Date());
      setLoaded(true);
    });
  }, []);

  return (
    <div className="w-full max-w-none space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="border-b border-[#1E2C52]/50 pb-5 light:border-slate-200">
        <h1 className="text-2xl font-bold text-white light:text-slate-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-[#4DA6FF]" /> ATS Resume Engine
          <span className="ml-1 rounded bg-[#FFB454]/10 px-2 py-0.5 font-mono text-xs text-[#FFB454] font-bold">PRO</span>
        </h1>
        <p className="mt-1 text-sm text-[#8B98B8] light:text-slate-500">
          Generated directly from your active data workspace into standard, machine-readable text parameters.
        </p>
      </div>

      {!loaded ? (
        <div className="h-40 w-full rounded-xl border border-dashed border-[#1E2C52] bg-[#0F1730]/20 animate-pulse light:border-slate-200" />
      ) : !pro ? (
        /* Paywall Container */
        <div className="w-full rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6 light:bg-white light:border-slate-200 shadow-sm">
          <p className="font-semibold text-white light:text-slate-800">The ATS resume viewer is a Pro feature.</p>
          <p className="mt-1 text-sm text-[#8B98B8] light:text-slate-500">
            Go Pro to instantly access your synced plain-text layout previews and raw binary PDF file download exports.
          </p>
          <Link href="/dashboard/billing"
            className="mt-4 inline-block rounded-lg bg-[#39D98A] px-5 py-2.5 text-sm font-semibold text-[#04101F] hover:bg-opacity-90 transition">
            Upgrade Workspace — from ₹149
          </Link>
        </div>
      ) : !published ? (
        /* Not Published Warning Flag */
        <p className="w-full rounded-xl border border-[#1E2C52] bg-[#111A36] p-4 text-sm text-[#FFB454] light:bg-amber-50/50 light:border-amber-200">
          ⚠️ Please publish your portfolio data first. The document rendering engines process your assets directly from your live public link layouts.
        </p>
      ) : (
        /* Simple Clean Full-Width Output Dashboard Panel */
        <div className="w-full rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6 light:bg-white light:border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-white light:text-slate-800 text-sm uppercase tracking-wider font-mono">Document Compilation Export</h3>
          <p className="text-xs text-[#8B98B8] light:text-slate-500 max-w-xl">
            This workspace translates data fields into a strict single-column layout without tables, charts, or vector shapes to safeguard perfect grading scores across resume sorting parsers.
          </p>
          
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a href={`/${username}/resume`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#1E2C52] bg-[#111A36]/40 px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#4DA6FF] light:bg-white light:border-slate-200 light:text-slate-700">
              <Eye className="h-3.5 w-3.5" /> Plaintext Layout Preview
            </a>
            <a href={`/api/pdf?username=${username}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#4DA6FF] px-4 py-2.5 text-xs font-bold text-[#04101F] transition hover:bg-opacity-90 shadow-sm">
              <Download className="h-3.5 w-3.5" /> Download Standard PDF
            </a>
          </div>
        </div>
      )}

      {/* ATS Core Facts Section */}
      <div className="w-full space-y-4 pt-4">
        <div className="flex items-center gap-2 border-b border-[#1E2C52] pb-2 light:border-slate-100">
          <Terminal className="h-4 w-4 text-[#4DA6FF]" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-[#8B98B8] light:text-slate-500">
            How ATS Parsers Read Your Resume
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#1E2C52]/60 bg-[#111A36] p-5 light:bg-slate-50/50 light:border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#FFB454]">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <h4 className="text-xs font-bold uppercase font-mono tracking-wide">01. Layout Pitfalls</h4>
            </div>
            <p className="text-xs text-[#8B98B8] light:text-slate-600 leading-relaxed">
              Multi-column configurations, horizontal lines, tables, text boxes, graphic icons, and custom canvases completely scramble modern parser hierarchies, turning your application into unreadable source code.
            </p>
          </div>

          <div className="rounded-xl border border-[#1E2C52]/60 bg-[#111A36] p-5 light:bg-slate-50/50 light:border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#39D98A]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <h4 className="text-xs font-bold uppercase font-mono tracking-wide">02. Formatting Standards</h4>
            </div>
            <p className="text-xs text-[#8B98B8] light:text-slate-600 leading-relaxed">
              Tracking systems extract plain text and look for standard header flags like <code className="text-white light:text-slate-800 font-mono text-[11px]">PROFESSIONAL EXPERIENCE</code> or <code className="text-white light:text-slate-800 font-mono text-[11px]">TECHNICAL SKILLS</code> to categorize metrics safely.
            </p>
          </div>

          <div className="rounded-xl border border-[#1E2C52]/60 bg-[#111A36] p-5 light:bg-slate-50/50 light:border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#4DA6FF]">
              <FileText className="h-4 w-4 shrink-0" />
              <h4 className="text-xs font-bold uppercase font-mono tracking-wide">03. Context Match Optimization</h4>
            </div>
            <p className="text-xs text-[#8B98B8] light:text-slate-600 leading-relaxed">
              Systems scan keyword proximity rankings. Ensure your core experience points contain explicit structural details, listing technical frameworks, metrics, and project parameters directly inline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}