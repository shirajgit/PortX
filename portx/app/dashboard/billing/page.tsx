"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDown, BadgeCheck, Check, Clock, FileText, Infinity as InfinityIcon, Loader2, Lock, Palette,
  RefreshCcw, ShieldCheck, Sparkles, Target, WandSparkles, Wallet, X, Zap,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Notice, btn } from "@/components/ui";
import { PASSES as ALL_PASSES } from "@/lib/billing";
import {
  PRICES, SALE, formatPrice, isCurrency, perMonth, priceOf, saleActive, type Currency, type SellablePass,
} from "@/lib/pricing";
import { useCurrency } from "@/lib/useCurrency";

type PassInfo = { id: SellablePass; label: string; short: string; days: number };
/** price = what it costs now; was = the crossed-out comparison price. */
type Pass = PassInfo & { price: number; was: number };
const PASS_INFO: PassInfo[] = [
  { id: "month", label: "Pro — 1 Month", short: "1 month", days: 30 },
  { id: "halfyear", label: "Pro — 6 Months", short: "6 months", days: 180 },
  { id: "year", label: "Pro — 1 Year", short: "1 year", days: 365 },
];
/* During the sale a pass is compared with its own regular price (so every plan shows
   50% off). Otherwise longer passes are compared with paying monthly for as long. */
function passesFor(currency: Currency, sale: boolean): Pass[] {
  const monthly = PRICES[currency].month;
  return PASS_INFO.map((info) => ({
    ...info,
    price: priceOf(info.id, currency),
    was: sale ? PRICES[currency][info.id] : Math.round(monthly * (info.days / 30) * 100) / 100,
  }));
}
const savePct = (p: Pass) => Math.round((1 - p.price / p.was) * 100);

const BENEFITS = [
  { icon: Palette, title: "All 8 premium designs", text: "Executive, Editorial, Noir, Aurora and more. Switch anytime — your details stay the same." },
  { icon: FileText, title: "6 resume templates", text: "Modern, Executive, Technical and more — or design your own. All read perfectly by hiring software." },
  { icon: Sparkles, title: "AI feedback on your page", text: "A score out of 100 and simple, specific fixes — like a mentor reviewing your profile." },
  { icon: WandSparkles, title: "200 AI rewrites a month", text: "Turn rough notes into strong, professional lines with one click — 40× the free plan." },
  { icon: InfinityIcon, title: "No limits", text: "Add every project, job, skill and link you want — no caps like on the free plan." },
  { icon: Target, title: "Tailor to any job", text: "Paste a job post to get a match score, missing keywords and bullets rewritten to fit — then download that resume." },
];

const COMPARE: [string, string | boolean, string | boolean][] = [
  ["Your own page link", true, true],
  ["Designs", "1", "All 8"],
  ["Projects, jobs & links", "Up to 5", "Unlimited"],
  ["AI writing help", "5 a month", "200 a month"],
  ["AI feedback & score", false, true],
  ["Tailor resume to a job", false, "60 a month"],
  ["Resume PDF", "Classic", "6 templates + editor"],
];

const trustFor = (currency: Currency) => [
  { icon: ShieldCheck, text: "Secure payment by Razorpay" },
  { icon: RefreshCcw, text: "No subscription, no auto-renewal" },
  { icon: Zap, text: "Pro turns on instantly" },
  // UPI, netbanking and wallets are India-only; international buyers pay by card.
  { icon: Wallet, text: currency === "INR" ? "UPI, cards, netbanking & wallets" : "All major cards accepted" },
];

