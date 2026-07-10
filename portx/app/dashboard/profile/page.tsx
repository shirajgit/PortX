"use client";
import { useEffect, useState } from "react";
import { EnhanceButton } from "@/components/editor/EnhanceButton";
import { usePlan } from "@/lib/usePlan";
import { PlanChip } from "@/components/PlanChip";

type ProfileForm = {
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  openToWork: boolean;
};

const EMPTY: ProfileForm = {
  fullName: "", headline: "", summary: "", location: "", email: "", phone: "", openToWork: true,
};

const input = "mt-1 w-full rounded-xl border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none transition focus:border-[#4DA6FF] focus:shadow-[0_0_0_3px_rgba(77,166,255,0.12)]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";
const card = "rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6";

export default function ProfilePage() {
  const { pro, expiresAt } = usePlan();
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      if (r.status === 404) { window.location.href = "/setup"; return; }
      if (!r.ok) { setError(`Could not load profile (HTTP ${r.status})`); setLoading(false); return; }
      const p = await r.json();
      setForm({
        fullName: p.fullName ?? "", headline: p.headline ?? "", summary: p.summary ?? "",
        location: p.location ?? "", email: p.email ?? "", phone: p.phone ?? "",
        openToWork: p.openToWork ?? true,
      });
      setLoading(false);
    });
  }, []);

  async function save() {
    setSaving(true); setSaved(false); setError(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      setError(`Save failed (HTTP ${res.status}): ${JSON.stringify(b.error ?? b)}`);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p className="text-[#8B98B8]">Loading…</p>;

  return (
    <div className="w-full max-w-none">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Profile</h1>
        <PlanChip pro={pro} expiresAt={expiresAt} />
      </div>
      <p className="mt-1 text-sm text-[#8B98B8]">Shared by your portfolio and your resume.</p>

      {error && (
        <p className="mt-4 rounded-xl border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">{error}</p>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* identity card */}
        <div className={card}>
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#4DA6FF]">Identity</h2>

          <label className={label}>Full name</label>
          <input className={input} value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} />

          <label className={label}>Headline</label>
          <input className={input} value={form.headline} placeholder="Full Stack Developer (MERN / Next.js)"
            onChange={(e) => setForm({ ...form, headline: e.target.value })} />

          <label className={label}>Summary</label>
          <textarea className={`${input} resize-none`} rows={5} value={form.summary}
            placeholder="What you build, who you help, what you're looking for."
            onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          <div className="mt-1">
            <EnhanceButton mode="summary" text={form.summary}
              onAccept={(s) => setForm({ ...form, summary: s })} />
          </div>
        </div>

        {/* contact card */}
        <div className={card}>
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#4DA6FF]">Contact & Status</h2>

          <label className={label}>Public email</label>
          <input className={input} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Location</label>
              <input className={input} value={form.location} placeholder="Bengaluru, India"
                onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input className={input} value={form.phone} placeholder="resume only"
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <label className="mt-6 flex cursor-pointer items-center justify-between rounded-xl border border-[#1E2C52] bg-[#111A36] px-4 py-3">
            <span className="text-sm">
              Show <span className="text-[#39D98A]">“open to work”</span> badge
              <span className="block text-xs text-[#8B98B8]">Appears on your public page</span>
            </span>
            <input type="checkbox" className="h-4 w-4 accent-[#39D98A]" checked={form.openToWork}
              onChange={(e) => setForm({ ...form, openToWork: e.target.checked })} />
          </label>
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="mt-6 rounded-xl bg-[#4DA6FF] px-6 py-2.5 font-semibold text-[#04101F] shadow-[0_4px_16px_rgba(77,166,255,0.25)] transition hover:bg-[#8FC4FF] disabled:opacity-40">
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}
