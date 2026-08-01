"use client";
import { motion } from "framer-motion";
import type { TemplateProps } from "../types";
import {
  Reveal,
  Stagger,
  Item,
  TiltCard,
  Magnetic,
  GradientText,
  Spotlight,
} from "../tem_comps/Motion";

/* ── Noir template · premium edition ────────────────────────────────────
   Dark luxury, cinematic: black/charcoal with champagne-gold accents.
   Film-grain + vignette, a breathing candle glow, gold hairlines, a
   shimmering serif name, and unhurried reveals orchestrated through the
   shared Portxz motion toolkit. Restraint over clutter — expensive things
   don't shout. Every decorative layer is deterministic (SSR-stable) and
   reduced-motion aware.                                                  */

const GOLD = "#D4B36A";
const GOLD_LT = "#F5E3B3";
const INK = "#EDEAE2";
const DIM = "#8F8A7E";
const BODY = "#B8B3A6";
const HAIR = "#2A2820";

/* champagne shimmer stops for GradientText */
const GOLD_STOPS = ["#B8935A", "#E8CE8F", GOLD_LT, GOLD, "#B8935A"];

/* deterministic golden-ratio spread for faint gold dust (no RNG at render) */
const PHI = 0.6180339887;
const DUST = Array.from({ length: 7 }, (_, i) => ({
  left: `${((i * PHI * 100) % 100).toFixed(2)}%`,
  top: `${((i * PHI * 260) % 100).toFixed(2)}%`,
  size: 1 + (i % 3),
  delay: `${(i * 0.9).toFixed(2)}s`,
}));

const slow = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

