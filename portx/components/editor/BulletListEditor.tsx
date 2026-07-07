"use client";
import { EnhanceButton } from "./EnhanceButton";

type Props = { bullets: string[]; onChange: (b: string[]) => void };

export function BulletListEditor({ bullets, onChange }: Props) {
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
    <div className="space-y-3">
      {bullets.map((b, i) => (
        <div key={i} className="rounded-lg border border-[#1E2C52] bg-[#111A36] p-3">
          <textarea value={b} onChange={(e) => set(i, e.target.value)} rows={2}
            className="w-full resize-none bg-transparent text-sm outline-none" placeholder="Built…" />
          <div className="mt-1 flex items-center gap-4 font-mono text-xs text-[#8B98B8]">
            <button type="button" onClick={() => move(i, -1)}>↑</button>
            <button type="button" onClick={() => move(i, 1)}>↓</button>
            <button type="button" onClick={() => remove(i)} className="text-[#FF6B6B]">remove</button>
            <EnhanceButton mode="bullet" text={b} onAccept={(s) => set(i, s)} />
          </div>
        </div>
      ))}
      {bullets.length < 8 && (
        <button type="button" onClick={() => onChange([...bullets, ""])}
          className="font-mono text-xs text-[#8FC4FF]">+ add bullet</button>
      )}
    </div>
  );
}
