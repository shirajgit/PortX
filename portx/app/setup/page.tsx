"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PortxzLoader } from "@/components/PortxzLoader";
import { PhotoPicker } from "@/components/editor/PhotoPicker";
import { Logo } from "@/components/Logo";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, AtSign, Briefcase, Check, FolderGit2, GraduationCap, Link2, Loader2, Lock, Palette, Rocket, Sparkles,
  UserRound, X,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { Field, Notice, TagInput, btn, inputCls } from "@/components/ui";

/* ── portxz onboarding wizard ───────────────────────────────────────────
   New signups walk: Profile → Project → Experience → Skills → Education
   → Links → Template & Publish. Every step skippable. Progress saved
   server-side (profile.onboardingStep) so refresh/return resumes.
   Built from the dashboard UI kit (Field, inputCls, btn, Notice).     */

const STEPS = [
  { n: 0, icon: AtSign, short: "Your link", title: "Choose your link", sub: "This will be the address of your page. You can share it anywhere." },
  { n: 1, icon: UserRound, short: "About you", title: "Tell us about you", sub: "A photo, a headline and a few words about yourself." },
  { n: 2, icon: FolderGit2, short: "A project", title: "Add something you've worked on", sub: "Just one for now: a project, design, campaign or case study. You can add more later." },
  { n: 3, icon: Briefcase, short: "Experience", title: "Your work experience", sub: "A job, internship or freelance work. Just starting out? Skip this step." },
  { n: 4, icon: Sparkles, short: "Skills", title: "Your skills", sub: "A few things you're good at, grouped under a name like Design or Tools." },
  { n: 5, icon: GraduationCap, short: "Education", title: "Your education", sub: "Where you studied: school, college or a course." },
  { n: 6, icon: Link2, short: "Social links", title: "Your social links", sub: "Where people can find you online. Both are optional." },
  { n: 7, icon: Palette, short: "Design", title: "Pick a design and go live", sub: "Choose how your page looks. You can change it anytime." },
];

