"use client";

import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  QrCode, 
  HelpCircle, 
  History, 
  Sparkles,
  CreditCard
} from "lucide-react";

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
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME ?? "Portxz";
const QR_OVERRIDE = process.env.NEXT_PUBLIC_UPI_QR_URL ?? "";

export default function BillingPage() {
  const [plan, setPlan] = useState("free");
  const [expires, setExpires] = useState<string | null>(null);
  const [requests, setRequests] = useState<PayReq[]>([]);
  const [selected, setSelected] = useState<Pass | null>(null);
  const [utr, setUtr] = useState("");
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
  const note = `Portxz-${username || "user"}`;
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
      body: JSON.stringify({ plan: selected.id, utr: utr.trim() }),
    });
    setBusy(false);
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      const msg =
        b.error === "launch_offer_over" ? "The launch offer is sold out 🎉 — regular passes are below."
        : b.error === "launch_once_per_user" ? "The launch offer is once per user — grab a regular pass to extend."
        : b.error === "already_pending" ? "You already have a request awaiting verification."
        : b.error === "utr_already_used" ? "That transaction ID has already been submitted."
        : `Submit failed (HTTP ${res.status}): ${JSON.stringify(b.error ?? b)}`;
      setError(msg);
      return;
    }
    setSelected(null);
    setUtr("");
    load();
  }

  return (
    <div className="w-full max-w-none space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="border-b border-[#1E2C52]/50 pb-6 light:border-slate-200">
        <h1 className="text-3xl font-extrabold tracking-tight text-white light:text-slate-900">Billing</h1>
        <p className="mt-1 text-sm text-[#8B98B8] light:text-slate-500">
          Manage your subscription and billing preferences.
        </p>
      </div>

      {/* Current Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 light:bg-white light:border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-[#1E2C52]/20 light:text-slate-100 group-hover:scale-110 transition-transform duration-300">
            <CreditCard className="h-24 w-24" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#8B98B8] light:text-slate-400">Current Plan</p>
          <div className="mt-3 flex items-center gap-2">
            {pro ? (
              <div>
                <span className="text-2xl font-black text-[#39D98A] tracking-tight flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#39D98A] animate-pulse" />
                  Pro Pass
                </span>
                <p className="mt-2 text-xs font-mono text-[#8B98B8] light:text-slate-500">
                  Active until {new Date(expires!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-black text-white light:text-slate-900 tracking-tight">Free Workspace</span>
                <p className="mt-1 text-xs text-[#8B98B8] light:text-slate-400">Upgrade below to unlock Pro access</p>
              </div>
            )}
          </div>
        </div>

        {/* Perks Column */}
        <div className="md:col-span-2 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 light:bg-slate-50/50 light:border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-[#4DA6FF] mb-3 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Included Features
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#8B98B8] light:text-slate-600">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-black light:text-slate-900" />
                <span className="text-sm text-white">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Notification Flags */}
      {pro && daysLeft > 7 && !pending && (
        <div className="flex items-center gap-3 rounded-xl border border-[#1E3A2E] bg-[#0E2018] px-4 py-3 font-mono text-xs text-[#39D98A] light:bg-emerald-50 light:border-emerald-200 light:text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>You're all set — {daysLeft} days of Pro remaining. Premium passes will reappear near expiry.</span>
        </div>
      )}

      {pending && (
        <div className="flex items-center gap-3 rounded-xl border border-[#3A2E10] bg-[#1F1A08] px-4 py-3 font-mono text-xs text-[#FFB454] light:bg-amber-50 light:border-amber-200 light:text-amber-800 animate-pulse">
          <Clock className="h-4 w-4 shrink-0" />
          <span>Payment of ₹{pending.amount} submitted (UTR {pending.utr}) — verification usually takes a few hours.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B] light:bg-red-50 light:border-red-200 light:text-red-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Subscription Tier Cards */}
      {showPasses && (
        <div className="space-y-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-[#4DA6FF]">
            {pro ? `Your Pro ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"} — extend now` : "Select a Premium Pass"}
          </h2>
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {PASSES.map((p) => {
              const perMonth = Math.round(p.price / (p.days / 30));
              const isSelected = selected?.id === p.id;
              return (
                <button 
                  key={p.id} 
                  onClick={() => { setSelected(p); setError(null); }}
                  className={`group rounded-2xl border p-5 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? "border-[#4DA6FF] bg-[#111A36] shadow-md shadow-blue-500/5 light:bg-blue-50/50 light:border-blue-500" 
                      : "border-[#1E2C52] bg-[#0F1730] hover:border-[#2A3E6E] hover:bg-[#111A36]/30 light:bg-white light:border-slate-200 light:hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-bold transition-colors ${isSelected ? "text-[#4DA6FF]" : "text-white light:text-slate-800"}`}>
                        {p.label.replace(/🚀|Pro —/g, "").trim()}
                      </p>
                      {p.id === "year" && (
                        <span className="rounded-md bg-[#39D98A] px-1.5 py-0.5 text-[10px] font-mono text-[#39D98A] uppercase tracking-wider font-semibold">Value</span>
                      )}
                      {p.id === "launch" && (
                        <span className="rounded-md bg-[#FFB454] px-1.5 py-0.5 text-[10px] font-mono text-[#FFB454] uppercase tracking-wider font-semibold">Offer</span>
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white light:text-slate-900 tracking-tight">₹{p.price}</span>
                      <span className="text-xs text-[#8B98B8] font-mono">/{p.days}d</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#1E2C52]/50 light:border-slate-100 w-full">
                    <p className="font-mono text-[11px] text-[#8B98B8] light:text-slate-500">
                      {p.id === "month" ? "Standard checkout duration" : `~₹${perMonth}/mo billing equivalents`}
                    </p>
                    {p.id === "launch" && (
                      <p className="mt-1 font-mono text-[11px] text-[#FFB454]">
                        <span className="line-through opacity-60">₹149</span> · first 50 users only
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Checkout Section Panel */}
      {selected && showPasses && (
        <div className="rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 light:bg-white light:border-slate-200 shadow-md w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2 pb-4 border-b border-[#1E2C52]/50 light:border-slate-100">
            <QrCode className="h-5 w-5 text-[#4DA6FF]" />
            <h3 className="font-bold text-white light:text-slate-800">Complete Purchase: ₹{selected.price} via Instant UPI</h3>
          </div>

          {!UPI_ID ? (
            <p className="mt-4 font-mono text-xs text-[#FF9B9B] bg-red-500/5 p-3 rounded-lg border border-red-500/20">
              Configuration Missing: `NEXT_PUBLIC_UPI_ID` variable is not set up inside the system environment files.
            </p>
          ) : (
            <div className="mt-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
              {qrSrc && (
                <div className="flex flex-col items-center gap-2 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrSrc} alt="UPI QR code" width={180} height={180}
                    className="rounded-xl border border-[#1E2C52] bg-white p-2.5 light:border-slate-200 shadow-sm transition-transform hover:scale-[1.02]" />
                  <span className="text-[10px] text-[#8B98B8] font-mono uppercase tracking-wider">Scan using any payment App</span>
                </div>
              )}
              
              <div className="text-sm space-y-3 flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#111A36] p-4 rounded-xl border border-[#1E2C52]/60 light:bg-slate-50 light:border-slate-200">
                  <div>
                    <span className="text-xs text-[#8B98B8] light:text-slate-400 block font-mono uppercase">VPA Address</span>
                    <span className="font-mono text-sm text-[#8FC4FF] light:text-blue-600 font-semibold">{UPI_ID}</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#8B98B8] light:text-slate-400 block font-mono uppercase">Required Reference Note</span>
                    <span className="font-mono text-sm text-[#FFB454] font-semibold">{note}</span>
                  </div>
                </div>

                <a href={upiLink}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-[#4DA6FF] px-4 py-2.5 text-sm font-semibold text-[#04101F] sm:hidden shadow-lg shadow-blue-500/10 transition hover:bg-opacity-90">
                  Open Native App <ArrowUpRight className="h-4 w-4" />
                </a>

                <div className="rounded-xl border border-dashed border-[#1E2C52] p-3 light:border-slate-200 text-xs text-[#8B98B8] light:text-slate-500 flex gap-2">
                  <HelpCircle className="h-4 w-4 shrink-0 text-[#4DA6FF] mt-0.5" />
                  <p>
                    Important: You must copy/include the specific <strong>Payment Note</strong> inside your app transaction flow. Once authorized, pull the 12-digit UTR reference key from your transaction dashboard logs and input it below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Validation Fields */}
          <div className="mt-6 pt-5 border-t border-[#1E2C52]/50 light:border-slate-100 space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-[#8B98B8] light:text-slate-500 mb-1.5 font-semibold">
                UPI Reference ID / Transaction Number (12-digit UTR)
              </label>
              <input 
                value={utr} 
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 405912345678"
                className="w-full rounded-xl border border-[#1E2C52] bg-[#111A36] px-4 py-3 font-mono text-sm text-white outline-none focus:border-[#4DA6FF] transition light:bg-slate-50 light:border-slate-200 light:text-slate-800 light:focus:border-blue-500" 
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={claim} 
                disabled={utr.trim().length < 8 || busy}
                className="rounded-xl bg-[#39D98A] px-6 py-3 text-sm font-bold text-[#04101F] disabled:opacity-40 transition-opacity flex items-center justify-center min-w-[140px]"
              >
                {busy ? "Submitting Request…" : "Verify Payment Transaction"}
              </button>
              <button 
                onClick={() => setSelected(null)} 
                className="text-sm font-medium text-[#8B98B8] hover:text-white light:text-slate-500 light:hover:text-slate-700 px-3 py-2 transition"
              >
                Change Pass Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Ledger */}
      {requests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#4DA6FF]">
            <History className="h-4 w-4" />
            <h2 className="font-mono text-sm uppercase tracking-widest">Transaction History Log</h2>
          </div>
          
          <div className="rounded-2xl border border-[#1E2C52] bg-[#111A36] overflow-hidden light:bg-white light:border-slate-200 shadow-sm">
            <div className="divide-y divide-[#1E2C52]/50 light:divide-slate-100">
              {requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-4 text-sm transition hover:bg-[#111A36]/20 light:hover:bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="font-bold text-white light:text-slate-800">₹{r.amount}</span>
                    <span className="text-[#8B98B8] text-xs capitalize light:text-slate-500 bg-[#0F1730] light:bg-slate-100 px-2 py-0.5 rounded border border-[#1E2C52]/40 light:border-slate-200 inline-block w-fit">
                      {r.plan} tier
                    </span>
                    <span className="font-mono text-xs text-[#8B98B8]/70 light:text-slate-400">
                      UTR: <span className="text-black light:text-slate-700 font-medium">{r.utr}</span>
                    </span>
                  </div>
                  
                  <span 
                    className="font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-opacity-10 backdrop-blur-sm"
                    style={{ 
                      color: r.status === "approved" ? "#39D98A" : r.status === "rejected" ? "#FF6B6B" : "#FFB454",
                      borderColor: r.status === "approved" ? "rgba(57,217,138,0.2)" : r.status === "rejected" ? "rgba(255,107,107,0.2)" : "rgba(255,180,84,0.2)",
                      backgroundColor: r.status === "approved" ? "rgba(57,217,138,0.05)" : r.status === "rejected" ? "rgba(255,107,107,0.05)" : "rgba(255,180,84,0.05)"
                    }}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}