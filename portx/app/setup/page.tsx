"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PortxzLoader } from "@/components/PortxzLoader";
import { PhotoPicker } from "@/components/editor/PhotoPicker";
import { Logo } from "@/components/Logo";
import { ArrowRight, Check, Loader2, Lock, Rocket, X } from "lucide-react";
import { Notice, TagInput, inputCls } from "@/components/ui";

/* ── portxz onboarding wizard ───────────────────────────────────────────
   New signups walk: Profile → Project → Experience → Skills → Education
   → Links → Template & Publish. Every step skippable. Progress saved
   server-side (profile.onboardingStep) so refresh/return resumes.     */

const input = `${inputCls} mt-1.5`;
const label = "mt-5 block text-sm font-medium text-lp-text";
const hint = "mt-1.5 block text-[13px] text-lp-muted";
const opt = <span className="font-normal text-lp-subtle">(optional)</span>;

const STEPS = [
  { n: 0, title: "Choose your link", sub: "This will be the address of your page. You can share it anywhere." },
  { n: 1, title: "Tell us about you", sub: "A photo, a headline and a few words about yourself." },
  { n: 2, title: "Add something you've worked on", sub: "Just one for now — a project, design, campaign or case study. You can add more later." },
  { n: 3, title: "Your work experience", sub: "A job, internship or freelance work. Just starting out? Skip this step." },
  { n: 4, title: "Your skills", sub: "A few things you're good at, grouped under a name like Design or Tools." },
  { n: 5, title: "Your education", sub: "Where you studied — school, college or a course." },
  { n: 6, title: "Your social links", sub: "Where people can find you online. Both are optional." },
  { n: 7, title: "Pick a design and go live", sub: "Choose how your page looks. You can change it anytime." },
];

