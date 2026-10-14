"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BarChart3, Briefcase, Check, CodeXml, FileText, Globe, Link2, Menu, Palette, PenLine, Plus, Rocket, ShieldCheck, Sparkles, Star, Terminal, WandSparkles, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { FAQ } from "@/lib/faq";
import { LEGAL_LINKS } from "@/lib/site";

/* ═══ Portxz landing ═══
   Colors come from the lp-* tokens in globals.css so the page works in both
   themes. Surfaces that must stay dark (terminal, README) or light (resume
   paper) use hex values that globals.css does NOT remap in light mode.     */

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease },
};
const delayed = (d: number) => ({ ...reveal, transition: { ...reveal.transition, delay: d } });

const CONTAINER = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#templates", label: "Templates" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const TEMPLATES = [
  { slug: "aurora", name: "Aurora", tag: "Glowing gradients, dark", pro: true },
  { slug: "executive", name: "Executive", tag: "Interview-ready, light", pro: true },
  { slug: "cli", name: "CLI Terminal", tag: "Interactive, the shareable one", pro: true },
  { slug: "noir", name: "Noir", tag: "Black & gold luxury", pro: true },
  { slug: "editorial", name: "Editorial", tag: "Serif magazine, light", pro: true },
  { slug: "bento", name: "Bento", tag: "Modern tile grid", pro: true },
  { slug: "glass", name: "Glassmorphism", tag: "Frosted premium", pro: true },
  { slug: "minimal", name: "Minimal", tag: "Clean and quiet", pro: false },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

/* ── shared bits ─────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="lp-mono inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-lp-accent">
      <span className="h-px w-5 bg-lp-accent/60" />
      {children}
    </p>
  );
}

function SectionHead({
  eyebrow, title, sub, center,
}: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode; center?: boolean }) {
  return (
    <motion.div {...reveal} className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-lp-muted sm:text-lg">{sub}</p>}
    </motion.div>
  );
}

function PrimaryButton({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href}
      className={`lp-btn-primary group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-medium transition ${className ?? ""}`}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function PhoneFrame({ slug, alt, priority, className }: { slug: string; alt: string; priority?: boolean; className?: string }) {
  return (
    <div className={`relative rounded-[2.4rem] border border-lp-border-strong bg-lp-surface-2 p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] ${className ?? ""}`}>
      <div className="relative aspect-[9/16] overflow-hidden rounded-[1.9rem] bg-black">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={slug} className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease }}>
            <Image src={`/brand/templates/${slug}.png`} alt={alt} fill preload={priority} loading={priority ? "eager" : undefined}
              sizes="(min-width: 1024px) 300px, 60vw" className="object-cover object-top" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full bg-black/90" />
      </div>
    </div>
  );
}

/* ── nav ─────────────────────────────────────────────────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 sm:px-5 ${
        scrolled || open ? "border border-lp-border bg-lp-bg/75 shadow-lg shadow-black/5 backdrop-blur-xl" : "border border-transparent"
      }`}>
        <Link href="/" aria-label="Portxz home"><Logo size="sm" /></Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}
              className="rounded-lg px-3 py-1.5 text-sm text-lp-muted transition hover:bg-lp-surface-2 hover:text-lp-text">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/sign-in" className="hidden rounded-lg px-3 py-1.5 text-sm text-lp-muted transition hover:text-lp-text sm:block">
            Sign in
          </Link>
          <Link href="/sign-up" className="lp-btn-primary hidden rounded-lg px-4 py-2 text-sm font-medium sm:block">
            Get started
          </Link>
          <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}
            className="rounded-lg border border-lp-border p-2 text-lp-muted md:hidden">
            {open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl border border-lp-border bg-lp-bg/95 p-3 backdrop-blur-xl md:hidden">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-[15px] text-lp-muted hover:bg-lp-surface-2 hover:text-lp-text">
                {l.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-lp-border pt-3">
              <Link href="/sign-in" className="rounded-lg border border-lp-border px-3 py-2.5 text-center text-sm">Sign in</Link>
              <Link href="/sign-up" className="lp-btn-primary rounded-lg px-3 py-2.5 text-center text-sm font-medium">Get started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ── hero ────────────────────────────────────────────────────────── */

