"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, BadgeCheck, BarChart3, BookOpen, Briefcase, Check, CodeXml, FileText, Globe, GraduationCap, HeartHandshake, Languages, Link2, Menu, Palette, PenLine, Plus, Rocket, Search, Share2, ShieldCheck, Smartphone, Sparkles, Star, Target, Terminal, Trophy, WandSparkles, X } from "lucide-react";
import { RESUME_TEMPLATES } from "@/lib/resume";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { faqFor } from "@/lib/faq";
import { PRICES, SALE, SALE_PRICES, formatPrice, saleActive } from "@/lib/pricing";
import { LAUNCH_OFFER_LIMIT } from "@/lib/billing";
import { useCurrency } from "@/lib/useCurrency";
import { LEGAL_LINKS } from "@/lib/site";
import { TESTIMONIALS } from "@/lib/testimonials";

/* ═══ Portxz landing ═══
   Colors come from the lp-* tokens in globals.css so the page works in both
   themes. Surfaces that must stay dark (terminal, README) or light (resume
   paper) use hex values that globals.css does NOT remap in light mode.     */

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease },
};
const delayed = (d: number) => ({ ...reveal, transition: { ...reveal.transition, delay: d } });

const CONTAINER = "mx-auto w-full max-w-6xl px-5 sm:px-8";

/* Card spotlight + lift — pairs with .lp-spot in globals.css. The lift is a framer
   whileHover because framer owns these cards' transform after the reveal. */
const spot = {
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  },
  whileHover: { y: -3, transition: { duration: 0.3, ease } },
};

const NAV_LINKS = [
  { href: "#tailor", label: "Job tailoring" },
  { href: "#features", label: "Features" },
  { href: "#templates", label: "Templates" },
  { href: "#resume", label: "Resume" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];
const NAV_IDS = NAV_LINKS.map((l) => l.href.slice(1));

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
      className={`lp-btn-primary lp-shine group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-medium transition ${className ?? ""}`}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/* Live phone preview: the real template with demo data, rendered at phone width in an
   iframe and scaled to the frame — always matches the current design, like the
   dashboard's picker. Recently shown templates stay mounted so switching back is
   instant; the cap keeps hidden templates from piling up. */
const PHONE_W = 390;
const PHONE_H = 845; // 9 : 19.5
const KEEP_MOUNTED = 4;

/* Live templates are whole pages — too heavy for phones, which get the screenshots
   instead. Matches Tailwind's `sm` breakpoint. Server render assumes a phone. */
const WIDE_QUERY = "(min-width: 640px)";
function useWideScreen() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(WIDE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE_QUERY).matches,
    () => false,
  );
}

