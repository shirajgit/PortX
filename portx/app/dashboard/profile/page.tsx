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

export default function ProfilePage() {
  const { pro, expiresAt } = usePlan();
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      if (r.status === 404) { window.location.href = "/dashboard/onboarding"; return; }
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
    setSaving(true); setSaved(false);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  }

  if (loading) return <p className="text-[#8B98B8]">Loading…</p>;

  const input = "mt-1 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none focus:border-[#4DA6FF]";
  const label = "mt-5 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Profile</h1>
        <PlanChip pro={pro} expiresAt={expiresAt} />
      </div>
      <p className="mt-1 text-sm text-[#8B98B8]">Shared by your portfolio and your resume.</p>

      <label className={label}>Full name</label>
      <input className={input} value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })} />

      <label className={label}>Headline</label>
      <input className={input} value={form.headline} placeholder="Full Stack Developer (MERN / Next.js)"
        onChange={(e) => setForm({ ...form, headline: e.target.value })} />

      <label className={label}>Summary</label>
      <textarea className={`${input} resize-none`} rows={4} value={form.summary}
        onChange={(e) => setForm({ ...form, summary: e.target.value })} />
      <div className="mt-1">
        <EnhanceButton mode="summary" text={form.summary}
          onAccept={(s) => setForm({ ...form, summary: s })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Location</label>
          <input className={input} value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div>
          <label className={label}>Phone</label>
          <input className={input} value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
      </div>

      <label className={label}>Public email</label>
      <input className={input} value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <label className="mt-5 flex items-center gap-3 text-sm">
        <input type="checkbox" checked={form.openToWork}
          onChange={(e) => setForm({ ...form, openToWork: e.target.checked })} />
        Show “open to work” badge
      </label>

      <button onClick={save} disabled={saving}
        className="mt-8 rounded-lg bg-[#4DA6FF] px-6 py-2.5 font-semibold text-[#04101F] disabled:opacity-40">
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}
