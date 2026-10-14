"use client";
import { EnhanceButton } from "./EnhanceButton";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

type Props = { bullets: string[]; onChange: (b: string[]) => void; placeholder?: string };

const iconBtn = "grid h-7 w-7 place-items-center rounded-md text-lp-subtle transition hover:bg-lp-surface-2 hover:text-lp-text disabled:opacity-30 disabled:hover:bg-transparent";

export function BulletListEditor({ bullets, onChange, placeholder = "Describe one thing you did and the result…" }: Props) {
  const set = (i: number, v: string) => onChange(bullets.map((b, j) => (j === i ? v : b)));
  const remove = (i: number) => onChange(bullets.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= bullets.length) return;
    const next = [...bullets];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2.5">
      {bullets.map((b, i) => (
        <div key={i} className="rounded-xl border border-lp-border bg-lp-surface transition focus-within:border-lp-accent focus-within:ring-4 focus-within:ring-lp-accent-soft">
          <div className="flex gap-2.5 px-3.5 pt-3">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-lp-accent" />
            <textarea value={b} onChange={(e) => set(i, e.target.value)} rows={2} placeholder={placeholder}
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-lp-text outline-none placeholder:text-lp-subtle" />
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-lp-border px-2 py-1.5">
            <EnhanceButton mode="bullet" text={b} onAccept={(s) => set(i, s)} />
            <div className="flex items-center">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" title="Move up" className={iconBtn}>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === bullets.length - 1} aria-label="Move down" title="Move down" className={iconBtn}>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => remove(i)} aria-label="Remove" title="Remove"
                className={`${iconBtn} hover:!bg-lp-danger/10 hover:!text-lp-danger`}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {bullets.length < 8 && (
        <button type="button" onClick={() => onChange([...bullets, ""])}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-lp-border-strong py-2.5 text-sm font-medium text-lp-muted transition hover:border-lp-accent hover:text-lp-accent">
          <Plus className="h-4 w-4" /> {bullets.length ? "Add another point" : "Add a point"}
        </button>
      )}
    </div>
  );
}
