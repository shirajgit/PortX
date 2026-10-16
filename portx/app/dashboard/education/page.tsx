"use client";
import { useEffect, useState } from "react";
import { Award, Calendar, GraduationCap, Plus } from "lucide-react";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import {
  Field, ItemCard, Notice, Sheet, UpgradeLink, UsageNote, btn, friendlyError, inputCls,
} from "@/components/ui";

type Edu = { id?: string; institution: string; degree: string; startYear: number | null; endYear: number | null; score: string };
type Problem = { message: string; upgrade: boolean } | null;
const EMPTY: Edu = { institution: "", degree: "", startYear: null, endYear: null, score: "" };

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR + 6 - 1980 }, (_, i) => THIS_YEAR + 5 - i);

export default function EducationPage() {
  const { pro } = usePlan();
  const [rows, setRows] = useState<Edu[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<Edu | null>(null);
  const [problem, setProblem] = useState<Problem>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/educations");
    if (!r.ok) { setProblem(await friendlyError(r, "entries")); setLoaded(true); return; }
    const data = await r.json();
    setRows((Array.isArray(data) ? data : []).map((e: Edu) => ({ ...EMPTY, ...e, degree: e.degree ?? "", score: e.score ?? "" })));
    setLoaded(true);
  };
  // Fetch on mount: load() only sets state after its request resolves.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const atLimit = !pro && rows.length >= FREE_UI_LIMITS.educations;

  async function save(e: Edu) {
    setProblem(null);
    setSaving(true);
    const isNew = !e.id;
    const res = await fetch(isNew ? "/api/educations" : `/api/educations/${e.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institution: e.institution.trim(),
        degree: e.degree.trim(),
        startYear: e.startYear,
        endYear: e.endYear,
        score: e.score.trim(),
      }),
    });
    setSaving(false);
    if (!res.ok) { setProblem(await friendlyError(res, "entries")); return; } // keep the panel open — nothing lost
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/educations/${id}`, { method: "DELETE" });
    if (!res.ok) setProblem(await friendlyError(res, "entries"));
    load();
  }

  const yearSelect = (value: number | null, onChange: (v: number | null) => void) => (
    <select className={inputCls} value={value ?? ""} onChange={(ev) => onChange(ev.target.value ? Number(ev.target.value) : null)}>
      <option value="">Select year</option>
      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
    </select>
  );

  return (
    <div>
      <PageHeader
        eyebrow="Your details"
        title="Education"
        description="Your school, college, degrees and certificates."
        actions={
          <button onClick={() => { setProblem(null); setEditing({ ...EMPTY }); }} disabled={atLimit} className={btn("primary")}>
            <Plus className="h-4 w-4" /> Add education
          </button>
        }
      />

      <div className="mt-6 space-y-3">
        <UsageNote used={rows.length} limit={FREE_UI_LIMITS.educations} pro={pro} thing="entries" />
        {problem && !editing && (
          <Notice tone="error" action={problem.upgrade ? <UpgradeLink /> : undefined}>{problem.message}</Notice>
        )}

        {rows.map((e) => (
          <ItemCard key={e.id} icon={GraduationCap}
            title={e.institution}
            subtitle={e.degree || undefined}
            onEdit={() => { setProblem(null); setEditing(e); }}
            onDelete={() => remove(e.id!)}>
            {(e.startYear || e.endYear || e.score) && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-lp-muted">
                {(e.startYear || e.endYear) && (
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{[e.startYear, e.endYear].filter(Boolean).join(" – ")}</span>
                )}
                {e.score && <span className="inline-flex items-center gap-1.5"><Award className="h-3.5 w-3.5" />{e.score}</span>}
              </div>
            )}
          </ItemCard>
        ))}

        {loaded && rows.length === 0 && !problem && (
          <EmptyState icon={GraduationCap} title="Add where you studied"
            description="Your college, university, diploma or a certificate course — it shows on your portfolio and resume." />
        )}
      </div>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit education" : "Add education"}
        description="Only the school or college name is required."
        footer={
          <>
            <button onClick={() => setEditing(null)} className={btn("ghost")}>Cancel</button>
            <button onClick={() => editing && save(editing)} disabled={!editing?.institution.trim() || saving} className={btn("primary")}>
              {saving ? "Saving…" : editing?.id ? "Save changes" : "Add education"}
            </button>
          </>
        }>
        {editing && (
          <>
            {problem && <Notice tone="error" action={problem.upgrade ? <UpgradeLink /> : undefined}>{problem.message}</Notice>}
            <Field label="School, college or university">
              <input className={inputCls} value={editing.institution} placeholder="e.g. Pune University" autoFocus
                onChange={(ev) => setEditing({ ...editing, institution: ev.target.value })} />
            </Field>
            <Field label="Degree or course" optional>
              <input className={inputCls} value={editing.degree} placeholder="e.g. B.Com, Diploma in Design"
                onChange={(ev) => setEditing({ ...editing, degree: ev.target.value })} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Start year" optional>{yearSelect(editing.startYear, (v) => setEditing({ ...editing, startYear: v }))}</Field>
              <Field label="End year" optional hint="Expected year is fine if you're still studying.">
                {yearSelect(editing.endYear, (v) => setEditing({ ...editing, endYear: v }))}
              </Field>
            </div>
            <Field label="Grade or score" optional>
              <input className={inputCls} value={editing.score} placeholder="e.g. 8.4 CGPA, First Class, 85%"
                onChange={(ev) => setEditing({ ...editing, score: ev.target.value })} />
            </Field>
          </>
        )}
      </Sheet>
    </div>
  );
}
