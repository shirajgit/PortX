"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDown, BadgeCheck, Check, Clock, FileText, Infinity as InfinityIcon, Loader2, Lock, Palette,
  RefreshCcw, ShieldCheck, Sparkles, WandSparkles, Wallet, X, Zap,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Notice, btn } from "@/components/ui";

type Pass = { id: string; label: string; short: string; price: number; days: number };
const PASSES: Pass[] = [
  { id: "launch", label: "Launch Offer — 1 Month", short: "1 month", price: 49, days: 30 },
  { id: "month", label: "Pro — 1 Month", short: "1 month", price: 149, days: 30 },
  { id: "halfyear", label: "Pro — 6 Months", short: "6 months", price: 649, days: 180 },
  { id: "year", label: "Pro — 1 Year", short: "1 year", price: 999, days: 365 },
];
const MONTHLY = 149;
const savePct = (p: Pass) => Math.round((1 - p.price / (MONTHLY * (p.days / 30))) * 100);
const perMonthOf = (p: Pass) => Math.round(p.price / (p.days / 30));

const BENEFITS = [
  { icon: Palette, title: "All 8 premium designs", text: "Executive, Editorial, Noir, Aurora and more. Switch anytime — your details stay the same." },
  { icon: FileText, title: "Resume PDF, ready to send", text: "A clean, one-page resume that job portals and hiring software read perfectly." },
  { icon: Sparkles, title: "AI feedback on your page", text: "A score out of 100 and simple, specific fixes — like a mentor reviewing your profile." },
  { icon: WandSparkles, title: "Unlimited AI writing help", text: "Turn rough notes into strong, professional lines with one click, as often as you like." },
  { icon: InfinityIcon, title: "No limits", text: "Add every project, job, skill and link you want — no caps like on the free plan." },
  { icon: Zap, title: "Stand out from the crowd", text: "A polished page and resume make the first impression for you before you even say hello." },
];

const COMPARE: [string, string | boolean, string | boolean][] = [
  ["Your own page link", true, true],
  ["Designs", "1", "All 8"],
  ["Projects, jobs & links", "Up to 5", "Unlimited"],
  ["AI writing help", "5 a month", "Unlimited"],
  ["AI feedback & score", false, true],
  ["Resume PDF download", false, true],
];

