"use client";
import Link from "next/link";

/** Small plan indicator: "PRO until date" or "FREE · upgrade". */
export function PlanChip({ pro, expiresAt }: { pro: boolean; expiresAt: string | null }) {
  if (pro)
    return (
      <span className="rounded-full border border-[#1E3A2E] bg-[#0E2018] px-3 py-1 font-mono text-[11px] text-[#39D98A]">
        ● PRO{expiresAt ? ` until ${new Date(expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : ""}
      </span>
    );
  return (
    <Link href="/dashboard/billing"
      className="rounded-full border border-[#1E2C52] bg-[#0F1730] px-3 py-1 font-mono text-[11px] text-[#8B98B8] hover:border-[#4DA6FF] hover:text-[#8FC4FF]">
      FREE · upgrade ↗
    </Link>
  );
}

/** Usage counter for free tier: "3/5 used". Hidden for pro. */
export function LimitChip({ used, limit, pro }: { used: number; limit: number; pro: boolean }) {
  if (pro) return null;
  const full = used >= limit;
  return (
    <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${
      full ? "border-[#5C4A1E] bg-[#1F1A08] text-[#FFB454]" : "border-[#1E2C52] bg-[#0F1730] text-[#8B98B8]"}`}>
      {used}/{limit} used{full ? " · limit reached" : ""}
    </span>
  );
}
