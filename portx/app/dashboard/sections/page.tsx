"use client";
import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowUp, BadgeCheck, BookOpen, HeartHandshake, Languages, LayoutList, Plus, Trash2, Trophy,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Field, ItemCard, Notice, Sheet, btn, friendlyError, inputCls } from "@/components/ui";
import type { SectionKind } from "@/lib/sections";

/* ── Custom sections ─────────────────────────────────────────────────
   Pick a ready-made type (or start blank), then add entries. Each type
   just relabels the same five fields so the form speaks the user's
   language: "Issued by" for a certificate, "Level" for a language.   */

type Entry = { title: string; subtitle: string; date: string; url: string; description: string };
type Section = { id?: string; title: string; kind: SectionKind; items: Entry[] };
type Labels = { title: string; subtitle?: string; date?: string; url?: string; description?: string };
type Preset = { kind: SectionKind; name: string; icon: LucideIcon; blurb: string; example: string; labels: Labels; placeholders: Partial<Entry> };

const PRESETS: Preset[] = [
  {
    kind: "certifications", name: "Certifications", icon: BadgeCheck,
    blurb: "Courses and certificates you've earned", example: "Google UX Design · Coursera · 2024",
    labels: { title: "Certificate name", subtitle: "Issued by", date: "Year", url: "Certificate link" },
    placeholders: { title: "e.g. Google UX Design Certificate", subtitle: "e.g. Coursera", date: "e.g. 2024", url: "Link to view it (optional)" },
  },
  {
    kind: "awards", name: "Awards", icon: Trophy,
    blurb: "Prizes, honours and recognition", example: "Employee of the Month · Acme · 2025",
    labels: { title: "Award name", subtitle: "Given by", date: "Year", description: "What it was for" },
    placeholders: { title: "e.g. Best Final Year Project", subtitle: "e.g. Pune University", date: "e.g. 2025", description: "A sentence about why you won it" },
  },
  {
    kind: "volunteering", name: "Volunteering", icon: HeartHandshake,
    blurb: "Causes and communities you help", example: "Teacher · Teach for India · 2023",
    labels: { title: "Role", subtitle: "Organisation", date: "When", description: "What you did" },
    placeholders: { title: "e.g. Weekend Teacher", subtitle: "e.g. Teach for India", date: "e.g. 2022 – 2023", description: "A sentence about your impact" },
  },
  {
    kind: "languages", name: "Languages", icon: Languages,
    blurb: "Languages you speak or write", example: "Hindi · Native",
    labels: { title: "Language", subtitle: "How well" },
    placeholders: { title: "e.g. English", subtitle: "e.g. Fluent, Native, Basic" },
  },
  {
    kind: "publications", name: "Publications", icon: BookOpen,
    blurb: "Articles, papers or blog posts", example: "Designing for trust · Medium · 2024",
    labels: { title: "Title", subtitle: "Published in", date: "Date", url: "Link" },
    placeholders: { title: "e.g. Designing for Trust", subtitle: "e.g. Medium", date: "e.g. Mar 2024", url: "Where people can read it" },
  },
  {
    kind: "custom", name: "Something else", icon: LayoutList,
    blurb: "Name it yourself — hobbies, talks, anything", example: "Your own section title",
    labels: { title: "Title", subtitle: "Subtitle", date: "Date", url: "Link", description: "Description" },
    placeholders: { title: "Main line", subtitle: "Second line (optional)", date: "Optional", url: "Optional", description: "Optional" },
  },
];
const presetOf = (k: string) => PRESETS.find((p) => p.kind === k) ?? PRESETS[PRESETS.length - 1];
const EMPTY_ENTRY: Entry = { title: "", subtitle: "", date: "", url: "", description: "" };

