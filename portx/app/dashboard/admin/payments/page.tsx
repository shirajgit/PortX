"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { formatPrice, isCurrency } from "@/lib/pricing";

type Req = {
  id: string; plan: string; amount: number | string; currency: string; utr: string; status: string; createdAt: string;
  profile: { username: string; fullName: string; plan: string; planExpiresAt: string | null };
};

// amount arrives as a string (Prisma Decimal)
const paid = (r: Req) => formatPrice(Number(r.amount), isCurrency(r.currency) ? r.currency : "INR");

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<Req[] | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const r = await fetch("/api/admin/payments");
    if (r.status === 403) { setForbidden(true); return; }
    if (r.ok) setRows(await r.json());
  };
  // Fetch on mount: load() only sets state after its request resolves.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  async function act(id: string, action: "approve" | "reject") {
    setError(null);
    setBusy(id);
    const res = await fetch(`/api/admin/payments/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(null);
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      setError(`Action failed (HTTP ${res.status}): ${JSON.stringify(b.error ?? b)}`);
    }
    load();
  }

  if (forbidden)
    return <p className="text-lp-danger">403 — this page is admin-only.</p>;

  const pending = rows?.filter((r) => r.status === "pending") ?? [];
  const done = rows?.filter((r) => r.status !== "pending") ?? [];

  return (
    <div className="w-full max-w-none">
      <PageHeader eyebrow="Admin" title="Payments admin" description={<>Match the Payer + amount in your UPI app before approving. Approve extends the user&apos;s Pro expiry.</>} />

      {error && (
        <p className="mt-4 rounded-lg border border-lp-danger/30 bg-lp-danger/10 px-4 py-3 font-mono text-xs text-lp-danger">{error}</p>
      )}

      <h2 className="mb-3 mt-8 font-mono text-sm uppercase tracking-widest text-lp-warning">
        Pending ({pending.length})
      </h2>
      {pending.length === 0 && (
        <EmptyState icon={CheckCircle2} title="All caught up" description="No payments are waiting for review." />
      )}
      <div className="space-y-3">
        {pending.map((r) => (
          <div key={r.id} className="rounded-xl border border-lp-border bg-lp-surface-2 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                <p className="font-semibold">
                  {r.profile.fullName} <span className="font-mono text-xs text-lp-accent">/{r.profile.username}</span>
                </p>
                <p className="text-lp-muted">
                  {paid(r)} · {r.plan} · Payer <span className="font-mono text-lp-warning">{r.utr}</span>
                  {" · "}{new Date(r.createdAt).toLocaleString("en-IN")}
                </p>
                <p className="font-mono text-[11px] text-lp-muted">
                  current: {r.profile.plan}{r.profile.planExpiresAt ? ` until ${new Date(r.profile.planExpiresAt).toLocaleDateString("en-IN")}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => act(r.id, "approve")} disabled={busy === r.id}
                  className="rounded-lg lp-btn-success px-4 py-1.5 text-sm font-semibold  disabled:opacity-40">
                  Approve
                </button>
                <button onClick={() => act(r.id, "reject")} disabled={busy === r.id}
                  className="rounded-lg border border-lp-danger/30 px-4 py-1.5 text-sm text-lp-danger disabled:opacity-40">
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {done.length > 0 && (
        <>
          <h2 className="mb-3 mt-10 font-mono text-sm uppercase tracking-widest text-lp-accent">Recent</h2>
          <div className="space-y-2">
            {done.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-lp-border bg-lp-surface-2 px-4 py-2 text-sm">
                <span>/{r.profile.username} · {paid(r)} · {r.plan} · <span className="font-mono text-xs text-lp-muted">{r.utr}</span></span>
                <span className="font-mono text-xs" style={{ color: r.status === "approved" ? "var(--lp-green)" : "var(--lp-danger)" }}>{r.status}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