// amount arrives as a string — Prisma serializes Decimal columns that way.
type PayReq = { id: string; plan: string; amount: number | string; currency: string; utr: string; status: string; createdAt: string };
const paidAmount = (r: PayReq) => formatPrice(Number(r.amount), isCurrency(r.currency) ? r.currency : "INR");

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
  const currency = useCurrency();
  const sale = saleActive();
  const PASSES = passesFor(currency, sale);
  const fmt = (n: number) => formatPrice(n, currency);
  const TRUST = trustFor(currency);

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
  const daysLeft = expires
    ? Math.ceil((new Date(expires).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : 0;
  const showPasses = !pending && (!pro || daysLeft <= 7);
  // phone list: best value picked by default
  const pick = choice ?? "year";
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
        b.error === "razorpay_not_configured" ? "Payments are temporarily unavailable — please try again later."
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
        // A network drop here is fine: the Razorpay webhook still turns Pro on.
        const v = await fetch("/api/billing/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(result),
        }).catch(() => null);
        setPaying(null);
        if (!v?.ok)
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
  // From lib/billing so old payments (e.g. the retired "launch" pass) keep their names.
  const PLAN_NAME: Record<string, string> = Object.fromEntries(Object.values(ALL_PASSES).map((p) => [p.id, p.label]));
  const month = PASSES[0];

  return (
    <div className={`space-y-6 sm:space-y-8 ${chosen ? "pb-28 sm:pb-0" : ""}`}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {success && <Notice tone="success">Payment successful — welcome to Pro! Everything is unlocked.</Notice>}
      {error && <Notice tone="error">{error}</Notice>}
      {pending && (
        <Notice tone="warning">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> We&apos;re checking your payment of {paidAmount(pending)}. This usually takes a few hours.</span>
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
                <span className="text-4xl font-semibold tracking-tight">{fmt(month.price)}</span>
                {sale && <span className="text-lg text-lp-subtle line-through">{fmt(month.was)}</span>}
                <span className="text-sm text-lp-muted">for 1 month</span>
              </div>
              {sale
                ? <p className="mt-1 text-[13px] font-medium text-lp-green">Launch sale · {SALE.percent}% off every plan until {SALE.endsLabel}</p>
                : <p className="mt-1 text-[13px] font-medium text-lp-muted">Or save more with a 6-month or yearly pass</p>}
              {/* phones use the sticky pay bar instead */}
              <div className="mt-6 hidden flex-wrap gap-3 sm:flex">
                {showPasses ? (
                  <button onClick={() => pay(month)} disabled={!!paying} className={btn("primary", "lg")}>
                    {paying === month.id ? <><Loader2 className="h-4 w-4 animate-spin" /> Opening payment…</> : <>Get Pro for {fmt(month.price)}</>}
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
          <p className="mt-1 text-sm text-lp-muted sm:text-[15px]">
            {sale && <span className="font-medium text-lp-green">{SALE.percent}% off until {SALE.endsLabel}. </span>}
            Pay once. No subscription — you&apos;ll never be charged again unless you choose to.
          </p>

          {/* phones: compact tappable list + sticky pay bar */}
          <div className="mt-4 space-y-2.5 sm:hidden" role="radiogroup" aria-label="Plans">
            {PASSES.map((p) => {
              const on = pick === p.id;
              const save = savePct(p);
              return (
                <button key={p.id} type="button" role="radio" aria-checked={on}
                  onClick={() => setChoice(p.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
                    on ? "border-lp-accent bg-lp-accent-soft ring-4 ring-lp-accent-soft" : "border-lp-border bg-lp-surface"}`}>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-lp-accent" : "border-lp-border-strong"}`}>
                    {on && <span className="h-2.5 w-2.5 rounded-full bg-lp-accent" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[15px] font-semibold">{p.short}</span>
                      {p.id === "year" && <span className="rounded-full bg-lp-green px-1.5 py-0.5 text-[10px] font-semibold text-white">Best value</span>}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-lp-muted">
                      {p.days === 30 ? "for 30 days" : `${fmt(perMonth(p.price, p.days, currency))} a month`}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-lg font-semibold tracking-tight">
                      {save > 0 && <span className="mr-1.5 text-[13px] font-normal text-lp-subtle line-through">{fmt(p.was)}</span>}
                      {fmt(p.price)}
                    </span>
                    {save > 0 && <span className="block text-[11px] font-semibold text-lp-green">{sale ? `${save}% off` : `Save ${save}%`}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          {/* tablets & desktop: cards */}
          <div className="mt-5 hidden gap-4 sm:grid sm:grid-cols-3">
            {PASSES.map((p) => {
              const featured = p.id === "year";
              const save = savePct(p);
              return (
                <div key={p.id}
                  className={`relative flex min-w-0 flex-col rounded-2xl p-5 ${
                    featured ? "lp-gradient-border shadow-[0_24px_60px_-28px_rgba(79,110,255,0.7)]" : "lp-card"}`}>
                  {featured && (
                    <span className="absolute -top-3 left-5 rounded-full bg-lp-green px-2.5 py-1 text-[11px] font-semibold text-white shadow">Best value</span>
                  )}
                  <p className="mt-1 text-sm font-medium text-lp-muted">{p.short}</p>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tight">{fmt(p.price)}</span>
                    {save > 0 && <span className="text-sm text-lp-subtle line-through">{fmt(p.was)}</span>}
                  </p>
                  <p className="mt-1 text-[13px] text-lp-muted">
                    {p.days === 30 ? "for 30 days" : `just ${fmt(perMonth(p.price, p.days, currency))} a month`}
                  </p>
                  <div className="mt-3 h-6">
                    {save > 0 && (
                      <span className="inline-flex rounded-full bg-lp-green/10 px-2 py-0.5 text-xs font-semibold text-lp-green">{sale ? `${save}% off · until ${SALE.endsLabel}` : `Save ${save}%`}</span>
                    )}
                  </div>
                  <div className="mt-auto pt-5">
                    <button onClick={() => pay(p)} disabled={!!paying}
                      className={btn(featured ? "primary" : "secondary", "md", "w-full")}>
                      {paying === p.id ? <><Loader2 className="h-4 w-4 animate-spin" /> Opening…</> : `Get ${p.short}`}
                    </button>
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
                  <p className="text-[15px] font-semibold">{fmt(chosen.price)} <span className="text-[13px] font-normal text-lp-muted">· {chosen.short}</span></p>
                  <p className="flex items-center gap-1 text-[11px] text-lp-muted"><ShieldCheck className="h-3 w-3 text-lp-green" /> Secure · no auto-renewal</p>
                </div>
                <button onClick={() => pay(chosen)} disabled={!!paying} className={btn("primary", "lg", "px-5")}>
                  {paying === chosen.id ? <><Loader2 className="h-4 w-4 animate-spin" /> Opening…</> : <>Pay {fmt(chosen.price)}</>}
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
                    <p className="font-medium">{PLAN_NAME[r.plan] ?? r.plan} · {paidAmount(r)}</p>
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
            <p className="mt-1.5 text-[15px] text-lp-muted">All designs, every resume template, AI feedback and unlimited everything.</p>
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
