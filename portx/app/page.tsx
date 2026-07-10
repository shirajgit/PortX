import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0F1E] text-[#E8EDF7]">
      {/* ambient gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[#4DA6FF]/15 blur-[160px]" />
        <div className="absolute bottom-0 -left-40 h-[420px] w-[420px] rounded-full bg-[#7C5CFF]/10 blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-[380px] w-[380px] rounded-full bg-[#39D98A]/8 blur-[140px]" />
      </div>

      {/* nav */}
      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-xl font-bold">
          Port<span className="text-[#4DA6FF]">xz</span>
        </span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/sign-in" className="text-sm text-[#8B98B8] hover:text-white">
            Sign in
          </Link>
          <Link href="/sign-up"
            className="rounded-lg border border-[#1E2C52] px-4 py-2 text-sm font-semibold hover:border-[#4DA6FF]">
            Get started
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-16 text-center sm:pt-24">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1E2C52] bg-[#0F1730]/80 px-4 py-1.5 font-mono text-xs text-[#4DA6FF] backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#39D98A]" />
          Portxz.vercel.app/you — claim yours
        </span>

        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          One profile.{" "}
          <span className="bg-gradient-to-r from-[#4DA6FF] via-[#8FC4FF] to-[#7C5CFF] bg-clip-text text-transparent">
            Portfolio, resume &amp; README
          </span>
          {" "}— always in sync.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#8B98B8]">
          Edit a project once — your live portfolio, your ATS-ready PDF resume, and your
          GitHub README all update. Built for developers who ship.
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <Link href="/sign-up"
            className="rounded-xl bg-[#4DA6FF] px-8 py-3.5 font-semibold text-[#04101F] shadow-[0_8px_32px_rgba(77,166,255,0.35)] transition hover:bg-[#8FC4FF] hover:shadow-[0_8px_40px_rgba(77,166,255,0.5)]">
            Claim your username — free
          </Link>
          <Link href="/sign-in"
            className="rounded-xl border border-[#1E2C52] px-8 py-3.5 font-semibold transition hover:border-[#4DA6FF] hover:bg-[#0F1730]">
            Sign in
          </Link>
        </div>

        {/* terminal teaser */}
        <div className="mt-16 w-full max-w-2xl overflow-hidden rounded-2xl border border-[#1E2C52] bg-[#070C1A] text-left shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 border-b border-[#1E2C52] bg-[#0F1730] px-4 py-3">
            <i className="block h-3 w-3 rounded-full bg-[#FF5F57]" />
            <i className="block h-3 w-3 rounded-full bg-[#FFB454]" />
            <i className="block h-3 w-3 rounded-full bg-[#39D98A]" />
            <span className="ml-2 font-mono text-xs text-[#6B7A99]">visitor@you — portfolio</span>
          </div>
          <div className="space-y-1.5 p-5 font-mono text-[13px] leading-relaxed">
            <p><span className="text-[#39D98A]">visitor</span><span className="text-[#6B7A99]">@</span><span className="text-[#4DA6FF]">you</span><span className="text-[#6B7A99]">:~$</span> <span className="text-[#E8EDF7]">whoami</span></p>
            <p className="text-[#8B98B8]">full-stack developer · shipping real products</p>
            <p><span className="text-[#39D98A]">visitor</span><span className="text-[#6B7A99]">@</span><span className="text-[#4DA6FF]">you</span><span className="text-[#6B7A99]">:~$</span> <span className="text-[#E8EDF7]">resume</span></p>
            <p className="text-[#8B98B8]">📄 <span className="text-[#8FC4FF] underline">view resume</span> <span className="text-[#6B7A99]">|</span> ⬇ <span className="text-[#8FC4FF] underline">download PDF</span> <span className="text-[#6B7A99]">— always in sync</span></p>
            <p><span className="text-[#39D98A]">visitor</span><span className="text-[#6B7A99]">@</span><span className="text-[#4DA6FF]">you</span><span className="text-[#6B7A99]">:~$</span> <span className="inline-block h-3.5 w-2 animate-pulse bg-[#4DA6FF] align-middle" /></p>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        <p className="mb-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-[#6B7A99]">
          everything from one profile
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: "🖥️", title: "3 live templates", desc: "Minimal, an interactive CLI terminal, and glassmorphism. Switch anytime — same data." },
            { icon: "📄", title: "ATS resume PDF", desc: "A recruiter-ready resume rendered from the same profile. Edit once, both update." },
            { icon: "🐙", title: "GitHub README", desc: "One-click profile README with badges, projects, and stats. Paste and push." },
            { icon: "⚡", title: "GitHub import", desc: "Pull your repos in one click, pick your best, polish with AI." },
            { icon: "✨", title: "AI enhance & review", desc: "Rewrite weak bullets and get a rubric-scored readiness review with specific fixes." },
            { icon: "📊", title: "Analytics", desc: "Know when your page is viewed and your resume is downloaded." },
          ].map((f) => (
            <div key={f.title}
              className="rounded-2xl border border-[#1E2C52] bg-[#0F1730]/60 p-6 backdrop-blur transition hover:border-[#4DA6FF]/50 hover:bg-[#111A36]">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#8B98B8]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* pricing teaser */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="rounded-2xl border border-[#1E2C52] bg-gradient-to-b from-[#0F1730] to-[#0A0F1E] p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">Free to start. Pro from ₹149.</h2>
          <p className="mx-auto mt-3 max-w-md text-[#8B98B8]">
            Portfolio and profile are free forever. Go Pro for all templates, the AI review,
            unlimited everything, and your synced resume PDF.
          </p>
          <Link href="/sign-up"
            className="mt-7 inline-block rounded-xl bg-[#39D98A] px-8 py-3.5 font-semibold text-[#04101F] shadow-[0_8px_32px_rgba(57,217,138,0.3)] transition hover:shadow-[0_8px_40px_rgba(57,217,138,0.45)]">
            Start free →
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-[#1E2C52]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
          <span className="font-bold">Port<span className="text-[#4DA6FF]">xz</span></span>
          <p className="font-mono text-xs text-[#6B7A99]">
            © {new Date().getFullYear()} Portxz · one profile, always in sync
          </p>
        </div>
      </footer>
    </main>
  );
}