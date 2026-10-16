"use client";
import { useEffect, useState } from "react";
import { ExternalLink, FolderKanban, Plus, Star } from "lucide-react";
import { BulletListEditor } from "@/components/editor/BulletListEditor";
import { EnhanceButton } from "@/components/editor/EnhanceButton";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PageHeader } from "@/components/PageHeader";
import { GithubIcon } from "@/components/BrandIcons";
import { EmptyState } from "@/components/EmptyState";
import {
  Field, ItemCard, Notice, Sheet, TagInput, Tags, Toggle, UpgradeLink, UsageNote,
  btn, friendlyError, inputCls,
} from "@/components/ui";

type Project = {
  id?: string;
  name: string;
  tagline: string;
  bullets: string[];
  tech: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
};

type Draft = { name: string; tagline: string; tech: string[]; repoUrl: string; liveUrl: string | null; githubRepo: string };
type ApiProject = Partial<Project> & { bullets?: unknown; tech?: unknown };
type Problem = { message: string; upgrade: boolean } | null;

const EMPTY: Project = { name: "", tagline: "", bullets: [], tech: [], liveUrl: null, repoUrl: null, imageUrl: null, featured: false };

function normalizeUrl(v: string | null): string | null {
  if (!v) return null;
  const s = v.trim();
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

/** Cover images must be https (the API rejects anything else), so upgrade http:// links. */
function normalizeImageUrl(v: string | null): string | null {
  return normalizeUrl(v)?.replace(/^http:\/\//i, "https://") ?? null;
}

export default function ProjectsPage() {
  const { pro } = usePlan();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [ghOpen, setGhOpen] = useState(false);
  const [problem, setProblem] = useState<Problem>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/projects");
    if (!r.ok) { setProblem(await friendlyError(r, "projects")); setLoaded(true); return; }
    const data = await r.json();
    setProjects(
      (Array.isArray(data) ? data : []).map((p: ApiProject) => ({
        ...EMPTY,
        ...p,
        bullets: Array.isArray(p.bullets) ? p.bullets : [],
        tech: Array.isArray(p.tech) ? p.tech : [],
      }) as Project)
    );
    setLoaded(true);
  };
  // Fetch on mount: load() only sets state after its request resolves.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const atLimit = !pro && projects.length >= FREE_UI_LIMITS.projects;

  function startNew() { setProblem(null); setEditing({ ...EMPTY }); }

  async function save(p: Project) {
    setProblem(null);
    setSaving(true);
    const isNew = !p.id;
    const res = await fetch(isNew ? "/api/projects" : `/api/projects/${p.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: p.name, tagline: p.tagline, bullets: p.bullets.filter(Boolean),
        tech: p.tech, liveUrl: normalizeUrl(p.liveUrl), repoUrl: normalizeUrl(p.repoUrl),
        imageUrl: normalizeImageUrl(p.imageUrl), featured: p.featured,
      }),
    });
    setSaving(false);
    if (!res.ok) { setProblem(await friendlyError(res, "projects")); return; }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) setProblem(await friendlyError(res, "projects"));
    load();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Your details"
        title="Projects"
        description="Show the work you're proudest of. Each project appears on your portfolio and your resume."
        actions={
          <>
            <button onClick={() => setGhOpen(true)} className={btn("secondary")}>
              <GithubIcon className="h-4 w-4" /> Import from GitHub
            </button>
            <button onClick={startNew} disabled={atLimit} className={btn("primary")}>
              <Plus className="h-4 w-4" /> Add project
            </button>
          </>
        }
      />

      <div className="mt-6 space-y-3">
        <UsageNote used={projects.length} limit={FREE_UI_LIMITS.projects} pro={pro} thing="projects" />
        {problem && !editing && (
          <Notice tone="error" action={problem.upgrade ? <UpgradeLink /> : undefined}>{problem.message}</Notice>
        )}

        {projects.map((p) => (
          <ItemCard key={p.id} icon={FolderKanban}
            title={
              <span className="inline-flex flex-wrap items-center gap-2">
                {p.name}
                {p.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-lp-warning/10 px-2 py-0.5 text-[11px] font-medium text-lp-warning">
                    <Star className="h-3 w-3 fill-current" /> Highlighted
                  </span>
                )}
              </span>
            }
            subtitle={p.tagline || <span className="italic text-lp-subtle">No description yet</span>}
            onEdit={() => { setProblem(null); setEditing(p); }}
            onDelete={() => remove(p.id!)}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Tags items={p.tech} />
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-lp-accent hover:underline">
                  <ExternalLink className="h-3 w-3" /> View project
                </a>
              )}
            </div>
          </ItemCard>
        ))}

        {loaded && projects.length === 0 && !problem && (
          <EmptyState icon={FolderKanban} title="Add your first project"
            description="Anything you've made counts — an app, a design, a campaign, a case study. You can also import projects from GitHub." />
        )}
      </div>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit project" : "Add a project"}
        description="Only the name is required — you can fill in the rest later."
        footer={
          <>
            <button onClick={() => setEditing(null)} className={btn("ghost")}>Cancel</button>
            <button onClick={() => editing && save(editing)} disabled={!editing?.name.trim() || saving} className={btn("primary")}>
              {saving ? "Saving…" : editing?.id ? "Save changes" : "Add project"}
            </button>
          </>
        }>
        {editing && (
          <>
            {problem && <Notice tone="error" action={problem.upgrade ? <UpgradeLink /> : undefined}>{problem.message}</Notice>}
            <Field label="Project name">
              <input className={inputCls} value={editing.name} placeholder="e.g. Ledgerly" autoFocus
                onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <Field group label="Short description" hint="One sentence about what it is or what it does.">
              <input className={inputCls} value={editing.tagline} placeholder="An app that sorts your expenses automatically"
                onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
              <span className="mt-2 block">
                <EnhanceButton mode="tagline" text={editing.tagline} onAccept={(s) => setEditing({ ...editing, tagline: s })} />
              </span>
            </Field>
            <Field group label="Highlights" optional
              hint="What did you do, and what happened because of it? Numbers help — e.g. “Grew sign-ups by 30%”.">
              <BulletListEditor bullets={editing.bullets} onChange={(b) => setEditing({ ...editing, bullets: b })} />
            </Field>
            <Field group label="Tools & skills used" optional hint="Type one and press Enter.">
              <TagInput value={editing.tech} onChange={(tech) => setEditing({ ...editing, tech })}
                placeholder="e.g. Figma, React, Excel" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Project link" optional hint="Where people can see it.">
                <input className={inputCls} value={editing.liveUrl ?? ""} placeholder="myproject.com"
                  onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })} />
              </Field>
              <Field label="Code link" optional hint="For developers — e.g. GitHub.">
                <input className={inputCls} value={editing.repoUrl ?? ""} placeholder="github.com/you/project"
                  onChange={(e) => setEditing({ ...editing, repoUrl: e.target.value })} />
              </Field>
            </div>
            <Field label="Cover image link" optional hint="A screenshot or banner of the project (https link). Without one, your page draws a cover for you.">
              <div className="flex items-center gap-3">
                <input className={inputCls} value={editing.imageUrl ?? ""} placeholder="https://…/screenshot.png"
                  onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} />
                {/^https?:\/\/\S+$/i.test(editing.imageUrl?.trim() ?? "") && (
                  // Any external host, so next/image (which needs allow-listed hosts) doesn't fit.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editing.imageUrl!.trim()} alt="" className="h-10 w-16 shrink-0 rounded-md border border-lp-border object-cover" />
                )}
              </div>
            </Field>
            <Toggle checked={editing.featured} onChange={(featured) => setEditing({ ...editing, featured })}
              label="Highlight this project" description="Highlighted projects are shown first on your page." />
          </>
        )}
      </Sheet>

      <GithubImport open={ghOpen} onClose={() => setGhOpen(false)} onDone={load} />
    </div>
  );
}

function GithubImport({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const [username, setUsername] = useState("");
  const [drafts, setDrafts] = useState<Draft[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function close() {
    setDrafts(null); setSelected(new Set()); setError(null);
    onClose();
  }

  async function fetchDrafts() {
    setError(null);
    setBusy(true);
    const res = await fetch("/api/import/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim() }),
    });
    setBusy(false);
    if (!res.ok) { setError("We couldn't find that GitHub account. Check the username and try again."); return; }
    setDrafts((await res.json()).drafts);
  }

  async function importSelected() {
    if (!drafts) return;
    setError(null);
    setBusy(true);
    const failures: string[] = [];
    for (const d of drafts.filter((d) => selected.has(d.githubRepo))) {
      const r = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.name, tagline: d.tagline, tech: d.tech,
          repoUrl: d.repoUrl, liveUrl: d.liveUrl,
          source: "github", githubRepo: d.githubRepo,
        }),
      });
      if (!r.ok) failures.push(d.name);
    }
    setBusy(false);
    onDone();
    if (failures.length) {
      setError(`${failures.length} couldn't be added (${failures.join(", ")}). The free plan includes up to 5 projects.`);
      return;
    }
    close();
  }

  const toggle = (repo: string) => {
    const next = new Set(selected);
    if (next.has(repo)) next.delete(repo); else next.add(repo);
    setSelected(next);
  };

  return (
    <Sheet open={open} onClose={close} title="Import from GitHub"
      description={drafts ? "Pick your best 4–6. You can edit them afterwards." : "We'll list your public repositories — you choose which become projects."}
      footer={
        <>
          <button onClick={close} className={btn("ghost")}>Cancel</button>
          {!drafts ? (
            <button onClick={fetchDrafts} disabled={!username.trim() || busy} className={btn("primary")}>
              {busy ? "Looking…" : "Find my projects"}
            </button>
          ) : (
            <button onClick={importSelected} disabled={selected.size === 0 || busy} className={btn("primary")}>
              {busy ? "Importing…" : selected.size ? `Import ${selected.size} project${selected.size === 1 ? "" : "s"}` : "Select projects"}
            </button>
          )}
        </>
      }>
      {error && <Notice tone="error">{error}</Notice>}
      {!drafts ? (
        <Field label="Your GitHub username" hint="The name in your GitHub address — github.com/username">
          <input className={inputCls} placeholder="e.g. aaravmehta" value={username} autoFocus
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && username.trim() && fetchDrafts()} />
        </Field>
      ) : drafts.length === 0 ? (
        <Notice tone="info">No public repositories found for this account.</Notice>
      ) : (
        <div className="space-y-2">
          {drafts.map((d) => {
            const on = selected.has(d.githubRepo);
            return (
              <button key={d.githubRepo} type="button" onClick={() => toggle(d.githubRepo)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                  on ? "border-lp-accent bg-lp-accent-soft" : "border-lp-border bg-lp-surface hover:border-lp-border-strong"}`}>
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                  on ? "border-lp-accent bg-lp-accent text-white" : "border-lp-border-strong"}`}>
                  {on && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{d.name}</span>
                  <span className="block truncate text-[13px] text-lp-muted">{d.tagline || "No description"}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Sheet>
  );
}