function normalizeUrl(v: string) {
  const s = v.trim();
  if (!s) return "";
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

type ApiSection = { id: string; title: string; kind: string; items: unknown };

export default function SectionsPage() {
  const [rows, setRows] = useState<Section[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/sections");
    if (!r.ok) { setProblem((await friendlyError(r, "sections")).message); setLoaded(true); return; }
    const data = await r.json();
    setRows((Array.isArray(data) ? data : []).map((s: ApiSection) => ({
      id: s.id,
      title: s.title,
      kind: presetOf(s.kind).kind,
      items: Array.isArray(s.items) ? (s.items as Entry[]).map((i) => ({ ...EMPTY_ENTRY, ...i })) : [],
    })));
    setLoaded(true);
  };
  useEffect(() => { load(); }, []);

  function startNew(p: Preset) {
    setProblem(null);
    setEditing({ title: p.kind === "custom" ? "" : p.name, kind: p.kind, items: [{ ...EMPTY_ENTRY }] });
  }

  async function save(s: Section) {
    setProblem(null);
    setSaving(true);
    const items = s.items
      .filter((i) => i.title.trim())
      .map((i) => ({ ...i, url: normalizeUrl(i.url) }));
    const isNew = !s.id;
    const res = await fetch(isNew ? "/api/sections" : `/api/sections/${s.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: s.title.trim(), kind: s.kind, items }),
    });
    setSaving(false);
    if (!res.ok) { setProblem((await friendlyError(res, "sections")).message); return; }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/sections/${id}`, { method: "DELETE" });
    if (!res.ok) setProblem((await friendlyError(res, "sections")).message);
    load();
  }

  // editor helpers
  const setEntry = (i: number, patch: Partial<Entry>) =>
    editing && setEditing({ ...editing, items: editing.items.map((e, j) => (j === i ? { ...e, ...patch } : e)) });
  const moveEntry = (i: number, dir: -1 | 1) => {
    if (!editing) return;
    const j = i + dir;
    if (j < 0 || j >= editing.items.length) return;
    const items = [...editing.items];
    [items[i], items[j]] = [items[j], items[i]];
    setEditing({ ...editing, items });
  };

  const preset = editing ? presetOf(editing.kind) : null;
  const filled = editing ? editing.items.filter((i) => i.title.trim()).length : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Your details"
        title="Add section"
        description="Add anything else that makes you stand out — certifications, awards, languages and more. Sections appear on your portfolio below your other details."
      />

      <div className="mt-6 space-y-3">
        {problem && !editing && <Notice tone="error">{problem}</Notice>}

        {rows.map((s) => {
          const p = presetOf(s.kind);
          return (
            <ItemCard key={s.id} icon={p.icon}
              title={s.title}
              subtitle={`${s.items.length} ${s.items.length === 1 ? "entry" : "entries"}`}
              onEdit={() => { setProblem(null); setEditing({ ...s, items: s.items.length ? s.items : [{ ...EMPTY_ENTRY }] }); }}
              onDelete={() => remove(s.id!)}>
              {s.items.length > 0 && (
                <ul className="space-y-1 text-[13px] text-lp-muted">
                  {s.items.slice(0, 3).map((it, i) => (
                    <li key={i} className="truncate">
                      <span className="text-lp-text">{it.title}</span>
                      {[it.subtitle, it.date].filter(Boolean).map((x) => ` · ${x}`).join("")}
                    </li>
                  ))}
                  {s.items.length > 3 && <li className="text-lp-subtle">+{s.items.length - 3} more</li>}
                </ul>
              )}
            </ItemCard>
          );
        })}
      </div>

      {/* type picker */}
      {loaded && (
        <section className={rows.length ? "mt-10" : "mt-6"}>
          <h2 className="text-[15px] font-semibold">{rows.length ? "Add another section" : "What would you like to add?"}</h2>
          <p className="mt-0.5 text-sm text-lp-muted">Pick a type to start — you can rename it anytime.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRESETS.map((p) => (
              <button key={p.kind} type="button" onClick={() => startNew(p)}
                className="lp-card group flex items-start gap-4 rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:border-lp-accent/40">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lp-accent-soft text-lp-accent transition group-hover:bg-lp-accent group-hover:text-white">
                  <p.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 font-semibold">
                    {p.name}
                    <Plus className="h-3.5 w-3.5 text-lp-subtle transition group-hover:text-lp-accent" />
                  </span>
                  <span className="mt-0.5 block text-sm text-lp-muted">{p.blurb}</span>
                  <span className="mt-2 block truncate text-xs text-lp-subtle">e.g. {p.example}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* editor */}
      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit ${editing.title || "section"}` : `New ${preset?.name === "Something else" ? "section" : preset?.name ?? "section"}`}
        description="Add as many entries as you like. Only the first line of each entry is required."
        footer={
          <>
            <button onClick={() => setEditing(null)} className={btn("ghost")}>Cancel</button>
            <button onClick={() => editing && save(editing)} disabled={!editing?.title.trim() || filled === 0 || saving} className={btn("primary")}>
              {saving ? "Saving…" : editing?.id ? "Save changes" : "Add section"}
            </button>
          </>
        }>
        {editing && preset && (
          <>
            {problem && <Notice tone="error">{problem}</Notice>}
            <Field label="Section name" hint="This is the heading visitors will see on your page.">
              <input className={inputCls} value={editing.title} placeholder="e.g. Certifications" autoFocus={editing.kind === "custom"}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>

            <div className="space-y-3">
              <p className="text-sm font-medium">Entries</p>
              {editing.items.map((it, i) => (
                <div key={i} className="rounded-2xl border border-lp-border bg-lp-surface p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-lp-subtle">Entry {i + 1}</span>
                    <div className="flex items-center">
                      <button type="button" onClick={() => moveEntry(i, -1)} disabled={i === 0} aria-label="Move up" title="Move up"
                        className="grid h-7 w-7 place-items-center rounded-md text-lp-subtle transition hover:bg-lp-surface-2 hover:text-lp-text disabled:opacity-30">
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => moveEntry(i, 1)} disabled={i === editing.items.length - 1} aria-label="Move down" title="Move down"
                        className="grid h-7 w-7 place-items-center rounded-md text-lp-subtle transition hover:bg-lp-surface-2 hover:text-lp-text disabled:opacity-30">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" aria-label="Remove entry" title="Remove entry"
                        onClick={() => setEditing({ ...editing, items: editing.items.filter((_, j) => j !== i) })}
                        className="grid h-7 w-7 place-items-center rounded-md text-lp-subtle transition hover:bg-lp-danger/10 hover:text-lp-danger">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Field label={preset.labels.title}>
                      <input className={inputCls} value={it.title} placeholder={preset.placeholders.title}
                        autoFocus={editing.kind !== "custom" && i === editing.items.length - 1 && !it.title}
                        onChange={(e) => setEntry(i, { title: e.target.value })} />
                    </Field>
                    {(preset.labels.subtitle || preset.labels.date) && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {preset.labels.subtitle && (
                          <Field label={preset.labels.subtitle} optional>
                            <input className={inputCls} value={it.subtitle} placeholder={preset.placeholders.subtitle}
                              onChange={(e) => setEntry(i, { subtitle: e.target.value })} />
                          </Field>
                        )}
                        {preset.labels.date && (
                          <Field label={preset.labels.date} optional>
                            <input className={inputCls} value={it.date} placeholder={preset.placeholders.date}
                              onChange={(e) => setEntry(i, { date: e.target.value })} />
                          </Field>
                        )}
                      </div>
                    )}
                    {preset.labels.url && (
                      <Field label={preset.labels.url} optional>
                        <input className={inputCls} value={it.url} placeholder={preset.placeholders.url}
                          onChange={(e) => setEntry(i, { url: e.target.value })} />
                      </Field>
                    )}
                    {preset.labels.description && (
                      <Field label={preset.labels.description} optional>
                        <textarea className={`${inputCls} resize-none`} rows={2} value={it.description} placeholder={preset.placeholders.description}
                          onChange={(e) => setEntry(i, { description: e.target.value })} />
                      </Field>
                    )}
                  </div>
                </div>
              ))}
              {editing.items.length < 30 && (
                <button type="button" onClick={() => setEditing({ ...editing, items: [...editing.items, { ...EMPTY_ENTRY }] })}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-lp-border-strong py-3 text-sm font-medium text-lp-muted transition hover:border-lp-accent hover:text-lp-accent">
                  <Plus className="h-4 w-4" /> Add another entry
                </button>
              )}
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
}
