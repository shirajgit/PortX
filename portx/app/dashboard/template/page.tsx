"use client";
import { useEffect, useState } from "react";
import { usePlan } from "@/lib/usePlan";
import { PlanChip } from "@/components/PlanChip";

/* ── Template & Publish — gallery edition ───────────────────────────────
   3-wide grid of template cards, each with a hand-drawn CSS thumbnail
   that mimics the template's real look. No screenshots needed.        */

const OPTIONS = [
  { id: "minimal", name: "Minimal", note: "Blue-black, fast, readable.", proOnly: false },
  { id: "cli", name: "CLI Terminal", note: "Visitors type commands to explore. The shareable one.", proOnly: true },
  { id: "glass", name: "Glassmorphism", note: "Frosted cards over gradient orbs.", proOnly: true },
  { id: "noir", name: "Noir", note: "Black & gold quiet luxury.", proOnly: true },
  { id: "executive", name: "Executive", note: "Corporate-clean & light. Interview-ready.", proOnly: true },
  { id: "aurora", name: "Aurora", note: "Glowing gradient washes. Luminous.", proOnly: true },
];

/* miniature CSS previews per template */
function Thumb({ id }: { id: string }) {
  const base = "pointer-events-none h-full w-full overflow-hidden";
  switch (id) {
    case "minimal":
      return (
        <div className={`${base} bg-[#0A0F1E] p-3`}>
          <div className="h-2 w-16 rounded bg-[#4DA6FF]" />
          <div className="mt-1.5 h-1.5 w-24 rounded bg-[#3A4664]" />
          <div className="mt-3 space-y-1.5">
            <div className="h-6 rounded border border-[#1E2C52] bg-[#111A36]" />
            <div className="h-6 rounded border border-[#1E2C52] bg-[#111A36]" />
          </div>
        </div>
      );
    case "cli":
      return (
        <div className={`${base} bg-[#070C1A] p-3 font-mono`}>
          <div className="flex gap-1">
            <i className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" />
            <i className="h-1.5 w-1.5 rounded-full bg-[#FFB454]" />
            <i className="h-1.5 w-1.5 rounded-full bg-[#39D98A]" />
          </div>
          <p className="mt-2 text-[8px] text-[#39D98A]">visitor@you:~$ <span className="text-[#E8EDF7]">whoami</span></p>
          <div className="mt-1 h-1.5 w-20 rounded bg-[#2A3550]" />
          <p className="mt-2 text-[8px] text-[#39D98A]">visitor@you:~$ <span className="inline-block h-2 w-1 animate-pulse bg-[#4DA6FF] align-middle" /></p>
        </div>
      );
    case "glass":
      return (
        <div className={`${base} relative bg-[#0A0F1E] p-3`}>
          <div className="absolute -left-3 -top-3 h-12 w-12 rounded-full bg-[#4DA6FF]/40 blur-lg" />
          <div className="absolute -bottom-3 -right-3 h-12 w-12 rounded-full bg-[#7C5CFF]/40 blur-lg" />
          <div className="relative mt-2 h-8 rounded-lg border border-white/20 bg-white/10 backdrop-blur" />
          <div className="relative mt-1.5 h-5 w-2/3 rounded-lg border border-white/15 bg-white/5 backdrop-blur" />
        </div>
      );
    case "editorial":
      return (
        <div className={`${base} bg-[#FAF7F1] p-3`}>
          <div className="h-2.5 w-20 rounded-sm bg-[#191714]" />
          <div className="mt-1 h-1.5 w-14 rounded-sm bg-[#B4532A]/70" />
          <div className="mt-2.5 border-t-2 border-[#191714] pt-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[7px] text-[#B4532A]">01</span>
              <div className="h-1 w-16 rounded bg-[#8A8377]" />
            </div>
            <div className="mt-1 h-1 w-24 rounded bg-[#D8D2C6]" />
            <div className="mt-0.5 h-1 w-20 rounded bg-[#D8D2C6]" />
          </div>
        </div>
      );
    case "noir":
      return (
        <div className={`${base} flex flex-col items-center justify-center bg-[#0B0B0D] p-3`}>
          <div className="h-2.5 w-20 rounded-sm bg-[#EDEAE2]" />
          <div className="mt-1.5 h-px w-10 bg-[#D4B36A]" />
          <div className="mt-1.5 h-1 w-14 rounded bg-[#8F8A7E]/60" />
          <div className="mt-2 flex gap-2">
            <div className="h-1 w-6 rounded bg-[#D4B36A]/70" />
            <div className="h-1 w-6 rounded bg-[#D4B36A]/70" />
          </div>
        </div>
      );
    case "bento":
      return (
        <div className={`${base} grid grid-cols-3 gap-1 bg-[#0C0E14] p-2`}>
          <div className="col-span-2 rounded-md bg-gradient-to-br from-[#182036] to-[#10131D]" />
          <div className="rounded-md bg-[#11151F]" />
          <div className="rounded-md bg-gradient-to-br from-[#1A2440] to-[#111524]" />
          <div className="rounded-md bg-gradient-to-br from-[#241A3E] to-[#141021]" />
          <div className="rounded-md bg-[#11151F]" />
        </div>
      );
    case "executive":
      return (
        <div className={`${base} bg-[#F6F8FB]`}>
          <div className="h-1.5 w-full bg-gradient-to-r from-[#1E3A5F] to-[#2563EB]" />
          <div className="p-2.5">
            <div className="rounded-md border border-[#E2E8F0] bg-white p-1.5 shadow-sm">
              <div className="h-1.5 w-14 rounded bg-[#1E3A5F]" />
              <div className="mt-1 h-1 w-10 rounded bg-[#2563EB]/60" />
            </div>
            <div className="mt-1.5 flex gap-1.5">
              <div className="h-4 flex-1 rounded-md border border-[#E2E8F0] bg-white" />
              <div className="h-4 flex-1 rounded-md border border-[#E2E8F0] bg-white" />
            </div>
          </div>
        </div>
      );
    case "aurora":
      return (
        <div className={`${base} relative bg-[#070912] p-3`}>
          <div className="absolute -left-2 -top-4 h-10 w-16 rotate-12 rounded-full bg-[#22D3EE]/30 blur-lg" />
          <div className="absolute -right-2 top-2 h-10 w-12 rounded-full bg-[#8B5CF6]/30 blur-lg" />
          <div className="absolute bottom-0 left-4 h-8 w-14 rounded-full bg-[#EC4899]/20 blur-lg" />
          <div className="relative mt-1 h-2.5 w-20 rounded bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6]" />
          <div className="relative mt-1.5 h-1 w-14 rounded bg-[#3A4258]" />
          <div className="relative mt-2 h-5 rounded-lg border border-white/10 bg-white/5" />
        </div>
      );
    default:
      return <div className={`${base} bg-[#0A0F1E]`} />;
  }
}

