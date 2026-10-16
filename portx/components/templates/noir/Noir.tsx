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
  ScrollProgress,
  CountUp,
  Avatar3D,
} from "../tem_comps/Motion";
import {
  FloatingChips,
  FloatingNav,
  HeroBackdrop,
  ProjectCover,
  SocialRail,
  jumpTo,
  resumeHref,
  type NavItem,
} from "../tem_comps/Premium";
import { getInsights } from "../insights";

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

const focusRing =
  "outline-none focus-visible:ring-1 focus-visible:ring-[#D4B36A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]";

export function Noir({ data, username }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations, sections } = data;
  const { initials, current, stats, topTech, years } = getInsights(data);
  const resume = resumeHref(username);

  const nav: NavItem[] = [
    projects.length > 0 && { id: "work", label: "Work" },
    experiences.length > 0 && { id: "experience", label: "Experience" },
    skills.length > 0 && { id: "capabilities", label: "Capabilities" },
    (profile.email || links.length > 0) && { id: "contact", label: "Contact" },
  ].filter((x): x is NavItem => !!x);

  const chips = [
    current ? `${current.title}${current.organization ? ` · ${current.organization}` : ""}` : "",
    topTech.slice(0, 2).join(" · "),
    years > 0 ? `${years}+ years` : profile.location,
  ];

  return (
    <main
      id="top"
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

      <ScrollProgress color={`linear-gradient(90deg, #B8935A, ${GOLD_LT}, ${GOLD})`} height={1} />

      <FloatingNav
        brand={
          <span className="font-serif text-xl tracking-wide" style={{ color: GOLD }}>
            {profile.fullName.split(" ")[0]}
            <span style={{ color: DIM }}>.</span>
          </span>
        }
        items={nav}
        cta={resume ? { label: "Résumé ↓", href: resume } : null}
        tone={{
          bar: "rounded-sm border border-[#D4B36A]/15 bg-[#0B0B0D]/60 backdrop-blur-md",
          scrolled: "bg-[#0B0B0D]/85 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]",
          link: "text-[11px] uppercase tracking-[0.22em] text-[#8F8A7E] hover:text-[#F5E3B3]",
          linkActive: "text-[11px] uppercase tracking-[0.22em] text-[#F5E3B3]",
          pill: "rounded-sm border border-[#D4B36A]/30 bg-[#D4B36A]/[0.07]",
          cta: "rounded-sm border border-[#D4B36A]/50 text-[11px] uppercase tracking-[0.22em] text-[#D4B36A] hover:bg-[#D4B36A] hover:text-[#0B0B0D]",
          menu: "border-[#2A2820]",
        }}
      />

      <SocialRail
        links={links}
        email={profile.email}
        icon="text-[#8F8A7E] hover:text-[#D4B36A]"
        line="bg-gradient-to-b from-[#D4B36A]/60 to-transparent"
      />

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

      {/* HERO — full height, words left, medallion right */}
      <header className="relative z-10 flex min-h-[100svh] items-center overflow-hidden">
        <HeroBackdrop
          glow="rgba(212,179,106,0.07)"
          blobs={["rgba(212,179,106,0.09)", "rgba(140,98,40,0.12)"]}
          grid={GOLD}
          gridOpacity={0.045}
        />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:px-16 lg:py-0">
          <div className="text-center lg:text-left">
            {/* portrait first on small screens */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12 flex justify-center font-serif lg:hidden"
            >
              <Avatar3D src={profile.avatarUrl} name={profile.fullName} initials={initials} size={112}
                colors={[GOLD, GOLD_LT, "#B8935A"]} surface="#0E0E10" textColor={GOLD} glow={0.22} />
            </motion.div>

            {profile.openToWork && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="mb-8 inline-flex items-center gap-2.5 rounded-sm border border-[#D4B36A]/20 bg-[#D4B36A]/[0.04] px-4 py-1.5"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden" style={{ background: GOLD }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
                </span>
                <p className="text-[10px] font-medium uppercase tracking-[0.4em]" style={{ color: GOLD }}>
                  Available for select engagements
                </p>
              </motion.div>
            )}

            {profile.headline && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-xs font-medium uppercase tracking-[0.35em] sm:text-sm"
                style={{ color: DIM }}
              >
                {profile.headline}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-serif text-5xl font-normal leading-[1.02] tracking-tight sm:text-7xl lg:text-[5.5rem]"
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
              className="noir-anim mx-auto mt-8 h-px w-24 origin-center lg:mx-0 lg:origin-left"
              style={{
                background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD_LT}, ${GOLD}, transparent)`,
                backgroundSize: "200% auto",
                animation: "noirShimmer 5s linear infinite",
              }}
            />

            {current && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="mt-7 font-serif text-lg italic"
                style={{ color: BODY }}
              >
                presently {current.title}
                {current.organization && <span style={{ color: GOLD }}> · {current.organization}</span>}
                {profile.location && <span className="not-italic text-[10px] uppercase tracking-[0.3em]" style={{ color: DIM }}>  ·  {profile.location}</span>}
              </motion.p>
            )}

            {profile.summary && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.85 }}
                className="mx-auto mt-6 max-w-xl text-[15px] font-light leading-relaxed sm:text-base sm:leading-loose lg:mx-0"
                style={{ color: BODY }}
              >
                {profile.summary}
              </motion.p>
            )}

            {/* calls to action */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              {projects.length > 0 && (
                <Magnetic strength={0.25}>
                  <a href="#work" onClick={(e) => jumpTo(e, "work")}
                    className={`inline-flex items-center gap-2 rounded-sm px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0B0B0D] shadow-[0_10px_40px_-10px_rgba(212,179,106,0.55)] transition-all duration-500 hover:shadow-[0_10px_50px_-6px_rgba(212,179,106,0.75)] ${focusRing}`}
                    style={{ background: `linear-gradient(120deg, #B8935A, ${GOLD_LT} 55%, ${GOLD})` }}>
                    View the work →
                  </a>
                </Magnetic>
              )}
              {resume && (
                <Magnetic strength={0.25}>
                  <a href={resume}
                    className={`inline-flex items-center gap-2 rounded-sm border px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.3em] transition-all duration-500 hover:bg-[#D4B36A]/10 ${focusRing}`}
                    style={{ borderColor: `${GOLD}55`, color: GOLD }}>
                    Résumé ↓
                  </a>
                </Magnetic>
              )}
            </motion.div>

            {/* in figures — quiet gold numerals */}
            {stats.length > 1 && (
              <Stagger stagger={0.12} delay={1.1}
                className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-6 lg:justify-start">
                {stats.map((s) => (
                  <Item key={s.label} className="text-center lg:text-left">
                    <div className="font-serif text-3xl font-light sm:text-4xl">
                      <GradientText colors={GOLD_STOPS} duration={8}>
                        <CountUp value={s.value} suffix={s.suffix} duration={2} />
                      </GradientText>
                    </div>
                    <div className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.35em]" style={{ color: DIM }}>
                      {s.label}
                    </div>
                  </Item>
                ))}
              </Stagger>
            )}

            {/* links — the rail covers wide screens */}
            {links.length > 0 && (
              <nav aria-label="Links" className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[11px] font-medium uppercase tracking-[0.25em] lg:hidden">
                {links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                    className={`rounded-sm py-1 transition-colors hover:text-white ${focusRing}`} style={{ color: GOLD }}>
                    {l.label || l.kind}
                  </a>
                ))}
              </nav>
            )}
          </div>

          {/* gold medallion — portrait or monogram inside slow orbiting rings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden justify-center font-serif lg:flex"
          >
            <div className="relative">
              <Avatar3D src={profile.avatarUrl} name={profile.fullName} initials={initials} size={260}
                colors={[GOLD, GOLD_LT, "#B8935A"]} surface="#0E0E10" textColor={GOLD} glow={0.28} rings={3} />
              <FloatingChips chips={chips}
                chipClass="rounded-sm border border-[#D4B36A]/25 bg-[#0B0B0D]/80 font-sans text-[#F5E3B3] backdrop-blur-md" />
            </div>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
          <span className="text-[9px] uppercase tracking-[0.4em]" style={{ color: DIM }}>Scroll</span>
          <span className="noir-anim block h-10 w-px" style={{ background: `linear-gradient(${GOLD}, transparent)`, animation: "noirBreathe 3s ease-in-out infinite", opacity: 0.6 }} />
        </motion.div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20 sm:pb-28">
        {/* PROJECTS — the first is the feature, the rest pair up */}
        {projects.length > 0 && (
          <NoirSection id="work" eyebrow="Portfolio" title="Selected Work">
            <Stagger className="grid gap-8 md:grid-cols-2" stagger={0.1}>
              {projects.map((p, i) => {
                const lead = i === 0;
                return (
                  <Item key={p.name} as="article" className={lead ? "md:col-span-2" : ""}>
                    <Spotlight color={`${GOLD}14`} size={420} className="h-full rounded-sm">
                      <TiltCard
                        max={lead ? 2 : 4}
                        glareColor={`${GOLD}1F`}
                        className="group flex h-full flex-col overflow-hidden rounded-sm border border-[#1A1915] bg-[#0E0E10]/60 transition-colors duration-500 hover:border-[#D4B36A]/30"
                      >
                        <ProjectCover
                          name={p.name}
                          imageUrl={p.imageUrl}
                          palette={["rgba(212,179,106,0.30)", "rgba(140,98,40,0.35)", "rgba(245,227,179,0.12)"]}
                          base="#0E0E10"
                          ink="rgba(212,179,106,0.10)"
                          grid="rgba(212,179,106,0.05)"
                          overlay="linear-gradient(to top, rgba(11,11,13,0.95), rgba(11,11,13,0.35) 55%, transparent)"
                          className={lead ? "h-72 md:h-96" : "h-56"}
                        >
                          <div className="flex h-full flex-col justify-between p-6 sm:p-7">
                            <div className="flex items-start justify-between gap-3">
                              <span className="rounded-sm border border-[#D4B36A]/25 bg-[#0B0B0D]/60 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.3em] backdrop-blur" style={{ color: GOLD }}>
                                {p.featured || lead ? "Featured" : "Project"}
                              </span>
                              <span className="font-serif text-3xl font-light" style={{ color: GOLD, opacity: 0.55 }}>
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <div>
                              <h3 className={`font-serif font-normal text-white transition-colors duration-300 group-hover:text-[#F5E3B3] ${lead ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                                {p.name}
                              </h3>
                              {p.tech.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {p.tech.slice(0, lead ? 6 : 4).map((t) => (
                                    <span key={t} className="rounded-sm border border-white/10 bg-black/40 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-[#B8B3A6] backdrop-blur transition-colors group-hover:border-[#D4B36A]/35 group-hover:text-[#F5E3B3]">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </ProjectCover>

                        <div className="flex flex-1 flex-col p-6 sm:p-7">
                          {p.tagline && (
                            <p className="font-serif text-base italic leading-relaxed" style={{ color: INK }}>
                              {p.tagline}
                            </p>
                          )}
                          {p.bullets.length > 0 && (
                            <ul className="mt-3 space-y-1.5 text-sm font-light leading-relaxed" style={{ color: BODY }}>
                              {p.bullets.map((b, j) => (
                                <li key={j} className="relative pl-5">
                                  <span aria-hidden className="absolute left-0" style={{ color: GOLD, opacity: 0.7 }}>·</span>
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                          {(p.liveUrl || p.repoUrl) && (
                            <div className="mt-auto flex items-center gap-6 pt-6 text-[10px] font-medium uppercase tracking-[0.25em]">
                              {p.liveUrl && (
                                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                  className={`rounded-sm transition-all duration-300 hover:tracking-[0.35em] ${focusRing}`} style={{ color: GOLD }}>
                                  View live ↗
                                </a>
                              )}
                              {p.repoUrl && (
                                <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                                  className={`rounded-sm transition-colors duration-300 hover:text-[#EDEAE2] ${focusRing}`} style={{ color: DIM }}>
                                  Source ↗
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </TiltCard>
                    </Spotlight>
                  </Item>
                );
              })}
            </Stagger>
          </NoirSection>
        )}

        {/* EXPERIENCE — gold timeline */}
        {experiences.length > 0 && (
          <NoirSection id="experience" eyebrow="Career" title="Experience">
            <Stagger className="relative space-y-12 pl-8 sm:pl-10" stagger={0.09}>
              <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px" style={{ background: `linear-gradient(${GOLD}66, ${HAIR} 70%, transparent)` }} />
              {experiences.map((e, i) => (
                <Item key={i} className="group relative">
                  <span aria-hidden className="absolute -left-8 top-2 h-[11px] w-[11px] rotate-45 border bg-[#0B0B0D] transition-colors duration-500 group-hover:bg-[#D4B36A] sm:-left-10"
                    style={{ borderColor: GOLD }} />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-2xl font-normal transition-colors group-hover:text-[#F5E3B3]">
                      {e.title}{" "}
                      <span style={{ color: DIM }} className="font-light">— {e.organization}</span>
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: e.endDate ? DIM : GOLD }}>
                      {e.startDate ?? ""} — {e.endDate ?? "Present"}
                    </span>
                  </div>
                  {e.location && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.25em]" style={{ color: DIM }}>{e.location}</p>
                  )}
                  {e.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2.5 text-sm font-light leading-relaxed" style={{ color: BODY }}>
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

        {/* SKILLS — one quiet panel per discipline */}
        {skills.length > 0 && (
          <NoirSection id="capabilities" eyebrow="Expertise" title="Capabilities">
            <Stagger className="grid gap-5 sm:grid-cols-2" stagger={0.07}>
              {skills.map((s) => (
                <Item key={s.category}
                  className="group rounded-sm border border-[#1A1915] bg-[#0E0E10]/50 p-6 transition-colors duration-500 hover:border-[#D4B36A]/30">
                  <h3 className="font-serif text-lg font-normal transition-colors group-hover:text-[#F5E3B3]">{s.category}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.items.map((it) => (
                      <span key={it} className="rounded-sm border border-[#2A2820] px-2.5 py-1 text-[11px] font-light" style={{ color: BODY }}>
                        {it}
                      </span>
                    ))}
                  </div>
                </Item>
              ))}
            </Stagger>
          </NoirSection>
        )}

        {/* EDUCATION */}
        {educations.length > 0 && (
          <NoirSection eyebrow="Formation" title="Education">
            <Stagger className="space-y-4 text-sm font-light" stagger={0.07}>
              {educations.map((ed, i) => (
                <Item key={i} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#1A1915] pb-4">
                  <div>
                    <span className="font-serif text-lg font-normal" style={{ color: INK }}>{ed.institution}</span>
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

        {/* CUSTOM SECTIONS */}
        {sections.map((sec) => (
          <NoirSection key={sec.title} eyebrow="Distinctions" title={sec.title}>
            <Stagger className="grid gap-5 text-sm font-light sm:grid-cols-2" stagger={0.07}>
              {sec.items.map((it, i) => (
                <Item key={i} className="rounded-sm border border-[#1A1915] bg-[#0E0E10]/50 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    {it.url ? (
                      <a href={it.url} target="_blank" rel="noreferrer" className="font-serif text-base font-normal underline decoration-[#D4B36A]/40 underline-offset-4 transition-colors hover:decoration-[#D4B36A]" style={{ color: INK }}>
                        {it.title}
                      </a>
                    ) : (
                      <span className="font-serif text-base font-normal" style={{ color: INK }}>{it.title}</span>
                    )}
                    {it.date && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: DIM }}>{it.date}</span>
                    )}
                  </div>
                  {it.subtitle && <p className="mt-1" style={{ color: BODY }}>{it.subtitle}</p>}
                  {it.description && <p className="mt-1.5 leading-relaxed" style={{ color: DIM }}>{it.description}</p>}
                </Item>
              ))}
            </Stagger>
          </NoirSection>
        ))}

        {/* ENQUIRIES */}
        {(profile.email || links.length > 0) && (
          <Reveal as="section" className="mt-32" duration={1}>
            <div id="contact" className="relative overflow-hidden rounded-sm border border-[#D4B36A]/20 bg-[#0E0E10]/70 px-6 py-16 text-center sm:px-12 sm:py-20">
              <div aria-hidden className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(600px circle at 50% 0%, ${GOLD}1A, transparent 60%)` }} />
              <div className="relative">
                <p className="text-[10px] font-medium uppercase tracking-[0.4em]" style={{ color: GOLD }}>
                  {profile.openToWork ? "Available for select engagements" : "Enquiries"}
                </p>
                <h2 className="mt-6 font-serif text-4xl font-normal leading-tight sm:text-6xl">
                  <GradientText colors={GOLD_STOPS} duration={7}>
                    Shall we begin?
                  </GradientText>
                </h2>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  {profile.email && (
                    <Magnetic strength={0.3}>
                      <a
                        href={`mailto:${profile.email}`}
                        className={`inline-block rounded-sm border px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.3em] transition-all duration-500 hover:bg-[#D4B36A] hover:text-[#0B0B0D] hover:shadow-[0_0_40px_rgba(212,179,106,0.25)] ${focusRing}`}
                        style={{ borderColor: `${GOLD}66`, color: GOLD }}
                      >
                        {profile.email}
                      </a>
                    </Magnetic>
                  )}
                  {resume && (
                    <a href={resume} className={`rounded-sm px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.3em] transition-colors hover:text-[#F5E3B3] ${focusRing}`} style={{ color: DIM }}>
                      Résumé ↓
                    </a>
                  )}
                </div>
                {links.length > 0 && (
                  <div className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[10px] font-medium uppercase tracking-[0.25em]">
                    {links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                        className={`rounded-sm transition-colors hover:text-[#F5E3B3] ${focusRing}`} style={{ color: DIM }}>
                        {l.label || l.kind}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* FOOTER */}
        <Reveal as="footer" className="mt-24 text-center" duration={0.9}>
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
            © {profile.fullName} · built with Portxz
          </p>
        </Reveal>
      </div>
    </main>
  );
}

function NoirSection({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-28 first:mt-12">
      <Reveal y={16} duration={0.8} className="mb-12 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.4em]" style={{ color: DIM }}>{eyebrow}</p>
        <h2 className="mt-4 font-serif text-4xl font-normal sm:text-5xl">
          <GradientText colors={GOLD_STOPS} duration={8}>{title}</GradientText>
        </h2>
        <div aria-hidden className="mx-auto mt-6 h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
      </Reveal>
      {children}
    </section>
  );
}
