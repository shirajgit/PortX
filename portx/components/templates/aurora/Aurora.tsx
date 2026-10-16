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
  Marquee,
  ScrollProgress,
  CountUp,
  Parallax,
  Avatar3D,
} from "../tem_comps/Motion";
import {
  FloatingChips,
  FloatingNav,
  HeroBackdrop,
  ProjectCover,
  SocialRail,
  StatusPill,
  jumpTo,
  resumeHref,
  type NavItem,
} from "../tem_comps/Premium";
import { getInsights } from "../insights";

/* ── Aurora template · premium edition ──────────────────────────────────
   Living aurora washes (CSS keyframes) + deterministic starfield depth,
   gradient-shimmer name, orchestrated reveals, cursor-spotlit tilt cards,
   magnetic link pills, and a drifting skills marquee. Built on the shared
   Portxz motion toolkit so it stays cohesive across templates.
   All decorative geometry is deterministic (golden-angle spread) so SSR
   and client hydration always match; every custom @keyframes respects
   prefers-reduced-motion.                                                */

const card =
  "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm";

const AURORA = ["#67E8F9", "#A78BFA", "#F472B6", "#67E8F9"];
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]/60";

/* deterministic starfield — fixed positions so SSR/client always match */
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 137.508) % 100, // golden-angle spread
  y: (i * 61.803) % 100,
  s: 1 + (i % 3), // 1–3px
  d: 2 + ((i * 7) % 5), // twinkle duration 2–6s
  o: 0.25 + ((i * 13) % 40) / 100, // base opacity
}));

