"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePlan } from "@/lib/usePlan";
import { PRICES, formatPrice } from "@/lib/pricing";
import { useCurrency } from "@/lib/useCurrency";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight, ArrowUpRight, Check, Copy, EyeOff, Globe, Lock, Rocket, Sparkles } from "lucide-react";
import { Card, Notice, UpgradeLink, btn, friendlyError } from "@/components/ui";

/* ── Template & Publish — gallery edition ───────────────────────────────
   3-wide grid of template cards, each showing a real screenshot. */

const OPTIONS = [
  { id: "minimal", name: "Minimal", note: "Clean and simple. Free for everyone.", proOnly: false },
  { id: "executive", name: "Executive", note: "Light and professional — great for interviews.", proOnly: true },
  { id: "editorial", name: "Editorial", note: "Elegant, like a magazine page.", proOnly: true },
  { id: "noir", name: "Noir", note: "Black and gold, quietly luxurious.", proOnly: true },
  { id: "aurora", name: "Aurora", note: "Dark with soft glowing colours.", proOnly: true },
  { id: "glass", name: "Glass", note: "Modern frosted-glass look.", proOnly: true },
  { id: "bento", name: "Bento", note: "Neat tiles, easy to scan.", proOnly: true },
  { id: "cli", name: "Terminal", note: "Looks like a computer terminal — fun for developers.", proOnly: true },
];

/* real screenshot of each template, cropped to its header */
function Thumb({ id, name }: { id: string; name: string }) {
  return (
    <Image src={`/brand/templates/${id}.png`} alt={`${name} template`} fill
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="pointer-events-none object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
  );
}

