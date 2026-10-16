"use client";
import { useEffect, useState } from "react";
import { ExternalLink, Globe, Link2, Plus } from "lucide-react";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/BrandIcons";
import {
  Field, ItemCard, Notice, Sheet, UpgradeLink, UsageNote, btn, friendlyError, inputCls,
} from "@/components/ui";

type Link = { id?: string; kind: string; label: string; url: string };
type Problem = { message: string; upgrade: boolean } | null;
type IconC = (p: { className?: string }) => React.ReactNode;

const KINDS: { id: string; name: string; icon: IconC; placeholder: string }[] = [
  { id: "linkedin", name: "LinkedIn", icon: LinkedinIcon, placeholder: "linkedin.com/in/your-name" },
  { id: "github", name: "GitHub", icon: GithubIcon, placeholder: "github.com/your-name" },
  { id: "x", name: "X (Twitter)", icon: XIcon, placeholder: "x.com/your-name" },
  { id: "website", name: "Website", icon: Globe, placeholder: "yourwebsite.com" },
  { id: "custom", name: "Other", icon: Link2, placeholder: "behance.net/your-name" },
];
const kindOf = (id: string) => KINDS.find((k) => k.id === id) ?? KINDS[KINDS.length - 1];

function normalizeUrl(v: string): string {
  const s = v.trim();
  if (!s) return s;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export default function LinksPage() {
  const { pro } = usePlan();
  const [rows, setRows] = useState<Link[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<Link | null>(null);
  const [problem, setProblem] = useState<Problem>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/links");
    if (!r.ok) { setProblem(await friendlyError(r, "links")); setLoaded(true); return; }
    const data = await r.json();
    setRows(Array.isArray(data) ? data : []);
    setLoaded(true);
  };
  // Fetch on mount: load() only sets state after its request resolves.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const atLimit = !pro && rows.length >= FREE_UI_LIMITS.links;

  async function save(l: Link) {
    setProblem(null);
    setSaving(true);
    const isNew = !l.id;
    const res = await fetch(isNew ? "/api/links" : `/api/links/${l.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: l.kind, label: l.label.trim() || kindOf(l.kind).name, url: normalizeUrl(l.url) }),
    });
    setSaving(false);
    if (!res.ok) { setProblem(await friendlyError(res, "links")); return; }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
    if (!res.ok) setProblem(await friendlyError(res, "links"));
    load();
  }

  const startNew = () => { setProblem(null); setEditing({ kind: "linkedin", label: "LinkedIn", url: "" }); };

  return (
    <div>
      <PageHeader
        eyebrow="Your details"
        title="Social links"
        description="Where people can find you online. These appear as buttons on your page."
        actions={
          <button onClick={startNew} disabled={atLimit} className={btn("primary")}>
            <Plus className="h-4 w-4" /> Add link
          </button>
        }
      />

      <div className="mt-6 space-y-3">
        <UsageNote used={rows.length} limit={FREE_UI_LIMITS.links} pro={pro} thing="links" />
        {problem && !editing && (
          <Notice tone="error" action={problem.upgrade ? <UpgradeLink /> : undefined}>{problem.message}</Notice>
        )}

        {rows.map((l) => {
          const k = kindOf(l.kind);
          return (
            <ItemCard key={l.id} icon={k.icon}
              title={l.label || k.name}
              subtitle={
                <a href={l.url} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 truncate hover:text-lp-accent">
                  <span className="truncate">{l.url.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              }
              onEdit={() => { setProblem(null); setEditing(l); }}
              onDelete={() => remove(l.id!)} />
          );
        })}

        {loaded && rows.length === 0 && !problem && (
          <EmptyState icon={Link2} title="Add your first link"
            description="LinkedIn is a great place to start — recruiters almost always look for it." />
        )}
      </div>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit link" : "Add a link"}
        footer={
          <>
            <button onClick={() => setEditing(null)} className={btn("ghost")}>Cancel</button>
            <button onClick={() => editing && save(editing)} disabled={!editing?.url.trim() || saving} className={btn("primary")}>
              {saving ? "Saving…" : editing?.id ? "Save changes" : "Add link"}
            </button>
          </>
        }>
        {editing && (
          <>
            {problem && <Notice tone="error" action={problem.upgrade ? <UpgradeLink /> : undefined}>{problem.message}</Notice>}
            <Field group label="Where is this link to?">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {KINDS.map((k) => {
                  const on = editing.kind === k.id;
                  return (
                    <button key={k.id} type="button"
                      onClick={() => setEditing({
                        ...editing, kind: k.id,
                        // keep a custom label, otherwise follow the chosen type
                        label: !editing.label || KINDS.some((x) => x.name === editing.label) ? (k.id === "custom" ? "" : k.name) : editing.label,
                      })}
                      className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition ${
                        on ? "border-lp-accent bg-lp-accent-soft text-lp-accent" : "border-lp-border bg-lp-surface hover:border-lp-border-strong"}`}>
                      <k.icon className="h-4 w-4 shrink-0" /> {k.name}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Link" hint="Copy it from your browser's address bar and paste it here.">
              <input className={inputCls} value={editing.url} placeholder={kindOf(editing.kind).placeholder} autoFocus
                onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
            </Field>
            {(editing.kind === "custom" || editing.kind === "website") && (
              <Field label="Button text" optional hint="What visitors see, e.g. “My Behance” or “Blog”.">
                <input className={inputCls} value={editing.label} placeholder={kindOf(editing.kind).name}
                  onChange={(e) => setEditing({ ...editing, label: e.target.value })} />
              </Field>
            )}
          </>
        )}
      </Sheet>
    </div>
  );
}