export function Noir({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-[#0B0B0D] font-sans text-[#EDEAE2] antialiased selection:bg-[#D4B36A]/20 selection:text-[#D4B36A]"
      data-fixed-theme
    >
      <style>{`
        @keyframes noirBreathe { 0%,100%{opacity:0.03} 50%{opacity:0.08} }
        @keyframes noirShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes noirGrain { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-2%,1%)} 50%{transform:translate(1%,-2%)} 75%{transform:translate(-1%,2%)} }
        @keyframes noirDust { 0%,100%{opacity:0.15; transform:translateY(0)} 50%{opacity:0.5; transform:translateY(-6px)} }
        @media (prefers-reduced-motion: reduce) { .noir-anim { animation: none !important; } }
      `}</style>

      {/* breathing candle-glow */}
      <div
        aria-hidden
        className="noir-anim pointer-events-none absolute left-1/2 top-0 h-[620px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4B36A] via-transparent to-transparent"
        style={{ animation: "noirBreathe 9s ease-in-out infinite", opacity: 0.04 }}
      />

      {/* faint gold dust — deterministic golden-ratio spread */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {DUST.map((d, i) => (
          <span
            key={i}
            className="noir-anim absolute rounded-full"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              background: GOLD,
              boxShadow: `0 0 6px ${GOLD}`,
              opacity: 0.25,
              animation: `noirDust ${7 + (i % 4)}s ease-in-out infinite`,
              animationDelay: d.delay,
            }}
          />
        ))}
      </div>

      {/* film grain */}
      <div
        aria-hidden
        className="noir-anim pointer-events-none fixed inset-[-10%] z-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          animation: "noirGrain 8s steps(4) infinite",
        }}
      />

      {/* cinematic vignette — darkens the edges of the frame */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* fine gold frame hairline */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-3 z-20 rounded-[2px] sm:inset-5"
        style={{ border: `1px solid ${GOLD}14` }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 sm:py-28">
        {/* HERO */}
        <header className="text-center">
          {profile.openToWork && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2"
            >
              <span className="h-1 w-1 animate-pulse rounded-full" style={{ background: GOLD }} />
              <p className="text-[10px] font-medium uppercase tracking-[0.4em]" style={{ color: GOLD }}>
                Available for select engagements
              </p>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl font-normal leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl"
          >
            <GradientText colors={GOLD_STOPS} duration={7}>
              {profile.fullName}
            </GradientText>
          </motion.h1>

          {/* shimmering hairline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="noir-anim mx-auto mt-8 h-px w-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD_LT}, ${GOLD}, transparent)`,
              backgroundSize: "200% auto",
              animation: "noirShimmer 5s linear infinite",
            }}
          />

          {profile.headline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-8 text-xs font-medium uppercase tracking-[0.35em] sm:text-sm"
              style={{ color: DIM }}
            >
              {profile.headline}
            </motion.p>
          )}

          {(profile.location || profile.email) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.78 }}
              className="mt-3 text-[10px] font-medium uppercase tracking-[0.3em]"
              style={{ color: DIM }}
            >
              {profile.location}
            </motion.p>
          )}

          {profile.summary && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.85 }}
              className="mx-auto mt-8 max-w-xl text-[15px] font-light leading-relaxed sm:text-base sm:leading-loose"
              style={{ color: BODY }}
            >
              {profile.summary}
            </motion.p>
          )}

          {(links.length > 0 || profile.email) && (
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3.5 text-xs font-medium uppercase tracking-[0.25em]"
            >
              {links.map((l) => (
                <Magnetic key={l.url} strength={0.3}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative rounded-sm py-1 outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#D4B36A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
                    style={{ color: GOLD }}
                  >
                    <span>{l.label || l.kind}</span>
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-500 group-hover:w-full"
                      style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LT})`, boxShadow: `0 0 8px ${GOLD}66` }}
                    />
                  </a>
                </Magnetic>
              ))}
              {profile.email && (
                <Magnetic strength={0.3}>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group relative rounded-sm py-1 outline-none transition-colors duration-300 hover:text-white focus-visible:ring-1 focus-visible:ring-[#D4B36A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
                    style={{ color: GOLD }}
                  >
                    <span>Email</span>
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-500 group-hover:w-full"
                      style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LT})`, boxShadow: `0 0 8px ${GOLD}66` }}
                    />
                  </a>
                </Magnetic>
              )}
            </motion.nav>
          )}
        </header>

        {/* PROJECTS */}
        {projects.length > 0 && (
          <NoirSection title="Selected Work">
            <Stagger className="space-y-8" stagger={0.1}>
              {projects.map((p, i) => (
                <Item key={p.name} as="article">
                  <Spotlight color={`${GOLD}14`} size={420} className="rounded-sm">
                    <TiltCard
                      max={4}
                      glareColor={`${GOLD}1F`}
                      className="group rounded-sm border border-[#1A1915] bg-[#0E0E10]/40 p-6 transition-colors duration-500 hover:border-[#2A2820] sm:p-8"
                    >
                      <div className="flex items-baseline gap-5 sm:gap-7">
                        <span
                          className="font-serif text-2xl font-light transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-90 sm:text-3xl"
                          style={{ color: GOLD, opacity: 0.45 }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="font-serif text-2xl font-normal transition-colors duration-300 group-hover:text-white">
                              {p.name}
                            </h3>
                            <div className="flex items-center gap-5 text-[10px] font-medium uppercase tracking-[0.25em]">
                              {p.liveUrl && (
                                <a
                                  href={p.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-sm outline-none transition-all duration-300 hover:tracking-[0.35em] hover:opacity-100 focus-visible:ring-1 focus-visible:ring-[#D4B36A]/70"
                                  style={{ color: GOLD, opacity: 0.85 }}
                                >
                                  View ↗
                                </a>
                              )}
                              {p.repoUrl && (
                                <a
                                  href={p.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-sm outline-none transition-opacity duration-300 hover:opacity-100 focus-visible:ring-1 focus-visible:ring-[#D4B36A]/70"
                                  style={{ color: DIM, opacity: 0.8 }}
                                >
                                  Source ↗
                                </a>
                              )}
                            </div>
                          </div>

                          {p.tagline && (
                            <p className="text-sm font-light leading-relaxed" style={{ color: BODY }}>
                              {p.tagline}
                            </p>
                          )}

                          {p.bullets.length > 0 && (
                            <ul className="space-y-1.5 pt-1 text-sm font-light leading-relaxed" style={{ color: BODY }}>
                              {p.bullets.map((b, j) => (
                                <li key={j} className="relative pl-5">
                                  <span aria-hidden className="absolute left-0" style={{ color: GOLD, opacity: 0.7 }}>·</span>
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}

                          {p.tech.length > 0 && (
                            <p className="pt-1 text-[10px] font-medium uppercase tracking-[0.25em]" style={{ color: DIM }}>
                              {p.tech.join("  ·  ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </Spotlight>
                </Item>
              ))}
            </Stagger>
          </NoirSection>
        )}

        {/* EXPERIENCE */}
        {experiences.length > 0 && (
          <NoirSection title="Experience">
            <Stagger className="space-y-10" stagger={0.09}>
              {experiences.map((e, i) => (
                <Item key={i} className="group space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl font-normal">
                      {e.title}{" "}
                      <span style={{ color: DIM }} className="font-light">— {e.organization}</span>
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: DIM }}>
                      {e.startDate ?? ""} — {e.endDate ?? "Present"}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="mt-3 space-y-2.5 text-sm font-light leading-relaxed" style={{ color: BODY }}>
                      {e.bullets.map((b, j) => (
                        <li key={j} className="relative pl-5">
                          <span aria-hidden className="absolute left-0" style={{ color: GOLD, opacity: 0.7 }}>·</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </Item>
              ))}
            </Stagger>
          </NoirSection>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <NoirSection title="Capabilities">
            <Stagger className="space-y-5" stagger={0.07}>
              {skills.map((s) => (
                <Item
                  key={s.category}
                  className="flex flex-col gap-1 text-sm font-light sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <span className="min-w-[140px] shrink-0 text-[10px] font-medium uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                    {s.category}
                  </span>
                  <span className="leading-relaxed" style={{ color: BODY }}>
                    {s.items.join(", ")}
                  </span>
                </Item>
              ))}
            </Stagger>
          </NoirSection>
        )}

        {/* EDUCATION */}
        {educations.length > 0 && (
          <NoirSection title="Education">
            <Stagger className="space-y-4 text-sm font-light" stagger={0.07}>
              {educations.map((ed, i) => (
                <Item key={i} className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-serif text-base font-normal" style={{ color: INK }}>{ed.institution}</span>
                    {ed.degree && <span className="ml-2" style={{ color: BODY }}>— {ed.degree}</span>}
                    {ed.score && <span className="ml-2" style={{ color: DIM }}>· {ed.score}</span>}
                  </div>
                  {ed.endYear && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: DIM }}>
                      {ed.startYear ? `${ed.startYear}–` : ""}{ed.endYear}
                    </span>
                  )}
                </Item>
              ))}
            </Stagger>
          </NoirSection>
        )}

        {/* FOOTER */}
        <Reveal as="footer" className="mt-28 text-center" duration={0.9}>
          <div
            aria-hidden
            className="noir-anim mx-auto mb-6 h-px w-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD_LT}, ${GOLD}, transparent)`,
              backgroundSize: "200% auto",
              animation: "noirShimmer 5s linear infinite",
              opacity: 0.4,
            }}
          />
          <p className="text-[10px] font-medium uppercase tracking-[0.4em]" style={{ color: DIM }}>
            built with Portxz
          </p>
        </Reveal>
      </div>
    </main>
  );
}

function NoirSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-24">
      <Reveal y={0} duration={0.8} className="mb-10 flex items-center gap-6">
        <h2 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.4em]" style={{ color: GOLD }}>
          {title}
        </h2>
        <div aria-hidden className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${HAIR}, transparent)` }} />
      </Reveal>
      {children}
    </section>
  );
}
