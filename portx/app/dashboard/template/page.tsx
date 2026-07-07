"use client";
import { useEffect, useState } from "react";

export default function TemplatePage() {
  const [template, setTemplate] = useState("minimal");
  const [published, setPublished] = useState(false);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      const p = await r.json();
      setTemplate(p.template ?? "minimal");
      setPublished(p.isPublished ?? false);
      setUsername(p.username ?? "");
    });
  }, []);

  async function save(next: { template?: string; isPublished?: boolean }) {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
  }

  const options = [
    { id: "minimal", name: "Minimal", note: "Blue-black, fast, readable — live now" },
    { id: "cli", name: "CLI Terminal", note: "Coming in week 9-10", disabled: true },
    { id: "glass", name: "Glassmorphism", note: "Coming in week 9-10", disabled: true },
  ];

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Template & Publish</h1>

      <div className="mt-6 space-y-3">
        {options.map((o) => (
          <button key={o.id} disabled={o.disabled}
            onClick={() => { setTemplate(o.id); save({ template: o.id }); }}
            className={`w-full rounded-xl border p-4 text-left disabled:opacity-40 ${
              template === o.id ? "border-[#4DA6FF] bg-[#111A36]" : "border-[#1E2C52]"}`}>
            <p className="font-semibold">{o.name} {template === o.id && <span className="font-mono text-xs text-[#39D98A]">● selected</span>}</p>
            <p className="text-sm text-[#8B98B8]">{o.note}</p>
          </button>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{published ? "Published" : "Unpublished"}</p>
            <p className="text-sm text-[#8B98B8]">
              {published ? <>Live at <a className="font-mono text-[#8FC4FF]" href={`/${username}`} target="_blank">portx.in/{username}</a></> : "Your page returns 404 until you publish."}
            </p>
          </div>
          <button onClick={() => { const next = !published; setPublished(next); save({ isPublished: next }); }}
            disabled={saving}
            className={`rounded-lg px-5 py-2 text-sm font-semibold ${published ? "border border-[#1E2C52]" : "bg-[#39D98A] text-[#04101F]"}`}>
            {published ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
