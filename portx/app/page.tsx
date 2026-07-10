"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

/* ═══ Portxz landing — animated SaaS edition ═══ */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

/* ── typing terminal ── */
const SCRIPT = [
  { cmd: "whoami", out: "product designer · full-stack dev · shipping real things" },
  { cmd: "projects", out: "📁 Ledgerly · Brief.day · Design System Kit — 12k users served" },
  { cmd: "resume", out: "📄 view resume | ⬇ download PDF — always in sync" },
  { cmd: "sudo hire-me", out: "✅ permission granted." },
];

function TypingTerminal() {
  const [lines, setLines] = useState<{ cmd: string; out: string }[]>([]);
  const [typed, setTyped] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => {
    const current = SCRIPT[step % SCRIPT.length];
    let i = 0;
    setTyped("");
    const typer = setInterval(() => {
      i++;
      setTyped(current.cmd.slice(0, i));
      if (i >= current.cmd.length) {
        clearInterval(typer);
        setTimeout(() => {
          setLines((prev) => [...prev.slice(-2), current]);
          setTyped("");
          setTimeout(() => setStep((s) => s + 1), 1400);
        }, 350);
      }
    }, 90);
    return () => clearInterval(typer);
  }, [step]);

  const Prompt = () => (
    <>
      <span className="text-[#39D98A]">visitor</span>
      <span className="text-[#6B7A99]">@</span>
      <span className="text-[#4DA6FF]">you</span>
      <span className="text-[#6B7A99]">:~$</span>{" "}
    </>
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#1E2C52] bg-[#070C1A] text-left shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 border-b border-[#1E2C52] bg-[#0F1730] px-4 py-3">
        <i className="block h-3 w-3 rounded-full bg-[#FF5F57]" />
        <i className="block h-3 w-3 rounded-full bg-[#FFB454]" />
        <i className="block h-3 w-3 rounded-full bg-[#39D98A]" />
        <span className="ml-2 font-mono text-xs text-[#6B7A99]">visitor@you — portfolio</span>
        <span className="ml-auto rounded bg-[#4DA6FF]/10 px-2 py-0.5 font-mono text-[10px] text-[#4DA6FF]">LIVE</span>
      </div>
      <div className="min-h-[190px] space-y-1.5 p-5 font-mono text-[13px] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i}>
            <p><Prompt /><span className="text-[#E8EDF7]">{l.cmd}</span></p>
            <p className="text-[#8B98B8]">{l.out}</p>
          </div>
        ))}
        <p>
          <Prompt />
          <span className="text-[#E8EDF7]">{typed}</span>
          <span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-[#4DA6FF] align-middle" />
        </p>
      </div>
    </div>
  );
}

