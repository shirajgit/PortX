"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { EnhanceButton } from "@/components/editor/EnhanceButton";
import { PortxzLoader } from "@/components/PortxzLoader";
import { PhotoPicker } from "@/components/editor/PhotoPicker";
import { PageHeader } from "@/components/PageHeader";
import { Card, Field, Notice, Toggle, btn, friendlyError, inputCls } from "@/components/ui";

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
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [savedForm, setSavedForm] = useState<ProfileForm>(EMPTY);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // saved on its own by PhotoPicker
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      if (r.status === 404) { window.location.href = "/setup"; return; }
      if (!r.ok) { setError((await friendlyError(r)).message); setLoading(false); return; }
      const p = await r.json();
      const f = {
        fullName: p.fullName ?? "", headline: p.headline ?? "", summary: p.summary ?? "",
        location: p.location ?? "", email: p.email ?? "", phone: p.phone ?? "",
        openToWork: p.openToWork ?? true,
      };
      setForm(f);
      setSavedForm(f);
      setAvatarUrl(p.avatarUrl ?? null);
      setLoading(false);
    });
  }, []);

  const dirty = JSON.stringify(form) !== JSON.stringify(savedForm);
  const set = <K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) => setForm({ ...form, [k]: v });

  async function save() {
    setSaving(true); setError(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) { setError((await friendlyError(res)).message); return; }
    setSavedForm(form);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  }

  if (loading) return <PortxzLoader label="Loading your details" />;

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Your details"
        title="About you"
        description="The basics about you. This appears at the top of your portfolio and your resume."
      />

      {error && <Notice tone="error" className="mt-6">{error}</Notice>}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Introduce yourself" description="First impressions — keep it short and clear.">
          <div className="space-y-5">
            <Field group label="Profile photo" optional>
              <PhotoPicker value={avatarUrl} name={form.fullName} onChange={setAvatarUrl} />
            </Field>
            <Field label="Full name">
              <input className={inputCls} value={form.fullName} placeholder="e.g. Aarav Mehta"
                onChange={(e) => set("fullName", e.target.value)} />
            </Field>
            <Field label="Headline" hint="Who you are in a few words. Shown right under your name.">
              <input className={inputCls} value={form.headline} placeholder="e.g. Graphic Designer · Marketing Specialist"
                onChange={(e) => set("headline", e.target.value)} />
            </Field>
            <Field group label="About me" hint="2–3 sentences: what you do, what you're good at, and what you're looking for.">
              <textarea className={`${inputCls} resize-none leading-relaxed`} rows={5} value={form.summary}
                aria-label="About me"
                placeholder="I'm a designer who helps small brands look big. I love clean layouts and I'm looking for a full-time role in Pune."
                onChange={(e) => set("summary", e.target.value)} />
              <span className="mt-2 block">
                <EnhanceButton mode="summary" text={form.summary} onAccept={(s) => set("summary", s)} />
              </span>
            </Field>
          </div>
        </Card>

        <div className="space-y-5">
          <Card title="Contact details" description="How people can reach you.">
            <div className="space-y-5">
              <Field label="Email" hint="Shown on your page so people can contact you.">
                <input type="email" className={inputCls} value={form.email} placeholder="you@example.com"
                  onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="City" optional>
                <input className={inputCls} value={form.location} placeholder="e.g. Bengaluru, India"
                  onChange={(e) => set("location", e.target.value)} />
              </Field>
              <Field label="Phone" optional hint="Only printed on your resume — never shown on your public page.">
                <input type="tel" className={inputCls} value={form.phone} placeholder="+91 98765 43210"
                  onChange={(e) => set("phone", e.target.value)} />
              </Field>
            </div>
          </Card>
          <Card title="Availability">
            <Toggle checked={form.openToWork} onChange={(v) => set("openToWork", v)}
              label="I'm open to work" description="Adds a small “Open to work” badge to your page." />
          </Card>
        </div>
      </div>

      {/* save bar — appears when something changed */}
      <AnimatePresence>
        {(dirty || justSaved) && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 lg:pl-[256px]">
            <div className="flex w-full max-w-xl items-center justify-between gap-4 rounded-2xl border border-lp-border-strong bg-lp-surface/95 px-4 py-3 shadow-2xl backdrop-blur">
              {justSaved && !dirty ? (
                <p className="inline-flex items-center gap-2 text-sm font-medium text-lp-green"><Check className="h-4 w-4" /> All changes saved</p>
              ) : (
                <>
                  <p className="text-sm text-lp-muted">You have unsaved changes</p>
                  <div className="flex gap-2">
                    <button onClick={() => setForm(savedForm)} disabled={saving} className={btn("ghost", "sm")}>Undo</button>
                    <button onClick={save} disabled={saving} className={btn("primary", "sm")}>
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
