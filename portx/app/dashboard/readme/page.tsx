"use client";
import { useEffect, useState } from "react";

export default function ReadmePage() {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/readme").then(async (r) => {
      if (r.ok) setMarkdown((await r.json()).markdown);
      setLoading(false);
    });
  }, []);

  async function copy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">GitHub README</h1>
      <p className="mt-1 text-sm text-[#8B98B8]">
        Generated from the same profile as your portfolio and resume. Paste it into your
        GitHub profile repo (<span className="font-mono">username/username</span> → README.md).
      </p>

      {loading ? (
        <p className="mt-6 text-[#8B98B8]">Generating…</p>
      ) : (
        <>
          <div className="mt-6 flex gap-3">
            <button onClick={copy}
              className="rounded-lg bg-[#4DA6FF] px-5 py-2.5 text-sm font-semibold text-[#04101F]">
              {copied ? "Copied ✓" : "Copy README.md"}
            </button>
            <button onClick={download}
              className="rounded-lg border border-[#1E2C52] px-5 py-2.5 text-sm font-semibold hover:border-[#4DA6FF]">
              Download .md
            </button>
          </div>
          <textarea readOnly value={markdown} rows={24}
            className="mt-4 w-full resize-y rounded-xl border border-[#1E2C52] bg-[#0F1730] p-4 font-mono text-xs leading-relaxed outline-none" />
        </>
      )}
    </div>
  );
}
