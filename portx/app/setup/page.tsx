"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ── portxz onboarding wizard ───────────────────────────────────────────
   New signups walk: Profile → Project → Experience → Skills → Education
   → Links → Template & Publish. Every step skippable. Progress saved
   server-side (profile.onboardingStep) so refresh/return resumes.     */

const input = "mt-1 w-full rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-2.5 text-sm outline-none focus:border-[#4DA6FF]";
const label = "mt-4 block font-mono text-xs uppercase tracking-wider text-[#8B98B8]";

const STEPS = [
  { n: 0, title: "Claim your username", sub: "This becomes your public link — choose wisely." },
  { n: 1, title: "About you", sub: "This becomes your headline everywhere." },
  { n: 2, title: "Your best project", sub: "Just one for now — add the rest later." },
  { n: 3, title: "Experience", sub: "A job, internship, or freelance gig. Skip if you're just starting." },
  { n: 4, title: "Your skills", sub: "One group, a few skills. e.g. Frontend: React, Next.js" },
  { n: 5, title: "Education", sub: "Where you studied." },
  { n: 6, title: "Your links", sub: "GitHub + LinkedIn — where people find you." },
  { n: 7, title: "Pick a look & go live", sub: "Choose a template and publish your page." },
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
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("");
  // step 2
  const [pName, setPName] = useState("");
  const [pTagline, setPTagline] = useState("");
  const [pTech, setPTech] = useState("");
  const [pLive, setPLive] = useState("");
  // step 3
  const [xTitle, setXTitle] = useState("");
  const [xOrg, setXOrg] = useState("");
  const [xBullet, setXBullet] = useState("");
  // step 4
  const [sCategory, setSCategory] = useState("Frontend");
  const [sItems, setSItems] = useState("");
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
            tech: pTech.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 15),
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
      } else if (step === 4 && sItems.trim()) {
        res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: sCategory.trim() || "Skills",
            items: sItems.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10),
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
        setError(`Couldn't save (HTTP ${res.status}): ${JSON.stringify(body.error ?? body)} — fix it or skip for now.`);
        setBusy(false);
        return;
      }
      await advance();
    } finally {
      setBusy(false);
    }
  }

  if (step === null)
    return (
      <main className="grid min-h-screen place-items-center bg-[#0A0F1E] text-[#8B98B8]">
        Loading…
      </main>
    );

  const meta = STEPS[step]; // index aligns: 0 = claim, 1-7 = content steps
  const displayStep = step + 1; // 1..8 for humans
  const pct = Math.round((step / STEPS.length) * 100);

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0A0F1E] px-4 py-10 text-[#E8EDF7]">
      <div className="w-full max-w-lg">
        {/* header */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">Port<span className="text-[#4DA6FF]">xz</span></span>
          <span className="font-mono text-xs text-[#8B98B8]">
            step {displayStep}/8{username ? ` · Portxz.vercel.app/${username}` : ""}
          </span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#111A36]">
          <div className="h-full rounded-full bg-gradient-to-r from-[#4DA6FF] to-[#39D98A] transition-all"
            style={{ width: `${pct}%` }} />
        </div>

        {/* card */}
        <div className="mt-8 rounded-2xl border border-[#1E2C52] bg-[#0F1730] p-6 sm:p-8">
          <h1 className="text-2xl font-bold">{meta.title}</h1>
          <p className="mt-1 text-sm text-[#8B98B8]">{meta.sub}</p>

          {error && (
            <p className="mt-4 rounded-lg border border-[#5C2B2B] bg-[#2A1414] px-4 py-3 font-mono text-xs text-[#FF9B9B]">{error}</p>
          )}

          {step === 0 && (
            <>
              <label className={label}>Full name</label>
              <input className={input} value={claimName} placeholder="Shiraj Mujawar"
                onChange={(e) => setClaimName(e.target.value)} />
              <label className={label}>Username</label>
              <div className="mt-1 flex items-center rounded-lg border border-[#1E2C52] bg-[#111A36] focus-within:border-[#4DA6FF]">
                <span className="pl-4 font-mono text-sm text-[#8B98B8]">Portxz.vercel.app/</span>
                <input value={claimUser} onChange={(e) => checkAvail(e.target.value)}
                  className="w-full bg-transparent px-1 py-2.5 font-mono text-sm outline-none" placeholder="shiraj" />
              </div>
              <p className={`mt-1 h-5 font-mono text-xs ${
                avail === "free" ? "text-[#39D98A]" : avail === "checking" ? "text-[#8B98B8]" : "text-[#FF6B6B]"}`}>
                {{ idle: "", checking: "checking…", free: "✓ available", taken: "✗ taken",
                   invalid: "✗ 3–30 chars, a-z 0-9 - only" }[avail]}
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <label className={label}>Headline</label>
              <input className={input} value={headline} placeholder="Full Stack Developer (MERN / Next.js)"
                onChange={(e) => setHeadline(e.target.value)} />
              <label className={label}>Short summary</label>
              <textarea className={`${input} resize-none`} rows={3} value={summary}
                placeholder="What you build and what you're looking for — 2-3 sentences."
                onChange={(e) => setSummary(e.target.value)} />
              <label className={label}>Location</label>
              <input className={input} value={location} placeholder="Bengaluru, India"
                onChange={(e) => setLocation(e.target.value)} />
            </>
          )}

          {step === 2 && (
            <>
              <label className={label}>Project name</label>
              <input className={input} value={pName} placeholder="My best project"
                onChange={(e) => setPName(e.target.value)} />
              <label className={label}>One-line tagline</label>
              <input className={input} value={pTagline} placeholder="What it does, in one sentence"
                onChange={(e) => setPTagline(e.target.value)} />
              <label className={label}>Tech (comma separated)</label>
              <input className={input} value={pTech} placeholder="React, Node.js, MongoDB"
                onChange={(e) => setPTech(e.target.value)} />
              <label className={label}>Live URL (optional)</label>
              <input className={input} value={pLive} placeholder="myapp.vercel.app"
                onChange={(e) => setPLive(e.target.value)} />
            </>
          )}

          {step === 3 && (
            <>
              <label className={label}>Title</label>
              <input className={input} value={xTitle} placeholder="Intern / Developer / Founder"
                onChange={(e) => setXTitle(e.target.value)} />
              <label className={label}>Company / organization</label>
              <input className={input} value={xOrg} placeholder="Company name"
                onChange={(e) => setXOrg(e.target.value)} />
              <label className={label}>One thing you did there (optional)</label>
              <input className={input} value={xBullet} placeholder="Built X using Y"
                onChange={(e) => setXBullet(e.target.value)} />
            </>
          )}

          {step === 4 && (
            <>
              <label className={label}>Category</label>
              <input className={input} value={sCategory}
                onChange={(e) => setSCategory(e.target.value)} />
              <label className={label}>Skills (comma separated)</label>
              <input className={input} value={sItems} placeholder="React.js, Next.js, TypeScript"
                onChange={(e) => setSItems(e.target.value)} />
            </>
          )}

          {step === 5 && (
            <>
              <label className={label}>Institution</label>
              <input className={input} value={eInst} placeholder="Your college / university"
                onChange={(e) => setEInst(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Degree</label>
                  <input className={input} value={eDegree} placeholder="Diploma / B.E. CS"
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
              <label className={label}>GitHub</label>
              <input className={input} value={lGithub} placeholder="github.com/you"
                onChange={(e) => setLGithub(e.target.value)} />
              <label className={label}>LinkedIn</label>
              <input className={input} value={lLinkedin} placeholder="linkedin.com/in/you"
                onChange={(e) => setLLinkedin(e.target.value)} />
            </>
          )}

          {step === 7 && (
            <div className="mt-4 space-y-3">
              {[
                { id: "minimal", name: "Minimal", note: "Clean and fast. Free." },
                { id: "cli", name: "CLI Terminal", note: "Interactive terminal — the shareable one. PRO" },
                { id: "glass", name: "Glassmorphism", note: "Frosted premium look. PRO" },
                { id: "editorial", name: "Editorial", note: "Serif magazine style, light. PRO" },
                { id: "noir", name: "Noir", note: "Dark luxury, gold accents. PRO" },
                { id: "bento", name: "Bento", note: "Modern tile grid. PRO" },
                { id: "executive", name: "Executive", note: "Corporate-clean, light. PRO" },
                { id: "aurora", name: "Aurora", note: "Glowing gradients. PRO" },
              ].map((o) => (
                <button key={o.id} onClick={() => setTemplate(o.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    template === o.id ? "border-[#4DA6FF] bg-[#111A36]" : "border-[#1E2C52] hover:border-[#2A3E6E]"}`}>
                  <p className="font-semibold">{o.name} {template === o.id && <span className="font-mono text-xs text-[#39D98A]">● selected</span>}</p>
                  <p className="text-sm text-[#8B98B8]">{o.note}</p>
                </button>
              ))}
              <p className="font-mono text-[11px] text-[#8B98B8]">
                PRO templates need a Pro pass — if you pick one on the free plan, we'll publish
                with Minimal and you can upgrade anytime from Billing.
              </p>
            </div>
          )}

          {/* actions */}
          <div className="mt-8 flex items-center justify-between">
            {step === 0 ? <span /> : (
              <button onClick={skip} disabled={busy}
                className="text-sm text-[#8B98B8] hover:text-white disabled:opacity-40">
                Skip for now
              </button>
            )}
            {step === 0 ? (
              <button onClick={claim} disabled={avail !== "free" || !claimName.trim() || busy}
                className="rounded-lg bg-[#4DA6FF] px-6 py-2.5 text-sm font-semibold text-[#04101F] disabled:opacity-40">
                {busy ? "Creating…" : "Claim & continue →"}
              </button>
            ) : (
              <button onClick={submitStep} disabled={busy}
                className="rounded-lg bg-[#4DA6FF] px-6 py-2.5 text-sm font-semibold text-[#04101F] disabled:opacity-40">
                {busy ? "Saving…" : step === 7 ? "Publish & finish 🚀" : "Continue →"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[11px] text-[#5C6A87]">
          everything here is editable later from your dashboard
        </p>
      </div>
    </main>
  );
}
