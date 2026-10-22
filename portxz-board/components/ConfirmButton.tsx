"use client";
import { useEffect, useState, useTransition } from "react";

/* Runs a server action after a second click ("Approve" → "Confirm approve?"),
   so nothing changes on a stray click. Shows the error the action returns. */
export function ConfirmButton({ action, label, confirm, tone = "default" }: {
  action: () => Promise<{ error?: string }>; label: string; confirm?: string; tone?: "default" | "primary" | "danger";
}) {
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  const tones = {
    default: "border-border-strong text-text hover:bg-surface-2",
    primary: "border-transparent bg-accent text-white hover:brightness-110",
    danger: "border-danger/40 text-danger hover:bg-danger/10",
  };

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" disabled={pending}
        onClick={() => {
          if (!armed) { setArmed(true); setError(null); return; }
          setArmed(false);
          start(async () => {
            const res = await action();
            if (res.error) setError(res.error);
          });
        }}
        className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
          armed ? "border-warning bg-warning/15 text-warning" : tones[tone]}`}>
        {pending ? "Working…" : armed ? (confirm ?? `Confirm ${label.toLowerCase()}?`) : label}
      </button>
      {error && <span className="text-[11px] text-danger">{error}</span>}
    </span>
  );
}