const TRUST = [
  { icon: ShieldCheck, text: "Secure payment by Razorpay" },
  { icon: RefreshCcw, text: "No subscription, no auto-renewal" },
  { icon: Zap, text: "Pro turns on instantly" },
  { icon: Wallet, text: "UPI, cards, netbanking & wallets" },
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
  const router = useRouter();
  const [plan, setPlan] = useState("free");
  const [expires, setExpires] = useState<string | null>(null);
  const [requests, setRequests] = useState<PayReq[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [paying, setPaying] = useState<string | null>(null); // pass id being paid for
  const [choice, setChoice] = useState<string | null>(null); // plan picked in the phone list
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [prefill, setPrefill] = useState<{ name?: string; email?: string }>({});

  const load = async () => {
    try {
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
    } catch {
      setError("We couldn't load your plan details. Please check your connection and refresh.");
    } finally {
      setLoaded(true); // never leave the page stuck on the loading skeleton
    }
  };
  useEffect(() => { load(); }, []);

  const pro = plan === "pro" && !!expires && new Date(expires) > new Date();
  const pending = requests.find((r) => r.status === "pending");
  const launchUsed = requests.some((r) => r.plan === "launch" && r.status === "approved");
  const daysLeft = expires
    ? Math.ceil((new Date(expires).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : 0;
  const showPasses = !pending && (!pro || daysLeft <= 7);
  // phone list: launch offer by default, best value once the offer is used
  const pick = choice && !(choice === "launch" && launchUsed) ? choice : launchUsed ? "year" : "launch";
  const chosen = loaded && showPasses ? PASSES.find((p) => p.id === pick) ?? null : null;

  async function pay(pass: Pass) {
    setError(null);
    setSuccess(false);
    if (!window.Razorpay) {
      setError("The payment window is still loading — please try again in a moment.");
      return;
    }
    setPaying(pass.id);
    const res = await fetch("/api/billing/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: pass.id }),
    });
    if (!res.ok) {
      setPaying(null);
      const b = await res.json().catch(() => ({}));
      setError(
        b.error === "launch_offer_over" ? "The launch offer has sold out — please choose one of the other plans."
        : b.error === "launch_once_per_user" ? "The launch offer can only be used once — please choose one of the other plans."
        : b.error === "razorpay_not_configured" ? "Payments are temporarily unavailable — please try again later."
        : "We couldn't start the payment. Please try again."
      );
      return;
    }
    const order = await res.json();

    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "Portxz",
      description: pass.label,
      prefill,
      theme: { color: "#4F8BFF" },
      modal: { ondismiss: () => setPaying(null) },
      handler: async (result: RazorpayResult) => {
        const v = await fetch("/api/billing/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        });
        setPaying(null);
        if (!v.ok)
          setError(`Your payment went through, but we're still confirming it — Pro will turn on shortly. Reference: ${result.razorpay_payment_id}`);
        else setSuccess(true);
        await load();
        router.refresh(); // sidebar shows the new plan
      },
    });
    rzp.on("payment.failed", (r) => {
      setError(r.error?.description ?? "Payment failed — you were not charged.");
    });
    rzp.open();
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const STATUS: Record<string, { label: string; cls: string }> = {
    approved: { label: "Paid", cls: "bg-lp-green/10 text-lp-green" },
    rejected: { label: "Failed", cls: "bg-lp-danger/10 text-lp-danger" },
    pending: { label: "Being checked", cls: "bg-lp-warning/10 text-lp-warning" },
    created: { label: "Not completed", cls: "bg-lp-surface-2 text-lp-muted" },
  };
  const PLAN_NAME: Record<string, string> = Object.fromEntries(PASSES.map((p) => [p.id, p.label]));

  return (
    <div className={`space-y-6 sm:space-y-8 ${chosen ? "pb-28 sm:pb-0" : ""}`}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {success && <Notice tone="success">Payment successful — welcome to Pro! Everything is unlocked.</Notice>}
      {error && <Notice tone="error">{error}</Notice>}
      {pending && (
        <Notice tone="warning">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> We&apos;re checking your payment of ₹{pending.amount}. This usually takes a few hours.</span>
        </Notice>
      )}

      {/* ── hero ── */}
      {!loaded ? (
        <div className="h-72 animate-pulse rounded-3xl border border-lp-border bg-lp-surface" />
      ) : pro ? (
        <ProStatus expires={expires!} daysLeft={daysLeft} fmtDate={fmtDate} />
      ) : (
        <section className="lp-gradient-border relative overflow-hidden rounded-3xl">
          <div aria-hidden className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-40 right-10 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
          <div className="relative grid items-center gap-8 p-5 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lp-accent-soft px-3 py-1 text-xs font-semibold text-lp-accent">
                <Sparkles className="h-3.5 w-3.5" /> Portxz Pro
              </span>
              <h1 className="mt-4 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[2.6rem]">
                Look like the <span className="lp-serif lp-gradient-text pr-1">obvious</span> choice.
              </h1>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-lp-muted sm:mt-4">
                Every premium design, a ready-to-send resume and AI that helps you write — all you need to impress recruiters.
              </p>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mt-6">
                <span className="text-4xl font-semibold tracking-tight">₹49</span>
                <span className="text-lg text-lp-subtle line-through">₹149</span>
                <span className="text-sm text-lp-muted">for your first month</span>
              </div>
              <p className="mt-1 text-[13px] font-medium text-lp-green">Launch offer · first 50 users only</p>
              {/* phones use the sticky pay bar instead */}
              <div className="mt-6 hidden flex-wrap gap-3 sm:flex">
                {!launchUsed && showPasses ? (
                  <button onClick={() => pay(PASSES[0])} disabled={!!paying} className={btn("primary", "lg")}>
                    {paying === "launch" ? <><Loader2 className="h-4 w-4 animate-spin" /> Opening payment…</> : <>Get Pro for ₹49</>}
                  </button>
                ) : null}
                <a href="#plans" className={btn("secondary", "lg")}>See all plans <ArrowDown className="h-4 w-4" /></a>
              </div>
            </div>

            {/* fanned design previews */}
            <div aria-hidden className="relative mx-auto hidden h-[300px] w-full max-w-[380px] sm:block">
              {[
                { id: "editorial", cls: "left-0 top-6 -rotate-[8deg]" },
                { id: "aurora", cls: "right-0 top-6 rotate-[8deg]" },
                { id: "executive", cls: "left-1/2 top-0 -translate-x-1/2 z-10" },
              ].map((t) => (
                <div key={t.id} className={`absolute w-[150px] overflow-hidden rounded-2xl border border-lp-border-strong bg-lp-surface p-1.5 shadow-2xl ${t.cls}`}>
                  <div className="relative aspect-[9/16] overflow-hidden rounded-xl">
                    <Image src={`/brand/templates/${t.id}.png`} alt="" fill sizes="150px" className="object-cover object-top" />
                  </div>
                </div>
              ))}
              <span className="absolute bottom-4 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-lp-border bg-lp-surface px-3 py-1.5 text-xs font-medium shadow-lg">
                <Palette className="h-3.5 w-3.5 text-lp-accent" /> 8 designs included
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── plans ── */}
      {loaded && showPasses && (
        <section id="plans" className="scroll-mt-24">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            {pro ? `Your Pro ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"} — extend it` : "Choose your plan"}
          </h2>
          <p className="mt-1 text-sm text-lp-muted sm:text-[15px]">Pay once. No subscription — you&apos;ll never be charged again unless you choose to.</p>

          {/* phones: compact tappable list + sticky pay bar */}
          <div className="mt-4 space-y-2.5 sm:hidden" role="radiogroup" aria-label="Plans">
            {PASSES.map((p) => {
              const disabled = p.id === "launch" && launchUsed;
              const on = pick === p.id;
              const save = savePct(p);
              return (
                <button key={p.id} type="button" role="radio" aria-checked={on} disabled={disabled}
                  onClick={() => setChoice(p.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
                    on ? "border-lp-accent bg-lp-accent-soft ring-4 ring-lp-accent-soft" : "border-lp-border bg-lp-surface"}`}>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-lp-accent" : "border-lp-border-strong"}`}>
                    {on && <span className="h-2.5 w-2.5 rounded-full bg-lp-accent" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[15px] font-semibold">{p.id === "launch" ? "First month" : p.short}</span>
                      {p.id === "launch" && !launchUsed && <span className="rounded-full bg-lp-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">Launch offer</span>}
                      {p.id === "year" && <span className="rounded-full bg-lp-green px-1.5 py-0.5 text-[10px] font-semibold text-white">Best value</span>}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-lp-muted">
                      {disabled ? "Already used" : p.days === 30 ? "for 30 days" : `₹${perMonthOf(p)} a month`}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-lg font-semibold tracking-tight">₹{p.price}</span>
                    {save > 0 && <span className="block text-[11px] font-semibold text-lp-green">Save {save}%</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {/* tablets & desktop: cards */}
          <div className="mt-5 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {PASSES.map((p) => {
              const featured = p.id === "launch" && !launchUsed;
              const disabled = p.id === "launch" && launchUsed;
              const save = savePct(p);
              return (
                <div key={p.id}
                  className={`relative flex min-w-0 flex-col rounded-2xl p-5 ${
                    featured ? "lp-gradient-border shadow-[0_24px_60px_-28px_rgba(79,110,255,0.7)]" : "lp-card"} ${disabled ? "opacity-60" : ""}`}>
                  {featured && (
                    <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-lp-accent px-2.5 py-1 text-[11px] font-semibold text-white shadow">
                      <Sparkles className="h-3 w-3" /> Launch offer
                    </span>
                  )}
                  {p.id === "year" && (
                    <span className="absolute -top-3 left-5 rounded-full bg-lp-green px-2.5 py-1 text-[11px] font-semibold text-white shadow">Best value</span>
                  )}
                  <p className="mt-1 text-sm font-medium text-lp-muted">{p.id === "launch" ? "First month" : p.short}</p>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tight">₹{p.price}</span>
                    {save > 0 && <span className="text-sm text-lp-subtle line-through">₹{MONTHLY * (p.days / 30)}</span>}
                  </p>
                  <p className="mt-1 text-[13px] text-lp-muted">
                    {p.days === 30 ? "for 30 days" : `just ₹${perMonthOf(p)} a month`}
                  </p>
                  <div className="mt-3 h-6">
                    {save > 0 && (
                      <span className="inline-flex rounded-full bg-lp-green/10 px-2 py-0.5 text-xs font-semibold text-lp-green">Save {save}%</span>
                    )}
                  </div>
                  <div className="mt-auto pt-5">
                    {disabled ? (
                      <span className={btn("secondary", "md", "w-full cursor-default")}>Already used</span>
                    ) : (
                      <button onClick={() => pay(p)} disabled={!!paying}
                        className={btn(featured ? "primary" : "secondary", "md", "w-full")}>
                        {paying === p.id ? <><Loader2 className="h-4 w-4 animate-spin" /> Opening…</> : `Get ${p.id === "launch" ? "Pro for ₹49" : p.short}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 rounded-2xl border border-lp-border bg-lp-surface/60 p-4 sm:mt-5 lg:grid-cols-4">
            {TRUST.map((t) => (
              <p key={t.text} className="flex items-start gap-2 text-[13px] leading-snug text-lp-muted sm:items-center sm:text-sm">
                <t.icon className="mt-0.5 h-4 w-4 shrink-0 text-lp-green sm:mt-0" /> {t.text}
              </p>
            ))}
          </div>
          <p className="mt-3 text-xs text-lp-subtle">
            By paying you agree to our{" "}
            <a href="/terms" target="_blank" className="underline underline-offset-2 hover:text-lp-accent">Terms</a> and{" "}
            <a href="/refund-policy" target="_blank" className="underline underline-offset-2 hover:text-lp-accent">Refund Policy</a>.
          </p>

          {/* sticky pay bar — phones only */}
          {chosen && (
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-lp-border bg-lp-bg/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">₹{chosen.price} <span className="text-[13px] font-normal text-lp-muted">· {chosen.id === "launch" ? "first month" : chosen.short}</span></p>
                  <p className="flex items-center gap-1 text-[11px] text-lp-muted"><ShieldCheck className="h-3 w-3 text-lp-green" /> Secure · no auto-renewal</p>
                </div>
                <button onClick={() => pay(chosen)} disabled={!!paying} className={btn("primary", "lg", "px-5")}>
                  {paying === chosen.id ? <><Loader2 className="h-4 w-4 animate-spin" /> Opening…</> : <>Pay ₹{chosen.price}</>}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── what you get ── */}
      {loaded && !pro && (
        <section>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">Everything you get with Pro</h2>
          <p className="mt-1 text-sm text-lp-muted sm:text-[15px]">Made for job seekers, freelancers and anyone who wants to be taken seriously.</p>

          {/* phones: one compact list */}
          <div className="lp-card mt-4 divide-y divide-lp-border rounded-2xl sm:hidden">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-3 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lp-accent-soft text-lp-accent">
                  <b.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold">{b.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-lp-muted">{b.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* tablets & desktop: cards */}
          <div className="mt-5 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="lp-card rounded-2xl p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-lp-accent-soft text-lp-accent">
                  <b.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-semibold">{b.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-lp-muted">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── free vs pro ── */}
      {loaded && !pro && (
        <Card title="Free vs Pro" description="Start free, upgrade when you're ready to stand out.">
          <div className="overflow-hidden rounded-xl border border-lp-border">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-lp-surface-2/60 px-4 py-3 text-sm font-medium">
              <span className="text-lp-muted">Feature</span>
              <span className="text-center">Free</span>
              <span className="text-center text-lp-accent">Pro</span>
            </div>
            {COMPARE.map(([label, free, proV]) => (
              <div key={label} className="grid grid-cols-[1.4fr_1fr_1fr] items-center border-t border-lp-border px-4 py-3 text-sm">
                <span className="text-lp-muted">{label}</span>
                <span className="flex justify-center"><Cell v={free} /></span>
                <span className="flex justify-center font-medium"><Cell v={proV} pro /></span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── history ── */}
      {requests.length > 0 && (
        <Card title="Payment history">
          <div className="divide-y divide-lp-border">
            {requests.map((r) => {
              const s = STATUS[r.status] ?? { label: r.status, cls: "bg-lp-surface-2 text-lp-muted" };
              return (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium">{PLAN_NAME[r.plan] ?? r.plan} · ₹{r.amount}</p>
                    <p className="text-xs text-lp-subtle">{fmtDate(r.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

function Cell({ v, pro }: { v: string | boolean; pro?: boolean }) {
  if (v === true) return <Check className={`h-4 w-4 ${pro ? "text-lp-accent" : "text-lp-muted"}`} strokeWidth={2.5} />;
  if (v === false) return <X className="h-4 w-4 text-lp-subtle" />;
  return <span className={pro ? "text-lp-text" : "text-lp-muted"}>{v}</span>;
}

function ProStatus({ expires, daysLeft, fmtDate }: { expires: string; daysLeft: number; fmtDate: (d: string) => string }) {
  // progress across the current pass, assuming the longest common pass length that fits
  const span = daysLeft > 180 ? 365 : daysLeft > 30 ? 180 : 30;
  const pct = Math.max(4, Math.min(100, Math.round((daysLeft / span) * 100)));
  return (
    <>
      <PageHeader eyebrow="Account" title="Plan & billing" description="Pay once for the time you need. No subscription and no automatic renewal." />
      <section className="lp-gradient-border relative overflow-hidden rounded-3xl p-7 sm:p-9">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lp-green/10 px-3 py-1 text-xs font-semibold text-lp-green">
              <BadgeCheck className="h-3.5 w-3.5" /> Pro is active
            </span>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">You have everything unlocked</h1>
            <p className="mt-1.5 text-[15px] text-lp-muted">All designs, resume PDF, AI feedback and unlimited everything.</p>
          </div>
          <div className="w-full max-w-xs rounded-2xl border border-lp-border bg-lp-surface p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-semibold tracking-tight">{daysLeft}</span>
              <span className="text-sm text-lp-muted">day{daysLeft === 1 ? "" : "s"} left</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-lp-surface-2">
              <div className="h-full rounded-full bg-gradient-to-r from-lp-accent to-lp-violet" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-lp-muted">
              <Lock className="h-3 w-3" /> Active until {fmtDate(expires)}
            </p>
          </div>
        </div>
        {daysLeft > 7 && (
          <p className="relative mt-6 text-sm text-lp-muted">Options to extend will appear here a week before your Pro ends — no automatic charges.</p>
        )}
      </section>
    </>
  );
}