const HERO_CYCLE = ["aurora", "executive", "cli", "noir"];

function HeroVisual() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % HERO_CYCLE.length), 3200);
    return () => clearInterval(t);
  }, []);
  const slug = HERO_CYCLE[i];
  const name = TEMPLATES.find((t) => t.slug === slug)?.name;

  return (
    <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[540px]">
      <div aria-hidden className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)] blur-2xl" />

      {/* phone — the live portfolio */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25, ease }}
        className="absolute right-[4%] top-0 w-[48%]">
        <PhoneFrame slug={slug} alt={`${name} portfolio template`} priority />
        <div className="mt-3 flex justify-center">
          <span className="lp-mono rounded-full border border-lp-border bg-lp-surface px-3 py-1 text-[11px] text-lp-muted">
            template: <span className="text-lp-text">{name}</span>
          </span>
        </div>
      </motion.div>

      {/* resume paper — always light */}
      <motion.div initial={{ opacity: 0, x: -30, rotate: -8 }} animate={{ opacity: 1, x: 0, rotate: -5 }}
        transition={{ duration: 0.9, delay: 0.4, ease }}
        className="absolute left-0 top-[10%] w-[47%]">
        <div className="lp-float rounded-xl bg-white p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="lp-mono text-[9px] font-medium uppercase tracking-widest text-[#8A92A6]">resume.pdf</span>
            <span className="rounded-full bg-[#E7F8EF] px-2 py-0.5 text-[9px] font-semibold text-[#047857]">ATS 94</span>
          </div>
          <p className="mt-3 text-[13px] font-semibold text-[#0A0F1D] sm:text-sm">Aarav Mehta</p>
          <p className="text-[10px] text-[#535D73]">Product Designer &amp; Frontend Developer</p>
          <div className="mt-3 h-px bg-[#E5E7EE]" />
          <p className="mt-2.5 text-[8px] font-bold uppercase tracking-widest text-[#0A0F1D]">Experience</p>
          <div className="mt-1.5 space-y-1.5">
            {[92, 78, 85, 64].map((w, k) => (
              <div key={k} className="h-1.5 rounded-full bg-[#E5E7EE]" style={{ width: `${w}%` }} />
            ))}
          </div>
          <p className="mt-3 text-[8px] font-bold uppercase tracking-widest text-[#0A0F1D]">Projects</p>
          <div className="mt-1.5 space-y-1.5">
            {[88, 70].map((w, k) => (
              <div key={k} className="h-1.5 rounded-full bg-[#E5E7EE]" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* README — always dark */}
      <motion.div initial={{ opacity: 0, y: 30, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ duration: 0.9, delay: 0.55, ease }}
        className="absolute bottom-[3%] left-[5%] w-[52%]">
        <div className="lp-float-2 overflow-hidden rounded-xl border border-white/10 bg-[#0B0F19] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <GithubIcon className="h-3 w-3 text-[#9AA3B5]" />
            <span className="lp-mono text-[9px] text-[#9AA3B5]">aarav / README.md</span>
          </div>
          <div className="lp-mono space-y-1 p-3 text-[9px] leading-relaxed sm:text-[10px]">
            <p className="text-[#E6EAF2]"><span className="text-[#5AA9FF]">##</span> Hi, I&apos;m Aarav 👋</p>
            <p className="text-[#9AA3B5]">Product Designer &amp; Frontend Dev</p>
            <div className="flex gap-1 pt-1">
              <span className="rounded bg-[#3178C6] px-1.5 text-[8px] text-white">TypeScript</span>
              <span className="rounded bg-[#20232A] px-1.5 text-[8px] text-[#61DAFB]">React</span>
              <span className="rounded bg-[#A259FF] px-1.5 text-[8px] text-white">Figma</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* sync chip */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.9, ease }}
        className="absolute bottom-[24%] right-0 sm:right-[-2%]">
        <div className="flex items-center gap-2 rounded-full border border-lp-border bg-lp-surface/90 px-3 py-1.5 text-xs shadow-lg backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lp-green opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lp-green" />
          </span>
          <span className="font-medium">All 3 synced</span>
          <span className="text-lp-subtle">· just now</span>
        </div>
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 sm:pt-40">
      <div aria-hidden className="lp-grid-bg pointer-events-none absolute inset-x-0 top-0 h-[820px]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-280px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />

      <div className={`${CONTAINER} relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-8`}>
        <div className="text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <a href="#pricing"
              className="group inline-flex items-center gap-2 rounded-full border border-lp-border bg-lp-surface py-1 pl-1 pr-3 text-[13px] text-lp-muted shadow-sm transition hover:border-lp-border-strong">
              <span className="rounded-full bg-lp-green/15 px-2 py-0.5 text-[11px] font-semibold text-lp-green">Launch offer</span>
              Pro for ₹49 · first 50 users
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-7 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.4rem]">
            Build it once.
            <br />
            Stay <span className="lp-serif lp-gradient-text pr-1 text-[1.12em]">in sync</span> everywhere.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.16, ease }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-lp-muted lg:mx-0">
            One profile becomes your <span className="text-lp-text">live portfolio</span>, an{" "}
            <span className="text-lp-text">ATS-ready resume PDF</span> and your{" "}
            <span className="text-lp-text">GitHub README</span>. Edit a project once — all three update instantly.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.24, ease }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <PrimaryButton href="/sign-up" className="w-full sm:w-auto">Claim your username — free</PrimaryButton>
            <a href="#templates"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-lp-border bg-lp-surface px-6 py-3.5 text-[15px] font-medium transition hover:border-lp-border-strong sm:w-auto">
              Browse templates
            </a>
          </motion.div>

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-lp-muted lg:justify-start">
            {["Free plan forever", "No card required", "Live in 3 minutes"].map((t) => (
              <li key={t} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-lp-green" />{t}</li>
            ))}
          </motion.ul>
        </div>

        <HeroVisual />
      </div>

      {/* stat row */}
      <motion.div {...delayed(0.1)} className={`${CONTAINER} relative mt-20`}>
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-lp-border bg-lp-border sm:grid-cols-4" style={{ gap: 1 }}>
          {[
            ["8", "portfolio templates"],
            ["1-click", "GitHub import"],
            ["3 min", "from sign-up to live"],
            ["₹0", "to get started"],
          ].map(([v, l]) => (
            <div key={l} className="bg-lp-bg px-5 py-6 text-center sm:text-left">
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">{v}</p>
              <p className="mt-1 text-[13px] text-lp-muted">{l}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ── interactive sync demo ───────────────────────────────────────── */

function Flash({ tick }: { tick: number }) {
  if (tick === 0) return null;
  return (
    <motion.span key={tick} aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-lp-accent"
      initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.9 }} />
  );
}

function OutputLabel({ icon: Icon, label }: { icon: typeof Globe; label: string }) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-xs text-lp-muted">
      <Icon className="h-3.5 w-3.5" /> {label}
    </div>
  );
}

