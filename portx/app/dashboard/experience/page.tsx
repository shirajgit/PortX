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
const input = "mt-1 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none focus:border-[#4DA6FF]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

export default function ExperiencePage() {
  const { pro, expiresAt } = usePlan();
  const [rows, setRows] = useState<Exp[]>([]);
  const [editing, setEditing] = useState<Exp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = () => fetch("/api/experiences").then(async (r) => {
    const data = await r.json();
    setRows(data.map((e: any) => ({
      ...e,
      startDate: e.startDate ? e.startDate.slice(0, 10) : null,
      endDate: e.endDate ? e.endDate.slice(0, 10) : null,
    })));
  });
  useEffect(() => { load(); }, []);

  const atLimit = !pro && rows.length >= FREE_UI_LIMITS.experiences;

  async function save(e: Exp) {
    setError(null);
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
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Experience</h1>
          <PlanChip pro={pro} expiresAt={expiresAt} />
        </div>
        <div className="flex items-center gap-3">
          <LimitChip used={rows.length} limit={FREE_UI_LIMITS.experiences} pro={pro} />
          {atLimit ? (
            <NextLink href="/dashboard/billing"
              className="rounded-lg bg-[#39D98A] px-4 py-2 text-sm font-semibold text-[#04101F]">
              Upgrade for more
            </NextLink>
          ) : (
            <button onClick={() => { setError(null); setEditing({ ...EMPTY }); }}
              className="rounded-lg bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F]">+ Add</button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">{error}</p>
      )}

      <div className="mt-6 space-y-3">
        {rows.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-3">
            <div>
              <p className="font-semibold">{e.title}</p>
              <p className="text-sm text-[#8B98B8]">{e.organization}</p>
            </div>
            <div className="flex gap-3 font-mono text-xs">
              <button className="text-[#8FC4FF]" onClick={() => setEditing(e)}>edit</button>
              <button className="text-[#FF6B6B]" onClick={() => remove(e.id!)}>delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-[#8B98B8]">No experience yet.</p>}
      </div>

      {editing && (
        <div className="mt-8 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6">
          <label className={label}>Title</label>
          <input className={input} value={editing.title} placeholder="Founder / Intern / Engineer"
            onChange={(ev) => setEditing({ ...editing, title: ev.target.value })} />
          <label className={label}>Organization</label>
          <input className={input} value={editing.organization}
            onChange={(ev) => setEditing({ ...editing, organization: ev.target.value })} />
          <label className={label}>Location</label>
          <input className={input} value={editing.location}
            onChange={(ev) => setEditing({ ...editing, location: ev.target.value })} />
          <div className="grid grid-cols-2 gap-4">
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
            <button onClick={() => save(editing)} disabled={!editing.title.trim() || !editing.organization.trim()}
              className="rounded-lg bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">Save</button>
            <button onClick={() => setEditing(null)} className="text-sm text-[#8B98B8]">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
