"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { BulletListEditor } from "@/components/editor/BulletListEditor";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PlanChip, LimitChip } from "@/components/PlanChip";

type Exp = {
  id?: string; title: string; organization: string; location: string;
  startDate: string | null; endDate: string | null; bullets: string[];
};
const EMPTY: Exp = { title: "", organization: "", location: "", startDate: null, endDate: null, bullets: [] };
const input = "mt-1 w-full rounded-xl border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none transition focus:border-[#4DA6FF] focus:shadow-[0_0_0_3px_rgba(77,166,255,0.12)]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : null;

export default function ExperiencePage() {
  const { pro, expiresAt } = usePlan();
  const [rows, setRows] = useState<Exp[]>([]);
  const [editing, setEditing] = useState<Exp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/experiences");
    if (!r.ok) { setError(`Could not load experience (HTTP ${r.status})`); return; }
    const data = await r.json();
    setRows(
      (Array.isArray(data) ? data : []).map((e: any) => ({
        ...e,
        bullets: Array.isArray(e.bullets) ? e.bullets : [],
        startDate: e.startDate ? e.startDate.slice(0, 10) : null,
        endDate: e.endDate ? e.endDate.slice(0, 10) : null,
      }))
    );
  };
  useEffect(() => { load(); }, []);

  const atLimit = !pro && rows.length >= FREE_UI_LIMITS.experiences;

  async function save(e: Exp) {
    setError(null);
    setSaving(true);
    const isNew = !e.id;
    const res = await fetch(isNew ? "/api/experiences" : `/api/experiences/${e.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: e.title, organization: e.organization, location: e.location,
        startDate: e.startDate || null, endDate: e.endDate || null,
        bullets: e.bullets.filter(Boolean),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(
        body.error === "free_limit_reached"
          ? `Free plan allows ${body.limit} experience entries — upgrade on the Billing page for unlimited.`
          : `Save failed (HTTP ${res.status}): ${JSON.stringify(body.error ?? body)}`
      );
      return;
    }
    setEditing(null); load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
    if (!res.ok) setError(`Delete failed (HTTP ${res.status})`);
    load();
  }

  return (
    <div className="w-full max-w-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Experience</h1>
          <PlanChip pro={pro} expiresAt={expiresAt} />
          <LimitChip used={rows.length} limit={FREE_UI_LIMITS.experiences} pro={pro} />
        </div>
        {atLimit ? (
          <NextLink href="/dashboard/billing"
            className="rounded-xl bg-[#39D98A] px-4 py-2 text-sm font-semibold text-[#04101F]">
            Upgrade for more
          </NextLink>
        ) : (
          <button onClick={() => { setError(null); setEditing({ ...EMPTY }); }}
            className="rounded-xl bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F] shadow-[0_4px_16px_rgba(77,166,255,0.25)] transition hover:bg-[#8FC4FF]">
            + Add
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">{error}</p>
      )}

      <div className="mt-6 space-y-3">
        {rows.map((e) => (
          <div key={e.id}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-5 transition hover:border-[#2A3E6E] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#4DA6FF]/20 to-[#7C5CFF]/20 text-[#8FC4FF]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  <path d="M3 12h18" />
                </svg>
              </span>
              <div>
                <p className="font-semibold">{e.title} <span className="font-normal text-[#8FA3CC]">@ {e.organization}</span></p>
                <div className="mt-1.5 flex flex-wrap gap-2 font-mono text-[11px]">
                  <span className="rounded-full border border-[#1E2C52] bg-[#111A36] px-2.5 py-0.5 text-[#8FC4FF]">
                    {fmt(e.startDate) ?? "—"} – {fmt(e.endDate) ?? "Present"}
                  </span>
                  {e.location && (
                    <span className="rounded-full border border-[#1E2C52] bg-[#111A36] px-2.5 py-0.5 text-[#8B98B8]">📍 {e.location}</span>
                  )}
                  {e.bullets.length > 0 && (
                    <span className="rounded-full border border-[#1E3A2E] bg-[#0E2018] px-2.5 py-0.5 text-[#39D98A]">
                      {e.bullets.length} bullet{e.bullets.length === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 gap-2 opacity-60 transition group-hover:opacity-100">
              <button onClick={() => { setError(null); setEditing(e); }}
                className="rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#8FC4FF] transition hover:border-[#4DA6FF]">edit</button>
              <button onClick={() => remove(e.id!)}
                className="rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#FF6B6B] transition hover:border-[#FF6B6B]">delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-[#2A3E6E] p-10 text-center">
            <p className="text-3xl">💼</p>
            <p className="mt-2 font-semibold">No experience yet</p>
            <p className="mt-1 text-sm text-[#8B98B8]">Jobs, internships, freelance gigs — anything counts.</p>
          </div>
        )}
      </div>

      {editing && (
        <div className="mt-8 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
          <h2 className="font-semibold">{editing.id ? "Edit experience" : "Add experience"}</h2>
          <label className={label}>Title</label>
          <input className={input} value={editing.title} placeholder="Founder / Intern / Engineer"
            onChange={(ev) => setEditing({ ...editing, title: ev.target.value })} />
          <label className={label}>Organization</label>
          <input className={input} value={editing.organization}
            onChange={(ev) => setEditing({ ...editing, organization: ev.target.value })} />
          <label className={label}>Location</label>
          <input className={input} value={editing.location}
            onChange={(ev) => setEditing({ ...editing, location: ev.target.value })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Start date</label>
              <input type="date" className={input} value={editing.startDate ?? ""}
                onChange={(ev) => setEditing({ ...editing, startDate: ev.target.value || null })} />
            </div>
            <div>
              <label className={label}>End date (blank = present)</label>
              <input type="date" className={input} value={editing.endDate ?? ""}
                onChange={(ev) => setEditing({ ...editing, endDate: ev.target.value || null })} />
            </div>
          </div>
          <label className={label}>Bullets</label>
          <BulletListEditor bullets={editing.bullets} onChange={(b) => setEditing({ ...editing, bullets: b })} />
          <div className="mt-6 flex gap-3">
            <button onClick={() => save(editing)} disabled={!editing.title.trim() || !editing.organization.trim() || saving}
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
