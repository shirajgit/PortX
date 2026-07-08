"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { BulletListEditor } from "@/components/editor/BulletListEditor";
import { EnhanceButton } from "@/components/editor/EnhanceButton";
import { usePlan, FREE_UI_LIMITS } from "@/lib/usePlan";
import { PlanChip, LimitChip } from "@/components/PlanChip";

type Project = {
  id?: string;
  name: string;
  tagline: string;
  bullets: string[];
  tech: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
};

type Draft = { name: string; tagline: string; tech: string[]; repoUrl: string; liveUrl: string | null; githubRepo: string };

const EMPTY: Project = { name: "", tagline: "", bullets: [], tech: [], liveUrl: null, repoUrl: null, featured: false };

const input = "mt-1 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none focus:border-[#4DA6FF]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

export default function ProjectsPage() {
  const { pro, expiresAt } = usePlan();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [ghOpen, setGhOpen] = useState(false);

  const load = () => fetch("/api/projects").then(async (r) => setProjects(await r.json()));
  useEffect(() => { load(); }, []);

  async function save(p: Project) {
    const isNew = !p.id;
    await fetch(isNew ? "/api/projects" : `/api/projects/${p.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: p.name, tagline: p.tagline, bullets: p.bullets.filter(Boolean),
        tech: p.tech, liveUrl: p.liveUrl || null, repoUrl: p.repoUrl || null, featured: p.featured,
      }),
    });
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Projects</h1>
          <PlanChip pro={pro} expiresAt={expiresAt} />
          <LimitChip used={projects.length} limit={FREE_UI_LIMITS.projects} pro={pro} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setGhOpen(true)}
            className="rounded-lg border border-[#1E2C52] px-4 py-2 font-mono text-xs hover:border-[#4DA6FF]">
            ⇣ import from GitHub
          </button>
          <button onClick={() => setEditing({ ...EMPTY })}
            className="rounded-lg bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F]">
            + Add project
          </button>
        </div>
      </div>

      {/* list */}
      <div className="mt-6 space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-3">
            <div>
              <p className="font-semibold">{p.name} {p.featured && <span className="font-mono text-xs text-[#FFB454]">★</span>}</p>
              <p className="text-sm text-[#8B98B8]">{p.tagline}</p>
            </div>
            <div className="flex gap-3 font-mono text-xs">
              <button className="text-[#8FC4FF]" onClick={() => setEditing(p)}>edit</button>
              <button className="text-[#FF6B6B]" onClick={() => remove(p.id!)}>delete</button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-sm text-[#8B98B8]">No projects yet — add one or import from GitHub.</p>}
      </div>

      {/* editor */}
      {editing && (
        <div className="mt-8 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6">
          <h2 className="font-semibold">{editing.id ? "Edit project" : "New project"}</h2>

          <label className={label}>Name</label>
          <input className={input} value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })} />

          <label className={label}>Tagline</label>
          <input className={input} value={editing.tagline}
            onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
          <div className="mt-1">
            <EnhanceButton mode="tagline" text={editing.tagline}
              onAccept={(s) => setEditing({ ...editing, tagline: s })} />
          </div>

          <label className={label}>Resume bullets</label>
          <BulletListEditor bullets={editing.bullets}
            onChange={(b) => setEditing({ ...editing, bullets: b })} />

          <label className={label}>Tech (comma separated)</label>
          <input className={input} value={editing.tech.join(", ")}
            onChange={(e) => setEditing({ ...editing, tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Live URL</label>
              <input className={input} value={editing.liveUrl ?? ""}
                onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })} />
            </div>
            <div>
              <label className={label}>Repo URL</label>
              <input className={input} value={editing.repoUrl ?? ""}
                onChange={(e) => setEditing({ ...editing, repoUrl: e.target.value })} />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-3 text-sm">
            <input type="checkbox" checked={editing.featured}
              onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
            Featured
          </label>

          <div className="mt-6 flex gap-3">
            <button onClick={() => save(editing)} disabled={!editing.name.trim()}
              className="rounded-lg bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
              Save
            </button>
            <button onClick={() => setEditing(null)} className="text-sm text-[#8B98B8]">Cancel</button>
          </div>
        </div>
      )}

      {ghOpen && <GithubImport onClose={() => setGhOpen(false)} onDone={load} />}
    </div>
  );
}

function GithubImport({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [username, setUsername] = useState("");
  const [drafts, setDrafts] = useState<Draft[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  async function fetchDrafts() {
    setBusy(true);
    const res = await fetch("/api/import/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    setBusy(false);
    if (res.ok) setDrafts((await res.json()).drafts);
  }

  async function importSelected() {
    if (!drafts) return;
    setBusy(true);
    for (const d of drafts.filter((d) => selected.has(d.githubRepo))) {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.name, tagline: d.tagline, tech: d.tech,
          repoUrl: d.repoUrl, liveUrl: d.liveUrl,
          source: "github", githubRepo: d.githubRepo,
        }),
      });
    }
    setBusy(false);
    onDone();
    onClose();
  }

  const toggle = (repo: string) => {
    const next = new Set(selected);
    next.has(repo) ? next.delete(repo) : next.add(repo);
    setSelected(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6">
        <h2 className="font-semibold">Import from GitHub</h2>
        {!drafts ? (
          <>
            <p className="mt-1 text-sm text-[#8B98B8]">We fetch your public repos — you pick which become projects.</p>
            <input className="mt-4 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none focus:border-[#4DA6FF]"
              placeholder="github username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <div className="mt-4 flex gap-3">
              <button onClick={fetchDrafts} disabled={!username.trim() || busy}
                className="rounded-lg bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
                {busy ? "Fetching…" : "Fetch repos"}
              </button>
              <button onClick={onClose} className="text-sm text-[#8B98B8]">Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-[#8B98B8]">Select 4–6 of your best. You can polish them after.</p>
            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
              {drafts.map((d) => (
                <label key={d.githubRepo}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#1E2C52] bg-[#111A36] p-3">
                  <input type="checkbox" checked={selected.has(d.githubRepo)} onChange={() => toggle(d.githubRepo)} />
                  <span>
                    <span className="text-sm font-semibold">{d.name}</span>
                    <span className="block text-xs text-[#8B98B8]">{d.tagline || "no description"}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={importSelected} disabled={selected.size === 0 || busy}
                className="rounded-lg bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
                {busy ? "Importing…" : `Import ${selected.size || ""}`}
              </button>
              <button onClick={onClose} className="text-sm text-[#8B98B8]">Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