/* ── tilting template mini-card ── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setT({
          x: ((e.clientY - r.top) / r.height - 0.5) * -14,
          y: ((e.clientX - r.left) / r.width - 0.5) * 14,
        });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      style={{ transform: `perspective(700px) rotateX(${t.x}deg) rotateY(${t.y}deg)` }}
      className={`transition-transform duration-200 ease-out ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

const TEMPLATE_THUMBS = [
  {
    name: "CLI Terminal",
    el: (
      <div className="h-full w-full bg-[#070C1A] p-3 font-mono">
        <div className="flex gap-1">
          <i className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" /><i className="h-1.5 w-1.5 rounded-full bg-[#FFB454]" /><i className="h-1.5 w-1.5 rounded-full bg-[#39D98A]" />
        </div>
        <p className="mt-2 text-[8px] text-[#39D98A]">$ whoami<span className="inline-block h-2 w-1 animate-pulse bg-[#4DA6FF] align-middle" /></p>
      </div>
    ),
  },
  {
    name: "Noir",
    el: (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#0B0B0D] p-3">
        <div className="h-2 w-16 rounded-sm bg-[#EDEAE2]" />
        <div className="mt-1.5 h-px w-8 bg-[#D4B36A]" />
        <div className="mt-1.5 h-1 w-12 rounded bg-[#8F8A7E]/60" />
      </div>
    ),
  },
  {
    name: "Executive",
    el: (
      <div className="h-full w-full bg-[#F6F8FB]">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1E3A5F] to-[#2563EB]" />
        <div className="p-2">
          <div className="rounded border border-[#E2E8F0] bg-white p-1.5"><div className="h-1.5 w-12 rounded bg-[#1E3A5F]" /></div>
        </div>
      </div>
    ),
  },
  {
    name: "Aurora",
    el: (
      <div className="relative h-full w-full overflow-hidden bg-[#070912] p-3">
        <div className="absolute -left-2 -top-3 h-8 w-12 rounded-full bg-[#22D3EE]/40 blur-md" />
        <div className="absolute -right-1 bottom-0 h-8 w-10 rounded-full bg-[#EC4899]/30 blur-md" />
        <div className="relative mt-2 h-2 w-16 rounded bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6]" />
      </div>
    ),
  },
];

const SHOWCASE = [
  { name: "Minimal", tag: "free forever", el: (
    <div className="h-full w-full bg-[#0A0F1E] p-4">
      <div className="h-2.5 w-20 rounded bg-[#4DA6FF]" />
      <div className="mt-2 h-2 w-28 rounded bg-[#3A4664]" />
      <div className="mt-4 space-y-2">
        <div className="h-8 rounded-lg border border-[#1E2C52] bg-[#111A36]" />
        <div className="h-8 rounded-lg border border-[#1E2C52] bg-[#111A36]" />
      </div>
    </div>
  )},
  { name: "CLI Terminal", tag: "the shareable one", el: (
    <div className="h-full w-full bg-[#070C1A] p-4 font-mono">
      <div className="flex gap-1.5">
        <i className="h-2 w-2 rounded-full bg-[#FF5F57]" /><i className="h-2 w-2 rounded-full bg-[#FFB454]" /><i className="h-2 w-2 rounded-full bg-[#39D98A]" />
      </div>
      <p className="mt-3 text-[10px] text-[#39D98A]">visitor@you:~$ <span className="text-[#E8EDF7]">sudo hire-me</span></p>
      <p className="mt-1 text-[10px] text-[#8B98B8]">✅ permission granted.</p>
      <p className="mt-2 text-[10px] text-[#39D98A]">visitor@you:~$ <span className="inline-block h-2.5 w-1.5 animate-pulse bg-[#4DA6FF] align-middle" /></p>
    </div>
  )},
  { name: "Glassmorphism", tag: "frosted premium", el: (
    <div className="relative h-full w-full bg-[#0A0F1E] p-4">
      <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-[#4DA6FF]/40 blur-xl" />
      <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#7C5CFF]/40 blur-xl" />
      <div className="relative mt-3 h-10 rounded-xl border border-white/20 bg-white/10 backdrop-blur" />
      <div className="relative mt-2 h-7 w-2/3 rounded-xl border border-white/15 bg-white/5 backdrop-blur" />
    </div>
  )},
  { name: "Noir", tag: "black & gold luxury", el: (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0B0B0D] p-4">
      <div className="h-3 w-24 rounded-sm bg-[#EDEAE2]" />
      <div className="mt-2 h-px w-12 bg-[#D4B36A]" />
      <div className="mt-2 h-1.5 w-16 rounded bg-[#8F8A7E]/60" />
      <div className="mt-3 flex gap-2">
        <div className="h-1.5 w-8 rounded bg-[#D4B36A]/70" /><div className="h-1.5 w-8 rounded bg-[#D4B36A]/70" />
      </div>
    </div>
  )},
  { name: "Executive", tag: "interview-ready, light", el: (
    <div className="h-full w-full bg-[#F6F8FB]">
      <div className="h-2 w-full bg-gradient-to-r from-[#1E3A5F] to-[#2563EB]" />
      <div className="p-3">
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-2 shadow-sm">
          <div className="h-2 w-16 rounded bg-[#1E3A5F]" />
          <div className="mt-1.5 h-1.5 w-12 rounded bg-[#2563EB]/60" />
        </div>
        <div className="mt-2 flex gap-2">
          <div className="h-6 flex-1 rounded-lg border border-[#E2E8F0] bg-white" />
          <div className="h-6 flex-1 rounded-lg border border-[#E2E8F0] bg-white" />
        </div>
      </div>
    </div>
  )},
  { name: "Aurora", tag: "glowing gradients", el: (
    <div className="relative h-full w-full overflow-hidden bg-[#070912] p-4">
      <div className="absolute -left-3 -top-5 h-14 w-20 rotate-12 rounded-full bg-[#22D3EE]/40 blur-lg" />
      <div className="absolute -right-3 top-3 h-12 w-16 rounded-full bg-[#8B5CF6]/40 blur-lg" />
      <div className="absolute bottom-0 left-6 h-10 w-16 rounded-full bg-[#EC4899]/30 blur-lg" />
      <div className="relative mt-2 h-3 w-24 rounded bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6]" />
      <div className="relative mt-2 h-1.5 w-16 rounded bg-[#3A4258]" />
      <div className="relative mt-3 h-7 rounded-xl border border-white/10 bg-white/5" />
    </div>
  )},
];

const FAQ = [
  { q: "Is the free plan actually free?", a: "Forever. You get a published portfolio with the Minimal template, 5 projects, 5 experience entries, skills, education, links, and GitHub import. Pro adds the premium templates, AI review, the synced resume PDF, and removes all limits." },
  { q: "What does the ₹49 launch offer include?", a: "One full month of Pro — every premium template, AI portfolio review, unlimited entries, and the ATS resume PDF. It's limited to the first 50 users, once per user. After that, Pro is ₹149/month (or less on 6-month and yearly passes)." },
  { q: "How does payment work?", a: "Simple UPI. Pick a pass, pay to the shown UPI ID with your username in the note, tell us the number or UPI ID you paid from, and we verify and activate — usually within a few hours." },
  { q: "Is the resume really ATS-friendly?", a: "Yes — single column, real selectable text, standard section headings, no graphics. It's built to parse cleanly, and the AI review pushes your content toward measurable, recruiter-ready bullets." },
  { q: "I'm not a developer. Is this for me?", a: "Absolutely. Designers, PMs, marketers, consultants — the Executive and Noir templates were designed for working professionals. GitHub features are optional; everything else is profession-neutral." },
  { q: "Can I switch templates later?", a: "Anytime, in one click. Your data lives separately from the design — switching templates never touches your content." },
];

export default function Landing() {
  return (
    <main className="relative min-h-screen   overflow-hidden bg-[#0A0F1E] text-[#E8EDF7]">
      <style>{`
        @keyframes drift { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-30px) scale(1.08)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,20px) scale(1.1)} }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>

      {/* ambient animated orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#4DA6FF]/15 blur-[160px]" style={{ animation: "drift 14s ease-in-out infinite" }} />
        <div className="absolute bottom-0 -left-40 h-[420px] w-[420px] rounded-full bg-[#7C5CFF]/12 blur-[140px]" style={{ animation: "drift2 18s ease-in-out infinite" }} />
        <div className="absolute -right-40 top-1/3 h-[380px] w-[380px] rounded-full bg-[#39D98A]/8 blur-[140px]" style={{ animation: "drift 20s ease-in-out infinite" }} />
      </div>

      {/* nav */}
      <nav className="relative z-10 flex w-full items-center justify-between px-6 py-5 sm:px-12">
        <span className="flex items-center gap-2 text-xl font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#4DA6FF] to-[#7C5CFF] text-sm text-white shadow-[0_4px_16px_rgba(77,166,255,0.4)]">P</span>
          Port<span className="text-[#4DA6FF]">xz</span>
        </span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/sign-in" className="hidden text-sm text-[#8B98B8] hover:text-white sm:block">Sign in</Link>
          <Link href="/sign-up"
            className="rounded-lg bg-[#4DA6FF] px-4 py-2 text-sm font-semibold text-[#04101F] shadow-[0_4px_20px_rgba(77,166,255,0.35)] transition hover:bg-[#8FC4FF]">
            Get started
          </Link>
        </div>
      </nav>

      {/* ═══ hero ═══ */}
      <section className="relative z-10 mx-auto flex w-full flex-col items-center px-6 pt-14 text-center sm:pt-20">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full border border-[#39D98A]/40 bg-[#0E2018]/80 px-4 py-1.5 font-mono text-xs text-[#39D98A] backdrop-blur transition hover:border-[#39D98A]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#39D98A]" />
            🚀 Launch offer — Pro for ₹49 · first 50 users →
          </Link>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-7 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-7xl">
          One profile.{" "}
          <span className="bg-gradient-to-r from-[#4DA6FF] via-[#8FC4FF] to-[#7C5CFF] bg-clip-text text-transparent">
            Portfolio, resume &amp; README
          </span>{" "}
          — always in sync.
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-[#8B98B8]">
          Edit a project once — your live portfolio, ATS-ready PDF resume, and GitHub README
          all update instantly. Built for people who ship.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col gap-4 sm:flex-row">
          <Link href="/sign-up"
            className="rounded-xl bg-[#4DA6FF] px-8 py-3.5 font-semibold text-[#04101F] shadow-[0_8px_32px_rgba(77,166,255,0.4)] transition hover:bg-[#8FC4FF] hover:shadow-[0_8px_48px_rgba(77,166,255,0.55)]">
            Claim your username — free
          </Link>
          <a href="#launch-offer"
            className="rounded-xl border border-[#1E2C52] px-8 py-3.5 font-semibold transition hover:border-[#39D98A] hover:bg-[#0F1730]">
            See the ₹49 offer
          </a>
        </motion.div>

        {/* floating template cards + typing terminal */}
        <div className="relative mt-16 w-full max-w-4xl">
          <div className="pointer-events-none absolute -left-6 -top-8 hidden gap-3 lg:flex" style={{ animation: "floaty 5s ease-in-out infinite" }}>
            {TEMPLATE_THUMBS.slice(0, 2).map((t) => (
              <div key={t.name} className="pointer-events-auto">
                <TiltCard className="h-20 w-32 overflow-hidden rounded-xl border border-[#1E2C52] shadow-2xl">{t.el}</TiltCard>
                <p className="mt-1 text-center font-mono text-[10px] text-[#6B7A99]">{t.name}</p>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute -right-6 -top-8 hidden gap-3 lg:flex" style={{ animation: "floaty 6s ease-in-out infinite" }}>
            {TEMPLATE_THUMBS.slice(2).map((t) => (
              <div key={t.name} className="pointer-events-auto">
                <TiltCard className="h-20 w-32 overflow-hidden rounded-xl border border-[#1E2C52] shadow-2xl">{t.el}</TiltCard>
                <p className="mt-1 text-center font-mono text-[10px] text-[#6B7A99]">{t.name}</p>
              </div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
            <TypingTerminal />
          </motion.div>
        </div>

        {/* stat strip */}
        <motion.div {...fadeUp} className="mt-12 grid w-full max-w-2xl grid-cols-3 divide-x divide-[#1E2C52] rounded-2xl border border-[#1E2C52] bg-[#0F1730]/60 backdrop-blur">
          {[["6", "templates"], ["1-click", "GitHub import"], ["3 min", "to publish"]].map(([v, l]) => (
            <div key={l} className="px-2 py-4">
              <p className="text-xl font-bold text-[#4DA6FF] sm:text-2xl">{v}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#6B7A99] sm:text-xs">{l}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* marquee */}
      <div className="relative z-10 mt-20 overflow-hidden border-y border-[#1E2C52] bg-[#0F1730]/40 py-3">
        <div className="flex w-max gap-10 font-mono text-xs uppercase tracking-[0.2em] text-[#6B7A99]" style={{ animation: "marquee 22s linear infinite" }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-10">
              {["live portfolio", "✦", "ats resume pdf", "✦", "github readme", "✦", "ai review", "✦", "cli terminal", "✦", "6 templates", "✦", "analytics", "✦"].map((t, j) => (
                <span key={j}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ how it works ═══ */}
      <section className="relative z-10 w-full px-6 py-24 sm:px-12">
        <motion.p {...fadeUp} className="text-center font-mono text-xs uppercase tracking-[0.25em] text-[#4DA6FF]">how it works</motion.p>
        <motion.h2 {...fadeUp} className="mt-3 text-center text-3xl font-bold sm:text-4xl">Live in 3 minutes. Really.</motion.h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { n: "01", t: "Claim your link", d: "portxz…/you — the guided setup takes you step by step. GitHub import pulls your repos in one click." },
            { n: "02", t: "Fill once", d: "Projects, experience, skills — with AI that rewrites weak lines into recruiter-ready bullets." },
            { n: "03", t: "Publish everywhere", d: "Pick a template, hit publish. Portfolio live, resume PDF ready, README copied. All from one profile." },
          ].map((s, i) => (
            <motion.div key={s.n} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.12 }}
              className="relative rounded-2xl border border-[#1E2C52] bg-[#0F1730]/60 p-7 backdrop-blur">
              <span className="bg-gradient-to-br from-[#4DA6FF] to-[#7C5CFF] bg-clip-text font-mono text-4xl font-bold text-transparent">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8B98B8]">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ features ═══ */}
      <section className="relative z-10 w-full px-6 pb-24 sm:px-12">
        <motion.p {...fadeUp} className="text-center font-mono text-xs uppercase tracking-[0.25em] text-[#4DA6FF]">everything from one profile</motion.p>
        <motion.h2 {...fadeUp} className="mt-3 text-center text-3xl font-bold sm:text-4xl">Your whole professional identity</motion.h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: "🖥️", title: "6 premium templates", desc: "Minimal, interactive CLI terminal, glass, black-gold Noir, corporate Executive, glowing Aurora. Switch anytime — same data." },
            { icon: "📄", title: "ATS resume PDF", desc: "Single-column, parser-friendly, recruiter-ready. Edit your profile — the PDF updates itself." },
            { icon: "🐙", title: "GitHub README", desc: "One-click profile README with badges, projects, and stats. Paste and push." },
            { icon: "⚡", title: "GitHub import", desc: "Pull your repos in one click, pick your best, polish with AI." },
            { icon: "✨", title: "AI enhance & review", desc: "Weak bullets rewritten, plus a rubric-scored readiness review with specific fixes." },
            { icon: "📊", title: "Analytics", desc: "Know when your page is viewed and your resume gets downloaded." },
          ].map((f, i) => (
            <motion.div key={f.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 3) * 0.1 }}
              className="group rounded-2xl border border-[#1E2C52] bg-[#0F1730]/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-[#4DA6FF]/50 hover:bg-[#111A36] hover:shadow-[0_16px_40px_rgba(77,166,255,0.12)]">
              <span className="text-2xl transition group-hover:scale-110">{f.icon}</span>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#8B98B8]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ template showcase ═══ */}
      <section className="relative z-10 w-full px-6 pb-24 sm:px-12">
        <motion.p {...fadeUp} className="text-center font-mono text-xs uppercase tracking-[0.25em] text-[#4DA6FF]">the wardrobe</motion.p>
        <motion.h2 {...fadeUp} className="mt-3 text-center text-3xl font-bold sm:text-4xl">Six looks. One profile. Zero rework.</motion.h2>
        <motion.p {...fadeUp} className="mx-auto mt-3 max-w-lg text-center text-[#8B98B8]">
          Switch templates like outfits — your content never moves. Preview every one with demo data before you commit.
        </motion.p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE.map((t, i) => (
            <motion.div key={t.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 3) * 0.1 }}>
              <TiltCard className="overflow-hidden rounded-2xl border border-[#1E2C52] shadow-xl transition hover:border-[#4DA6FF]/50">
                <div className="aspect-[16/10]">{t.el}</div>
                <div className="flex items-center justify-between border-t border-[#1E2C52] bg-[#0F1730] px-4 py-3">
                  <p className="font-semibold">{t.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#6B7A99]">{t.tag}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ the trio deep-dive ═══ */}
      <section className="relative z-10 w-full px-6 pb-24 sm:px-12">
        <motion.p {...fadeUp} className="text-center font-mono text-xs uppercase tracking-[0.25em] text-[#4DA6FF]">one profile, three outputs</motion.p>
        <motion.h2 {...fadeUp} className="mt-3 text-center text-3xl font-bold sm:text-4xl">Stop maintaining three versions of yourself</motion.h2>
        <motion.p {...fadeUp} className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-[#8B98B8]">
          The portfolio says one thing, the resume another, and the README hasn&apos;t been touched since 2023.
          Sound familiar? Portxz kills the drift: one source of truth renders all three, and every edit updates everywhere.
        </motion.p>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: "🌐", t: "The Portfolio", pts: ["Your own link: portxz…/you", "6 templates, switch anytime", "Interactive CLI mode visitors love", "View analytics built in"] },
            { icon: "📄", t: "The Resume", pts: ["ATS-parseable single column", "Rendered from the same data", "One-click PDF download", "AI-polished bullet points"] },
            { icon: "🐙", t: "The README", pts: ["GitHub profile README generator", "Badges, projects & stats included", "Copy, paste, push — done", "Stays consistent with the rest"] },
          ].map((c, i) => (
            <motion.div key={c.t} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.12 }}
              className="rounded-2xl border border-[#1E2C52] bg-[#0F1730]/60 p-7 backdrop-blur">
              <span className="text-3xl">{c.icon}</span>
              <h3 className="mt-3 text-lg font-semibold">{c.t}</h3>
              <ul className="mt-4 space-y-2 text-sm text-[#8B98B8]">
                {c.pts.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#4DA6FF]/15 text-[10px] text-[#4DA6FF]">✓</span>{p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ who it's for ═══ */}
      <section className="relative z-10 w-full px-6 pb-24 sm:px-12">
        <motion.p {...fadeUp} className="text-center font-mono text-xs uppercase tracking-[0.25em] text-[#4DA6FF]">built for people who ship</motion.p>
        <motion.h2 {...fadeUp} className="mt-3 text-center text-3xl font-bold sm:text-4xl">Not just for developers</motion.h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { e: "👩‍💻", t: "Developers", d: "GitHub import, the CLI terminal template, a README that writes itself, and a resume that passes the parsers. Type sudo on your own page." },
            { e: "🎨", t: "Designers & PMs", d: "Case studies as projects, Aurora and Glass for personality, Executive when it's interview week. Metrics-first bullets courtesy of the AI." },
            { e: "💼", t: "Working professionals", d: "Consultants, marketers, analysts — Noir and Executive were designed for you. A serious personal brand without touching code." },
          ].map((p, i) => (
            <motion.div key={p.t} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.12 }}
              className="rounded-2xl border border-[#1E2C52] bg-[#0F1730]/60 p-7 text-center backdrop-blur transition hover:-translate-y-1 hover:border-[#4DA6FF]/50">
              <span className="text-4xl">{p.e}</span>
              <h3 className="mt-3 text-lg font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#8B98B8]">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ free vs pro ═══ */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24">
        <motion.p {...fadeUp} className="text-center font-mono text-xs uppercase tracking-[0.25em] text-[#4DA6FF]">simple pricing</motion.p>
        <motion.h2 {...fadeUp} className="mt-3 text-center text-3xl font-bold sm:text-4xl">Free to start. Pro when you&apos;re ready.</motion.h2>
        <motion.div {...fadeUp} className="mt-10 overflow-hidden rounded-2xl border border-[#1E2C52]">
          <div className="grid grid-cols-3 border-b border-[#1E2C52] bg-[#0F1730] px-5 py-4 text-sm font-semibold">
            <span className="text-[#8B98B8]">What you get</span>
            <span className="text-center">Free</span>
            <span className="text-center text-[#39D98A]">Pro ₹49*</span>
          </div>
          {[
            ["Published portfolio + your link", "✓", "✓"],
            ["GitHub import & README", "✓", "✓"],
            ["Templates", "Minimal", "All 6"],
            ["Projects / experience / links", "5 each", "Unlimited"],
            ["AI enhance", "5 / month", "Unlimited"],
            ["AI portfolio review", "—", "✓"],
            ["ATS resume view + PDF", "—", "✓"],
          ].map(([f, a, b], i) => (
            <div key={f} className={`grid grid-cols-3 px-5 py-3.5 text-sm ${i % 2 ? "bg-[#0F1730]/50" : ""}`}>
              <span className="text-[#8B98B8]">{f}</span>
              <span className="text-center text-[#C7CFE5]">{a}</span>
              <span className="text-center font-medium text-[#39D98A]">{b}</span>
            </div>
          ))}
          <p className="border-t border-[#1E2C52] bg-[#0F1730] px-5 py-3 text-center font-mono text-[11px] text-[#6B7A99]">
            *launch offer, first 50 users · then ₹149/mo · ₹649/6mo · ₹999/yr
          </p>
        </motion.div>
      </section>

      {/* ═══ launch offer ═══ */}
      <section id="launch-offer" className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 sm:px-12">
        <motion.div {...fadeUp}
          className="relative overflow-hidden rounded-3xl border border-[#39D98A]/30 bg-gradient-to-b from-[#0E2018] to-[#0A0F1E] p-10 text-center sm:p-14">
          <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#39D98A]/20 blur-[100px]" />
          <span className="relative inline-block rounded-full border border-[#39D98A]/40 bg-[#39D98A]/10 px-4 py-1.5 font-mono text-xs text-[#39D98A]">
            🚀 LAUNCH OFFER · FIRST 50 USERS ONLY
          </span>
          <h2 className="relative mt-6 text-3xl font-bold sm:text-5xl">
            Everything Pro.{" "}
            <span className="text-[#8B98B8] line-through decoration-[#FF6B6B]/70">₹149</span>{" "}
            <span className="text-[#39D98A]">₹49</span>
            <span className="text-xl text-[#8B98B8]">/month</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-[#8B98B8]">
            Less than a coffee. All 5 premium templates, AI review, synced resume PDF,
            unlimited everything — for the first 50 people who believe early.
          </p>
          <div className="relative mx-auto mt-7 grid max-w-lg grid-cols-2 gap-2 text-left text-sm sm:grid-cols-2">
            {["All premium templates", "AI portfolio review", "ATS resume + PDF", "Unlimited projects & skills"].map((p) => (
              <p key={p} className="flex items-center gap-2 text-[#C7CFE5]">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-[#39D98A]/15 text-[10px] text-[#39D98A]">✓</span>{p}
              </p>
            ))}
          </div>
          <Link href="/sign-up"
            className="relative mt-9 inline-block rounded-xl bg-[#39D98A] px-10 py-4 font-semibold text-[#04101F] shadow-[0_8px_40px_rgba(57,217,138,0.4)] transition hover:shadow-[0_8px_56px_rgba(57,217,138,0.55)]">
            Claim your spot — start free →
          </Link>
          <p className="relative mt-3 font-mono text-[11px] text-[#6B7A99]">free plan forever · upgrade only if you love it</p>
        </motion.div>
      </section>

      {/* ═══ faq ═══ */}
      <section className="relative z-10 mx-auto max-w-2xl px-6 pb-24">
        <motion.p {...fadeUp} className="text-center font-mono text-xs uppercase tracking-[0.25em] text-[#4DA6FF]">questions</motion.p>
        <motion.h2 {...fadeUp} className="mt-3 text-center text-3xl font-bold sm:text-4xl">Asked &amp; answered</motion.h2>
        <div className="mt-10 space-y-3">
          {FAQ.map((f, i) => (
            <motion.details key={f.q} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="group rounded-2xl border border-[#1E2C52] bg-[#0F1730]/60 backdrop-blur open:border-[#4DA6FF]/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="shrink-0 text-[#4DA6FF] transition group-open:rotate-45">+</span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-[#8B98B8]">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* ═══ final cta ═══ */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 text-center">
        <motion.h2 {...fadeUp} className="text-3xl font-bold sm:text-4xl">
          Your work deserves better than a <span className="text-[#8B98B8] line-through">PDF in an email</span>.
        </motion.h2>
        <motion.p {...fadeUp} className="mx-auto mt-4 max-w-md text-[#8B98B8]">
          One link that carries your portfolio, resume, and README — and stays current forever.
        </motion.p>
        <motion.div {...fadeUp}>
          <Link href="/sign-up"
            className="mt-8 inline-block rounded-xl bg-[#4DA6FF] px-10 py-4 font-semibold text-[#04101F] shadow-[0_8px_40px_rgba(77,166,255,0.4)] transition hover:bg-[#8FC4FF]">
            Claim your username →
          </Link>
        </motion.div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-[#1E2C52]">
        <div className="flex w-full flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row sm:px-12">
          <span className="flex items-center gap-2 font-bold">
            <span className="grid h-6 w-6 place-items-center rounded bg-gradient-to-br from-[#4DA6FF] to-[#7C5CFF] text-xs text-white">P</span>
            Port<span className="text-[#4DA6FF]">xz</span>
          </span>
          <p className="font-mono text-xs text-[#6B7A99]">© {new Date().getFullYear()} Portxz · one profile, always in sync</p>
        </div>
      </footer>
    </main>
  );
}
