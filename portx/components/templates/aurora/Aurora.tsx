"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import type { TemplateProps } from "../types";

/* ── Aurora template · premium edition ──────────────────────────────────
   Living aurora washes (CSS keyframes), starfield depth, gradient-shimmer
   name, staggered section reveals, 3D-tilt project cards, glow hovers.  */

const card =
  "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm";

/* deterministic starfield — fixed positions so SSR/client always match */
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: ((i * 137.508) % 100),                  // golden-angle spread
  y: ((i * 61.803) % 100),
  s: 1 + (i % 3),                            // 1–3px
  d: 2 + ((i * 7) % 5),                      // twinkle duration 2–6s
  o: 0.25 + ((i * 13) % 40) / 100,           // base opacity
}));

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setT({
          x: ((e.clientY - r.top) / r.height - 0.5) * -6,
          y: ((e.clientX - r.left) / r.width - 0.5) * 6,
        });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      style={{ transform: `perspective(900px) rotateX(${t.x}deg) rotateY(${t.y}deg)` }}
      className={`transition-transform duration-200 ease-out ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function Aurora({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#070912] font-sans text-[#E9EDF7]"
      data-fixed-theme
    >
      <style>{`
        @keyframes aurora1 { 0%,100%{transform:rotate(12deg) translate(0,0) scale(1)} 50%{transform:rotate(18deg) translate(60px,40px) scale(1.15)} }
        @keyframes aurora2 { 0%,100%{transform:rotate(-12deg) translate(0,0) scale(1)} 50%{transform:rotate(-20deg) translate(-50px,30px) scale(1.1)} }
        @keyframes aurora3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-50px) scale(1.2)} }
        @keyframes twinkle { 0%,100%{opacity:var(--o)} 50%{opacity:0.05} }
        @keyframes shimmer { to { background-position: 200% center } }
        @media (prefers-reduced-motion: reduce) {
          .aur-anim { animation: none !important; }
        }
      `}</style>

      {/* aurora washes — now alive */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="aur-anim absolute -top-40 left-[10%] h-[500px] w-[700px] rounded-full bg-[#22D3EE]/20 blur-[140px]"
          style={{ animation: "aurora1 16s ease-in-out infinite" }} />
        <div className="aur-anim absolute top-40 right-[5%] h-[450px] w-[550px] rounded-full bg-[#8B5CF6]/20 blur-[140px]"
          style={{ animation: "aurora2 20s ease-in-out infinite" }} />
        <div className="aur-anim absolute top-[55%] left-[20%] h-[400px] w-[600px] rounded-full bg-[#EC4899]/12 blur-[150px]"
          style={{ animation: "aurora3 24s ease-in-out infinite" }} />
      </div>

      {/* starfield depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="aur-anim absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              // @ts-expect-error css var
              "--o": s.o,
              opacity: s.o,
              animation: `twinkle ${s.d}s ease-in-out infinite`,
              animationDelay: `${(i % 10) * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* hero */}
        <header>
          {profile.openToWork && (
            <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-4 py-1.5 text-xs font-medium text-[#67E8F9] shadow-[0_0_24px_rgba(34,211,238,0.15)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#67E8F9]" /> open to work
            </motion.span>
          )}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            <span
              className="aur-anim bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] via-50% to-[#F472B6] bg-clip-text text-transparent"
              style={{ backgroundSize: "200% auto", animation: "shimmer 6s linear infinite" }}>
              {profile.fullName}
            </span>
          </motion.h1>
          {profile.headline && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-4 text-xl text-[#9BA6C6]">{profile.headline}</motion.p>
          )}
          {profile.summary && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#8B96B5]">{profile.summary}</motion.p>
          )}
          {(links.length > 0 || profile.email) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 flex flex-wrap gap-3">
              {links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-[#C7CFE5] transition hover:-translate-y-0.5 hover:border-[#67E8F9]/50 hover:text-[#67E8F9] hover:shadow-[0_0_20px_rgba(103,232,249,0.2)]">
                  {l.label}
                </a>
              ))}
              {profile.email && (
                <a href={`mailto:${profile.email}`}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-[#C7CFE5] transition hover:-translate-y-0.5 hover:border-[#F472B6]/50 hover:text-[#F472B6] hover:shadow-[0_0_20px_rgba(244,114,182,0.2)]">
                  Email
                </a>
              )}
            </motion.div>
          )}
        </header>

        {/* projects */}
        {projects.length > 0 && (
          <AuroraSection title="Projects" glow="#67E8F9">
            <div className="space-y-4">
              {projects.map((p, i) => (
                <motion.div key={p.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
                  <TiltCard
                    className={`${card} group relative overflow-hidden transition hover:border-[#67E8F9]/30 hover:shadow-[0_12px_48px_rgba(34,211,238,0.12)]`}>
                    {/* corner glow on hover */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#22D3EE]/0 blur-3xl transition duration-500 group-hover:bg-[#22D3EE]/15" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold">{p.name}</h3>
                      <div className="flex gap-4 text-xs font-medium">
                        {p.liveUrl && <a className="text-[#67E8F9] hover:underline" href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live ↗</a>}
                        {p.repoUrl && <a className="text-[#9BA6C6] hover:text-[#67E8F9]" href={p.repoUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>}
                      </div>
                    </div>
                    {p.tagline && <p className="mt-1.5 text-sm text-[#8B96B5]">{p.tagline}</p>}
                    {p.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[#8B96B5]">
                        {p.bullets.map((b, j) => (
                          <li key={j} className="relative pl-4">
                            <span className="absolute left-0 text-[#67E8F9]">·</span>{b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {p.tech.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.tech.map((t) => (
                          <span key={t} className="rounded-full bg-gradient-to-r from-[#22D3EE]/10 to-[#8B5CF6]/10 px-2.5 py-0.5 text-[11px] text-[#A5B0D0]">{t}</span>
                        ))}
                      </div>
                    )}
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </AuroraSection>
        )}

        {/* experience */}
        {experiences.length > 0 && (
          <AuroraSection title="Experience" glow="#A78BFA">
            <div className="relative space-y-4 pl-6">
              {/* timeline spine */}
              <div className="absolute bottom-4 left-1.5 top-2 w-px bg-gradient-to-b from-[#A78BFA]/60 via-[#A78BFA]/20 to-transparent" />
              {experiences.map((e, i) => (
                <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="relative">
                  <span className="absolute -left-6 top-7 h-3 w-3 rounded-full border-2 border-[#A78BFA] bg-[#070912] shadow-[0_0_12px_rgba(167,139,250,0.6)]" />
                  <div className={`${card} transition hover:border-[#A78BFA]/30`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold">
                        {e.title} <span className="text-[#A78BFA]">@ {e.organization}</span>
                      </h3>
                      <span className="text-xs text-[#6B7694]">{e.startDate ?? ""} – {e.endDate ?? "Present"}</span>
                    </div>
                    {e.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[#8B96B5]">
                        {e.bullets.map((b, j) => (
                          <li key={j} className="relative pl-4">
                            <span className="absolute left-0 text-[#A78BFA]">·</span>{b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </AuroraSection>
        )}

        {/* skills */}
        {skills.length > 0 && (
          <AuroraSection title="Skills" glow="#F472B6">
            <motion.div {...fadeUp} className={card}>
              <div className="space-y-4">
                {skills.map((s) => (
                  <div key={s.category}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#F472B6]">{s.category}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.items.map((i) => (
                        <span key={i}
                          className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-[#C7CFE5] transition hover:-translate-y-0.5 hover:border-[#F472B6]/50 hover:text-[#F472B6] hover:shadow-[0_0_16px_rgba(244,114,182,0.2)]">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AuroraSection>
        )}

        {/* education */}
        {educations.length > 0 && (
          <AuroraSection title="Education" glow="#67E8F9">
            <motion.div {...fadeUp} className={`${card} space-y-2 text-sm text-[#8B96B5]`}>
              {educations.map((ed, i) => (
                <p key={i}>
                  <span className="font-semibold text-[#E9EDF7]">{ed.institution}</span>
                  {ed.degree && ` — ${ed.degree}`}
                  {ed.endYear && ` (${ed.startYear ? `${ed.startYear}–` : ""}${ed.endYear})`}
                  {ed.score && ` · ${ed.score}`}
                </p>
              ))}
            </motion.div>
          </AuroraSection>
        )}

        <footer className="mt-20 text-center text-xs text-[#6B7694]">built with Portxz</footer>
      </div>
    </main>
  );
}

function AuroraSection({ title, glow, children }: { title: string; glow: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <motion.h2
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-5 text-sm font-bold uppercase tracking-[0.25em]"
        style={{ color: glow, textShadow: `0 0 24px ${glow}55` }}>
        {title}
      </motion.h2>
      {children}
    </section>
  );
}