export default function TemplatePage() {
  const { pro } = usePlan();
  const [savedTemplate, setSavedTemplate] = useState("minimal");
  const [selected, setSelected] = useState("minimal");
  const [published, setPublished] = useState(false);
  const [username, setUsername] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmOffline, setConfirmOffline] = useState(false);
  const [upgradeFor, setUpgradeFor] = useState<string | null>(null); // template name that triggered the popup
  const currency = useCurrency();

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      if (!r.ok) { setError((await friendlyError(r)).message); setLoaded(true); return; }
      const p = await r.json();
      setSavedTemplate(p.template ?? "minimal");
      setSelected(p.template ?? "minimal");
      setPublished(p.isPublished ?? false);
      setUsername(p.username ?? "");
      setLoaded(true);
    });
  }, []);

  async function patch(body: { template?: string; isPublished?: boolean }): Promise<boolean> {
    setError(null);
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) {
      const f = await friendlyError(res);
      setError(f.upgrade ? "That design is part of Pro. Upgrade to use it, or pick Minimal for free." : f.message);
      return false;
    }
    return true;
  }

  async function publish() {
    const ok = await patch({ template: selected, isPublished: true });
    if (ok) { setSavedTemplate(selected); setPublished(true); }
  }
  async function applyDesign() {
    const ok = await patch({ template: selected });
    if (ok) setSavedTemplate(selected);
  }
  async function takeOffline() {
    const ok = await patch({ isPublished: false });
    if (ok) { setPublished(false); setConfirmOffline(false); }
  }
  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const dirty = selected !== savedTemplate;
  const nameOf = (id: string) => OPTIONS.find((o) => o.id === id)?.name ?? id;

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        eyebrow="Share"
        title="Design & publish"
        description="Choose how your page looks, then publish it to get your link. You can switch designs anytime — your details stay exactly the same."
      />

      {error && <Notice tone="error" action={!pro ? <UpgradeLink /> : undefined}>{error}</Notice>}

      {/* status */}
      {loaded && (
        <Card>
          {published ? (
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lp-green/10 text-lp-green">
                  <Globe className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">Your page is live</p>
                  <a href={`/${username}`} target="_blank" className="mt-0.5 block truncate text-sm text-lp-accent hover:underline">
                    portxz.xyz/{username}
                  </a>
                  <p className="mt-0.5 text-[13px] text-lp-muted">Design: {nameOf(savedTemplate)}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {confirmOffline ? (
                  <>
                    <span className="text-sm text-lp-muted">Hide your page from everyone?</span>
                    <button onClick={() => setConfirmOffline(false)} className={btn("ghost", "sm")}>Keep it live</button>
                    <button onClick={takeOffline} disabled={saving} className={btn("danger", "sm")}>
                      {saving ? "Hiding…" : "Yes, take offline"}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setConfirmOffline(true)} className={btn("ghost", "sm", "hover:text-lp-danger")}>Take offline</button>
                    <button onClick={copyLink} className={btn("secondary")}>
                      {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy link</>}
                    </button>
                    <a href={`/${username}`} target="_blank" className={btn("primary")}>
                      View my page <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lp-warning/10 text-lp-warning">
                  <EyeOff className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Your page isn&apos;t public yet</p>
                  <p className="mt-0.5 text-sm text-lp-muted">
                    Pick a design below, then publish to get your link: <span className="text-lp-text">portxz.xyz/{username}</span>
                  </p>
                </div>
              </div>
              <button onClick={publish} disabled={saving} className={btn("success", "lg")}>
                <Rocket className="h-4 w-4" /> {saving ? "Publishing…" : "Publish my page"}
              </button>
            </div>
          )}
        </Card>
      )}

      {/* gallery */}
      <div>
        <h2 className="text-[15px] font-semibold">Choose a design</h2>
        <p className="mt-0.5 text-sm text-lp-muted">Click a design to select it. Use “Preview” to see it full size with sample details.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OPTIONS.map((o) => {
            const isSelected = selected === o.id;
            const isLive = savedTemplate === o.id && published;
            const locked = o.proOnly && !pro;
            return (
              <div key={o.id}
                className={`group overflow-hidden rounded-2xl border bg-lp-surface transition-all ${
                  isSelected
                    ? "border-lp-accent ring-4 ring-lp-accent-soft"
                    : "border-lp-border hover:border-lp-border-strong hover:shadow-lg"}`}>
                <button type="button" aria-pressed={isSelected}
                  onClick={() => (locked ? setUpgradeFor(o.name) : setSelected(o.id))}
                  className="relative block aspect-[16/10] w-full overflow-hidden bg-lp-surface-2 text-left">
                  <Thumb id={o.id} name={o.name} />
                  <span className="absolute left-2.5 top-2.5 flex gap-1.5">
                    {isLive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-lp-green px-2 py-0.5 text-[11px] font-semibold text-white shadow">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
                      </span>
                    )}
                    {isSelected && !isLive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-lp-accent px-2 py-0.5 text-[11px] font-semibold text-white shadow">
                        <Check className="h-3 w-3" /> Selected
                      </span>
                    )}
                  </span>
                  {locked && (
                    <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                      <Lock className="h-3 w-3" /> Pro
                    </span>
                  )}
                </button>
                <div className="flex items-center justify-between gap-3 border-t border-lp-border p-4">
                  <div className="min-w-0">
                    <p className="font-semibold">{o.name}</p>
                    <p className="mt-0.5 truncate text-[13px] text-lp-muted">{o.note}</p>
                  </div>
                  <a href={`/preview/${o.id}`} target="_blank" className={btn("ghost", "sm")}>
                    Preview <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* apply bar — only when a different design is picked on a live page */}
      <AnimatePresence>
        {published && dirty && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 lg:pl-[256px]">
            <div className="flex w-full max-w-xl items-center justify-between gap-4 rounded-2xl border border-lp-border-strong bg-lp-surface/95 px-4 py-3 shadow-2xl backdrop-blur">
              <p className="text-sm text-lp-muted">Switch your page to <span className="font-medium text-lp-text">{nameOf(selected)}</span>?</p>
              <div className="flex gap-2">
                <button onClick={() => setSelected(savedTemplate)} disabled={saving} className={btn("ghost", "sm")}>Cancel</button>
                <button onClick={applyDesign} disabled={saving} className={btn("primary", "sm")}>
                  {saving ? "Applying…" : "Use this design"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* upgrade popup — free user tapped a Pro design */}
      <AnimatePresence>
        {upgradeFor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setUpgradeFor(null)}>
            <motion.div initial={{ scale: 0.95, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"
              className="lp w-full max-w-sm rounded-2xl border border-lp-border bg-lp-surface p-6 text-center shadow-2xl">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-lp-accent-soft text-lp-accent">
                <Sparkles className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{upgradeFor} is a Pro design</h2>
              <p className="mt-2 text-sm leading-relaxed text-lp-muted">
                Pro unlocks all 8 designs, your resume PDF, AI feedback and unlimited everything.
              </p>
              <p className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-sm text-lp-subtle line-through">{formatPrice(PRICES[currency].month, currency)}</span>
                <span className="text-3xl font-semibold tracking-tight">{formatPrice(PRICES[currency].launch, currency)}</span>
                <span className="text-sm text-lp-muted">first month</span>
              </p>
              <p className="mt-1 text-xs text-lp-muted">Launch offer for the first 50 users</p>
              <a href="/dashboard/billing" className={btn("primary", "lg", "mt-5 w-full")}>
                See Pro plans <ArrowRight className="h-4 w-4" />
              </a>
              <button onClick={() => setUpgradeFor(null)} className={btn("ghost", "md", "mt-2 w-full")}>
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
