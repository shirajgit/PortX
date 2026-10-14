"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "free" | "taken" | "invalid">("idle");
  const [saving, setSaving] = useState(false);

  // Debounce the API check to protect your database/network logs
  useEffect(() => {
    const clean = username.toLowerCase().trim();

    if (!clean) {
      setStatus("idle");
      return;
    }

    // 1. Local Validation: 3-30 chars, alphanumeric + hyphens only
    const isValidRegex = /^[a-z0-9-]{3,30}$/.test(clean);
    if (!isValidRegex) {
      setStatus("invalid");
      return;
    }

    setStatus("checking");

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/username/check?u=${encodeURIComponent(clean)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setStatus(data.available ? "free" : data.reason === "invalid" ? "invalid" : "taken");
      } catch (err) {
        setStatus("taken"); // Fail-safe fallback
      }
    }, 400); // Wait 400ms after user stops typing before making API call

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  async function submit() {
    if (status !== "free" || !fullName.trim() || saving) return;
    
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.toLowerCase().trim(), fullName: fullName.trim() }),
      });
      if (res.ok) {
        router.push("/setup");
      } else {
        setStatus("taken");
      }
    } catch {
      setStatus("taken");
    } finally {
      setSaving(false);
    }
  }

  const msg = {
    idle: null,
    checking: <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> checking…</span>,
    free: <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" /> available</span>,
    taken: <span className="inline-flex items-center gap-1"><X className="h-3 w-3" /> taken</span>,
    invalid: <span className="inline-flex items-center gap-1"><X className="h-3 w-3" /> 3–30 chars, a-z, 0-9, and hyphens only</span>,
  }[status];

  const color = status === "free" ? "text-lp-green" : status === "checking" ? "text-lp-muted" : "text-lp-danger";

  return (
    <div className="w-full max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-lp-text">Claim your username</h1>
      <p className="mt-1 text-lp-muted">This becomes your public link.</p>

      {/* Wrapping in a listener handles 'Enter' submissions smoothly */}
      <div className="mt-8 space-y-5" onKeyDown={(e) => e.key === "Enter" && submit()}>
        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-lp-muted">Full name</label>
          <input 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-lp-border bg-lp-surface-2 px-4 py-2.5 text-lp-text placeholder:text-lp-subtle outline-none transition focus:border-lp-accent"
            placeholder="Shiraj Mujawar" 
          />
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-wider text-lp-muted">Username</label>
          <div className="mt-1 flex items-center rounded-lg border border-lp-border bg-lp-surface-2 transition focus-within:border-lp-accent">
            <span className="pl-4 font-mono text-sm select-none text-lp-muted">portxz.xyz/</span>
            <input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent px-1 py-2.5 font-mono text-lp-text outline-none placeholder:text-lp-subtle" 
              placeholder="shiraj" 
            />
          </div>
          <p className={`mt-1.5 h-5 font-mono text-xs transition-colors duration-150 ${color}`}>{msg}</p>
        </div>
      </div>

      <button 
        onClick={submit} 
        disabled={status !== "free" || !fullName.trim() || saving}
        className="mt-2 w-full sm:w-auto rounded-lg lp-btn-primary px-6 py-2.5 font-semibold  transition active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
      >
        {saving ? "Creating…" : "Create my page"}
      </button>
    </div>
  );
}