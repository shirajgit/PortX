"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

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

type RazorpayResult = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayFailure = { error?: { description?: string } };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: "payment.failed", cb: (r: RazorpayFailure) => void) => void;
    };
  }
}

export default function BillingPage() {
  const [plan, setPlan] = useState("free");
  const [expires, setExpires] = useState<string | null>(null);
  const [requests, setRequests] = useState<PayReq[]>([]);
  const [selected, setSelected] = useState<Pass | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<{ name?: string; email?: string }>({});

  const load = async () => {
    const [b, p] = await Promise.all([fetch("/api/billing/claim"), fetch("/api/profile")]);
    if (b.ok) {
      const d = await b.json();
      setPlan(d.plan);
      setExpires(d.planExpiresAt);
      setRequests(d.requests);
    }
    if (p.ok) {
      const d = await p.json();
      setPrefill({ name: d.fullName ?? undefined, email: d.email ?? undefined });
    }
  };
  useEffect(() => { load(); }, []);

  const pro = plan === "pro" && expires && new Date(expires) > new Date();
  const pending = requests.find((r) => r.status === "pending");
  const daysLeft = expires
    ? Math.ceil((new Date(expires).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : 0;
  const showPasses = !pending && (!pro || daysLeft <= 7);

  async function pay() {
    if (!selected) return;
    setError(null);
    if (!window.Razorpay) {
      setError("Payment window is still loading — try again in a moment.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/billing/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selected.id }),
    });
    if (!res.ok) {
      setBusy(false);
      const b = await res.json().catch(() => ({}));
      const msg =
        b.error === "launch_offer_over" ? "The launch offer is sold out 🎉 — regular passes are below."
        : b.error === "launch_once_per_user" ? "The launch offer is once per user — grab a regular pass to extend."
        : b.error === "razorpay_not_configured" ? "Payments aren't set up yet — please try again later."
        : `Couldn't start payment (HTTP ${res.status}): ${JSON.stringify(b.error ?? b)}`;
      setError(msg);
      return;
    }
    const order = await res.json();

    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "portX",
      description: selected.label,
      prefill,
      theme: { color: "#4DA6FF" },
      modal: { ondismiss: () => setBusy(false) },
      handler: async (result: RazorpayResult) => {
        const v = await fetch("/api/billing/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        });
        setBusy(false);
        if (!v.ok)
          setError(`Payment received but we couldn't confirm it yet — Pro will activate shortly. Ref: ${result.razorpay_payment_id}`);
        setSelected(null);
        load();
      },
    });
    rzp.on("payment.failed", (r) => {
      setError(r.error?.description ?? "Payment failed — you were not charged.");
    });
    rzp.open();
  }

  return (
    <div className="w-full max-w-none">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
          <h3 className="font-semibold">{selected.label} — ₹{selected.price}</h3>
          <p className="mt-2 text-sm text-[#8B98B8]">
            Pay securely with UPI, card, netbanking or wallet. Pro activates as soon as the payment goes through.
          </p>
          <div className="mt-4 flex gap-3">
            <button onClick={pay} disabled={busy}
              className="rounded-lg bg-[#39D98A] px-5 py-2 text-sm font-semibold text-[#04101F] disabled:opacity-40">
              {busy ? "Processing…" : `Pay ₹${selected.price}`}
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
                <span>₹{r.amount} · {r.plan} · <span className="font-mono text-xs text-[#8B98B8]">{r.utr}</span></span>
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
