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

const input = "mt-1 w-full rounded-xl border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none transition focus:border-[#4DA6FF] focus:shadow-[0_0_0_3px_rgba(77,166,255,0.12)]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

function normalizeUrl(v: string | null): string | null {
  if (!v) return null;
  const s = v.trim();
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export default function ProjectsPage() {
  const { pro, expiresAt } = usePlan();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [ghOpen, setGhOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch("/api/projects");
    if (!r.ok) { setError(`Could not load projects (HTTP ${r.status})`); return; }
    const data = await r.json();
    setProjects(
      (Array.isArray(data) ? data : []).map((p: any) => ({
        ...p,
        bullets: Array.isArray(p.bullets) ? p.bullets : [],
        tech: Array.isArray(p.tech) ? p.tech : [],
      }))
    );
  };
  useEffect(() => { load(); }, []);

  const atLimit = !pro && projects.length >= FREE_UI_LIMITS.projects;

  async function save(p: Project) {
    setError(null);
    setSaving(true);
    const isNew = !p.id;
    const res = await fetch(isNew ? "/api/projects" : `/api/projects/${p.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: p.name, tagline: p.tagline, bullets: p.bullets.filter(Boolean),
        tech: p.tech, liveUrl: normalizeUrl(p.liveUrl), repoUrl: normalizeUrl(p.repoUrl), featured: p.featured,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(
        body.error === "free_limit_reached"
          ? `Free plan allows ${body.limit} projects — upgrade on the Billing page for unlimited.`
          : `Save failed (HTTP ${res.status}): ${JSON.stringify(body.error ?? body)}`
      );
      return;
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
    <div className="w-full max-w-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Projects</h1>
          <PlanChip pro={pro} expiresAt={expiresAt} />
          <LimitChip used={projects.length} limit={FREE_UI_LIMITS.projects} pro={pro} />
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setGhOpen(true)}
            className="rounded-xl border border-[#1E2C52] px-4 py-2 font-mono text-xs transition hover:border-[#4DA6FF]">
            ⇣ import from GitHub
          </button>
          {atLimit ? (
            <NextLink href="/dashboard/billing"
              className="rounded-xl bg-[#39D98A] px-4 py-2 text-sm font-semibold text-[#04101F]">
              Upgrade for more
            </NextLink>
          ) : (
            <button onClick={() => { setError(null); setEditing({ ...EMPTY }); }}
              className="rounded-xl bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F] shadow-[0_4px_16px_rgba(77,166,255,0.25)] transition hover:bg-[#8FC4FF]">
              + Add project
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">{error}</p>
      )}

      {/* list */}
      <div className="mt-6 space-y-3">
        {projects.map((p) => (
          <div key={p.id}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-5 transition hover:border-[#2A3E6E] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#4DA6FF]/20 to-[#7C5CFF]/20 text-[#8FC4FF]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="font-semibold">
                  {p.name}{" "}
                  {p.featured && (
                    <span className="rounded-full border border-[#5C4A1E] bg-[#1F1A08] px-2 py-0.5 font-mono text-[10px] text-[#FFB454]">★ featured</span>
                  )}
                </p>
                {p.tagline && <p className="mt-0.5 truncate text-sm text-[#8B98B8]">{p.tagline}</p>}
                {p.tech.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 5).map((t) => (
                      <span key={t} className="rounded-full border border-[#1E2C52] bg-[#111A36] px-2.5 py-0.5 font-mono text-[11px] text-[#C7CFE5]">{t}</span>
                    ))}
                    {p.tech.length > 5 && (
                      <span className="rounded-full px-1 py-0.5 font-mono text-[11px] text-[#5C6A87]">+{p.tech.length - 5}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2 opacity-60 transition group-hover:opacity-100">
              <button onClick={() => { setError(null); setEditing(p); }}
                className="rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#8FC4FF] transition hover:border-[#4DA6FF]">edit</button>
              <button onClick={() => remove(p.id!)}
                className="rounded-lg border border-[#1E2C52] px-3 py-1.5 font-mono text-xs text-[#FF6B6B] transition hover:border-[#FF6B6B]">delete</button>
            </div>
          </div>
        ))}
        {projects.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-[#2A3E6E] p-10 text-center">
            <p className="text-3xl">📁</p>
            <p className="mt-2 font-semibold">No projects yet</p>
            <p className="mt-1 text-sm text-[#8B98B8]">Add your best work or import straight from GitHub.</p>
          </div>
        )}
      </div>

      {/* editor */}
      {editing && (
        <div className="mt-8 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-[#1E2C52] bg-[#111A36] px-4 py-3">
            <span className="text-sm">
              Featured <span className="text-[#FFB454]">★</span>
              <span className="block text-xs text-[#8B98B8]">Shown first on your portfolio</span>
            </span>
            <input type="checkbox" className="h-4 w-4 accent-[#FFB454]" checked={editing.featured}
              onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
          </label>

          <div className="mt-6 flex gap-3">
            <button onClick={() => save(editing)} disabled={!editing.name.trim() || saving}
              className="rounded-xl bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] shadow-[0_4px_16px_rgba(77,166,255,0.25)] disabled:opacity-40">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditing(null)} className="text-sm text-[#8B98B8] hover:text-white">Cancel</button>
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
    if (!res.ok) { setError(`Could not fetch repos (HTTP ${res.status}) — check the username.`); return; }
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
    if (failures.length) {
      setError(`Some imports failed (${failures.join(", ")}) — free plan allows 5 projects.`);
      onDone();
      return;
    }
    onDone();
    onClose();
  }

  const toggle = (repo: string) => {
    const next = new Set(selected);
    next.has(repo) ? next.delete(repo) : next.add(repo);
    setSelected(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <h2 className="font-semibold">Import from GitHub</h2>
        {error && (
          <p className="mt-3 rounded-xl border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">{error}</p>
        )}
        {!drafts ? (
          <>
            <p className="mt-1 text-sm text-[#8B98B8]">We fetch your public repos — you pick which become projects.</p>
            <input className="mt-4 w-full rounded-xl border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none transition focus:border-[#4DA6FF] focus:shadow-[0_0_0_3px_rgba(77,166,255,0.12)]"
              placeholder="github username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <div className="mt-4 flex gap-3">
              <button onClick={fetchDrafts} disabled={!username.trim() || busy}
                className="rounded-xl bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
                {busy ? "Fetching…" : "Fetch repos"}
              </button>
              <button onClick={onClose} className="text-sm text-[#8B98B8] hover:text-white">Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-[#8B98B8]">Select 4–6 of your best. You can polish them after.</p>
            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
              {drafts.map((d) => (
                <label key={d.githubRepo}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                    selected.has(d.githubRepo) ? "border-[#4DA6FF] bg-[#111A36]" : "border-[#1E2C52] bg-[#111A36]/50 hover:border-[#2A3E6E]"}`}>
                  <input type="checkbox" className="mt-0.5 accent-[#4DA6FF]" checked={selected.has(d.githubRepo)} onChange={() => toggle(d.githubRepo)} />
                  <span className="min-w-0">
                    <span className="text-sm font-semibold">{d.name}</span>
                    <span className="block truncate text-xs text-[#8B98B8]">{d.tagline || "no description"}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={importSelected} disabled={selected.size === 0 || busy}
                className="rounded-xl bg-[#4DA6FF] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
                {busy ? "Importing…" : `Import ${selected.size || ""}`}
              </button>
              <button onClick={onClose} className="text-sm text-[#8B98B8] hover:text-white">Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
