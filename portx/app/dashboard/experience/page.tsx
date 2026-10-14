"use client";
import { useEffect, useState } from "react";
import { Briefcase, Calendar, MapPin, Plus } from "lucide-react";
import { BulletListEditor } from "@/components/editor/BulletListEditor";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import {
  Field, ItemCard, Notice, Sheet, Toggle, UpgradeLink, UsageNote, btn, friendlyError, inputCls,
} from "@/components/ui";

/* Dates are edited as months ("2025-11") and stored as the 1st of that month. */
type Exp = {
  id?: string; title: string; organization: string; location: string;
  start: string; end: string; current: boolean; bullets: string[];
};
type ApiExp = {
  id: string; title: string; organization: string; location?: string | null;
  startDate?: string | null; endDate?: string | null; bullets?: unknown;
};
type Problem = { message: string; upgrade: boolean } | null;

const EMPTY: Exp = { title: "", organization: "", location: "", start: "", end: "", current: false, bullets: [] };

const monthLabel = (m: string) =>
  m ? new Date(`${m}-01T00:00:00`).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "";

export default function ExperiencePage() {
  const { pro } = usePlan();
  const [rows, setRows] = useState<Exp[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<Exp | null>(null);
  const [problem, setProblem] = useState<Problem>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/experiences");
    if (!r.ok) { setProblem(await friendlyError(r, "jobs")); setLoaded(true); return; }
    const data = await r.json();
    setRows(
      (Array.isArray(data) ? data : []).map((e: ApiExp) => ({
        id: e.id,
        title: e.title ?? "",
        organization: e.organization ?? "",
        location: e.location ?? "",
        start: e.startDate ? e.startDate.slice(0, 7) : "",
        end: e.endDate ? e.endDate.slice(0, 7) : "",
        current: !!e.startDate && !e.endDate,
        bullets: Array.isArray(e.bullets) ? e.bullets : [],
      }))
    );
    setLoaded(true);
  };
  useEffect(() => { load(); }, []);

  const atLimit = !pro && rows.length >= FREE_UI_LIMITS.experiences;

  async function save(e: Exp) {
    setProblem(null);
    setSaving(true);
    const isNew = !e.id;
    const res = await fetch(isNew ? "/api/experiences" : `/api/experiences/${e.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: e.title.trim(), organization: e.organization.trim(), location: e.location.trim(),
        startDate: e.start ? `${e.start}-01` : null,
        endDate: e.current || !e.end ? null : `${e.end}-01`,
        bullets: e.bullets.filter(Boolean),
      }),
    });
    setSaving(false);
    if (!res.ok) { setProblem(await friendlyError(res, "jobs")); return; }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
    if (!res.ok) setProblem(await friendlyError(res, "jobs"));
    load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Your details"
        title="Work experience"
        description="Jobs, internships, freelance work or volunteering — anything that shows what you can do."
        actions={
          <button onClick={() => { setProblem(null); setEditing({ ...EMPTY }); }} disabled={atLimit} className={btn("primary")}>
            <Plus className="h-4 w-4" /> Add experience
          </button>
        }
      />

      <div className="mt-6 space-y-3">
        <UsageNote used={rows.length} limit={FREE_UI_LIMITS.experiences} pro={pro} thing="entries" />
        {problem && !editing && (
          <Notice tone="error" action={problem.upgrade ? <UpgradeLink /> : undefined}>{problem.message}</Notice>
        )}

        {rows.map((e) => {
          const dates = e.start ? `${monthLabel(e.start)} – ${e.current || !e.end ? "Present" : monthLabel(e.end)}` : "";
          return (
            <ItemCard key={e.id} icon={Briefcase}
              title={e.title}
              subtitle={e.organization}
              onEdit={() => { setProblem(null); setEditing(e); }}
              onDelete={() => remove(e.id!)}>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-lp-muted">
                {dates && <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{dates}</span>}
                {e.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.location}</span>}
                {e.bullets.length > 0 && <span>{e.bullets.length} highlight{e.bullets.length === 1 ? "" : "s"}</span>}
              </div>
            </ItemCard>
          );
        })}

        {loaded && rows.length === 0 && !problem && (
          <EmptyState icon={Briefcase} title="Add your first role"
            description="Jobs, internships, freelance gigs, volunteering — anything counts." />
        )}
      </div>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit experience" : "Add experience"}
        description="Job title and company are required — the rest is optional."
        footer={
          <>
            <button onClick={() => setEditing(null)} className={btn("ghost")}>Cancel</button>
            <button onClick={() => editing && save(editing)}
              disabled={!editing?.title.trim() || !editing?.organization.trim() || saving} className={btn("primary")}>
              {saving ? "Saving…" : editing?.id ? "Save changes" : "Add experience"}
            </button>
          </>
        }>
        {editing && (
          <>
            {problem && <Notice tone="error" action={problem.upgrade ? <UpgradeLink /> : undefined}>{problem.message}</Notice>}
            <Field label="Job title">
              <input className={inputCls} value={editing.title} placeholder="e.g. Marketing Intern" autoFocus
                onChange={(ev) => setEditing({ ...editing, title: ev.target.value })} />
            </Field>
            <Field label="Company or organisation">
              <input className={inputCls} value={editing.organization} placeholder="e.g. Acme Pvt Ltd"
                onChange={(ev) => setEditing({ ...editing, organization: ev.target.value })} />
            </Field>
            <Field label="Location" optional>
              <input className={inputCls} value={editing.location} placeholder="e.g. Pune, India · Remote"
                onChange={(ev) => setEditing({ ...editing, location: ev.target.value })} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Started" optional>
                <input type="month" className={inputCls} value={editing.start}
                  onChange={(ev) => setEditing({ ...editing, start: ev.target.value })} />
              </Field>
              <Field label="Ended" optional>
                <input type="month" className={inputCls} value={editing.current ? "" : editing.end} disabled={editing.current}
                  onChange={(ev) => setEditing({ ...editing, end: ev.target.value })} />
              </Field>
            </div>
            <Toggle checked={editing.current} onChange={(current) => setEditing({ ...editing, current })}
              label="I currently work here" description="Shows “Present” instead of an end date." />
            <Field group label="What you did" optional
              hint="A few short points. Start with an action word and mention results — e.g. “Managed a team of 4 and cut delivery time by 20%”.">
              <BulletListEditor bullets={editing.bullets} onChange={(b) => setEditing({ ...editing, bullets: b })} />
            </Field>
          </>
        )}
      </Sheet>
    </div>
  );
}
