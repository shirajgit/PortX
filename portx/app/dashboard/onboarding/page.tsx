"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "free" | "taken" | "invalid">("idle");
  const [saving, setSaving] = useState(false);

  async function check(u: string) {
    setUsername(u);
    const clean = u.toLowerCase().trim();
    if (clean.length < 3) return setStatus("idle");
    setStatus("checking");
    const res = await fetch(`/api/username/check?u=${encodeURIComponent(clean)}`);
    const data = await res.json();
    setStatus(data.available ? "free" : data.reason === "invalid" ? "invalid" : "taken");
  }

  async function submit() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.toLowerCase().trim(), fullName }),
    });
    setSaving(false);
    if (res.ok) router.push("/dashboard");
    else setStatus("taken");
  }

  const msg = { idle: "", checking: "checking…", free: "✓ available", taken: "✗ taken", invalid: "✗ 3–30 chars, a-z 0-9 - only" }[status];
  const color = status === "free" ? "text-[#39D98A]" : status === "checking" ? "text-[#8B98B8]" : "text-[#FF6B6B]";

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold">Claim your username</h1>
      <p className="mt-1 text-[#8B98B8]">This becomes your public link.</p>

      <label className="mt-8 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]">Full name</label>
      <input value={fullName} onChange={(e) => setFullName(e.target.value)}
        className="mt-1 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 outline-none focus:border-[#4DA6FF]"
        placeholder="Shiraj Mujawar" />

      <label className="mt-5 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]">Username</label>
      <div className="mt-1 flex items-center rounded-lg border border-[#1E2C52] bg-[#111A36] focus-within:border-[#4DA6FF]">
        <span className="pl-4 font-mono text-sm text-[#8B98B8]">portx.in/</span>
        <input value={username} onChange={(e) => check(e.target.value)}
          className="w-full bg-transparent px-1 py-2.5 font-mono outline-none" placeholder="shiraj" />
      </div>
      <p className={`mt-1 h-5 font-mono text-xs ${color}`}>{msg}</p>

      <button onClick={submit} disabled={status !== "free" || !fullName.trim() || saving}
        className="mt-4 rounded-lg bg-[#4DA6FF] px-6 py-2.5 font-semibold text-[#04101F] disabled:opacity-40">
        {saving ? "Creating…" : "Create my page"}
      </button>
    </div>
  );
}
