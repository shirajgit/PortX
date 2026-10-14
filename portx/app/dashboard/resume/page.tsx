"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Download, Eye, FileText, Hash, ListChecks, Lock, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Notice, btn } from "@/components/ui";

const TIPS = [
  { icon: ListChecks, title: "Keep it simple", text: "Hiring software reads plain, single-column resumes best — that's exactly the format we use." },
  { icon: Hash, title: "Use numbers", text: "“Grew followers by 40%” is stronger than “Managed social media”. Add results to your highlights." },
  { icon: Search, title: "Match the job", text: "Use the same words the job post uses for skills and tools — that's what recruiters search for." },
];

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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Share"
        title="Resume"
        description="A clean, professional resume made from your details. Whenever you update your info, your resume updates too."
      />

      {!loaded ? (
        <div className="h-48 animate-pulse rounded-2xl border border-lp-border bg-lp-surface" />
      ) : (
        <Card className="overflow-hidden !p-0">
          <div className="grid md:grid-cols-[1fr_260px]">
            <div className="p-6 sm:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lp-green/10 px-2.5 py-1 text-xs font-medium text-lp-green">
                <BadgeCheck className="h-3.5 w-3.5" /> Works with hiring software (ATS)
              </span>
              <h2 className="mt-4 text-xl font-semibold tracking-tight">Your resume is ready to download</h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-lp-muted">
                One page, easy to read, and formatted the way recruiters and job portals expect.
              </p>

              {!pro ? (
                <div className="mt-6 space-y-3">
                  <Notice tone="info">Downloading your resume is part of Pro.</Notice>
                  <Link href="/dashboard/billing" className={btn("primary", "lg")}>
                    <Lock className="h-4 w-4" /> Unlock with Pro
                  </Link>
                </div>
              ) : !published ? (
                <div className="mt-6 space-y-3">
                  <Notice tone="warning">Publish your page first — your resume is created from it.</Notice>
                  <Link href="/dashboard/template" className={btn("primary", "lg")}>Go to Design &amp; publish</Link>
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={`/api/pdf?username=${username}`} className={btn("primary", "lg")}>
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                  <a href={`/${username}/resume`} target="_blank" rel="noreferrer" className={btn("secondary", "lg")}>
                    <Eye className="h-4 w-4" /> Preview
                  </a>
                </div>
              )}
            </div>

            {/* paper preview */}
            <div aria-hidden className="relative hidden border-l border-lp-border bg-lp-surface-2/60 p-6 md:block">
              <div className="relative mx-auto w-[180px] rotate-[2deg] rounded-md bg-white p-4 shadow-xl ring-1 ring-black/5">
                <div className="mx-auto h-2 w-20 rounded bg-[#0A0F1D]" />
                <div className="mx-auto mt-1.5 h-1 w-28 rounded bg-[#C8CDD8]" />
                <div className="mt-3 h-px bg-[#0A0F1D]" />
                {[0, 1, 2].map((s) => (
                  <div key={s} className="mt-3">
                    <div className="h-1 w-12 rounded bg-[#0A0F1D]" />
                    <div className="mt-1.5 space-y-1">
                      {[92, 80, 86].map((w, i) => <div key={i} className="h-1 rounded bg-[#E2E5EC]" style={{ width: `${w}%` }} />)}
                    </div>
                  </div>
                ))}
                <FileText className="absolute bottom-3 right-3 h-4 w-4 text-[#C8CDD8]" />
              </div>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-[15px] font-semibold">Tips for a resume that gets noticed</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {TIPS.map((t) => (
            <div key={t.title} className="lp-card rounded-2xl p-5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-lp-accent-soft text-lp-accent">
                <t.icon className="h-4 w-4" />
              </span>
              <p className="mt-3 font-medium">{t.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-lp-muted">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
