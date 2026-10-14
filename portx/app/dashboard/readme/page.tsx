"use client";
import { useEffect, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { PortxzLoader } from "@/components/PortxzLoader";
import { PageHeader } from "@/components/PageHeader";
import { Card, Notice, btn } from "@/components/ui";

const STEPS = [
  "Click “Copy text” below.",
  "On GitHub, create a new repository with exactly the same name as your GitHub username.",
  "Open its README.md file, paste, and save. It now shows on your GitHub profile.",
];

export default function ReadmePage() {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/readme").then(async (r) => {
      if (r.ok) setMarkdown((await r.json()).markdown);
      else setFailed(true);
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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Share · Optional"
        title="GitHub README"
        description="Only useful if you have a GitHub account. We turn your details into a ready-made introduction for your GitHub profile."
        actions={
          !loading && !failed && (
            <>
              <button onClick={download} className={btn("secondary")}><Download className="h-4 w-4" /> Download</button>
              <button onClick={copy} className={btn("primary")}>
                {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy text</>}
              </button>
            </>
          )
        }
      />

      <Card title="How to add it to GitHub">
        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-lp-muted">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lp-accent-soft text-xs font-semibold text-lp-accent">{i + 1}</span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      </Card>

      {loading ? (
        <PortxzLoader label="Writing your README" />
      ) : failed ? (
        <Notice tone="error">We couldn&apos;t create your README right now. Please refresh the page to try again.</Notice>
      ) : (
        <Card title="Preview of the text" description="This is what you'll paste. It updates whenever you change your details.">
          <textarea readOnly value={markdown} rows={18} aria-label="README text"
            className="lp-scroll w-full resize-y rounded-xl border border-lp-border bg-lp-surface-2/50 p-4 font-mono text-[13px] leading-relaxed text-lp-muted outline-none" />
        </Card>
      )}
    </div>
  );
}
