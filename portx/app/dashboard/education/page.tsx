"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PlanChip, LimitChip } from "@/components/PlanChip";

type Edu = { id?: string; institution: string; degree: string; startYear: number | null; endYear: number | null; score: string };
const EMPTY: Edu = { institution: "", degree: "", startYear: null, endYear: null, score: "" };
const input = "mt-1 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none focus:border-[#4DA6FF]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

export default function EducationPage() {
  const { pro, expiresAt } = usePlan();
  const [rows, setRows] = useState<Edu[]>([]);
  const [editing, setEditing] = useState<Edu | null>(null);
  const load = () => fetch("/api/educations").then(async (r) => setRows(await r.json()));
  useEffect(() => { load(); }, []);

  async function save(e: Edu) {
    const isNew = !e.id;
    await fetch(isNew ? "/api/educations" : `/api/educations/${e.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institution: e.institution, degree: e.degree,
        startYear: e.startYear, endYear: e.endYear, score: e.score,
      }),
    });
    setEditing(null); load();
  }
  async function remove(id: string) { await fetch(`/api/educations/${id}`, { method: "DELETE" }); load(); }

  const yearOf = (v: string) => (v ? parseInt(v, 10) || null : null);

  return (
    <div className="w-full max-w-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Education</h1>
        <button onClick={() => setEditing({ ...EMPTY })}
          className="rounded-lg bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F]">+ Add</button>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-3">
            <div>
              <p className="font-semibold">{e.institution}</p>
              <p className="text-sm text-[#8B98B8]">{[e.degree, e.endYear, e.score].filter(Boolean).join(" · ")}</p>
            </div>
            <div className="flex gap-3 font-mono text-xs">
              <button className="text-[#8FC4FF]" onClick={() => setEditing(e)}>edit</button>
              <button className="text-[#FF6B6B]" onClick={() => remove(e.id!)}>delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-[#8B98B8]">No education yet.</p>}
      </div>

      {editing && (
        <div className="mt-8 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6">
          <label className={label}>Institution</label>
          <input className={input} value={editing.institution}
            onChange={(ev) => setEditing({ ...editing, institution: ev.target.value })} />
          <label className={label}>Degree</label>
          <input className={input} value={editing.degree} placeholder="Diploma in Computer Science"
            onChange={(ev) => setEditing({ ...editing, degree: ev.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={label}>Start year</label>
              <input type="number" className={input} value={editing.startYear ?? ""}
                onChange={(ev) => setEditing({ ...editing, startYear: yearOf(ev.target.value) })} />
            </div>
            <div>
              <label className={label}>End year</label>
              <input type="number" className={input} value={editing.endYear ?? ""}
                onChange={(ev) => setEditing({ ...editing, endYear: yearOf(ev.target.value) })} />
            </div>
            <div>
              <label className={label}>Score</label>
              <input className={input} value={editing.score} placeholder="8.4 CGPA"
                onChange={(ev) => setEditing({ ...editing, score: ev.target.value })} />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => save(editing)} disabled={!editing.institution.trim()}
              className="rounded-lg bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">Save</button>
            <button onClick={() => setEditing(null)} className="text-sm text-[#8B98B8]">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
