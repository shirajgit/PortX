"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PlanChip, LimitChip } from "@/components/PlanChip";

type Link = { id?: string; kind: string; label: string; url: string };
const KINDS = ["github", "linkedin", "x", "website", "custom"];
const KIND_ICON: Record<string, string> = { github: "🐙", linkedin: "💼", x: "𝕏", website: "🌐", custom: "🔗" };
const input = "mt-1 w-full rounded-xl border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none transition focus:border-[#4DA6FF] focus:shadow-[0_0_0_3px_rgba(77,166,255,0.12)]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

function normalizeUrl(v: string): string {
  const s = v.trim();
  if (!s) return s;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export default function LinksPage() {
  const { pro, expiresAt } = usePlan();
  const [rows, setRows] = useState<Link[]>([]);
  const [editing, setEditing] = useState<Link | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/links");
    if (!r.ok) { setError(`Could not load links (HTTP ${r.status})`); return; }
    const data = await r.json();
    setRows(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, []);

  const atLimit = !pro && rows.length >= FREE_UI_LIMITS.links;

  async function save(l: Link) {
    setError(null);
    setSaving(true);
    const isNew = !l.id;
    const res = await fetch(isNew ? "/api/links" : `/api/links/${l.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: l.kind, label: l.label, url: normalizeUrl(l.url) }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(
        body.error === "free_limit_reached"
          ? `Free plan allows ${body.limit} links — upgrade on the Billing page for unlimited.`
          : `Save failed (HTTP ${res.status}): ${JSON.stringify(body.error ?? body)}`
      );
      return;
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
    if (!res.ok) setError(`Delete failed (HTTP ${res.status})`);
    load();
  }

  return (
    <div className="w-full max-w-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Links</h1>
          <PlanChip pro={pro} expiresAt={expiresAt} />
          <LimitChip used={rows.length} limit={FREE_UI_LIMITS.links} pro={pro} />
        </div>
        {atLimit ? (
          <NextLink href="/dashboard/billing"
            className="rounded-xl bg-[#39D98A] px-4 py-2 text-sm font-semibold text-[#04101F]">
            Upgrade for more
          </NextLink>
        ) : (
          <button onClick={() => { setError(null); setEditing({ kind: "github", label: "", url: "" }); }}
            className="rounded-xl bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F] shadow-[0_4px_16px_rgba(77,166,255,0.25)] transition hover:bg-[#8FC4FF]">
            + Add link
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-[#8B98B8]">Shown on your portfolio, resume, and README.</p>

      {error && (
        <p className="mt-4 rounded-xl border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">{error}</p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map((l) => (
          <div key={l.id}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-4 transition hover:border-[#2A3E6E] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#4DA6FF]/20 to-[#7C5CFF]/20 text-lg">
                {KIND_ICON[l.kind] ?? "🔗"}
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{l.label || l.kind}</p>
                <p className="truncate font-mono text-xs text-[#8B98B8]">{l.url}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2 opacity-60 transition group-hover:opacity-100">
              <button onClick={() => { setError(null); setEditing(l); }}
                className="rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#8FC4FF] transition hover:border-[#4DA6FF]">edit</button>
              <button onClick={() => remove(l.id!)}
                className="rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#FF6B6B] transition hover:border-[#FF6B6B]">delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-[#2A3E6E] p-10 text-center sm:col-span-2">
            <p className="text-3xl">🔗</p>
            <p className="mt-2 font-semibold">No links yet</p>
            <p className="mt-1 text-sm text-[#8B98B8]">Add GitHub and LinkedIn first — recruiters look for them.</p>
          </div>
        )}
      </div>

      {editing && (
        <div className="mt-8 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
          <h2 className="font-semibold">{editing.id ? "Edit link" : "Add link"}</h2>
          <label className={label}>Kind</label>
          <select className={input} value={editing.kind}
            onChange={(e) => setEditing({ ...editing, kind: e.target.value })}>
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <label className={label}>Label</label>
          <input className={input} value={editing.label} placeholder="GitHub"
            onChange={(e) => setEditing({ ...editing, label: e.target.value })} />
          <label className={label}>URL</label>
          <input className={input} value={editing.url} placeholder="github.com/you"
            onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
          <div className="mt-6 flex gap-3">
            <button onClick={() => save(editing)} disabled={!editing.url.trim() || saving}
              className="rounded-xl bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] shadow-[0_4px_16px_rgba(77,166,255,0.25)] disabled:opacity-40">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditing(null)} className="text-sm text-[#8B98B8] hover:text-white">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