export function Aurora({ data, username }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations, sections } = data;

  /* flatten skills for the drifting marquee strip (deterministic order) */
  const skillStrip = skills.flatMap((s) => s.items);
  const { initials, current, stats, topTech, years } = getInsights(data);
  const resume = resumeHref(username);

  const nav: NavItem[] = [
    projects.length > 0 && { id: "projects", label: "Projects" },
    experiences.length > 0 && { id: "experience", label: "Experience" },
    skills.length > 0 && { id: "skills", label: "Skills" },
    (profile.email || links.length > 0) && { id: "contact", label: "Contact" },
  ].filter((x): x is NavItem => !!x);

  const chips = [
    topTech.slice(0, 2).join(" · "),
    current?.organization ? `@ ${current.organization}` : profile.location,
    years > 0 ? `${years}+ years shipping` : "",
  ];

  return (
    <main
      id="top"
      className="relative min-h-screen overflow-hidden bg-[#070912] font-sans text-[#E9EDF7]"
      data-fixed-theme
    >
      <ScrollProgress />
      <style>{`
        @keyframes aur-wash1 { 0%,100%{transform:rotate(12deg) translate(0,0) scale(1)} 50%{transform:rotate(18deg) translate(60px,40px) scale(1.15)} }
        @keyframes aur-wash2 { 0%,100%{transform:rotate(-12deg) translate(0,0) scale(1)} 50%{transform:rotate(-20deg) translate(-50px,30px) scale(1.1)} }
        @keyframes aur-wash3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-50px) scale(1.2)} }
        @keyframes aur-twinkle { 0%,100%{opacity:var(--o)} 50%{opacity:0.05} }
        @media (prefers-reduced-motion: reduce) {
          .aur-anim { animation: none !important; }
        }
      `}</style>

      <FloatingNav
        brand={
          <span className="text-lg font-bold tracking-tight">
            <GradientText colors={AURORA}>{profile.fullName.split(" ")[0]}</GradientText>
            <span className="text-white/30">.</span>
          </span>
        }
        items={nav}
        cta={resume ? { label: "Resume ↓", href: resume } : null}
        tone={{
          bar: "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
          scrolled: "bg-[#070912]/75 shadow-[0_12px_40px_-12px_rgba(139,92,246,0.35)]",
          link: "rounded-xl font-medium text-[#9BA6C6] hover:text-[#E9EDF7]",
          linkActive: "rounded-xl font-medium text-[#E9EDF7]",
          pill: "rounded-xl border border-[#67E8F9]/25 bg-gradient-to-r from-[#22D3EE]/10 via-[#8B5CF6]/10 to-[#EC4899]/10",
          cta: "rounded-xl bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_24px_rgba(139,92,246,0.4)] hover:shadow-[0_0_36px_rgba(236,72,153,0.5)]",
          menu: "border-white/10",
        }}
      />

      <SocialRail
        links={links}
        email={profile.email}
        icon="text-[#8B96B5] hover:text-[#67E8F9] hover:drop-shadow-[0_0_8px_rgba(103,232,249,0.6)]"
        line="bg-gradient-to-b from-[#A78BFA]/60 to-transparent"
      />

      {/* aurora washes — living gradient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="aur-anim absolute -top-40 left-[10%] h-[500px] w-[700px] rounded-full bg-[#22D3EE]/20 blur-[140px]"
          style={{ animation: "aur-wash1 16s ease-in-out infinite" }}
        />
        <div
          className="aur-anim absolute top-40 right-[5%] h-[450px] w-[550px] rounded-full bg-[#8B5CF6]/20 blur-[140px]"
          style={{ animation: "aur-wash2 20s ease-in-out infinite" }}
        />
        <div
          className="aur-anim absolute top-[55%] left-[20%] h-[400px] w-[600px] rounded-full bg-[#EC4899]/12 blur-[150px]"
          style={{ animation: "aur-wash3 24s ease-in-out infinite" }}
        />
        {/* legibility scrim so text stays crisp over the glow */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,rgba(7,9,18,0.55)_100%)]" />
      </div>

      {/* starfield depth — drifts slower than the page for parallax */}
      <Parallax offset={140} className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="aur-anim absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              // @ts-expect-error css custom property
              "--o": s.o,
              opacity: s.o,
              animation: `aur-twinkle ${s.d}s ease-in-out infinite`,
              animationDelay: `${(i % 10) * 0.4}s`,
            }}
          />
        ))}
      </Parallax>

      {/* HERO — full height, words left, planet right */}
      <header className="relative flex min-h-[100svh] items-center">
        <HeroBackdrop
          glow="rgba(103,232,249,0.07)"
          grid="#A5B4FC"
          gridOpacity={0.05}
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pb-20 pt-32 lg:grid-cols-[1.2fr_1fr] lg:px-16 lg:py-0">
          <Stagger stagger={0.1} className="min-w-0 text-center lg:text-left">
            <Item className="mb-10 flex justify-center lg:hidden">
              <Avatar3D src={profile.avatarUrl} name={profile.fullName} initials={initials} size={120} rings={3}
                colors={["#67E8F9", "#A78BFA", "#F472B6"]} surface="linear-gradient(135deg,#0E1630,#1B1140)" glow={0.55} />
            </Item>
            {profile.openToWork && (
              <Item>
                <StatusPill dot="bg-[#67E8F9]"
                  className="border border-[#22D3EE]/30 bg-[#22D3EE]/10 font-medium text-[#67E8F9] shadow-[0_0_24px_rgba(34,211,238,0.15)] backdrop-blur">
                  Open to work{profile.location ? ` · ${profile.location}` : ""}
                </StatusPill>
              </Item>
            )}
            {profile.headline && (
              <Item>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#8B96B5]">{profile.headline}</p>
              </Item>
            )}
            <Item>
              <h1 className="mt-4 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
                <GradientText colors={AURORA}>{profile.fullName}</GradientText>
              </h1>
            </Item>
            {current && (
              <Item>
                <p className="mt-5 text-lg text-[#9BA6C6]">
                  Currently <span className="font-semibold text-[#E9EDF7]">{current.title}</span>
                  {current.organization && <span className="text-[#A78BFA]"> @ {current.organization}</span>}
                </p>
              </Item>
            )}
            {profile.summary && (
              <Item>
                <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#8B96B5] lg:mx-0">
                  {profile.summary}
                </p>
              </Item>
            )}
            <Item>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {projects.length > 0 && (
                  <Magnetic as="span" strength={0.3}>
                    <a href="#projects" onClick={(e) => jumpTo(e, "projects")}
                      className={`block rounded-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#EC4899] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.45)] transition hover:shadow-[0_0_60px_rgba(236,72,153,0.55)] ${ring}`}>
                      View my work →
                    </a>
                  </Magnetic>
                )}
                {resume && (
                  <Magnetic as="span" strength={0.3}>
                    <a href={resume}
                      className={`block rounded-full border border-white/15 bg-white/[0.05] px-7 py-3 text-sm font-semibold text-[#E9EDF7] backdrop-blur transition hover:border-[#67E8F9]/50 hover:text-[#67E8F9] ${ring}`}>
                      Download resume ↓
                    </a>
                  </Magnetic>
                )}
              </div>
            </Item>
            {/* small screens: links (the rail covers wide ones) */}
            {(links.length > 0 || profile.email) && (
              <Item>
                <div className="mt-7 flex flex-wrap justify-center gap-2 lg:hidden">
                  {links.map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                      className={`rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-[#C7CFE5] transition hover:border-[#67E8F9]/50 hover:text-[#67E8F9] ${ring}`}>
                      {l.label}
                    </a>
                  ))}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`}
                      className={`rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-[#C7CFE5] transition hover:border-[#F472B6]/50 hover:text-[#F472B6] ${ring}`}>
                      Email
                    </a>
                  )}
                </div>
              </Item>
            )}
          </Stagger>

          {/* a small planet: portrait inside three orbiting rings */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden justify-center lg:flex"
          >
            <div className="relative">
              <Avatar3D src={profile.avatarUrl} name={profile.fullName} initials={initials} size={250} rings={3}
                colors={["#67E8F9", "#A78BFA", "#F472B6"]} surface="linear-gradient(135deg,#0E1630,#1B1140)" glow={0.6} />
              <FloatingChips chips={chips}
                chipClass="border border-white/15 bg-[#0B1022]/70 text-[#C7CFE5] backdrop-blur-md" />
            </div>
          </motion.div>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-6 pb-16 sm:pb-24 lg:px-16">
        {/* at a glance */}
        {stats.length > 1 && (
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-4" stagger={0.08}>
            {stats.map((s, i) => {
              const glow = AURORA[i % 4];
              return (
                <Item key={s.label}>
                  <TiltCard max={10} glareColor={`${glow}26`} className="rounded-2xl">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-6 text-center backdrop-blur-sm [transform-style:preserve-3d]">
                      <div
                        className="text-4xl font-bold tracking-tight [transform:translateZ(26px)]"
                        style={{ color: glow, textShadow: `0 0 28px ${glow}66` }}
                      >
                        <CountUp value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7694] [transform:translateZ(12px)]">
                        {s.label}
                      </div>
                    </div>
                  </TiltCard>
                </Item>
              );
            })}
          </Stagger>
        )}

        {/* projects — the first leads, the rest pair up */}
        {projects.length > 0 && (
          <AuroraSection id="projects" eyebrow="Portfolio" title="Featured projects" glow="#67E8F9">
            <Stagger className="grid gap-6 md:grid-cols-2" stagger={0.09}>
              {projects.map((p, i) => {
                const lead = i === 0;
                return (
                  <Item key={p.name} as="article" className={lead ? "md:col-span-2" : ""}>
                    <TiltCard max={lead ? 3 : 6} glareColor="rgba(103,232,249,0.12)" className="h-full rounded-3xl">
                      <div className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-white/[0.03] backdrop-blur-xl transition duration-500 hover:shadow-[0_20px_60px_-15px_rgba(34,211,238,0.3)] ${lead ? "border-[#67E8F9]/25 ring-1 ring-[#67E8F9]/15" : "border-white/[0.08] hover:border-[#67E8F9]/30"}`}>
                        <ProjectCover
                          name={p.name}
                          imageUrl={p.imageUrl}
                          palette={["rgba(34,211,238,0.45)", "rgba(139,92,246,0.5)", "rgba(236,72,153,0.35)"]}
                          base="#0B1022"
                          ink="rgba(255,255,255,0.07)"
                          overlay="linear-gradient(to top, rgba(7,9,18,0.92), rgba(7,9,18,0.3) 55%, transparent)"
                          className={lead ? "h-72 md:h-96" : "h-56"}
                        >
                          <div className="flex h-full flex-col justify-between p-6">
                            <span className="self-start rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-[#C7CFE5] backdrop-blur">
                              {p.featured || lead ? "★ Featured" : `Project ${String(i + 1).padStart(2, "0")}`}
                            </span>
                            <div>
                              <h3 className={`font-bold tracking-tight text-[#F5F7FF] transition group-hover:text-[#67E8F9] ${lead ? "text-3xl" : "text-2xl"}`}>
                                {p.name}
                              </h3>
                              {p.tech.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {p.tech.slice(0, lead ? 6 : 4).map((t) => (
                                    <span key={t} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-[#DCE2F5] backdrop-blur transition group-hover:border-[#67E8F9]/40">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </ProjectCover>
                        <Spotlight className="flex flex-1 flex-col p-6" color="rgba(34,211,238,0.10)">
                          {p.tagline && <p className="text-[15px] text-[#C7CFE5]">{p.tagline}</p>}
                          {p.bullets.length > 0 && (
                            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[#8B96B5]">
                              {p.bullets.map((b, j) => (
                                <li key={j} className="relative pl-4">
                                  <span className="absolute left-0 text-[#67E8F9]">·</span>
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                          {(p.liveUrl || p.repoUrl) && (
                            <div className="mt-5 flex flex-wrap gap-3">
                              {p.liveUrl && (
                                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                  className={`rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-5 py-2 text-sm font-semibold text-white transition hover:shadow-[0_0_24px_rgba(34,211,238,0.45)] ${ring}`}>
                                  Live ↗
                                </a>
                              )}
                              {p.repoUrl && (
                                <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                                  className={`rounded-xl border border-white/15 px-5 py-2 text-sm font-semibold text-[#C7CFE5] transition hover:border-[#67E8F9]/50 hover:text-[#67E8F9] ${ring}`}>
                                  Code ↗
                                </a>
                              )}
                            </div>
                          )}
                        </Spotlight>
                      </div>
                    </TiltCard>
                  </Item>
                );
              })}
            </Stagger>
          </AuroraSection>
        )}

        {/* experience */}
        {experiences.length > 0 && (
          <AuroraSection id="experience" eyebrow="Career" title="Experience" glow="#A78BFA">
            <Stagger className="relative mx-auto max-w-4xl space-y-5 pl-8" stagger={0.1}>
              {/* timeline spine */}
              <div
                aria-hidden
                className="absolute bottom-4 left-1.5 top-2 w-px bg-gradient-to-b from-[#A78BFA]/60 via-[#A78BFA]/20 to-transparent"
              />
              {experiences.map((e, i) => (
                <Item key={i} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-8 top-7 h-3 w-3 rounded-full border-2 border-[#A78BFA] bg-[#070912] shadow-[0_0_12px_rgba(167,139,250,0.6)]"
                  />
                  <Spotlight
                    className={`${card} group transition hover:border-[#A78BFA]/30`}
                    color="rgba(167,139,250,0.14)"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold transition group-hover:text-[#C4B5FD]">
                        {e.title}{" "}
                        <span className="text-[#A78BFA]">@ {e.organization}</span>
                      </h3>
                      <span className={`rounded-full px-3 py-0.5 text-xs ${e.endDate ? "text-[#6B7694]" : "border border-[#67E8F9]/30 bg-[#22D3EE]/10 text-[#67E8F9]"}`}>
                        {e.startDate ?? ""} – {e.endDate ?? "Present"}
                      </span>
                    </div>
                    {e.location && (
                      <p className="mt-1 text-xs text-[#6B7694]">{e.location}</p>
                    )}
                    {e.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[#8B96B5]">
                        {e.bullets.map((b, j) => (
                          <li key={j} className="relative pl-4">
                            <span className="absolute left-0 text-[#A78BFA]">·</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Spotlight>
                </Item>
              ))}
            </Stagger>
          </AuroraSection>
        )}

        {/* skills — one card per group */}
        {skills.length > 0 && (
          <AuroraSection id="skills" eyebrow="Toolkit" title="Skills" glow="#F472B6">
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {skills.map((s, i) => (
                <Item key={s.category}>
                  <Spotlight className={`${card} group h-full transition hover:-translate-y-1 hover:border-[#F472B6]/30`} color="rgba(244,114,182,0.14)">
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: AURORA[i % 3] }}>
                      {s.category}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.items.map((it) => (
                        <span key={it}
                          className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-[#C7CFE5] transition hover:-translate-y-0.5 hover:border-[#F472B6]/50 hover:text-[#F472B6] hover:shadow-[0_0_16px_rgba(244,114,182,0.2)]">
                          {it}
                        </span>
                      ))}
                    </div>
                  </Spotlight>
                </Item>
              ))}
            </Stagger>

            {/* drifting skills marquee — tasteful ambient strip */}
            {skillStrip.length > 4 && (
              <div
                aria-hidden
                className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
              >
                <Marquee speed={34}>
                  {skillStrip.map((it, i) => (
                    <span
                      key={`${it}-${i}`}
                      className="whitespace-nowrap rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] text-[#8B96B5]"
                    >
                      {it}
                    </span>
                  ))}
                </Marquee>
              </div>
            )}
          </AuroraSection>
        )}

        {/* education */}
        {educations.length > 0 && (
          <AuroraSection eyebrow="Learning" title="Education" glow="#67E8F9">
            <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.07}>
              {educations.map((ed, i) => (
                <Item key={i}>
                  <Spotlight className={`${card} h-full`} color="rgba(103,232,249,0.14)">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-[#E9EDF7]">{ed.institution}</h3>
                      {ed.endYear && (
                        <span className="text-xs text-[#6B7694]">{ed.startYear ? `${ed.startYear}–` : ""}{ed.endYear}</span>
                      )}
                    </div>
                    {ed.degree && <p className="mt-1 text-sm text-[#8B96B5]">{ed.degree}</p>}
                    {ed.score && <p className="mt-2 text-xs text-[#67E8F9]">{ed.score}</p>}
                  </Spotlight>
                </Item>
              ))}
            </Stagger>
          </AuroraSection>
        )}

        {/* custom sections */}
        {sections.map((sec, si) => (
          <AuroraSection key={sec.title} eyebrow="Highlights" title={sec.title} glow={["#A78BFA", "#F472B6", "#67E8F9"][si % 3]}>
            <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.07}>
              {sec.items.map((it, i) => (
                <Item key={i}>
                  <Spotlight className={`${card} h-full text-sm text-[#8B96B5]`} color="rgba(167,139,250,0.14)">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      {it.url ? (
                        <a href={it.url} target="_blank" rel="noreferrer" className="font-semibold text-[#E9EDF7] hover:text-[#67E8F9]">
                          {it.title} ↗
                        </a>
                      ) : (
                        <span className="font-semibold text-[#E9EDF7]">{it.title}</span>
                      )}
                      {it.date && <span className="text-xs text-[#6B7694]">{it.date}</span>}
                    </div>
                    {it.subtitle && <p className="mt-1">{it.subtitle}</p>}
                    {it.description && <p className="mt-1.5 text-[13px] leading-relaxed">{it.description}</p>}
                  </Spotlight>
                </Item>
              ))}
            </Stagger>
          </AuroraSection>
        ))}

        {/* contact */}
        {(profile.email || links.length > 0) && (
          <Reveal as="section" className="mt-28">
            <div id="contact" className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-16 text-center backdrop-blur-xl sm:px-12 sm:py-20">
              <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#22D3EE]/20 blur-3xl" />
              <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[#EC4899]/20 blur-3xl" />
              <div className="relative">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#F472B6]" style={{ textShadow: "0 0 24px #F472B655" }}>
                  {profile.openToWork ? "Open to work" : "Contact"}
                </p>
                <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                  <GradientText colors={AURORA}>Let&apos;s make something glow.</GradientText>
                </h2>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  {profile.email && (
                    <Magnetic as="span" strength={0.35}>
                      <a
                        href={`mailto:${profile.email}`}
                        className={`block rounded-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#EC4899] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.45)] transition hover:shadow-[0_0_60px_rgba(236,72,153,0.55)] ${ring}`}
                      >
                        {profile.email}
                      </a>
                    </Magnetic>
                  )}
                  {resume && (
                    <Magnetic as="span" strength={0.3}>
                      <a href={resume}
                        className={`block rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-[#E9EDF7] transition hover:border-[#67E8F9]/50 hover:text-[#67E8F9] ${ring}`}>
                        Resume ↓
                      </a>
                    </Magnetic>
                  )}
                  {links.slice(0, 3).map((l) => (
                    <Magnetic as="span" key={l.url} strength={0.3}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-[#C7CFE5] transition hover:border-[#67E8F9]/50 hover:text-[#67E8F9] ${ring}`}
                      >
                        {l.label || l.kind}
                      </a>
                    </Magnetic>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        )}

        <footer className="mt-16 text-center text-xs text-[#6B7694]">
          © {profile.fullName} · built with Portxz
        </footer>
      </div>
    </main>
  );
}

function AuroraSection({
  id,
  eyebrow,
  title,
  glow,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  glow: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-28">
      <Reveal y={16} className="mb-12 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: glow, textShadow: `0 0 24px ${glow}55` }}>
          {eyebrow}
        </p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-[#F5F7FF] sm:text-5xl">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}
