"use client";
import { useEffect, useState } from "react";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PlanChip, LimitChip } from "@/components/PlanChip";

type Skill = { id?: string; category: string; items: string[] };
const input = "mt-1 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none focus:border-[#4DA6FF]";
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
    // normalize at the boundary — a bad row must never crash the page
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
      return; // keep the form open — nothing lost
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
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Skills</h1>
          <PlanChip pro={pro} expiresAt={expiresAt} />
          <LimitChip used={itemsUsed} limit={FREE_UI_LIMITS.skillItems} pro={pro} />
        </div>
        <button onClick={() => { setError(null); setEditing({ category: "", items: [] }); }}
          className="rounded-lg bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F]">+ Add group</button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {rows.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-3">
            <div>
              <p className="font-mono text-sm text-[#4DA6FF]">{s.category}</p>
              <p className="text-sm text-[#8B98B8]">
                {s.items.length > 0 ? s.items.join(", ") : <span className="italic text-[#5C6A87]">no items yet — click edit</span>}
              </p>
            </div>
            <div className="flex gap-3 font-mono text-xs">
              <button className="text-[#8FC4FF]" onClick={() => { setError(null); setEditing(s); }}>edit</button>
              <button className="text-[#FF6B6B]" onClick={() => remove(s.id!)}>delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && !error && (
          <p className="text-sm text-[#8B98B8]">No skill groups yet — e.g. Frontend, Backend, DevOps.</p>
        )}
      </div>

      {editing && (
        <div className="mt-8 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6">
          <label className={label}>Category</label>
          <input className={input} value={editing.category} placeholder="Frontend"
            onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
          <label className={label}>Items (comma separated)</label>
          <input className={input} value={editing.items.join(", ")} placeholder="React.js, Next.js, TypeScript"
            onChange={(e) => setEditing({ ...editing, items: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
          <div className="mt-6 flex gap-3">
            <button onClick={() => save(editing)} disabled={!editing.category.trim() || saving}
              className="rounded-lg bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditing(null)} className="text-sm text-[#8B98B8]">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}