export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState<number | null>(null); // 0 = claim username
  const [username, setUsername] = useState("");
  // step 0 (claim)
  const [claimName, setClaimName] = useState("");
  const [claimUser, setClaimUser] = useState("");
  const [avail, setAvail] = useState<"idle" | "checking" | "free" | "taken" | "invalid">("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // step 1
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // saved on its own by PhotoPicker
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("");
  // step 2
  const [pName, setPName] = useState("");
  const [pTagline, setPTagline] = useState("");
  const [pTech, setPTech] = useState<string[]>([]);
  const [pLive, setPLive] = useState("");
  // step 3
  const [xTitle, setXTitle] = useState("");
  const [xOrg, setXOrg] = useState("");
  const [xBullet, setXBullet] = useState("");
  // step 4
  const [sCategory, setSCategory] = useState("");
  const [sItems, setSItems] = useState<string[]>([]);
  // step 5
  const [eInst, setEInst] = useState("");
  const [eDegree, setEDegree] = useState("");
  const [eYear, setEYear] = useState("");
  // step 6
  const [lGithub, setLGithub] = useState("");
  const [lLinkedin, setLLinkedin] = useState("");
  // step 7
  const [template, setTemplate] = useState("minimal");

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      if (r.status === 404) { setStep(0); return; }
      if (!r.ok) { setError("Could not load your profile — refresh to retry."); return; }
      const p = await r.json();
      if (p.onboardingStep >= 8) { router.replace("/dashboard"); return; }
      setUsername(p.username ?? "");
      setFullName(p.fullName ?? "");
      setAvatarUrl(p.avatarUrl ?? null);
      setHeadline(p.headline ?? "");
      setSummary(p.summary ?? "");
      setLocation(p.location ?? "");
      setStep(Math.max(1, p.onboardingStep ?? 1));
    });
  }, [router]);

  const norm = (v: string) => {
    const s = v.trim();
    if (!s) return null;
    return /^https?:\/\//i.test(s) ? s : `https://${s}`;
  };

  async function checkAvail(u: string) {
    setClaimUser(u);
    const clean = u.toLowerCase().trim();
    if (clean.length < 3) return setAvail("idle");
    setAvail("checking");
    const res = await fetch(`/api/username/check?u=${encodeURIComponent(clean)}`);
    const data = await res.json();
    setAvail(data.available ? "free" : data.reason === "invalid" ? "invalid" : "taken");
  }

  async function claim() {
    setError(null);
    setBusy(true);
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: claimUser.toLowerCase().trim(), fullName: claimName.trim() }),
    });
    setBusy(false);
    if (!res.ok) {
      setAvail("taken");
      setError("That username just got taken — try another.");
      return;
    }
    const p = await res.json();
    setUsername(p.username);
    setFullName(p.fullName ?? "");
    setAvatarUrl(p.avatarUrl ?? null);
    setStep(1);
  }

  async function setServerStep(n: number) {
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboardingStep: n }),
    });
  }

  async function advance() {
    const next = (step ?? 1) + 1;
    if (next > 7) {
      await setServerStep(8);
      router.replace("/dashboard");
      return;
    }
    await setServerStep(next);
    setStep(next);
  }

  async function skip() {
    setError(null);
    setBusy(true);
    await advance();
    setBusy(false);
  }

  async function submitStep() {
    setError(null);
    setBusy(true);
    try {
      let res: Response | null = null;
      if (step === 1) {
        res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ headline, summary, location }),
        });
      } else if (step === 2 && pName.trim()) {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: pName.trim().slice(0, 80),
            tagline: pTagline.slice(0, 140),
            tech: pTech.slice(0, 15),
            liveUrl: norm(pLive),
            featured: true,
          }),
        });
      } else if (step === 3 && xTitle.trim() && xOrg.trim()) {
        res = await fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: xTitle.trim(),
            organization: xOrg.trim(),
            bullets: xBullet.trim() ? [xBullet.trim().slice(0, 300)] : [],
          }),
        });
      } else if (step === 4 && sItems.length) {
        res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: sCategory.trim() || "Skills",
            items: sItems.slice(0, 10),
          }),
        });
      } else if (step === 5 && eInst.trim()) {
        res = await fetch("/api/educations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            institution: eInst.trim(),
            degree: eDegree.trim(),
            endYear: eYear ? parseInt(eYear, 10) || null : null,
          }),
        });
      } else if (step === 6) {
        const posts = [
          lGithub.trim() && { kind: "github", label: "GitHub", url: norm(lGithub)! },
          lLinkedin.trim() && { kind: "linkedin", label: "LinkedIn", url: norm(lLinkedin)! },
        ].filter(Boolean) as { kind: string; label: string; url: string }[];
        for (const p of posts) {
          const r = await fetch("/api/links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p),
          });
          if (!r.ok) res = r;
        }
      } else if (step === 7) {
        res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ template, isPublished: true }),
        });
        if (res.status === 403) {
          // pro template on free plan — fall back to minimal, still publish
          res = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ template: "minimal", isPublished: true }),
          });
        }
      }

      if (res && !res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error === "free_limit_reached"
          ? "You've reached the free plan limit for this step — you can skip it for now."
          : "We couldn't save that. Please check the details, or skip this step for now.");
        setBusy(false);
        return;
      }
      await advance();
    } finally {
      setBusy(false);
    }
  }

  if (step === null) return <PortxzLoader fullscreen label="Setting things up" />;

  const meta = STEPS[step]; // index aligns: 0 = claim, 1-7 = content steps
  const displayStep = step + 1; // 1..8 for humans
  const pct = Math.round((step / STEPS.length) * 100);

  return (
    <main className="lp flex min-h-screen flex-col items-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* header */}
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <span className="text-sm text-lp-muted">Step {displayStep} of 8{username && <span className="hidden sm:inline"> · portxz.xyz/{username}</span>}</span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-lp-surface-2">
          <div className="h-full rounded-full bg-gradient-to-r from-lp-accent to-lp-green transition-all"
            style={{ width: `${pct}%` }} />
        </div>

        {/* card */}
        <div className="lp-card mt-8 rounded-3xl p-6 sm:p-9">
          <h1 className="text-[1.6rem] font-semibold leading-tight tracking-[-0.02em]">{meta.title}</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-lp-muted">{meta.sub}</p>

          {error && (
            <Notice tone="error" className="mt-5">{error}</Notice>
          )}

          {step === 0 && (
            <>
              <label className={label}>Your full name</label>
              <input className={input} value={claimName} placeholder="e.g. Aarav Mehta"
                onChange={(e) => setClaimName(e.target.value)} />
              <label className={label}>Your page link</label>
              <div className="mt-1.5 flex items-center rounded-xl border border-lp-border bg-lp-surface transition focus-within:border-lp-accent focus-within:ring-4 focus-within:ring-lp-accent-soft">
                <span className="pl-3.5 text-[15px] text-lp-muted">portxz.xyz/</span>
                <input value={claimUser} onChange={(e) => checkAvail(e.target.value)} aria-label="Your page link"
                  className="w-full bg-transparent px-0.5 py-2.5 text-[15px] outline-none placeholder:text-lp-subtle" placeholder="aarav" />
              </div>
              <span className={hint}>Lowercase letters, numbers or hyphens — your name works great.</span>
              <p className={`mt-1 h-5 text-[13px] font-medium ${
                avail === "free" ? "text-lp-green" : avail === "checking" ? "text-lp-muted" : "text-lp-danger"}`}>
                {{
                  idle: null,
                  checking: <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> checking…</span>,
                  free: <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" /> Available — it&apos;s yours!</span>,
                  taken: <span className="inline-flex items-center gap-1"><X className="h-3 w-3" /> Already taken — try another</span>,
                  invalid: <span className="inline-flex items-center gap-1"><X className="h-3 w-3" /> Use 3–30 lowercase letters, numbers or hyphens</span>,
                }[avail]}
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <label className={label}>Your photo</label>
              <div className="mb-2 mt-2">
                <PhotoPicker value={avatarUrl} name={fullName} onChange={setAvatarUrl} />
              </div>
              <label className={label}>Headline</label>
              <input className={input} value={headline} placeholder="e.g. Graphic Designer · Marketing Specialist"
                onChange={(e) => setHeadline(e.target.value)} />
              <label className={label}>A few words about you</label>
              <textarea className={`${input} resize-none`} rows={3} value={summary}
                placeholder="What you do, what you're good at, and what you're looking for — 2 or 3 sentences."
                onChange={(e) => setSummary(e.target.value)} />
              <label className={label}>City {opt}</label>
              <input className={input} value={location} placeholder="Bengaluru, India"
                onChange={(e) => setLocation(e.target.value)} />
            </>
          )}

          {step === 2 && (
            <>
              <label className={label}>Name</label>
              <input className={input} value={pName} placeholder="e.g. Rebrand for a local café"
                onChange={(e) => setPName(e.target.value)} />
              <label className={label}>Describe it in one sentence</label>
              <input className={input} value={pTagline} placeholder="e.g. A new logo and menu that lifted sales by 15%"
                onChange={(e) => setPTagline(e.target.value)} />
              <span className={label}>Tools or skills used {opt}</span>
              <div className="mt-1.5"><TagInput value={pTech} onChange={setPTech} placeholder="Type one and press Enter" /></div>
              <label className={label}>Link {opt}</label>
              <input className={input} value={pLive} placeholder="Where people can see it"
                onChange={(e) => setPLive(e.target.value)} />
            </>
          )}

          {step === 3 && (
            <>
              <label className={label}>Job title</label>
              <input className={input} value={xTitle} placeholder="e.g. Marketing Intern"
                onChange={(e) => setXTitle(e.target.value)} />
              <label className={label}>Company or organisation</label>
              <input className={input} value={xOrg} placeholder="e.g. Acme Pvt Ltd"
                onChange={(e) => setXOrg(e.target.value)} />
              <label className={label}>One thing you did there {opt}</label>
              <input className={input} value={xBullet} placeholder="e.g. Ran social media and doubled followers in 6 months"
                onChange={(e) => setXBullet(e.target.value)} />
            </>
          )}

          {step === 4 && (
            <>
              <label className={label}>Group name</label>
              <input className={input} value={sCategory} placeholder="e.g. Design, Marketing, Tools"
                onChange={(e) => setSCategory(e.target.value)} />
              <span className={label}>Skills</span>
              <div className="mt-1.5"><TagInput value={sItems} onChange={setSItems} placeholder="Type a skill and press Enter" /></div>
            </>
          )}

          {step === 5 && (
            <>
              <label className={label}>School, college or university</label>
              <input className={input} value={eInst} placeholder="e.g. Pune University"
                onChange={(e) => setEInst(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Degree or course</label>
                  <input className={input} value={eDegree} placeholder="e.g. B.Com"
                    onChange={(e) => setEDegree(e.target.value)} />
                </div>
                <div>
                  <label className={label}>End year</label>
                  <input className={input} type="number" value={eYear} placeholder="2026"
                    onChange={(e) => setEYear(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <label className={label}>LinkedIn {opt}</label>
              <input className={input} value={lLinkedin} placeholder="linkedin.com/in/your-name"
                onChange={(e) => setLLinkedin(e.target.value)} />
              <label className={label}>GitHub <span className="font-normal text-lp-subtle">(optional, for developers)</span></label>
              <input className={input} value={lGithub} placeholder="github.com/your-name"
                onChange={(e) => setLGithub(e.target.value)} />
            </>
          )}

          {step === 7 && (
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "minimal", name: "Minimal", pro: false },
                  { id: "executive", name: "Executive", pro: true },
                  { id: "editorial", name: "Editorial", pro: true },
                  { id: "noir", name: "Noir", pro: true },
                  { id: "aurora", name: "Aurora", pro: true },
                  { id: "glass", name: "Glass", pro: true },
                  { id: "bento", name: "Bento", pro: true },
                  { id: "cli", name: "Terminal", pro: true },
                ].map((o) => {
                  const on = template === o.id;
                  return (
                    <button key={o.id} type="button" onClick={() => setTemplate(o.id)} aria-pressed={on}
                      className={`overflow-hidden rounded-2xl border text-left transition ${
                        on ? "border-lp-accent ring-4 ring-lp-accent-soft" : "border-lp-border hover:border-lp-border-strong"}`}>
                      <span className="relative block aspect-[4/3] overflow-hidden bg-lp-surface-2">
                        <Image src={`/brand/templates/${o.id}.png`} alt="" fill sizes="240px" className="object-cover object-top" />
                        {o.pro && (
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                            <Lock className="h-2.5 w-2.5" /> Pro
                          </span>
                        )}
                        {on && (
                          <span className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-lp-accent text-white shadow">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </span>
                      <span className="flex items-center justify-between px-3 py-2.5">
                        <span className="text-sm font-medium">{o.name}</span>
                        {!o.pro && <span className="text-[11px] font-medium text-lp-green">Free</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-lp-muted">
                Designs marked Pro need an upgrade. If you pick one now, we&apos;ll publish with Minimal for free
                and you can switch anytime.
              </p>
            </div>
          )}

          {/* actions */}
          <div className="mt-8 flex items-center justify-between">
            {step === 0 ? <span /> : (
              <button onClick={skip} disabled={busy}
                className="text-sm text-lp-muted hover:text-lp-text disabled:opacity-40">
                Skip for now
              </button>
            )}
            {step === 0 ? (
              <button onClick={claim} disabled={avail !== "free" || !claimName.trim() || busy}
                className="rounded-lg lp-btn-primary px-6 py-2.5 text-sm font-semibold  disabled:opacity-40">
                {busy ? "Creating…" : <span className="inline-flex items-center gap-1.5">Claim &amp; continue <ArrowRight className="h-4 w-4" /></span>}
              </button>
            ) : (
              <button onClick={submitStep} disabled={busy}
                className="rounded-lg lp-btn-primary px-6 py-2.5 text-sm font-semibold  disabled:opacity-40">
                {busy ? "Saving…" : step === 7
                  ? <span className="inline-flex items-center gap-1.5">Publish &amp; finish <Rocket className="h-4 w-4" /></span>
                  : <span className="inline-flex items-center gap-1.5">Continue <ArrowRight className="h-4 w-4" /></span>}
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-[13px] text-lp-subtle">
          You can change anything later from your dashboard.
        </p>
      </div>
    </main>
  );
}
