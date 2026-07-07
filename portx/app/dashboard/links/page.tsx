"use client";
import { useEffect, useState } from "react";

type Link = { id?: string; kind: string; label: string; url: string };
const KINDS = ["github", "linkedin", "x", "website", "custom"];
const input = "mt-1 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none focus:border-[#4DA6FF]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

export default function LinksPage() {
  const [rows, setRows] = useState<Link[]>([]);
  const [editing, setEditing] = useState<Link | null>(null);
  const load = () => fetch("/api/links").then(async (r) => setRows(await r.json()));
  useEffect(() => { load(); }, []);

  async function save(l: Link) {
    const isNew = !l.id;
    await fetch(isNew ? "/api/links" : `/api/links/${l.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: l.kind, label: l.label, url: l.url }),
    });
    setEditing(null); load();
  }
  async function remove(id: string) { await fetch(`/api/links/${id}`, { method: "DELETE" }); load(); }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Links</h1>
        <button onClick={() => setEditing({ kind: "github", label: "", url: "" })}
          className="rounded-lg bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F]">+ Add link</button>
      </div>
      <p className="mt-1 text-sm text-[#8B98B8]">Shown on your portfolio, resume, and README.</p>

      <div className="mt-6 space-y-3">
        {rows.map((l) => (
          <div key={l.id} className="flex items-center justify-between rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-3">
            <div>
              <p className="font-mono text-xs uppercase text-[#4DA6FF]">{l.kind}</p>
              <p className="text-sm">{l.label} · <span className="text-[#8B98B8]">{l.url}</span></p>
            </div>
            <div className="flex gap-3 font-mono text-xs">
              <button className="text-[#8FC4FF]" onClick={() => setEditing(l)}>edit</button>
              <button className="text-[#FF6B6B]" onClick={() => remove(l.id!)}>delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-[#8B98B8]">No links yet — add GitHub and LinkedIn first.</p>}
      </div>

      {editing && (
        <div className="mt-8 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6">
          <label className={label}>Kind</label>
          <select className={input} value={editing.kind}
            onChange={(e) => setEditing({ ...editing, kind: e.target.value })}>
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <label className={label}>Label</label>
          <input className={input} value={editing.label} placeholder="GitHub"
            onChange={(e) => setEditing({ ...editing, label: e.target.value })} />
          <label className={label}>URL</label>
          <input className={input} value={editing.url} placeholder="https://github.com/you"
            onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
          <div className="mt-6 flex gap-3">
            <button onClick={() => save(editing)} disabled={!editing.url.trim()}
              className="rounded-lg bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">Save</button>
            <button onClick={() => setEditing(null)} className="text-sm text-[#8B98B8]">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
