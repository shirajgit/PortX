"use client";
import { useState } from "react";

type Props = {
  mode: "bullet" | "summary" | "tagline";
  text: string;
  onAccept: (suggestion: string) => void;
};

export function EnhanceButton({ mode, text, onAccept }: Props) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  async function enhance() {
    if (text.trim().length < 3) return;
    setLoading(true);
    setSuggestion(null);
    const res = await fetch("/api/ai/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, text }),
    });
    setLoading(false);
    if (res.ok) setSuggestion((await res.json()).suggestion);
  }

  return (
    <div>
      <button type="button" onClick={enhance} disabled={loading}
        className="font-mono text-xs text-[#8FC4FF] hover:text-white disabled:opacity-50">
        {loading ? "enhancing…" : "✨ enhance"}
      </button>
      {suggestion && (
        <div className="mt-2 rounded-lg border border-[#1E2C52] bg-[#0F1730] p-3 text-sm">
          <p className="text-[#E8EDF7]">{suggestion}</p>
          <div className="mt-2 flex gap-3 font-mono text-xs">
            <button type="button" className="text-[#39D98A]"
              onClick={() => { onAccept(suggestion); setSuggestion(null); }}>use this</button>
            <button type="button" className="text-[#8B98B8]"
              onClick={() => setSuggestion(null)}>keep mine</button>
          </div>
        </div>
      )}
    </div>
  );
}
