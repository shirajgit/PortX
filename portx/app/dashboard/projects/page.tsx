"use client";
import { useEffect, useState } from "react";
import { BulletListEditor } from "@/components/editor/BulletListEditor";
import { EnhanceButton } from "@/components/editor/EnhanceButton";

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

/** "workmax-os.vercel.app" → "https://workmax-os.vercel.app"; empty → null */
function normalizeUrl(v: string | null): string | null {
  const s = (v ?? "").trim();
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

/** normalize, then verify it's actually parseable — junk becomes null instead of failing the save */
function safeUrl(v: string | null): string | null {
  const n = normalizeUrl(v);
  if (!n) return null;
  try { new URL(n); return n; } catch { return null; }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [ghOpen, setGhOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/projects");
    if (!r.ok) { setError(`Could not load projects (HTTP ${r.status})`); return; }
    setProjects(await r.json());
  };
  useEffect(() => { load(); }, []);

  async function save(p: Project) {
    setError(null);
    setSaving(true);
    const isNew = !p.id;
    const res = await fetch(isNew ? "/api/projects" : `/api/projects/${p.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: p.name.trim().slice(0, 80),
        tagline: p.tagline.slice(0, 140),
        bullets: p.bullets.filter(Boolean).map((b) => b.slice(0, 300)),
        tech: p.tech.map((t) => t.slice(0, 30)),
        liveUrl: safeUrl(p.liveUrl),
        repoUrl: safeUrl(p.repoUrl),
        featured: p.featured,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(`Save failed (HTTP ${res.status}): ${JSON.stringify(body.error ?? body)}`);
      return; // keep the form open — nothing lost
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) setError(`Delete failed (HTTP ${res.status})`);
    load();
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-3">
          <button onClick={() => setGhOpen(true)}
            className="rounded-lg border border-[#1E2C52] px-4 py-2 font-mono text-xs hover:border-[#4DA6FF]">
            ⇣ import from GitHub
          </button>
          <button onClick={() => { setError(null); setEditing({ ...EMPTY }); }}
            className="rounded-lg bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F]">
            + Add project
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">
          {error}
        </p>
      )}

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
        {projects.length === 0 && !error && <p className="text-sm text-[#8B98B8]">No projects yet — add one or import from GitHub.</p>}
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
              <input className={input} value={editing.liveUrl ?? ""} placeholder="myapp.vercel.app"
                onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })} />
            </div>
            <div>
              <label className={label}>Repo URL</label>
              <input className={input} value={editing.repoUrl ?? ""} placeholder="github.com/you/repo"
                onChange={(e) => setEditing({ ...editing, repoUrl: e.target.value })} />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-3 text-sm">
            <input type="checkbox" checked={editing.featured}
              onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
            Featured
          </label>

          <div className="mt-6 flex gap-3">
            <button onClick={() => save(editing)} disabled={!editing.name.trim() || saving}
              className="rounded-lg bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
              {saving ? "Saving…" : "Save"}
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
  const [error, setError] = useState<string | null>(null);

  async function fetchDrafts() {
    setError(null);
    setBusy(true);
    const res = await fetch("/api/import/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    setBusy(false);
    if (!res.ok) { setError(`GitHub fetch failed (HTTP ${res.status}) — check the username.`); return; }
    setDrafts((await res.json()).drafts);
  }

  async function importSelected() {
    if (!drafts) return;
    setError(null);
    setBusy(true);
    const failures: string[] = [];
    for (const d of drafts.filter((d) => selected.has(d.githubRepo))) {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.name.slice(0, 80),
          tagline: (d.tagline ?? "").slice(0, 140),   // GitHub descriptions can exceed the API's limit
          tech: d.tech.map((t) => t.slice(0, 30)),
          repoUrl: safeUrl(d.repoUrl),
          liveUrl: safeUrl(d.liveUrl),
          source: "github",
          githubRepo: d.githubRepo,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        failures.push(`${d.name}: ${JSON.stringify(body.error ?? res.status)}`);
      }
    }
    setBusy(false);
    if (failures.length > 0) {
      setError(`Failed: ${failures.join(" | ").slice(0, 400)}`);
      onDone();
      return;
    }
    onDone();
    onClose();
  }

  const toggle = (repo: string) => {
    const next = new Set(selected);
    if (next.has(repo)) next.delete(repo); else next.add(repo);
    setSelected(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6">
        <h2 className="font-semibold">Import from GitHub</h2>

        {error && (
          <p className="mt-3 rounded-lg border border-[#5C2B2B] bg-[#2A1414] px-3 py-2 font-mono text-xs text-[#FF9B9B]">
            {error}
          </p>
        )}

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