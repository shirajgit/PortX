"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div className="w-full max-w-none">
      <h1 className="text-2xl font-bold">Resume PDF <span className="ml-1 rounded bg-[#FFB454]/15 px-2 py-0.5 font-mono text-xs text-[#FFB454]">PRO</span></h1>
      <p className="mt-1 text-sm text-[#8B98B8]">
        Generated from the same data as your portfolio — always in sync.
      </p>

      {!loaded ? null : !pro ? (
        <div className="mt-6 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6">
          <p className="font-semibold">The ATS resume is a Pro feature.</p>
          <p className="mt-1 text-sm text-[#8B98B8]">
            Go Pro to unlock the synced resume view and PDF download — plus all templates and unlimited AI.
          </p>
          <Link href="/dashboard/billing"
            className="mt-4 inline-block rounded-lg bg-[#39D98A] px-5 py-2.5 text-sm font-semibold text-[#04101F]">
            Upgrade — from ₹149
          </Link>
        </div>
      ) : !published ? (
        <p className="mt-6 rounded-lg border border-[#1E2C52] bg-[#111A36] p-4 text-sm text-[#FFB454]">
          Publish your portfolio first (Template &amp; Publish) — the PDF renders your public page.
        </p>
      ) : (
        <div className="mt-6 flex gap-4">
          <a href={`/${username}/resume`} target="_blank"
            className="rounded-lg border border-[#1E2C52] px-5 py-2.5 text-sm font-semibold hover:border-[#4DA6FF]">
            Preview
          </a>
          <a href={`/api/pdf?username=${username}`}
            className="rounded-lg bg-[#4DA6FF] px-5 py-2.5 text-sm font-semibold text-[#04101F]">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
