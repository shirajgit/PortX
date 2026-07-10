"use client";
import { useEffect, useState } from "react";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PlanChip, LimitChip } from "@/components/PlanChip";

type Skill = { id?: string; category: string; items: string[] };
const input = "mt-1 w-full rounded-xl border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none transition focus:border-[#4DA6FF] focus:shadow-[0_0_0_3px_rgba(77,166,255,0.12)]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

export default function SkillsPage() {
  const { pro, expiresAt } = usePlan();
  const [rows, setRows] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/skills");
    if (!r.ok) { setError(`Could not load skills (HTTP ${r.status})`); return; }
    const data = await r.json();
    setRows(
      (Array.isArray(data) ? data : []).map((s: any) => ({
        ...s,
        category: typeof s.category === "string" ? s.category : "",
        items: Array.isArray(s.items) ? s.items : [],
      }))
    );
  };
  useEffect(() => { load(); }, []);

  const itemsUsed = rows.reduce((n, g) => n + g.items.length, 0);

  async function save(s: Skill) {
    setError(null);
    setSaving(true);
    const isNew = !s.id;
    const res = await fetch(isNew ? "/api/skills" : `/api/skills/${s.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: s.category.trim(), items: s.items }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(
        body.error === "free_limit_reached"
          ? `Free plan allows ${body.limit} skill items total — upgrade on the Billing page for unlimited.`
          : `Save failed (HTTP ${res.status}): ${JSON.stringify(body.error ?? body)}`
      );
      return;
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (!res.ok) setError(`Delete failed (HTTP ${res.status})`);
    load();
  }

  return (
    <div className="w-full max-w-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Skills</h1>
          <PlanChip pro={pro} expiresAt={expiresAt} />
          <LimitChip used={itemsUsed} limit={FREE_UI_LIMITS.skillItems} pro={pro} />
        </div>
        <button onClick={() => { setError(null); setEditing({ category: "", items: [] }); }}
          className="rounded-xl bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F] shadow-[0_4px_16px_rgba(77,166,255,0.25)] transition hover:bg-[#8FC4FF]">
          + Add group
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">{error}</p>
      )}

      <div className="mt-6 space-y-3">
        {rows.map((s) => (
          <div key={s.id}
            className="group flex items-start justify-between gap-4 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-5 transition hover:border-[#2A3E6E] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#4DA6FF]/20 to-[#7C5CFF]/20 text-[#8FC4FF]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold">{s.category}</p>
                {s.items.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {s.items.map((i) => (
                      <span key={i} className="rounded-full border border-[#1E2C52] bg-[#111A36] px-2.5 py-0.5 font-mono text-[11px] text-[#C7CFE5]">{i}</span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-sm italic text-[#5C6A87]">no items yet — click edit</p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2 opacity-60 transition group-hover:opacity-100">
              <button onClick={() => { setError(null); setEditing(s); }}
                className="rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#8FC4FF] transition hover:border-[#4DA6FF]">edit</button>
              <button onClick={() => remove(s.id!)}
                className="rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#FF6B6B] transition hover:border-[#FF6B6B]">delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-[#2A3E6E] p-10 text-center">
            <p className="text-3xl">⚡</p>
            <p className="mt-2 font-semibold">No skill groups yet</p>
            <p className="mt-1 text-sm text-[#8B98B8]">Group your skills — e.g. Frontend, Backend, Design, Tools.</p>
          </div>
        )}
      </div>

      {editing && (
        <div className="mt-8 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
          <h2 className="font-semibold">{editing.id ? "Edit group" : "Add group"}</h2>
          <label className={label}>Category</label>
          <input className={input} value={editing.category} placeholder="Frontend"
            onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
          <label className={label}>Items (comma separated)</label>
          <input className={input} value={editing.items.join(", ")} placeholder="React.js, Next.js, TypeScript"
            onChange={(e) => setEditing({ ...editing, items: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
          <div className="mt-6 flex gap-3">
            <button onClick={() => save(editing)} disabled={!editing.category.trim() || saving}
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