const TEMPLATES = [
  { id: "minimal", name: "Minimal", pro: false },
  { id: "executive", name: "Executive", pro: true },
  { id: "editorial", name: "Editorial", pro: true },
  { id: "noir", name: "Noir", pro: true },
  { id: "aurora", name: "Aurora", pro: true },
  { id: "glass", name: "Glass", pro: true },
  { id: "bento", name: "Bento", pro: true },
  { id: "cli", name: "Terminal", pro: true },
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

  // Wait until typing pauses before asking the server, and ignore replies for older input.
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestCheck = useRef("");
  function checkAvail(u: string) {
    setClaimUser(u);
    const clean = u.toLowerCase().trim();
    latestCheck.current = clean;
    if (checkTimer.current) clearTimeout(checkTimer.current);
    if (clean.length < 3) return setAvail("idle");
    setAvail("checking");
    checkTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/username/check?u=${encodeURIComponent(clean)}`);
        const data = await res.json();
        if (latestCheck.current !== clean) return;
        setAvail(data.available ? "free" : data.reason === "invalid" ? "invalid" : "taken");
      } catch {
        if (latestCheck.current === clean) setAvail("idle");
      }
    }, 350);
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
  const last = step === STEPS.length - 1;

  return (
    <div className="lp relative isolate min-h-screen">
      {/* ambient backdrop — same grid + glow as the dashboard */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="lp-grid-bg absolute inset-x-0 top-0 h-[520px]" />
        <div className="absolute left-1/2 top-[-260px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
      </div>

      <main className="mx-auto flex w-full max-w-xl flex-col px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        {/* header */}
        <header className="flex items-center justify-between gap-4">
          <Logo size="md" />
          {username && (
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-lp-border bg-lp-surface/80 px-3 py-1 text-[13px] text-lp-muted backdrop-blur">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lp-green" />
              <span className="truncate">portxz.xyz/<span className="font-medium text-lp-text">{username}</span></span>
            </span>
          )}
        </header>

        {/* progress */}
        <div className="mt-10">
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] font-medium text-lp-accent">Step {step + 1} of {STEPS.length}</p>
            <p className="text-[13px] text-lp-subtle">{last ? "Last step" : `Next: ${STEPS[step + 1].short}`}</p>
          </div>
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {STEPS.map((s) => (
              <span key={s.n} className="h-1.5 flex-1 overflow-hidden rounded-full bg-lp-surface-2">
                <span className={`block h-full rounded-full bg-gradient-to-r from-lp-accent to-lp-violet transition-all duration-500 ${
                  s.n < step ? "w-full" : s.n === step ? "w-1/2" : "w-0"}`} />
              </span>
            ))}
          </div>
        </div>

        {/* card */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.section key={step} className="lp-card mt-6 rounded-2xl p-5 sm:p-8"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}>
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lp-accent-soft text-lp-accent">
                <meta.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h1 className="text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.6rem]">{meta.title}</h1>
                <p className="mt-1.5 text-[15px] leading-relaxed text-lp-muted">{meta.sub}</p>
              </div>
            </div>

            {error && <Notice tone="error" className="mt-6">{error}</Notice>}

            <div className="mt-7 space-y-5">
              {step === 0 && (
                <>
                  <Field label="Your full name">
                    <input className={inputCls} value={claimName} placeholder="e.g. Aarav Mehta" autoFocus
                      onChange={(e) => setClaimName(e.target.value)} />
                  </Field>
                  <Field label="Your page link" hint="Lowercase letters, numbers or hyphens. Your name works great.">
                    <span className="flex items-center rounded-xl border border-lp-border bg-lp-surface transition hover:border-lp-border-strong focus-within:border-lp-accent focus-within:ring-4 focus-within:ring-lp-accent-soft">
                      <span className="select-none pl-3.5 text-[15px] text-lp-subtle">portxz.xyz/</span>
                      <input value={claimUser} onChange={(e) => checkAvail(e.target.value)}
                        className="w-full bg-transparent py-2.5 pl-0.5 pr-3.5 text-[15px] text-lp-text outline-none placeholder:text-lp-subtle" placeholder="aarav" />
                      {avail === "checking" && <Loader2 className="mr-3.5 h-4 w-4 shrink-0 animate-spin text-lp-muted" />}
                      {avail === "free" && <Check className="mr-3.5 h-4 w-4 shrink-0 text-lp-green" />}
                      {(avail === "taken" || avail === "invalid") && <X className="mr-3.5 h-4 w-4 shrink-0 text-lp-danger" />}
                    </span>
                  </Field>
                  {(avail === "free" || avail === "taken" || avail === "invalid") && (
                    <Notice tone={avail === "free" ? "success" : "error"}>
                      {avail === "free" ? <>Nice, <strong>portxz.xyz/{claimUser.toLowerCase().trim()}</strong> is available. It&apos;s yours!</>
                        : avail === "taken" ? "That link is already taken. Try another."
                        : "Use 3 to 30 lowercase letters, numbers or hyphens."}
                    </Notice>
                  )}
                </>
              )}

              {step === 1 && (
                <>
                  <Field group label="Your photo" optional>
                    <PhotoPicker value={avatarUrl} name={fullName} onChange={setAvatarUrl} />
                  </Field>
                  <Field label="Headline" hint="Who you are in a few words. Shown right under your name.">
                    <input className={inputCls} value={headline} placeholder="e.g. Graphic Designer · Marketing Specialist"
                      onChange={(e) => setHeadline(e.target.value)} />
                  </Field>
                  <Field label="A few words about you" hint="What you do, what you're good at, and what you're looking for.">
                    <textarea className={`${inputCls} resize-none leading-relaxed`} rows={4} value={summary}
                      placeholder="2 or 3 sentences is perfect."
                      onChange={(e) => setSummary(e.target.value)} />
                  </Field>
                  <Field label="City" optional>
                    <input className={inputCls} value={location} placeholder="e.g. Bengaluru, India"
                      onChange={(e) => setLocation(e.target.value)} />
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="Name">
                    <input className={inputCls} value={pName} placeholder="e.g. Rebrand for a local café"
                      onChange={(e) => setPName(e.target.value)} />
                  </Field>
                  <Field label="Describe it in one sentence">
                    <input className={inputCls} value={pTagline} placeholder="e.g. A new logo and menu that lifted sales by 15%"
                      onChange={(e) => setPTagline(e.target.value)} />
                  </Field>
                  <Field group label="Tools or skills used" optional hint="Type one and press Enter.">
                    <TagInput value={pTech} onChange={setPTech} placeholder="e.g. Figma" />
                  </Field>
                  <Field label="Link" optional hint="Where people can see it.">
                    <input className={inputCls} value={pLive} placeholder="e.g. behance.net/your-project"
                      onChange={(e) => setPLive(e.target.value)} />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Job title">
                      <input className={inputCls} value={xTitle} placeholder="e.g. Marketing Intern"
                        onChange={(e) => setXTitle(e.target.value)} />
                    </Field>
                    <Field label="Company or organisation">
                      <input className={inputCls} value={xOrg} placeholder="e.g. Acme Pvt Ltd"
                        onChange={(e) => setXOrg(e.target.value)} />
                    </Field>
                  </div>
                  <Field label="One thing you did there" optional>
                    <input className={inputCls} value={xBullet} placeholder="e.g. Ran social media and doubled followers in 6 months"
                      onChange={(e) => setXBullet(e.target.value)} />
                  </Field>
                </>
              )}

              {step === 4 && (
                <>
                  <Field label="Group name" hint="Leave it empty and we'll call it “Skills”.">
                    <input className={inputCls} value={sCategory} placeholder="e.g. Design, Marketing, Tools"
                      onChange={(e) => setSCategory(e.target.value)} />
                  </Field>
                  <Field group label="Skills" hint="Type a skill and press Enter. Add up to 10.">
                    <TagInput value={sItems} onChange={setSItems} max={10} placeholder="e.g. Photoshop" />
                  </Field>
                </>
              )}

              {step === 5 && (
                <>
                  <Field label="School, college or university">
                    <input className={inputCls} value={eInst} placeholder="e.g. Pune University"
                      onChange={(e) => setEInst(e.target.value)} />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
                    <Field label="Degree or course" optional>
                      <input className={inputCls} value={eDegree} placeholder="e.g. B.Com"
                        onChange={(e) => setEDegree(e.target.value)} />
                    </Field>
                    <Field label="End year" optional>
                      <input className={inputCls} type="number" inputMode="numeric" value={eYear} placeholder="2026"
                        onChange={(e) => setEYear(e.target.value)} />
                    </Field>
                  </div>
                </>
              )}

              {step === 6 && (
                <>
                  <Field label="LinkedIn" optional>
                    <span className="relative block">
                      <LinkedinIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-subtle" />
                      <input className={`${inputCls} pl-10`} value={lLinkedin} placeholder="linkedin.com/in/your-name"
                        onChange={(e) => setLLinkedin(e.target.value)} />
                    </span>
                  </Field>
                  <Field label="GitHub" optional hint="For developers. It also powers the stats on your GitHub README.">
                    <span className="relative block">
                      <GithubIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-subtle" />
                      <input className={`${inputCls} pl-10`} value={lGithub} placeholder="github.com/your-name"
                        onChange={(e) => setLGithub(e.target.value)} />
                    </span>
                  </Field>
                </>
              )}

              {step === 7 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map((o) => {
                      const on = template === o.id;
                      return (
                        <button key={o.id} type="button" onClick={() => setTemplate(o.id)} aria-pressed={on}
                          className={`overflow-hidden rounded-xl border bg-lp-surface text-left transition ${
                            on ? "border-lp-accent ring-4 ring-lp-accent-soft" : "border-lp-border hover:border-lp-border-strong"}`}>
                          <span className="relative block aspect-[4/3] overflow-hidden bg-lp-surface-2">
                            <Image src={`/brand/templates/${o.id}.png`} alt="" fill sizes="240px" className="object-cover object-top" />
                            {o.pro && (
                              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                                <Lock className="h-2.5 w-2.5" /> Pro
                              </span>
                            )}
                            {on && (
                              <span className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-lp-accent text-lp-on-accent shadow">
                                <Check className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </span>
                          <span className="flex items-center justify-between px-3 py-2.5">
                            <span className="text-sm font-medium text-lp-text">{o.name}</span>
                            {!o.pro && <span className="text-[11px] font-medium text-lp-green">Free</span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <Notice tone="info">
                    Designs marked Pro need an upgrade. If you pick one now, we&apos;ll publish with Minimal for free and you can switch anytime.
                  </Notice>
                </>
              )}
            </div>

            {/* actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-lp-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              {step === 0 ? <span className="hidden sm:block" /> : (
                <button onClick={skip} disabled={busy} className={btn("ghost", "md")}>
                  Skip for now
                </button>
              )}
              {step === 0 ? (
                <button onClick={claim} disabled={avail !== "free" || !claimName.trim() || busy} className={btn("primary", "lg")}>
                  {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : <>Claim &amp; continue <ArrowRight className="h-4 w-4" /></>}
                </button>
              ) : (
                <button onClick={submitStep} disabled={busy} className={btn(last ? "success" : "primary", "lg")}>
                  {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                    : last ? <>Publish &amp; finish <Rocket className="h-4 w-4" /></>
                    : <>Continue <ArrowRight className="h-4 w-4" /></>}
                </button>
              )}
            </div>
          </motion.section>
        </AnimatePresence>

        <p className="mt-6 text-center text-[13px] text-lp-subtle">
          Every step is optional. You can change anything later from your dashboard.
        </p>
      </main>
    </div>
  );
}