function PhoneFrame({ slug, alt, eager, className }: { slug: string; alt: string; eager?: boolean; className?: string }) {
  const wide = useWideScreen();
  const screen = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [mounted, setMounted] = useState([slug]);
  const [loaded, setLoaded] = useState<string[]>([]);

  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / PHONE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!mounted.includes(slug)) setMounted([...mounted, slug].slice(-KEEP_MOUNTED));

  return (
    <div className={`relative rounded-[2.4rem] border border-[#2A2D36] bg-[#0B0C10] p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] ${className ?? ""}`}>
      {/* Screenshots are 9:16, so the phone version is a little shorter to avoid cropping them. */}
      <div ref={screen} className={`pointer-events-none relative overflow-hidden rounded-[1.9rem] bg-black ${wide ? "aspect-[9/19.5]" : "aspect-[9/18]"}`}>
        {!wide && (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={slug} className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}>
              <Image src={`/brand/templates/${slug}.png`} alt={alt} fill loading={eager ? "eager" : undefined}
                sizes="60vw" className="object-cover object-top" />
            </motion.div>
          </AnimatePresence>
        )}
        {wide && !loaded.includes(slug) && <div className="absolute inset-0 animate-pulse bg-lp-surface-2" />}
        {wide && scale > 0 && mounted.map((s) => (
          <iframe key={s}
            src={`/preview/${s}?thumb=1`}
            title={s === slug ? alt : `${s} template`}
            loading={eager ? "eager" : "lazy"}
            tabIndex={-1}
            scrolling="no"
            aria-hidden={s !== slug}
            onLoad={() => setLoaded((l) => (l.includes(s) ? l : [...l, s]))}
            className="absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-500"
            style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${scale})`, opacity: s === slug && loaded.includes(s) ? 1 : 0 }}
          />
        ))}
        <div className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
      </div>
    </div>
  );
}

/* ── nav ─────────────────────────────────────────────────────────── */

/* The nav section in the middle of the screen, or null between nav sections. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const id = e.target.id;
        setActive((a) => (e.isIntersecting ? id : a === id ? null : a));
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return (
    <motion.div aria-hidden style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#3B9BFF] via-[#5B5BF6] to-[#A16BFF]" />
  );
}

function Nav() {
  const active = useActiveSection(NAV_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

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
          {NAV_LINKS.map((l) => {
            const on = active === l.href.slice(1);
            return (
              <a key={l.href} href={l.href} aria-current={on ? "true" : undefined}
                className={`relative isolate rounded-lg px-3 py-1.5 text-sm transition-colors hover:text-lp-text ${on ? "text-lp-text" : "text-lp-muted"}`}>
                {on && <motion.span layoutId="nav-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 -z-10 rounded-lg bg-lp-surface-2" />}
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isSignedIn ? (
            <Link href="/dashboard" className="lp-btn-primary hidden rounded-lg px-4 py-2 text-sm font-medium sm:block">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="hidden rounded-lg px-3 py-1.5 text-sm text-lp-muted transition hover:text-lp-text sm:block">
                Sign in
              </Link>
              <Link href="/sign-up" className="lp-btn-primary hidden rounded-lg px-4 py-2 text-sm font-medium sm:block">
                Get started
              </Link>
            </>
          )}
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
            {isSignedIn ? (
              <div className="mt-2 border-t border-lp-border pt-3">
                <Link href="/dashboard" className="lp-btn-primary block rounded-lg px-3 py-2.5 text-center text-sm font-medium">Go to dashboard</Link>
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-lp-border pt-3">
                <Link href="/sign-in" className="rounded-lg border border-lp-border px-3 py-2.5 text-center text-sm">Sign in</Link>
                <Link href="/sign-up" className="lp-btn-primary rounded-lg px-3 py-2.5 text-center text-sm font-medium">Get started</Link>
              </div>
            )}
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
        className="absolute right-[6%] top-0 w-[42%]">
        <PhoneFrame slug={slug} alt={`${name} portfolio template`} eager />
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

      {/* tailoring chip */}
      <motion.a href="#tailor" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 1.05, ease }}
        className="absolute left-[2%] top-0 z-10">
        <div className="flex items-center gap-2 rounded-full border border-lp-border bg-lp-surface/90 px-3 py-1.5 text-xs shadow-lg backdrop-blur transition hover:border-lp-border-strong">
          <Target className="h-3.5 w-3.5 text-lp-accent" />
          <span className="font-medium">Job match</span>
          <span className="text-lp-subtle line-through">54%</span>
          <span className="font-semibold text-lp-green">91%</span>
        </div>
      </motion.a>

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
  const currency = useCurrency();
  return (
    <section className="relative pt-32 sm:pt-40">
      <div aria-hidden className="lp-grid-bg pointer-events-none absolute inset-x-0 top-0 h-[820px]" />
      <div aria-hidden className="lp-drift pointer-events-none absolute left-1/2 top-[-280px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />

      <div className={`${CONTAINER} relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-8`}>
        <div className="text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <a href="#launch-offer"
              className="group inline-flex items-center gap-2 rounded-full border border-lp-border bg-lp-surface py-1 pl-1 pr-3 text-[13px] text-lp-muted shadow-sm transition hover:border-lp-border-strong">
              <span className="rounded-full bg-lp-green/15 px-2 py-0.5 text-[11px] font-semibold text-lp-green">Launch offer</span>
              Pro for {formatPrice(PRICES[currency].launch, currency)}<span className="hidden sm:inline"> · first {LAUNCH_OFFER_LIMIT} users</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <h1 className="mt-7 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.4rem]">
            {[<>Build it once.</>, <>Stay <span className="lp-serif lp-gradient-text pr-1 text-[1.12em]">in sync</span> everywhere.</>].map((line, k) => (
              <motion.span key={k} className="block"
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.08 + k * 0.12, ease }}>
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.16, ease }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-lp-muted lg:mx-0">
            One profile becomes your <span className="text-lp-text">live portfolio</span>, an{" "}
            <span className="text-lp-text">ATS-ready resume PDF</span> and your{" "}
            <span className="text-lp-text">GitHub README</span>. Edit a project once — all three update instantly.
            Applying somewhere? <span className="text-lp-text">Tailor your resume to the job</span> in seconds.
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
            ["Any job", "resume tailored in seconds"],
            ["3 min", "from sign-up to live"],
            [formatPrice(0, currency), "to get started"],
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
    <motion.div {...delayed(delay)} {...spot}
      className={`lp-card lp-spot group flex flex-col overflow-hidden rounded-2xl p-6 ${className ?? ""}`}>
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

/* ── resume tailoring ── its own section: the job post on the right, the steps on the left. */
function Tailor() {
  const keywords: [string, boolean][] = [["React", true], ["TypeScript", true], ["REST APIs", true], ["GraphQL", false], ["CI/CD", false]];
  const steps = [
    { t: "Paste the job post", d: "Any role, from LinkedIn, Naukri or a careers page." },
    { t: "See where you stand", d: "A match score and the keywords the job wants that your resume is missing." },
    { t: "Download a resume for that job", d: "Bullets rewritten in the job's language and a tailored summary. Keep the suggestions you like, then download an ATS-ready PDF." },
  ];
  return (
    <section id="tailor" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className={CONTAINER}>
        <SectionHead
          eyebrow="resume tailoring"
          title={<>A resume made for <span className="lp-serif lp-gradient-text">every job</span> you apply to.</>}
          sub="Recruiters and ATS filters look for the job's own words. Paste a job description and Portxz rewrites your resume to match it in seconds, so you stop sending one generic PDF everywhere."
        />

        <motion.div {...delayed(0.1)}
          className="lp-card relative mt-14 overflow-hidden rounded-3xl p-6 sm:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Target className="h-[18px] w-[18px] text-lp-accent" />
                <p className="text-sm font-medium">How it works</p>
                <span className="rounded-full bg-lp-accent-soft px-2 py-0.5 text-[11px] font-semibold text-lp-accent">Pro</span>
              </div>
              <ol className="mt-6 space-y-5">
                {steps.map((s, k) => (
                  <li key={s.t} className="flex gap-4">
                    <span className="lp-mono grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lp-text text-xs font-semibold text-lp-bg">{k + 1}</span>
                    <div>
                      <p className="font-medium">{s.t}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-lp-muted">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 flex items-start gap-2 text-sm text-lp-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-lp-green" />
                Your saved profile, main resume and public portfolio stay exactly as they are.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <div className="rounded-xl border border-lp-border bg-lp-surface-2 p-4">
                  <p className="lp-mono text-[10px] uppercase tracking-widest text-lp-subtle">job description</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-lp-muted">
                    Frontend Engineer · We&apos;re looking for strong <b className="font-semibold text-lp-text">React</b> and{" "}
                    <b className="font-semibold text-lp-text">TypeScript</b> skills, experience with <b className="font-semibold text-lp-text">GraphQL</b>…
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map(([k, have]) => (
                    <span key={k} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      have ? "bg-lp-green/10 text-lp-green" : "bg-lp-warning/10 text-lp-warning"}`}>
                      {have ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}{k}
                    </span>
                  ))}
                </div>
                <div className="relative rounded-xl border border-lp-accent/30 bg-lp-accent-soft p-4 text-[13px] leading-relaxed">
                  <Sparkles className="absolute -top-2 right-4 h-4 w-4 text-lp-accent" />
                  Built <b className="font-semibold">React + TypeScript</b> dashboards consuming <b className="font-semibold">REST APIs</b> for 12k monthly users.
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 rounded-xl border border-lp-border bg-lp-surface-2 p-4 sm:flex-col">
                {[["Before", 54, "var(--lp-subtle)"], ["After", 91, "var(--lp-green)"]].map(([label, v, color]) => (
                  <div key={label as string} className="text-center">
                    <div className="relative h-16 w-16">
                      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--lp-border-strong)" strokeWidth="3" />
                        <motion.circle cx="18" cy="18" r="15.5" fill="none" stroke={color as string} strokeWidth="3" strokeLinecap="round"
                          strokeDasharray="97.4" initial={{ strokeDashoffset: 97.4 }}
                          whileInView={{ strokeDashoffset: 97.4 * (1 - (v as number) / 100) }}
                          viewport={{ once: true }} transition={{ duration: 1.2, ease }} />
                      </svg>
                      <span className="absolute inset-0 grid place-items-center text-sm font-semibold">{v}%</span>
                    </div>
                    <p className="mt-1 text-[11px] text-lp-muted">{label} match</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
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
          sub="Not just a website builder. Portxz writes, scores, tailors and ships your professional identity — wherever recruiters look."
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
                className={`group relative isolate rounded-xl border px-4 py-3 text-left transition-colors ${
                  k === active ? "border-transparent" : "border-lp-border hover:border-lp-border-strong hover:bg-lp-surface/60"
                }`}>
                {k === active && <motion.span layoutId="template-pick" transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  className="absolute -inset-px -z-10 rounded-xl border border-lp-accent/50 bg-lp-surface shadow-sm" />}
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

        <motion.div {...delayed(0.15)} className="relative mx-auto w-[240px] sm:w-[270px]">
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

/* ── resume templates ────────────────────────────────────────────── */

const RESUME_FONTS: Record<string, string> = {
  arimo: "Arial, Helvetica, sans-serif",
  carlito: "Calibri, Carlito, Arial, sans-serif",
  gelasio: "Georgia, 'Times New Roman', serif",
};
const CUSTOM_ACCENTS = ["#1d4ed8", "#7c3aed", "#be123c", "#0f766e", "#111111"];

const RESUME_SAMPLE: Record<string, { h: string; lines: string[] }> = {
  summary: { h: "Summary", lines: ["Full-stack engineer with 4 years shipping products used by 50k+ people."] },
  skills: { h: "Skills", lines: ["TypeScript · React · Node.js · PostgreSQL · AWS · Docker"] },
  experience: { h: "Experience", lines: ["Software Engineer — Ledgerly, 2022–now", "• Cut checkout latency 38% by moving pricing to the edge", "• Led a team of 3 to ship invoicing, now 22% of revenue"] },
  projects: { h: "Projects", lines: ["brief-day — AI daily planner, 486 ★ on GitHub"] },
  education: { h: "Education", lines: ["B.Tech, Computer Science — 2021"] },
};

function ResumeShowcase() {
  const [active, setActive] = useState(0);
  const [accent, setAccent] = useState(CUSTOM_ACCENTS[1]);
  const t = RESUME_TEMPLATES[active];
  const s = t.style;
  const color = t.id === "custom" ? accent : s.accent;
  const small = s.size === "small";
  const gap = s.spacing === "compact" ? "0.5rem" : s.spacing === "relaxed" ? "1rem" : "0.75rem";

  return (
    <section id="resume" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className={`${CONTAINER} grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20`}>
        <div>
          <SectionHead
            eyebrow="the resume"
            title={<>Six resumes. <span className="lp-serif lp-gradient-text">All</span> ATS-safe.</>}
            sub="The same profile, printed six ways. Every layout is single column with real text, so applicant tracking systems read it cleanly. Change the font, color and spacing yourself, and download a fresh PDF anytime."
          />

          <motion.div {...delayed(0.1)} className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {RESUME_TEMPLATES.map((tpl, k) => (
              <button key={tpl.id} onClick={() => setActive(k)} onMouseEnter={() => setActive(k)}
                aria-pressed={k === active}
                className={`relative isolate rounded-xl border px-4 py-3 text-left transition-colors ${
                  k === active ? "border-transparent" : "border-lp-border hover:border-lp-border-strong hover:bg-lp-surface/60"
                }`}>
                {k === active && <motion.span layoutId="resume-pick" transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  className="absolute -inset-px -z-10 rounded-xl border border-lp-accent/50 bg-lp-surface shadow-sm" />}
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{tpl.name}</span>
                  <span className={`lp-mono rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${
                    tpl.id === "classic" ? "bg-lp-green/10 text-lp-green" : "bg-lp-accent-soft text-lp-accent"
                  }`}>{tpl.id === "classic" ? "Free" : "Pro"}</span>
                </span>
              </button>
            ))}
          </motion.div>

          <motion.p {...delayed(0.15)} className="mt-5 min-h-[3rem] text-sm leading-relaxed text-lp-muted">
            <span className="font-medium text-lp-text">{t.name}:</span> {t.blurb}
          </motion.p>

          <motion.ul {...delayed(0.2)} className="mt-4 grid gap-2 text-sm text-lp-muted sm:grid-cols-2">
            {["Public resume page at /you/resume", "One-click PDF download", "Reorder sections freely", "Updates when your profile does"].map((f) => (
              <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0 text-lp-green" />{f}</li>
            ))}
          </motion.ul>
        </div>

        <motion.div {...delayed(0.15)} className="relative">
          <div aria-hidden className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
          <div className="relative mx-auto max-w-md rotate-[0.6deg] rounded-md bg-white p-7 text-[#1a1a1a] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] ring-1 ring-black/5 sm:p-9"
            style={{ fontFamily: RESUME_FONTS[s.font] ?? RESUME_FONTS.arimo, fontSize: small ? "10.5px" : "12px", lineHeight: 1.5 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={t.id + color} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease }}>
                <div style={{ textAlign: s.align === "center" ? "center" : "left" }}>
                  <p style={{ fontSize: small ? "18px" : "21px", fontWeight: 700, color: s.colorHeadings ? color : "#111" }}>Aarav Sharma</p>
                  <p className="text-[#555]">Full-stack Engineer · Bengaluru · portxz.xyz/aarav</p>
                </div>
                <div style={{ display: "grid", gap, marginTop: gap }}>
                  {t.order.filter((k) => RESUME_SAMPLE[k]).map((k) => (
                    <div key={k}>
                      <p style={{ fontSize: "0.85em", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                        color: s.colorHeadings ? color : "#111", borderBottom: `1px solid ${s.colorHeadings ? color : "#111"}33`, paddingBottom: 2, marginBottom: 4 }}>
                        {RESUME_SAMPLE[k].h}
                      </p>
                      {RESUME_SAMPLE[k].lines.map((l) => <p key={l}>{l}</p>)}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {t.id === "custom" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="relative mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-lp-border bg-lp-surface px-3 py-2 shadow-sm">
                <span className="text-xs text-lp-muted">Accent</span>
                {CUSTOM_ACCENTS.map((c) => (
                  <button key={c} onClick={() => setAccent(c)} aria-label={`Use color ${c}`} aria-pressed={accent === c}
                    className={`h-5 w-5 rounded-full transition ${accent === c ? "ring-2 ring-lp-accent ring-offset-2 ring-offset-lp-surface" : ""}`}
                    style={{ background: c }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ── more than projects ──────────────────────────────────────────── */

function Extras() {
  const items = [
    { icon: GraduationCap, t: "Education", d: "Degrees and courses, with links to transcripts or theses." },
    { icon: BadgeCheck, t: "Certifications", d: "Show what you've earned, with a link to verify it." },
    { icon: Trophy, t: "Awards", d: "Hackathon wins, scholarships and recognition." },
    { icon: HeartHandshake, t: "Volunteering", d: "Community work and causes you care about." },
    { icon: Languages, t: "Languages", d: "Every language you speak, with your level." },
    { icon: BookOpen, t: "Publications", d: "Papers, articles and talks." },
  ];
  const reach = [
    { icon: Search, t: "Found on Google", d: "Your portfolio is set up for search engines, so people who search your name can find it." },
    { icon: Share2, t: "Rich link previews", d: "Share your link on LinkedIn, WhatsApp or X and it shows your name, role and photo." },
    { icon: Smartphone, t: "Looks right everywhere", d: "Every template works on phones as well as desktops, so your link looks right wherever it's opened." },
  ];

  return (
    <section className="relative border-y border-lp-border bg-lp-surface-2/40 py-20 sm:py-28">
      <div className={CONTAINER}>
        <SectionHead center eyebrow="more than projects"
          title={<>Your <span className="lp-serif lp-gradient-text">whole</span> story, not just the code.</>}
          sub="Add the sections that make you, you. Each one appears on your portfolio and your resume at the same time." />

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.map((it, k) => (
            <motion.div key={it.t} {...delayed(k * 0.05)} {...spot} className="lp-card lp-spot rounded-2xl p-4 sm:p-5">
              <it.icon className="h-5 w-5 text-lp-accent" />
              <h3 className="mt-3 font-medium">{it.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-lp-muted">{it.d}</p>
            </motion.div>
          ))}
        </div>
        <motion.p {...delayed(0.1)} className="mt-4 text-center text-sm text-lp-muted">
          Need something else? Create a custom section with any title you like.
        </motion.p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {reach.map((r, k) => (
            <motion.div key={r.t} {...delayed(k * 0.08)} className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-lp-border bg-lp-surface text-lp-accent">
                <r.icon className="h-[18px] w-[18px]" />
              </span>
              <div>
                <h3 className="font-medium">{r.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-lp-muted">{r.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── before / after ──────────────────────────────────────────────── */

function Compare() {
  const rows = [
    ["A website builder, a resume editor and a README written by hand", "One profile that powers all three"],
    ["Fix a typo in three places", "Edit once, and everything updates"],
    ["Rewrite your resume for every job", "Paste the job post and get a tailored resume"],
    ["Guess whether the ATS can read your PDF", "ATS-safe layouts with a score"],
    ["Pay for several tools every month", "Free to start, with one-time Pro passes"],
  ];
  return (
    <section className="relative py-20 sm:py-28">
      <div className={CONTAINER}>
        <SectionHead center eyebrow="why portxz"
          title={<>Stop <span className="lp-serif text-lp-muted">juggling</span> four tools.</>} />

        <motion.div {...delayed(0.1)} className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-3xl border border-lp-border">
          {/* Two columns from sm up; on phones each row stacks "before" over "after". */}
          <div className="hidden grid-cols-2 border-b border-lp-border bg-lp-surface-2/60 text-sm font-medium sm:grid">
            <p className="px-7 py-4 text-lp-muted">The usual way</p>
            <p className="border-l border-lp-border px-7 py-4">With Portxz</p>
          </div>
          {rows.map(([before, after]) => (
            <div key={before} className="grid border-b border-lp-border text-sm last:border-b-0 sm:grid-cols-2">
              <p className="flex items-start gap-2.5 px-5 pb-2 pt-4 text-lp-muted sm:px-7 sm:py-4">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-lp-subtle" />{before}
              </p>
              <p className="flex items-start gap-2.5 bg-lp-accent-soft/40 px-5 py-3 sm:border-l sm:border-lp-border sm:px-7 sm:py-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-lp-green" />{after}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── testimonials ────────────────────────────────────────────────── */

function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <section className="relative border-y border-lp-border bg-lp-surface-2/40 py-20 sm:py-28">
      <div className={CONTAINER}>
        <SectionHead center eyebrow="from our users"
          title={<>People are <span className="lp-serif lp-gradient-text">shipping</span> with Portxz.</>} />

        <div className="mt-14 gap-4 sm:columns-2 lg:columns-3">
          {TESTIMONIALS.map((t, k) => {
            const initials = t.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <motion.figure key={t.name + k} {...delayed((k % 3) * 0.06)} {...spot}
                className="lp-card lp-spot mb-4 break-inside-avoid rounded-2xl p-6">
                <blockquote className="text-[15px] leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  {t.photo ? (
                    <Image src={t.photo} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-lp-accent-soft text-xs font-semibold text-lp-accent">{initials}</span>
                  )}
                  <span className="min-w-0 text-sm">
                    {t.url ? (
                      <a href={t.url} target="_blank" rel="noopener noreferrer" className="block truncate font-medium hover:text-lp-accent">{t.name}</a>
                    ) : (
                      <span className="block truncate font-medium">{t.name}</span>
                    )}
                    <span className="block truncate text-lp-muted">{t.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── how it works + audience ─────────────────────────────────────── */

function Steps() {
  const steps = [
    { icon: Link2, t: "Claim your link", d: "Pick a username. Guided setup walks you through, and GitHub import pulls your repos in one click." },
    { icon: PenLine, t: "Fill it once", d: "Projects, experience, skills — with AI that turns weak lines into recruiter-ready bullets." },
    { icon: Rocket, t: "Publish everywhere", d: "Choose a template and hit publish. Portfolio live, resume PDF ready — then tailor it to every job you apply for." },
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
                  <h3 className="font-medium">{a.t}</h3>
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
  const currency = useCurrency();
  const fmt = (n: number) => formatPrice(n, currency);
  const p = PRICES[currency];
  const sale = saleActive();
  const now = sale ? SALE_PRICES[currency] : p;
  const free = ["Published portfolio + your link", "GitHub import & README", "Minimal template", "Classic ATS resume PDF", "5 projects, experiences & links", "5 AI enhances / month"];
  const pro = ["Everything in Free", "All 8 templates", "Unlimited projects, experience & links", "200 AI rewrites a month", "Tailor your resume to any job", "AI portfolio review", "6 resume templates + resume editor"];

  return (
    <section id="pricing" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className={CONTAINER}>
        <SectionHead center eyebrow="simple pricing"
          title={<>Free to start. <span className="lp-serif text-lp-muted">Pro</span> when you&apos;re ready.</>}
          sub="No trials, no traps. Upgrade only if you love it." />

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          <motion.div {...reveal} className="lp-card flex flex-col rounded-3xl p-6 sm:p-8">
            <p className="font-medium">Free</p>
            <p className="mt-1 text-sm text-lp-muted">Everything you need to get online.</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-5xl font-semibold tracking-tight">{fmt(0)}</span>
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

          <motion.div id="pro" {...delayed(0.1)}
            className="lp-gradient-border relative flex scroll-mt-24 flex-col overflow-hidden rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_-30px_rgba(79,110,255,0.45)]">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
            <div className="relative flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">Pro</p>
              {sale && <span className="rounded-full bg-lp-green/15 px-2.5 py-1 text-[11px] font-semibold text-lp-green">Launch sale · {SALE.percent}% off until {SALE.endsLabel}</span>}
            </div>
            <p className="relative mt-1 text-sm text-lp-muted">The full kit, for less than a coffee.</p>
            <div id="launch-offer" className="relative mt-6 scroll-mt-28">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-lp-accent">Launch offer · first {LAUNCH_OFFER_LIMIT} users</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-xl text-lp-subtle line-through">{fmt(p.month)}</span>
                <span className="text-5xl font-semibold tracking-tight">{fmt(p.launch)}</span>
                <span className="text-lp-muted">/ first month</span>
              </p>
              <p className="mt-2 text-sm text-lp-muted">
                Then {fmt(now.month)}/month{sale && <> <span className="text-lp-subtle line-through">{fmt(p.month)}</span> during the launch sale</>}
              </p>
            </div>
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
            <PrimaryButton href="/sign-up" className="relative mt-8">Get Pro for {fmt(p.launch)}</PrimaryButton>
            <p className="lp-mono relative mt-3 text-center text-[11px] text-lp-subtle">
              or {fmt(now.halfyear)}/6mo · {fmt(now.year)}/yr{sale && ` (was ${fmt(p.halfyear)} · ${fmt(p.year)})`}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── faq ─────────────────────────────────────────────────────────── */

function Faq() {
  const FAQ = faqFor(useCurrency());
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
                {/* Always in the HTML (just collapsed) so search engines can read every answer. */}
                <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease }} className="overflow-hidden" aria-hidden={!isOpen}>
                  <p className="max-w-xl pb-6 pr-10 text-[15px] leading-relaxed text-lp-muted">{f.a}</p>
                </motion.div>
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
            One link that carries your portfolio, resume and README — plus a resume you can tailor to every job in seconds.
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
            One profile. Portfolio, an ATS resume you can tailor to any job, and your GitHub README — always in sync.
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
      <main className="lp lp-landing relative min-h-screen overflow-x-clip">
        <ScrollProgress />
        <Nav />
        <Hero />
        <SyncDemo />
        <Tailor />
        <Features />
        <Templates />
        <ResumeShowcase />
        <Extras />
        <Steps />
        <Compare />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
        <Footer />
      </main>
    </MotionConfig>
  );
}