export default function TemplatePage() {
  const { pro, expiresAt } = usePlan();
  const [savedTemplate, setSavedTemplate] = useState("minimal");
  const [selected, setSelected] = useState("minimal");
  const [published, setPublished] = useState(false);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeFor, setUpgradeFor] = useState<string | null>(null); // template name that triggered the popup

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
          ? "That template is a Pro feature — unlock all 7 premium templates from ₹49 on the Billing page."
          : `Save failed (HTTP ${res.status}): ${JSON.stringify(b.error ?? b)}`
      );
      return false;
    }
    return true;
  }

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

  const dirty = selected !== savedTemplate;

  return (
    <div className="w-full max-w-none">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Template &amp; Publish</h1>
        <PlanChip pro={pro} expiresAt={expiresAt} />
      </div>
      <p className="mt-1 text-sm text-[#8B98B8]">
        Pick a look, preview it, then apply. Nothing changes on your live page until you do.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">
          {error}
        </p>
      )}

      {/* gallery grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OPTIONS.map((o) => {
          const isSelected = selected === o.id;
          const isLive = savedTemplate === o.id && published;
          return (
            <div key={o.id}
              onClick={() => {
                if (o.proOnly && !pro) { setUpgradeFor(o.name); return; }
                setSelected(o.id);
              }}
              className={`group cursor-pointer overflow-hidden rounded-2xl border transition-all ${
                isSelected
                  ? "border-[#4DA6FF] shadow-[0_0_0_1px_#4DA6FF,0_12px_32px_rgba(77,166,255,0.15)]"
                  : "border-[#1E2C52] hover:border-[#2A3E6E] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"}`}>
              {/* thumbnail */}
              <div className="relative aspect-[16/10]">
                <Thumb id={o.id} />
                {/* hover overlay with preview */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                  <a href={`/preview/${o.id}`} target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg bg-white/95 px-4 py-2 text-sm font-semibold text-[#0A0F1E] shadow-lg">
                    Preview ↗
                  </a>
                </div>
                {/* badges */}
                <div className="absolute left-2 top-2 flex gap-1.5">
                  {isLive && (
                    <span className="rounded-full bg-[#0E2018]/90 px-2 py-0.5 font-mono text-[10px] text-[#39D98A] backdrop-blur">● live</span>
                  )}
                  {isSelected && !isLive && (
                    <span className="rounded-full bg-[#1F1A08]/90 px-2 py-0.5 font-mono text-[10px] text-[#FFB454] backdrop-blur">○ selected</span>
                  )}
                </div>
                {o.proOnly && !pro && (
                  <span className="absolute right-2 top-2 rounded-full bg-[#FFB454]/90 px-2 py-0.5 font-mono text-[10px] font-bold text-[#1F1A08]">PRO</span>
                )}
              </div>
              {/* meta */}
              <div className="border-t border-[#1E2C52] bg-[#0F1730] p-4">
                <p className="font-semibold">{o.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#8B98B8]">{o.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* apply / publish bar */}
      <div className="sticky bottom-4 mt-8 rounded-2xl border border-[#1E2C52] bg-[#0F1730]/95 p-5 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold">
              {published ? "Published" : "Unpublished"}
              {dirty && <span className="ml-2 font-mono text-xs text-[#FFB454]">unsaved template change</span>}
            </p>
            <p className="text-sm text-[#8B98B8]">
              {published
                ? <>Live at <a className="font-mono text-[#8FC4FF]" href={`/${username}`} target="_blank">portxz.in/{username}</a>{" "}
                    with <span className="font-mono text-[#8FC4FF]">{savedTemplate}</span>.</>
                : "Your page returns 404 until you publish."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
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
                className="rounded-lg bg-red-400 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40">
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

      {/* upgrade popup — free user tapped a PRO template */}
      {upgradeFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setUpgradeFor(null)}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#4DA6FF] to-[#7C5CFF] text-xl shadow-[0_8px_24px_rgba(77,166,255,0.35)]">
              ✨
            </span>
            <h2 className="mt-4 text-lg font-bold">{upgradeFor} is a Pro template</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#8B98B8]">
              Unlock <span className="text-[#E8EDF7]">all premium templates</span>, the AI review,
              resume PDF and unlimited everything.
            </p>
            <p className="mt-3 font-mono text-sm">
              <span className="text-[#8B98B8] line-through">₹149</span>{" "}
              <span className="text-2xl font-bold text-[#39D98A]">₹49</span>
              <span className="text-xs text-[#FFB454]"> · launch offer, first 50 users</span>
            </p>
            <a href="/dashboard/billing"
              className="mt-5 block rounded-xl bg-[#39D98A] px-5 py-2.5 text-sm font-semibold text-[#04101F] shadow-[0_8px_24px_rgba(57,217,138,0.3)]">
              Upgrade for ₹49 →
            </a>
            <button onClick={() => setUpgradeFor(null)}
              className="mt-3 text-sm text-[#8B98B8] hover:text-white">
              Keep browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
