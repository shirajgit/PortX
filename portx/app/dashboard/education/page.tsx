"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PlanChip, LimitChip } from "@/components/PlanChip";

type Edu = { id?: string; institution: string; degree: string; startYear: number | null; endYear: number | null; score: string };
const EMPTY: Edu = { institution: "", degree: "", startYear: null, endYear: null, score: "" };
const input = "mt-1 w-full rounded-xl border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none transition focus:border-[#4DA6FF] focus:shadow-[0_0_0_3px_rgba(77,166,255,0.12)]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR + 6 - 1980 }, (_, i) => THIS_YEAR + 5 - i);

export default function EducationPage() {
  const { pro, expiresAt } = usePlan();
  const [rows, setRows] = useState<Edu[]>([]);
  const [editing, setEditing] = useState<Edu | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/educations");
    if (!r.ok) { setError(`Could not load education (HTTP ${r.status})`); return; }
    const data = await r.json();
    setRows(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, []);

  const atLimit = !pro && rows.length >= FREE_UI_LIMITS.educations;

  async function save(e: Edu) {
    setError(null);
    setSaving(true);
    const isNew = !e.id;
    const res = await fetch(isNew ? "/api/educations" : `/api/educations/${e.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institution: e.institution.trim(),
        degree: e.degree,
        startYear: e.startYear,
        endYear: e.endYear,
        score: e.score,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(
        body.error === "free_limit_reached"
          ? `Free plan allows ${body.limit} education entries — upgrade on the Billing page for unlimited.`
          : `Save failed (HTTP ${res.status}): ${JSON.stringify(body.error ?? body)}`
      );
      return; // keep the form open — nothing lost
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/educations/${id}`, { method: "DELETE" });
    if (!res.ok) setError(`Delete failed (HTTP ${res.status})`);
    load();
  }

  return (
    <div className="w-full max-w-none">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Education</h1>
          <PlanChip pro={pro} expiresAt={expiresAt} />
          <LimitChip used={rows.length} limit={FREE_UI_LIMITS.educations} pro={pro} />
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
        <p className="mt-4 rounded-xl border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">
          {error}
        </p>
      )}

      {/* timeline cards */}
      <div className="mt-6 space-y-3">
        {rows.map((e) => (
          <div key={e.id}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-5 transition hover:border-[#2A3E6E] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-4">
              {/* grad-cap chip */}
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#4DA6FF]/20 to-[#7C5CFF]/20 text-[#8FC4FF]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M2 8.5 12 4l10 4.5L12 13 2 8.5z" />
                  <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
                </svg>
              </span>
              <div>
                <p className="font-semibold">{e.institution}</p>
                <p className="mt-0.5 text-sm text-[#8B98B8]">{e.degree || "—"}</p>
                <div className="mt-1.5 flex flex-wrap gap-2 font-mono text-[11px]">
                  {(e.startYear || e.endYear) && (
                    <span className="rounded-full border border-[#1E2C52] bg-[#111A36] px-2.5 py-0.5 text-[#8FC4FF]">
                      {[e.startYear, e.endYear].filter(Boolean).join(" – ")}
                    </span>
                  )}
                  {e.score && (
                    <span className="rounded-full border border-[#1E3A2E] bg-[#0E2018] px-2.5 py-0.5 text-[#39D98A]">
                      {e.score}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 gap-2 opacity-60 transition group-hover:opacity-100">
              <button onClick={() => { setError(null); setEditing(e); }}
                className="rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#8FC4FF] transition hover:border-[#4DA6FF]">
                edit
              </button>
              <button onClick={() => remove(e.id!)}
                className="rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#FF6B6B] transition hover:border-[#FF6B6B]">
                delete
              </button>
            </div>
          </div>
        ))}

        {rows.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-[#2A3E6E] p-10 text-center">
            <p className="text-3xl">🎓</p>
            <p className="mt-2 font-semibold">No education yet</p>
            <p className="mt-1 text-sm text-[#8B98B8]">Add your college, university, or diploma — it shows on your portfolio and resume.</p>
          </div>
        )}
      </div>

      {/* editor card */}
      {editing && (
        <div className="mt-8 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
          <h2 className="font-semibold">{editing.id ? "Edit education" : "Add education"}</h2>

          <label className={label}>Institution</label>
          <input className={input} value={editing.institution} placeholder="Your college / university"
            onChange={(ev) => setEditing({ ...editing, institution: ev.target.value })} />

          <label className={label}>Degree</label>
          <input className={input} value={editing.degree} placeholder="Diploma in Computer Science"
            onChange={(ev) => setEditing({ ...editing, degree: ev.target.value })} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={label}>Start year</label>
              <select className={input} value={editing.startYear ?? ""}
                onChange={(ev) => setEditing({ ...editing, startYear: ev.target.value ? Number(ev.target.value) : null })}>
                <option value="">—</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>End year</label>
              <select className={input} value={editing.endYear ?? ""}
                onChange={(ev) => setEditing({ ...editing, endYear: ev.target.value ? Number(ev.target.value) : null })}>
                <option value="">—</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Score</label>
              <input className={input} value={editing.score} placeholder="8.4 CGPA"
                onChange={(ev) => setEditing({ ...editing, score: ev.target.value })} />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => save(editing)} disabled={!editing.institution.trim() || saving}
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
