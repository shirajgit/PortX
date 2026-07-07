"use client";
import { useEffect, useState } from "react";

type Skill = { id?: string; category: string; items: string[] };
const input = "mt-1 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none focus:border-[#4DA6FF]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

export default function SkillsPage() {
  const [rows, setRows] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const load = () => fetch("/api/skills").then(async (r) => setRows(await r.json()));
  useEffect(() => { load(); }, []);

  async function save(s: Skill) {
    const isNew = !s.id;
    await fetch(isNew ? "/api/skills" : `/api/skills/${s.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: s.category, items: s.items }),
    });
    setEditing(null); load();
  }
  async function remove(id: string) { await fetch(`/api/skills/${id}`, { method: "DELETE" }); load(); }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Skills</h1>
        <button onClick={() => setEditing({ category: "", items: [] })}
          className="rounded-lg bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F]">+ Add group</button>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-3">
            <div>
              <p className="font-mono text-sm text-[#4DA6FF]">{s.category}</p>
              <p className="text-sm text-[#8B98B8]">{s.items.join(", ")}</p>
            </div>
            <div className="flex gap-3 font-mono text-xs">
              <button className="text-[#8FC4FF]" onClick={() => setEditing(s)}>edit</button>
              <button className="text-[#FF6B6B]" onClick={() => remove(s.id!)}>delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-[#8B98B8]">No skill groups yet — e.g. Frontend, Backend, DevOps.</p>}
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
            <button onClick={() => save(editing)} disabled={!editing.category.trim()}
              className="rounded-lg bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">Save</button>
            <button onClick={() => setEditing(null)} className="text-sm text-[#8B98B8]">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
