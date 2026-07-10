"use client";
import { useEffect, useState } from "react";

type Req = {
  id: string; plan: string; amount: number; utr: string; status: string; createdAt: string;
  profile: { username: string; fullName: string; plan: string; planExpiresAt: string | null };
};

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
    return <p className="text-[#FF9B9B]">403 — this page is admin-only.</p>;

  const pending = rows?.filter((r) => r.status === "pending") ?? [];
  const done = rows?.filter((r) => r.status !== "pending") ?? [];

  return (
    <div className="w-full max-w-none">
      <h1 className="text-2xl font-bold">Payments admin</h1>
      <p className="mt-1 text-sm text-[#8B98B8]">
        Match the Payer + amount in your UPI app before approving. Approve extends the user's Pro expiry.
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">{error}</p>
      )}

      <h2 className="mb-3 mt-8 font-mono text-sm uppercase tracking-widest text-[#FFB454]">
        Pending ({pending.length})
      </h2>
      {pending.length === 0 && <p className="text-sm text-[#8B98B8]">Nothing waiting. 🎉</p>}
      <div className="space-y-3">
        {pending.map((r) => (
          <div key={r.id} className="rounded-xl border border-[#1E2C52] bg-[#111A36] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                <p className="font-semibold">
                  {r.profile.fullName} <span className="font-mono text-xs text-[#8FC4FF]">/{r.profile.username}</span>
                </p>
                <p className="text-[#8B98B8]">
                  ₹{r.amount} · {r.plan} · Payer <span className="font-mono text-[#FFB454]">{r.utr}</span>
                  {" · "}{new Date(r.createdAt).toLocaleString("en-IN")}
                </p>
                <p className="font-mono text-[11px] text-[#8B98B8]">
                  current: {r.profile.plan}{r.profile.planExpiresAt ? ` until ${new Date(r.profile.planExpiresAt).toLocaleDateString("en-IN")}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => act(r.id, "approve")} disabled={busy === r.id}
                  className="rounded-lg bg-[#39D98A] px-4 py-1.5 text-sm font-semibold text-[#04101F] disabled:opacity-40">
                  Approve
                </button>
                <button onClick={() => act(r.id, "reject")} disabled={busy === r.id}
                  className="rounded-lg border border-[#5C2B2B] px-4 py-1.5 text-sm text-[#FF9B9B] disabled:opacity-40">
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {done.length > 0 && (
        <>
          <h2 className="mb-3 mt-10 font-mono text-sm uppercase tracking-widest text-[#4DA6FF]">Recent</h2>
          <div className="space-y-2">
            {done.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2 text-sm">
                <span>/{r.profile.username} · ₹{r.amount} · {r.plan} · <span className="font-mono text-xs text-[#8B98B8]">{r.utr}</span></span>
                <span className="font-mono text-xs" style={{ color: r.status === "approved" ? "#39D98A" : "#FF6B6B" }}>{r.status}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
