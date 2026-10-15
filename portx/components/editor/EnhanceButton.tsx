"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, Sparkles } from "lucide-react";

type Props = {
  mode: "bullet" | "summary" | "tagline";
  text: string;
  onAccept: (suggestion: string) => void;
};

export function EnhanceButton({ mode, text, onAccept }: Props) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [note, setNote] = useState<{ msg: string; upgrade?: boolean } | null>(null);

  async function enhance() {
    setNote(null);
    if (text.trim().length < 3) {
      setNote({ msg: "Write a few words first — then AI can polish them for you." });
      return;
    }
    setLoading(true);
    setSuggestion(null);
    const res = await fetch("/api/ai/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, text }),
    });
    setLoading(false);
    if (res.ok) { setSuggestion((await res.json()).suggestion); return; }
    const body = await res.json().catch(() => ({}));
    setNote(
      body.error === "free_limit_reached"
        ? { msg: `You've used your ${body.limit ?? 5} free AI improvements this month.`, upgrade: true }
        : body.error === "pro_limit_reached"
        ? { msg: `You've used ${body.limit ?? 200} AI improvements in the last 30 days, the monthly fair-use limit. More unlock as older ones roll off.` }
        : { msg: "AI couldn't help with this one right now. Please try again in a moment." }
    );
  }

  return (
    <div>
      <button type="button" onClick={enhance} disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-lp-accent transition hover:bg-lp-accent-soft disabled:opacity-60">
        {loading
          ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Improving…</>
          : <><Sparkles className="h-3.5 w-3.5" /> Improve with AI</>}
      </button>

      {note && (
        <p className="mt-1.5 text-[13px] text-lp-muted">
          {note.msg}{" "}
          {note.upgrade && <Link href="/dashboard/billing" className="font-medium text-lp-accent underline underline-offset-2">Get 200 a month with Pro</Link>}
        </p>
      )}

      {suggestion && (
        <div className="mt-2 rounded-xl border border-lp-accent/30 bg-lp-accent-soft p-4">
          <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium text-lp-accent">
            <Sparkles className="h-3.5 w-3.5" /> Suggested version
          </p>
          <p className="text-sm leading-relaxed text-lp-text">{suggestion}</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => { onAccept(suggestion); setSuggestion(null); }}
              className="lp-btn-primary inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium">
              <Check className="h-3.5 w-3.5" /> Use this
            </button>
            <button type="button" onClick={() => setSuggestion(null)}
              className="inline-flex h-8 items-center rounded-lg px-3 text-[13px] font-medium text-lp-muted transition hover:bg-lp-surface hover:text-lp-text">
              Keep mine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
