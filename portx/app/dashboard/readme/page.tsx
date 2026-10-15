"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ClipboardPaste } from "lucide-react";
import { PortxzLoader } from "@/components/PortxzLoader";
import { PageHeader } from "@/components/PageHeader";
import { Notice } from "@/components/ui";
import { GithubPublish, type PublishTarget } from "@/components/GithubPublish";
import { ReadmePreview } from "@/components/ReadmePreview";

const STEPS = [
  "Copy the text from the preview below (or download README.md).",
  "On GitHub, create a public repository named exactly like your GitHub username.",
  "Open its README.md, paste, and commit. It now shows on your GitHub profile.",
];

export default function ReadmePage() {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [target, setTarget] = useState<PublishTarget>(null);

  useEffect(() => {
    // Personal account → stats for that login; organization → no stats; not connected → GitHub link on the profile.
    const qs = target ? `?github=${target.personal ? encodeURIComponent(target.owner) : ""}` : "";
    fetch(`/api/readme${qs}`, { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("readme_failed");
        setMarkdown((await r.json()).markdown);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [target?.owner, target?.personal]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Share · GitHub"
        title="GitHub README"
        description="A polished introduction for your GitHub profile, built from your Portxz details and kept in sync with one click."
      />

      <GithubPublish onTargetChange={setTarget} />

      {loading ? (
        <PortxzLoader label="Writing your README" />
      ) : failed ? (
        <Notice tone="error">We couldn&apos;t create your README right now. Please refresh the page to try again.</Notice>
      ) : (
        <>
          <div className="flex items-end justify-between gap-3 pt-2">
            <div>
              <h2 className="text-base font-semibold tracking-[-0.01em] text-lp-text">Preview</h2>
              <p className="text-[13px] text-lp-muted">This is how it looks on GitHub. It updates whenever you change your details.</p>
            </div>
          </div>
          <ReadmePreview markdown={markdown} owner={target?.owner ?? null} />
        </>
      )}

      <details className="lp-card group rounded-2xl">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-5 sm:px-6 [&::-webkit-details-marker]:hidden">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-lp-surface-2 text-lp-muted"><ClipboardPaste className="h-4 w-4" /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-lp-text">Prefer to add it by hand?</span>
            <span className="block text-[13px] text-lp-muted">Copy and paste it yourself, without connecting GitHub.</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-lp-subtle transition group-open:rotate-180" />
        </summary>
        <ol className="space-y-3 border-t border-lp-border px-5 py-5 sm:px-6">
          {STEPS.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] text-lp-muted">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lp-accent-soft text-xs font-semibold text-lp-accent">{i + 1}</span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