function SyncDemo() {
  const [name, setName] = useState("Aarav Mehta");
  const [role, setRole] = useState("Product Designer & Frontend Developer");
  const [tick, setTick] = useState(0);
  const first = name.split(" ")[0] || "there";

  const field = "w-full rounded-lg border border-lp-border bg-lp-bg px-3 py-2.5 text-sm text-lp-text outline-none transition placeholder:text-lp-subtle focus:border-lp-accent focus:ring-4 focus:ring-lp-accent-soft";

  return (
    <section id="how" className="relative py-20 sm:py-28">
      <div className={CONTAINER}>
        <SectionHead
          eyebrow="one source of truth"
          title={<>Stop maintaining <span className="lp-serif text-lp-muted">three versions</span> of yourself.</>}
          sub="The portfolio says one thing, the resume another, and the README hasn't been touched since 2023. Try it — edit the profile and watch all three follow."
        />

        <motion.div {...delayed(0.1)} className="mt-14 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* editor */}
          <div className="lp-card rounded-2xl p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Your profile</p>
              <span className="lp-mono rounded-md bg-lp-accent-soft px-2 py-0.5 text-[10px] uppercase tracking-wider text-lp-accent">editable</span>
            </div>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs text-lp-muted">Full name</span>
                <input value={name} maxLength={32} className={field}
                  onChange={(e) => { setName(e.target.value); setTick((t) => t + 1); }} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-lp-muted">Headline</span>
                <input value={role} maxLength={48} className={field}
                  onChange={(e) => { setRole(e.target.value); setTick((t) => t + 1); }} />
              </label>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-dashed border-lp-border p-4 text-[13px] leading-relaxed text-lp-muted">
              <PenLine className="mt-0.5 h-4 w-4 shrink-0 text-lp-accent" />
              Same for projects, experience and skills — every edit lands in your portfolio, resume and README at once.
            </div>
          </div>

          {/* outputs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <OutputLabel icon={Globe} label="portxz.xyz/aarav" />
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0A0B14] p-5">
                <Flash tick={tick} />
                <div aria-hidden className="absolute -left-10 -top-16 h-40 w-56 rounded-full bg-[#22D3EE]/20 blur-3xl" />
                <div aria-hidden className="absolute -right-10 top-0 h-32 w-40 rounded-full bg-[#8B5CF6]/25 blur-3xl" />
                <span className="relative inline-flex items-center gap-1.5 rounded-full border border-[#22D3EE]/30 px-2.5 py-0.5 text-[10px] text-[#67E8F9]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#67E8F9]" /> open to work
                </span>
                <p className="relative mt-3 truncate bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6] bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                  {name || " "}
                </p>
                <p className="relative mt-1 truncate text-sm text-[#B7BED0]">{role || " "}</p>
              </div>
            </div>
            <div>
              <OutputLabel icon={FileText} label="resume.pdf" />
              <div className="relative h-[150px] rounded-xl bg-white p-4 ring-1 ring-black/5">
                <Flash tick={tick} />
                <p className="truncate text-center text-base font-bold text-[#0A0F1D]">{name || " "}</p>
                <p className="truncate text-center text-[11px] text-[#535D73]">{role || " "}</p>
                <div className="mt-3 h-px bg-[#0A0F1D]" />
                <div className="mt-3 space-y-1.5">
                  {[100, 86, 92].map((w, k) => <div key={k} className="h-1.5 rounded-full bg-[#E5E7EE]" style={{ width: `${w}%` }} />)}
                </div>
              </div>
            </div>
            <div>
              <OutputLabel icon={GithubIcon as typeof Globe} label="README.md" />
              <div className="lp-mono relative h-[150px] overflow-hidden rounded-xl border border-white/10 bg-[#0B0F19] p-4 text-[11px] leading-relaxed">
                <Flash tick={tick} />
                <p className="truncate text-[#E6EAF2]"><span className="text-[#5AA9FF]">##</span> Hi, I&apos;m {first} 👋</p>
                <p className="truncate text-[#9AA3B5]"><span className="text-[#5AA9FF]">&gt;</span> {role}</p>
                <p className="mt-2 text-[#5AA9FF]">### 🚀 Projects</p>
                <p className="text-[#9AA3B5]">- **Ledgerly** — 12k MAU</p>
                <p className="text-[#9AA3B5]">- **Brief.day** — morning briefs</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── features bento ──────────────────────────────────────────────── */

const SCRIPT = [
  { cmd: "whoami", out: "product designer · full-stack dev · shipping real things" },
  { cmd: "projects", out: "Ledgerly · Brief.day · Design System Kit — 12k users served" },
  { cmd: "resume --pdf", out: "↓ downloading aarav-mehta.pdf — always in sync" },
  { cmd: "sudo hire-me", out: "✓ permission granted." },
];

function Prompt() {
  return <><span className="text-[#3DDC97]">visitor</span><span className="text-[#6B7489]">@aarav:~$</span>{" "}</>;
}

function TypingTerminal() {
  const [lines, setLines] = useState<typeof SCRIPT>([]);
  const [typed, setTyped] = useState("");
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const current = SCRIPT[step % SCRIPT.length];
    let i = 0;
    const typer = setInterval(() => {
      i++;
      setTyped(current.cmd.slice(0, i));
      if (i >= current.cmd.length) {
        clearInterval(typer);
        timers.current.push(setTimeout(() => {
          setLines((prev) => [...prev.slice(-2), current]);
          setTyped("");
          timers.current.push(setTimeout(() => setStep((s) => s + 1), 1300));
        }, 350));
      }
    }, 85);
    return () => {
      clearInterval(typer);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [step]);

  return (
    <div className="lp-mono h-full min-h-[170px] space-y-1.5 rounded-xl border border-white/10 bg-[#070A12] p-4 text-[12px] leading-relaxed">
      {lines.map((l, k) => (
        <div key={k}>
          <p><Prompt /><span className="text-[#E6EAF2]">{l.cmd}</span></p>
          <p className="text-[#9AA3B5]">{l.out}</p>
        </div>
      ))}
      <p>
        <Prompt /><span className="text-[#E6EAF2]">{typed}</span>
        <span className="lp-caret ml-0.5 inline-block h-3.5 w-[7px] bg-[#5AA9FF] align-middle" />
      </p>
    </div>
  );
}

function BentoCard({
  icon: Icon, title, desc, className, children, delay = 0,
}: {
  icon: typeof Globe; title: string; desc: string; className?: string; children?: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div {...delayed(delay)}
      className={`lp-card group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-colors hover:border-lp-border-strong ${className ?? ""}`}>
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-lp-border bg-lp-surface-2 text-lp-accent">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <h3 className="text-[17px] font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-lp-muted">{desc}</p>
      {children && <div className="mt-6 flex-1">{children}</div>}
    </motion.div>
  );
}

function Features() {
  const bars = [32, 48, 40, 62, 55, 78, 70, 92, 84, 100];
  return (
    <section id="features" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className={CONTAINER}>
        <SectionHead
          eyebrow="everything from one profile"
          title={<>All the tools to get <span className="lp-serif lp-gradient-text">noticed</span>.</>}
          sub="Not just a website builder. Portxz writes, scores and ships your professional identity — wherever recruiters look."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <BentoCard icon={WandSparkles} title="AI enhance" className="md:col-span-4"
            desc="Weak lines rewritten into measurable, recruiter-ready bullets — in your voice, in one click.">
            <div className="space-y-3">
              <div className="rounded-xl border border-lp-border bg-lp-surface-2 p-4 text-sm text-lp-subtle line-through decoration-lp-subtle/50">
                Worked on the dashboard and improved some things.
              </div>
              <div className="relative rounded-xl border border-lp-accent/30 bg-lp-accent-soft p-4 text-sm">
                <Sparkles className="absolute -top-2 right-4 h-4 w-4 text-lp-accent" />
                Built an analytics dashboard used by <b className="font-semibold">12k monthly users</b>, cutting weekly reporting time by <b className="font-semibold">40%</b>.
              </div>
            </div>
          </BentoCard>

          <BentoCard icon={ShieldCheck} title="ATS-ready resume" className="md:col-span-2" delay={0.08}
            desc="Single column, real text, standard headings. Parses cleanly — and the PDF updates itself.">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--lp-border-strong)" strokeWidth="3" />
                  <motion.circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--lp-green)" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray="97.4" initial={{ strokeDashoffset: 97.4 }} whileInView={{ strokeDashoffset: 97.4 * 0.06 }}
                    viewport={{ once: true }} transition={{ duration: 1.4, ease }} />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-lg font-semibold">94</span>
              </div>
              <ul className="space-y-1.5 text-xs text-lp-muted">
                {["Parseable layout", "Standard sections", "One-click PDF"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5"><Check className="h-3 w-3 text-lp-green" />{t}</li>
                ))}
              </ul>
            </div>
          </BentoCard>

          <BentoCard icon={Terminal} title="A portfolio visitors can type into" className="md:col-span-3" delay={0.04}
            desc="The CLI template turns your page into a real terminal. Recruiters remember the one where they ran sudo hire-me.">
            <TypingTerminal />
          </BentoCard>

          <BentoCard icon={GithubIcon as typeof Globe} title="GitHub import & README" className="md:col-span-3" delay={0.12}
            desc="Pull your repos in one click, keep the best, and get a profile README with badges and stats to paste and push.">
            <div className="space-y-2">
              {[
                { n: "ledgerly", s: "1.2k", lang: "TypeScript", c: "#3178C6", on: true },
                { n: "brief-day", s: "486", lang: "React", c: "#61DAFB", on: true },
                { n: "dotfiles", s: "12", lang: "Shell", c: "#89E051", on: false },
              ].map((r) => (
                <div key={r.n} className="flex items-center gap-3 rounded-lg border border-lp-border bg-lp-surface-2 px-3 py-2.5 text-sm">
                  <span className={`grid h-4 w-4 place-items-center rounded ${r.on ? "bg-lp-accent text-lp-on-accent" : "border border-lp-border-strong"}`}>
                    {r.on && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="lp-mono flex-1 truncate">{r.n}</span>
                  <span className="hidden items-center gap-1.5 text-xs text-lp-muted sm:flex">
                    <span className="h-2 w-2 rounded-full" style={{ background: r.c }} />{r.lang}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-lp-subtle"><Star className="h-3 w-3" />{r.s}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard icon={BarChart3} title="Analytics" className="md:col-span-2" delay={0.04}
            desc="Know when your page is viewed and your resume downloaded.">
            <div className="flex h-24 items-end gap-1.5">
              {bars.map((h, k) => (
                <motion.div key={k} className="flex-1 rounded-t bg-gradient-to-t from-lp-accent/30 to-lp-accent"
                  initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: k * 0.04, ease }} />
              ))}
            </div>
          </BentoCard>

          <BentoCard icon={Sparkles} title="AI portfolio review" className="md:col-span-2" delay={0.08}
            desc="A rubric-scored readiness check with specific, fixable suggestions.">
            <div className="space-y-2.5">
              {[["Impact", 88], ["Clarity", 76], ["Completeness", 94]].map(([l, v]) => (
                <div key={l}>
                  <div className="mb-1 flex justify-between text-xs"><span className="text-lp-muted">{l}</span><span>{v}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-lp-surface-2">
                    <motion.div className="h-full rounded-full bg-lp-accent" initial={{ width: 0 }}
                      whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 1, ease }} />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard icon={Link2} title="Your own link" className="md:col-span-2" delay={0.12}
            desc="A clean, shareable URL for your bio, email signature and applications.">
            <div className="lp-mono flex items-center rounded-lg border border-lp-border bg-lp-surface-2 px-3 py-2.5 text-sm">
              <span className="text-lp-subtle">portxz.xyz/</span>
              <span className="text-lp-text">you</span>
              <span className="lp-caret ml-0.5 inline-block h-4 w-[2px] bg-lp-accent" />
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

/* ── template gallery ────────────────────────────────────────────── */

function Templates() {
  const [active, setActive] = useState(0);
  const t = TEMPLATES[active];

  return (
    <section id="templates" className="relative scroll-mt-24 overflow-hidden border-y border-lp-border bg-lp-surface-2/40 py-20 sm:py-28">
      <div className={`${CONTAINER} grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-20`}>
        <div>
          <SectionHead
            eyebrow="the wardrobe"
            title={<>Eight looks. <span className="lp-serif text-lp-muted">Zero</span> rework.</>}
            sub="Switch templates like outfits — your content never moves. Pick one now, change your mind anytime."
          />

          <motion.div {...delayed(0.1)} className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {TEMPLATES.map((tpl, k) => (
              <button key={tpl.slug} onClick={() => setActive(k)} onMouseEnter={() => setActive(k)}
                aria-pressed={k === active}
                className={`group relative rounded-xl border px-4 py-3 text-left transition ${
                  k === active ? "border-lp-accent/50 bg-lp-surface shadow-sm" : "border-lp-border hover:border-lp-border-strong hover:bg-lp-surface/60"
                }`}>
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{tpl.name}</span>
                  <span className={`lp-mono rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${
                    tpl.pro ? "bg-lp-accent-soft text-lp-accent" : "bg-lp-green/10 text-lp-green"
                  }`}>{tpl.pro ? "Pro" : "Free"}</span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-lp-muted">{tpl.tag}</span>
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div {...delayed(0.15)} className="relative mx-auto w-[260px] sm:w-[300px]">
          <div aria-hidden className="absolute -inset-16 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
          <PhoneFrame slug={t.slug} alt={`${t.name} template preview`} className="relative" />
          <p className="relative mt-5 text-center text-sm">
            <span className="font-medium">{t.name}</span>
            <span className="text-lp-muted"> — {t.tag}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ── how it works + audience ─────────────────────────────────────── */

function Steps() {
  const steps = [
    { icon: Link2, t: "Claim your link", d: "Pick a username. Guided setup walks you through, and GitHub import pulls your repos in one click." },
    { icon: PenLine, t: "Fill it once", d: "Projects, experience, skills — with AI that turns weak lines into recruiter-ready bullets." },
    { icon: Rocket, t: "Publish everywhere", d: "Choose a template and hit publish. Portfolio live, resume PDF ready, README copied." },
  ];
  const audience = [
    { icon: CodeXml, t: "Developers", d: "GitHub import, the CLI template and a README that writes itself." },
    { icon: Palette, t: "Designers & PMs", d: "Case studies as projects, Aurora and Glass for personality." },
    { icon: Briefcase, t: "Professionals", d: "Noir and Executive for a serious brand — no code needed." },
  ];

  return (
    <section className="relative py-20 sm:py-28">
      <div className={CONTAINER}>
        <SectionHead center eyebrow="how it works" title={<>Live in <span className="lp-serif lp-gradient-text">three minutes</span>. Really.</>} />

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          <div aria-hidden className="absolute left-[16.6%] right-[16.6%] top-6 hidden h-px bg-gradient-to-r from-transparent via-lp-border-strong to-transparent md:block" />
          {steps.map((s, k) => (
            <motion.div key={s.t} {...delayed(k * 0.1)} className="relative text-center">
              <div className="relative mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-lp-border bg-lp-surface text-lp-accent shadow-sm">
                <s.icon className="h-5 w-5" />
                <span className="lp-mono absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-lp-text text-[10px] font-semibold text-lp-bg">{k + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{s.t}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-lp-muted">{s.d}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...delayed(0.1)} className="mt-16 rounded-2xl border border-lp-border p-2">
          <div className="grid gap-2 md:grid-cols-3">
            {audience.map((a) => (
              <div key={a.t} className="flex gap-4 rounded-xl bg-lp-surface-2/60 p-5">
                <a.icon className="mt-0.5 h-5 w-5 shrink-0 text-lp-accent" />
                <div>
                  <p className="font-medium">{a.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-lp-muted">{a.d}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── pricing ─────────────────────────────────────────────────────── */

function Pricing() {
  const free = ["Published portfolio + your link", "GitHub import & README", "Minimal template", "5 projects, experiences & links", "5 AI enhances / month"];
  const pro = ["Everything in Free", "All 8 templates", "Unlimited projects, experience & links", "Unlimited AI enhance", "AI portfolio review", "ATS resume view + PDF"];

  return (
    <section id="pricing" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className={CONTAINER}>
        <SectionHead center eyebrow="simple pricing"
          title={<>Free to start. <span className="lp-serif text-lp-muted">Pro</span> when you&apos;re ready.</>}
          sub="No trials, no traps. Upgrade only if you love it." />

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          <motion.div {...reveal} className="lp-card flex flex-col rounded-3xl p-8">
            <p className="font-medium">Free</p>
            <p className="mt-1 text-sm text-lp-muted">Everything you need to get online.</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight">₹0</span>
              <span className="text-lp-muted">/ forever</span>
            </p>
            <ul className="mt-8 flex-1 space-y-3 text-sm">
              {free.map((f) => (
                <li key={f} className="flex items-start gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-lp-muted" />{f}</li>
              ))}
            </ul>
            <Link href="/sign-up"
              className="mt-8 rounded-xl border border-lp-border-strong px-6 py-3 text-center text-[15px] font-medium transition hover:bg-lp-surface-2">
              Start free
            </Link>
          </motion.div>

          <motion.div id="launch-offer" {...delayed(0.1)}
            className="lp-gradient-border relative flex scroll-mt-24 flex-col overflow-hidden rounded-3xl p-8 shadow-[0_30px_80px_-30px_rgba(79,110,255,0.45)]">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
            <div className="relative flex items-center justify-between">
              <p className="font-medium">Pro</p>
              <span className="rounded-full bg-lp-green/15 px-2.5 py-1 text-[11px] font-semibold text-lp-green">Launch offer · first 50</span>
            </div>
            <p className="relative mt-1 text-sm text-lp-muted">The full kit, for less than a coffee.</p>
            <p className="relative mt-6 flex items-baseline gap-2">
              <span className="text-xl text-lp-subtle line-through">₹149</span>
              <span className="text-5xl font-semibold tracking-tight">₹49</span>
              <span className="text-lp-muted">/ month</span>
            </p>
            <ul className="relative mt-8 flex-1 space-y-3 text-sm">
              {pro.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lp-accent text-lp-on-accent">
                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <PrimaryButton href="/sign-up" className="relative mt-8">Claim your spot</PrimaryButton>
            <p className="lp-mono relative mt-3 text-center text-[11px] text-lp-subtle">then ₹149/mo · ₹649/6mo · ₹999/yr</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── faq ─────────────────────────────────────────────────────────── */

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative scroll-mt-24 border-t border-lp-border py-20 sm:py-28">
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead eyebrow="questions" title={<>Asked &amp; <span className="lp-serif text-lp-muted">answered</span>.</>} />
          <motion.p {...delayed(0.1)} className="mt-5 text-lp-muted">
            Something else on your mind?{" "}
            <Link href="/contact" className="text-lp-text underline decoration-lp-border-strong underline-offset-4 hover:decoration-lp-accent">
              Get in touch
            </Link>.
          </motion.p>
        </div>

        <motion.div {...delayed(0.1)} className="divide-y divide-lp-border border-y border-lp-border">
          {FAQ.map((f, k) => {
            const isOpen = open === k;
            return (
              <div key={f.q}>
                <button onClick={() => setOpen(isOpen ? null : k)} aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-medium transition hover:text-lp-accent sm:text-base">
                  {f.q}
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-lp-border transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }} className="overflow-hidden">
                      <p className="max-w-xl pb-6 pr-10 text-[15px] leading-relaxed text-lp-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── final cta + footer ──────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="relative pb-20 sm:pb-28">
      <div className={CONTAINER}>
        <motion.div {...reveal}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#080B16] px-6 py-20 text-center sm:px-16 sm:py-24">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(79,110,255,0.35),transparent)]" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" />
          <h2 className="relative mx-auto max-w-3xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-[#F2F4FA] sm:text-5xl">
            Your work deserves better than a{" "}
            <span className="lp-serif text-[#8C95AB] line-through decoration-[#8C95AB]/60">PDF in an email</span>.
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-[#A3ABBE]">
            One link that carries your portfolio, resume and README — and stays current forever.
          </p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/sign-up">Claim your username</PrimaryButton>
            <a href="#pricing" className="inline-flex items-center gap-1.5 px-4 py-3 text-[15px] text-[#C9CFDC] transition hover:text-[#F2F4FA]">
              See pricing <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-lp-border">
      <div className={`${CONTAINER} grid gap-10 py-14 sm:grid-cols-[1.4fr_1fr_1fr]`}>
        <div>
          <Logo size="sm" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-lp-muted">
            One profile. Portfolio, ATS resume and GitHub README — always in sync.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Product</p>
          <ul className="mt-4 space-y-2.5 text-sm text-lp-muted">
            {NAV_LINKS.map((l) => (
              <li key={l.href}><a href={l.href} className="transition hover:text-lp-text">{l.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Company</p>
          <ul className="mt-4 space-y-2.5 text-sm text-lp-muted">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="transition hover:text-lp-text">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-lp-border">
        <div className={`${CONTAINER} flex flex-col items-center justify-between gap-2 py-6 text-xs text-lp-subtle sm:flex-row`}>
          <p>© {new Date().getFullYear()} Portxz. All rights reserved.</p>
          <p className="lp-mono">built for people who ship</p>
        </div>
      </div>
    </footer>
  );
}

/* ── page ────────────────────────────────────────────────────────── */

export function Landing() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="lp relative min-h-screen overflow-x-clip">
        <Nav />
        <Hero />
        <SyncDemo />
        <Features />
        <Templates />
        <Steps />
        <Pricing />
        <Faq />
        <FinalCta />
        <Footer />
      </main>
    </MotionConfig>
  );
}
