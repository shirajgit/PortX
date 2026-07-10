"use client";
import { useEffect, useState } from "react";

type Pass = { id: string; label: string; price: number; days: number };
const PASSES: Pass[] = [
  { id: "launch", label: "🚀 Launch Offer — 1 Month", price: 49, days: 30 },
  { id: "month", label: "Pro — 1 Month", price: 149, days: 30 },
  { id: "halfyear", label: "Pro — 6 Months", price: 649, days: 180 },
  { id: "year", label: "Pro — 1 Year", price: 999, days: 365 },
];

const PERKS = [
  "All 7 premium templates (CLI, Glass, Editorial, Noir, Bento, Executive, Aurora)",
  "ATS resume view + PDF download",
  "AI Portfolio Review + unlimited AI Enhance",
  "Unlimited projects, experience, skills, education & links",
];

type PayReq = { id: string; plan: string; amount: number; utr: string; status: string; createdAt: string };

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID ?? "";
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME ?? "portX";
const QR_OVERRIDE = process.env.NEXT_PUBLIC_UPI_QR_URL ?? "";

export default function BillingPage() {
  const [plan, setPlan] = useState("free");
  const [expires, setExpires] = useState<string | null>(null);
  const [requests, setRequests] = useState<PayReq[]>([]);
  const [selected, setSelected] = useState<Pass | null>(null);
  const [payer, setPayer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const load = async () => {
    const [b, p] = await Promise.all([fetch("/api/billing/claim"), fetch("/api/profile")]);
    if (b.ok) {
      const d = await b.json();
      setPlan(d.plan);
      setExpires(d.planExpiresAt);
      setRequests(d.requests);
    }
    if (p.ok) setUsername((await p.json()).username ?? "");
  };
  useEffect(() => { load(); }, []);

  const pro = plan === "pro" && expires && new Date(expires) > new Date();
  const pending = requests.find((r) => r.status === "pending");
  const daysLeft = expires
    ? Math.ceil((new Date(expires).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : 0;
  const showPasses = !pending && (!pro || daysLeft <= 7);
  const note = `PORTX-${username || "user"}`;
  const upiLink = selected
    ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${selected.price}&cu=INR&tn=${encodeURIComponent(note)}`
    : "";
  const qrSrc = selected
    ? QR_OVERRIDE ||
      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`
    : "";

  async function claim() {
    if (!selected) return;
    setError(null);
    setBusy(true);
    const res = await fetch("/api/billing/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selected.id, payer: payer.trim() }),
    });
    setBusy(false);
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      const msg =
        b.error === "launch_offer_over" ? "The launch offer is sold out 🎉 — regular passes are below."
        : b.error === "launch_once_per_user" ? "The launch offer is once per user — grab a regular pass to extend."
        : b.error === "already_pending" ? "You already have a request awaiting verification."
        : b.error === "payer_pending" ? "A payment from this number/UPI ID is already awaiting verification."
        : `Submit failed (HTTP ${res.status}): ${JSON.stringify(b.error ?? b)}`;
      setError(msg);
      return;
    }
    setSelected(null);
    setPayer("");
    load();
  }

  return (
    <div className="w-full max-w-none">
      <h1 className="text-2xl font-bold">Billing</h1>

      {/* current status */}
      <div className="mt-4 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-5">
        {pro ? (
          <p className="font-semibold text-[#39D98A]">
            ● Pro — active until {new Date(expires!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        ) : (
          <p className="font-semibold">Free plan</p>
        )}
        <ul className="mt-2 space-y-1 text-sm text-[#8B98B8]">
          {PERKS.map((p) => (
            <li key={p} className="relative pl-5 before:absolute before:left-0 before:content-['✓'] before:text-[#4DA6FF]">{p}</li>
          ))}
        </ul>
      </div>

      {pro && daysLeft > 7 && !pending && (
        <p className="mt-4 rounded-lg border border-[#1E3A2E] bg-[#0E2018] px-4 py-3 font-mono text-xs text-[#39D98A]">
          ✓ You&apos;re all set — {daysLeft} days of Pro remaining. Passes will reappear here near expiry.
        </p>
      )}

      {pending && (
        <p className="mt-4 rounded-lg border border-[#3A2E10] bg-[#1F1A08] px-4 py-3 font-mono text-xs text-[#FFB454]">
          ⏳ Payment of ₹{pending.amount} submitted (from {pending.utr}) — verification usually takes a few hours.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">{error}</p>
      )}

      {/* pass cards */}
      {showPasses && (
        <>
          <h2 className="mb-3 mt-8 font-mono text-sm uppercase tracking-widest text-[#4DA6FF]">
            {pro ? `Your Pro ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"} — extend now` : "Go Pro"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PASSES.map((p) => {
              const perMonth = Math.round(p.price / (p.days / 30));
              return (
                <button key={p.id} onClick={() => { setSelected(p); setError(null); }}
                  className={`rounded-xl border p-4 text-left transition ${
                    selected?.id === p.id ? "border-[#4DA6FF] bg-[#111A36]" : "border-[#1E2C52] hover:border-[#2A3E6E]"}`}>
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="mt-1 text-2xl font-bold text-[#4DA6FF]">₹{p.price}</p>
                  <p className="font-mono text-[11px] text-[#8B98B8]">
                    {p.id === "month" ? `${p.days} days` : `~₹${perMonth}/mo · ${p.days} days`}
                  </p>
                  {p.id === "launch" && (
                    <p className="mt-1 font-mono text-[11px] text-[#FFB454]">
                      <span className="line-through opacity-60">₹149</span> · first 50 users only
                    </p>
                  )}
                  {p.id === "year" && <p className="mt-1 font-mono text-[11px] text-[#39D98A]">best value</p>}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* payment instructions */}
      {selected && showPasses && (
        <div className="mt-6 rounded-xl border border-[#1E2C52] bg-[#0F1730] p-6">
          <h3 className="font-semibold">Pay ₹{selected.price} via UPI</h3>
          {!UPI_ID ? (
            <p className="mt-2 font-mono text-xs text-[#FF9B9B]">
              NEXT_PUBLIC_UPI_ID is not configured — set it in your environment.
            </p>
          ) : (
            <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row">
              {qrSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrSrc} alt="UPI QR code" width={180} height={180}
                  className="rounded-lg border border-[#1E2C52] bg-white p-2" />
              )}
              <div className="text-sm">
                <p><span className="text-[#8B98B8]">UPI ID: </span><span className="font-mono text-[#8FC4FF]">{UPI_ID}</span></p>
                <p className="mt-1"><span className="text-[#8B98B8]">Amount: </span><span className="font-mono">₹{selected.price}</span></p>
                <p className="mt-1"><span className="text-[#8B98B8]">Payment note: </span><span className="font-mono text-[#FFB454]">{note}</span></p>
                <a href={upiLink}
                  className="mt-3 inline-block rounded-lg bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F] sm:hidden">
                  Open UPI app
                </a>
                <p className="mt-3 text-xs text-[#8B98B8]">
                  Include the payment note so we can match your payment. After paying, tell us the
                  mobile number or UPI ID you paid from — we verify against it.
                </p>
              </div>
            </div>
          )}

          <label className="mt-5 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]">
            Your mobile number or UPI ID (the one you paid from)
          </label>
          <input value={payer} onChange={(e) => setPayer(e.target.value)}
            placeholder="9876543210 or you@upi"
            className="mt-1 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 font-mono text-sm outline-none focus:border-[#4DA6FF]" />
          <div className="mt-4 flex gap-3">
            <button onClick={claim} disabled={payer.trim().length < 6 || busy}
              className="rounded-lg bg-[#39D98A] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
              {busy ? "Submitting…" : "I've paid — verify"}
            </button>
            <button onClick={() => setSelected(null)} className="text-sm text-[#8B98B8]">Cancel</button>
          </div>
        </div>
      )}

      {/* history */}
      {requests.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-[#4DA6FF]">History</h2>
          <div className="space-y-2">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm">
                <span>₹{r.amount} · {r.plan} · <span className="font-mono text-xs text-[#8B98B8]">from {r.utr}</span></span>
                <span className="font-mono text-xs" style={{ color: r.status === "approved" ? "#39D98A" : r.status === "rejected" ? "#FF6B6B" : "#FFB454" }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
