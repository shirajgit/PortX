"use client";
import { useEffect, useState } from "react";
import { usePlan } from "@/lib/usePlan";
import { PlanChip } from "@/components/PlanChip";

export default function TemplatePage() {
  const { pro, expiresAt } = usePlan();
  const [savedTemplate, setSavedTemplate] = useState("minimal"); // what's live in the DB
  const [selected, setSelected] = useState("minimal");           // what's picked in the UI
  const [published, setPublished] = useState(false);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      if (!r.ok) { setError(`Could not load profile (HTTP ${r.status})`); return; }
      const p = await r.json();
      setSavedTemplate(p.template ?? "minimal");
      setSelected(p.template ?? "minimal");
      setPublished(p.isPublished ?? false);
      setUsername(p.username ?? "");
    });
  }, []);

  async function patch(body: { template?: string; isPublished?: boolean }): Promise<boolean> {
    setError(null);
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      setError(
        b.error === "pro_required"
          ? "That template is a Pro feature — upgrade from ₹149 on the Billing page."
          : `Save failed (HTTP ${res.status}): ${JSON.stringify(b.error ?? b)}`
      );
      return false;
    }
    return true;
  }

  /** Apply the selected template (and publish if not yet published). */
  async function applyAndPublish() {
    const ok = await patch({ template: selected, isPublished: true });
    if (ok) { setSavedTemplate(selected); setPublished(true); }
  }

  async function applyOnly() {
    const ok = await patch({ template: selected });
    if (ok) setSavedTemplate(selected);
  }

  async function unpublish() {
    const ok = await patch({ isPublished: false });
    if (ok) setPublished(false);
  }

  const options = [
    { id: "minimal", name: "Minimal", note: "Blue-black, fast, readable.", proOnly: false },
    { id: "cli", name: "CLI Terminal", note: "Interactive command-line — visitors type to explore. The shareable one.", proOnly: true },
    { id: "glass", name: "Glassmorphism", note: "Frosted cards over gradient orbs. The premium look.", proOnly: true },
  ];

  const dirty = selected !== savedTemplate;

  return (
    <div className="w-full max-w-none">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Template &amp; Publish</h1>
        <PlanChip pro={pro} expiresAt={expiresAt} />
      </div>
      <p className="mt-1 text-sm text-[#8B98B8]">
        Pick a template, preview it with your data, then apply. Nothing changes on your live page until you do.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {options.map((o) => {
          const isSelected = selected === o.id;
          const isLive = savedTemplate === o.id;
          return (
            <div key={o.id}
              onClick={() => setSelected(o.id)}
              className={`w-full cursor-pointer rounded-xl border p-4 text-left transition ${
                isSelected ? "border-[#4DA6FF] bg-[#111A36]" : "border-[#1E2C52] hover:border-[#2A3E6E]"}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {o.name}{" "}
                    {o.proOnly && !pro && <span className="rounded bg-[#FFB454]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#FFB454]">PRO</span>}{" "}
                    {isLive && published && <span className="font-mono text-xs text-[#39D98A]">● live</span>}
                    {isSelected && !isLive && <span className="font-mono text-xs text-[#FFB454]">○ selected</span>}
                  </p>
                  <p className="text-sm text-[#8B98B8]">{o.note}</p>
                </div>
                <a href={`/dashboard/preview/${o.id}`} target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#8FC4FF] hover:border-[#4DA6FF]">
                  preview ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* apply / publish */}
      <div className="mt-8 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold">
              {published ? "Published" : "Unpublished"}
              {dirty && <span className="ml-2 font-mono text-xs text-[#FFB454]">unsaved template change</span>}
            </p>
            <p className="text-sm text-[#8B98B8]">
              {published
                ? <>Live at <a className="font-mono text-[#8FC4FF]" href={`/${username}`} target="_blank">portx.in/{username}</a>{" "}
                    with the <span className="font-mono text-[#8FC4FF]">{savedTemplate}</span> template.</>
                : "Your page returns 404 until you publish."}
            </p>
          </div>
          <div className="flex gap-3">
            {published && dirty && (
              <button onClick={applyOnly} disabled={saving}
                className="rounded-lg bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
                {saving ? "Applying…" : "Apply template"}
              </button>
            )}
            {!published && (
              <button onClick={applyAndPublish} disabled={saving}
                className="rounded-lg bg-[#39D98A] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
                {saving ? "Publishing…" : dirty ? "Apply & publish" : "Publish"}
              </button>
            )}
            {published && !dirty && (
              <button onClick={unpublish} disabled={saving}
                className="rounded-lg border border-[#1E2C52] px-5 py-2 text-sm font-semibold disabled:opacity-40">
                Unpublish
              </button>
            )}
            {published && dirty && (
              <button onClick={() => setSelected(savedTemplate)} disabled={saving}
                className="rounded-lg border border-[#1E2C52] px-4 py-2 text-sm text-[#8B98B8]">
                Discard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
