"use client";
import { useEffect, useState } from "react";
import { Plus, Zap } from "lucide-react";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import {
  Field, ItemCard, Notice, Sheet, TagInput, Tags, UpgradeLink, UsageNote, btn, friendlyError, inputCls,
} from "@/components/ui";

type Skill = { id?: string; category: string; items: string[] };
type ApiSkill = { id: string; category?: unknown; items?: unknown };
type Problem = { message: string; upgrade: boolean } | null;

const GROUP_IDEAS = ["Design", "Marketing", "Tools", "Languages", "Soft skills", "Frontend", "Backend"];

export default function SkillsPage() {
  const { pro } = usePlan();
  const [rows, setRows] = useState<Skill[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [problem, setProblem] = useState<Problem>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/skills");
    if (!r.ok) { setProblem(await friendlyError(r, "skills")); setLoaded(true); return; }
    const data = await r.json();
    setRows(
      (Array.isArray(data) ? data : []).map((s: ApiSkill) => ({
        id: s.id,
        category: typeof s.category === "string" ? s.category : "",
        items: Array.isArray(s.items) ? s.items : [],
      }))
    );
    setLoaded(true);
  };
  useEffect(() => { load(); }, []);

  const itemsUsed = rows.reduce((n, g) => n + g.items.length, 0);

  async function save(s: Skill) {
    setProblem(null);
    setSaving(true);
    const isNew = !s.id;
    const res = await fetch(isNew ? "/api/skills" : `/api/skills/${s.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: s.category.trim(), items: s.items }),
    });
    setSaving(false);
    if (!res.ok) { setProblem(await friendlyError(res, "skills in total")); return; }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (!res.ok) setProblem(await friendlyError(res, "skills"));
    load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Your details"
        title="Skills"
        description="Group your skills so they're easy to scan — for example “Design: Figma, Canva” or “Languages: English, Hindi”."
        actions={
          <button onClick={() => { setProblem(null); setEditing({ category: "", items: [] }); }} className={btn("primary")}>
            <Plus className="h-4 w-4" /> Add skill group
          </button>
        }
      />

      <div className="mt-6 space-y-3">
        <UsageNote used={itemsUsed} limit={FREE_UI_LIMITS.skillItems} pro={pro} thing="skills" />
        {problem && !editing && (
          <Notice tone="error" action={problem.upgrade ? <UpgradeLink /> : undefined}>{problem.message}</Notice>
        )}

        {rows.map((s) => (
          <ItemCard key={s.id} icon={Zap}
            title={s.category}
            subtitle={s.items.length ? undefined : <span className="italic text-lp-subtle">No skills in this group yet</span>}
            onEdit={() => { setProblem(null); setEditing(s); }}
            onDelete={() => remove(s.id!)}>
            <Tags items={s.items} max={12} />
          </ItemCard>
        ))}

        {loaded && rows.length === 0 && !problem && (
          <EmptyState icon={Zap} title="Add your skills"
            description="Start with one group, like “Design” or “Tools”, and add a few skills to it." />
        )}
      </div>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit skill group" : "Add a skill group"}
        description="Give the group a name, then add the skills that belong in it."
        footer={
          <>
            <button onClick={() => setEditing(null)} className={btn("ghost")}>Cancel</button>
            <button onClick={() => editing && save(editing)} disabled={!editing?.category.trim() || saving} className={btn("primary")}>
              {saving ? "Saving…" : editing?.id ? "Save changes" : "Add group"}
            </button>
          </>
        }>
        {editing && (
          <>
            {problem && <Notice tone="error" action={problem.upgrade ? <UpgradeLink /> : undefined}>{problem.message}</Notice>}
            <Field group label="Group name">
              <input className={inputCls} value={editing.category} placeholder="e.g. Design" autoFocus
                aria-label="Group name"
                onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              {!editing.category && (
                <span className="mt-2.5 flex flex-wrap gap-1.5">
                  {GROUP_IDEAS.map((g) => (
                    <button key={g} type="button" onClick={() => setEditing({ ...editing, category: g })}
                      className="rounded-lg border border-lp-border px-2.5 py-1 text-[13px] text-lp-muted transition hover:border-lp-accent hover:text-lp-accent">
                      {g}
                    </button>
                  ))}
                </span>
              )}
            </Field>
            <Field group label="Skills" hint="Type a skill and press Enter to add it.">
              <TagInput value={editing.items} onChange={(items) => setEditing({ ...editing, items })}
                placeholder="e.g. Figma" />
            </Field>
          </>
        )}
      </Sheet>
    </div>
  );
}
