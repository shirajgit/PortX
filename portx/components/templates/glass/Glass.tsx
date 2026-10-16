"use client";

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
  Float,
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

const GLASS_STOPS = ["#c7d2fe", "#f0abfc", "#67e8f9", "#c7d2fe"];
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60";

/* ─────────────────────────────────────────────────────────────────────────
   GLASS — "Apple-keynote" frosted glassmorphism.
   A living animated color-mesh sits behind layered frosted-glass panels.
   Every decorative keyframe is deterministic and respects reduced motion.
   ──────────────────────────────────────────────────────────────────────── */

export function Glass({ data, username }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations, sections } = data;

  const { initials, current, stats, topTech, years } = getInsights(data);
  const resume = resumeHref(username);

  const nav: NavItem[] = [
    projects.length > 0 && { id: "projects", label: "Projects" },
    experiences.length > 0 && { id: "experience", label: "Experience" },
    (skills.length > 0 || educations.length > 0) && { id: "skills", label: "Skills" },
    (profile.email || links.length > 0) && { id: "contact", label: "Contact" },
  ].filter((x): x is NavItem => !!x);

  return (
    <main id="top" data-fixed-theme className="relative min-h-screen w-full overflow-x-hidden bg-[#05060B] font-sans text-slate-100 antialiased selection:bg-fuchsia-500/30 selection:text-white">
      <GlassStyles />
      <ScrollProgress color="linear-gradient(90deg,#818cf8,#ec4899,#22d3ee)" />

      <FloatingNav
        brand={
          <span className="text-lg font-black tracking-tight">
            <GradientText colors={GLASS_STOPS} duration={7}>{profile.fullName.split(" ")[0]}</GradientText>
            <span className="text-white/30">.</span>
          </span>
        }
        items={nav}
        cta={resume ? { label: "Resume ↓", href: resume } : null}
        tone={{
          bar: "rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl",
          scrolled: "bg-white/[0.09] border-white/20",
          link: "rounded-xl font-medium text-slate-300 hover:text-white",
          linkActive: "rounded-xl font-semibold text-white",
          pill: "rounded-xl border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
          cta: "rounded-xl border border-white/25 bg-white/15 text-white hover:bg-white/25",
          menu: "border-white/10",
        }}
      />

      <SocialRail
        links={links}
        email={profile.email}
        icon="text-slate-400 hover:text-white hover:drop-shadow-[0_0_10px_rgba(240,171,252,0.7)]"
        line="bg-gradient-to-b from-fuchsia-300/50 to-transparent"
      />

      {/* ── Living animated color-mesh backdrop ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="pxz-blob pxz-blob-a absolute -left-[12%] -top-[10%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.55),transparent_60%)] blur-[90px]" />
        <div className="pxz-blob pxz-blob-b absolute -right-[14%] top-[8%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.42),transparent_60%)] blur-[100px]" />
        <div className="pxz-blob pxz-blob-c absolute bottom-[-16%] left-[22%] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.40),transparent_60%)] blur-[100px]" />
        <div className="pxz-blob pxz-blob-d absolute bottom-[4%] right-[8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.32),transparent_60%)] blur-[110px]" />
        {/* Fine noise/grain veil for tactile frost */}
        <div className="absolute inset-0 opacity-[0.5] bg-[linear-gradient(to_bottom,rgba(5,6,11,0.2),rgba(5,6,11,0.85))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_40%,rgba(5,6,11,0.6))]" />

        {/* floating 3D glass panes — depth behind the content */}
        <Float className="absolute right-[6%] top-[14%] hidden lg:block" y={22} rotate={5} duration={11}>
          <div className="h-44 w-32 rounded-[1.75rem] border border-white/15 bg-white/[0.05] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] [transform:perspective(900px)_rotateX(22deg)_rotateY(-32deg)]" />
        </Float>
        <Float className="absolute left-[4%] top-[46%] hidden lg:block" y={16} rotate={-6} duration={13} delay={1.5}>
          <div className="h-28 w-28 rounded-full border border-white/15 bg-gradient-to-br from-white/[0.10] to-transparent [transform:perspective(900px)_rotateX(-18deg)_rotateY(34deg)]" />
        </Float>
        <Float className="absolute bottom-[10%] right-[14%] hidden lg:block" y={18} rotate={8} duration={15} delay={0.8}>
          <div className="h-24 w-40 rounded-[1.5rem] border border-white/12 bg-white/[0.04] [transform:perspective(900px)_rotateX(38deg)_rotateY(18deg)]" />
        </Float>
      </div>

      {/* ─────────────── HERO ─────────────── */}
      <header className="relative z-10 flex min-h-[100svh] items-center">
        <HeroBackdrop glow="rgba(240,171,252,0.08)" grid="#ffffff" gridOpacity={0.05} />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8 lg:py-0">
          <Stagger stagger={0.1} className="text-center lg:text-left">
            {profile.openToWork && (
              <Item>
                <StatusPill dot="bg-emerald-400"
                  className="border border-emerald-300/30 bg-emerald-400/10 font-semibold text-emerald-200 backdrop-blur-md">
                  Open to work{profile.location ? ` · ${profile.location}` : ""}
                </StatusPill>
              </Item>
            )}
            {profile.headline && (
              <Item>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{profile.headline}</p>
              </Item>
            )}
            <Item>
              <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl">
                <GradientText colors={GLASS_STOPS} duration={7}>{profile.fullName}</GradientText>
              </h1>
            </Item>
            {profile.summary && (
              <Item>
                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 lg:mx-0">{profile.summary}</p>
              </Item>
            )}
            <Item>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {projects.length > 0 && (
                  <Magnetic as="span" strength={0.35}>
                    <a href="#projects" onClick={(e) => jumpTo(e, "projects")}
                      className={`group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-200 px-7 py-3.5 text-sm font-bold text-[#0B0B1A] shadow-[0_10px_40px_-10px_rgba(240,171,252,0.8)] transition hover:shadow-[0_10px_50px_-6px_rgba(240,171,252,0.95)] ${ring}`}>
                      View my work <span aria-hidden className="transition-transform group-hover/cta:translate-x-0.5">→</span>
                    </a>
                  </Magnetic>
                )}
                {resume && (
                  <Magnetic as="span" strength={0.35}>
                    <a href={resume}
                      className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/20 ${ring}`}>
                      Download resume ↓
                    </a>
                  </Magnetic>
                )}
              </div>
            </Item>
            {stats.length > 1 && (
              <Item>
                <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4 lg:justify-start">
                  {stats.map((s) => (
                    <div key={s.label} className="text-center lg:text-left">
                      <div className="text-3xl font-black tracking-tight">
                        <GradientText colors={GLASS_STOPS} duration={7}><CountUp value={s.value} suffix={s.suffix} /></GradientText>
                      </div>
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </Item>
            )}
          </Stagger>

          {/* frosted profile card */}
          <Reveal delay={0.25} duration={0.9}>
            <TiltCard max={7} glareColor="rgba(255,255,255,0.18)" className="mx-auto w-full max-w-md rounded-[2rem]">
              <Spotlight
                color="rgba(168,140,255,0.18)"
                size={520}
                className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-8 text-center shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
              >
                <span aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                <div className="relative mx-auto w-fit">
                  <Avatar3D
                    src={profile.avatarUrl}
                    name={profile.fullName}
                    initials={initials}
                    size={150}
                    shape="squircle"
                    colors={["#818cf8", "#ec4899", "#22d3ee"]}
                    surface="rgba(255,255,255,0.10)"
                    className="my-6"
                  />
                  <div className="hidden sm:block">
                    <FloatingChips
                      chips={[topTech.slice(0, 2).join(" · "), years > 0 ? `${years}+ years` : ""]}
                      chipClass="border border-white/20 bg-white/10 text-slate-100 backdrop-blur-xl" />
                  </div>
                </div>
                <p className="mt-4 text-xl font-bold text-white">{profile.fullName}</p>
                {current && (
                  <p className="mt-1 text-sm text-slate-300">
                    {current.title}
                    {current.organization && <span className="text-indigo-200"> · {current.organization}</span>}
                  </p>
                )}
                {(profile.location || profile.email) && (
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    {profile.location && <span className="inline-flex items-center gap-1.5"><Dot /> {profile.location}</span>}
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className={`inline-flex items-center gap-1.5 rounded-sm text-slate-300 hover:text-white ${ring}`}>
                        <Dot /> {profile.email}
                      </a>
                    )}
                  </div>
                )}
                {links.length > 0 && (
                  <div className="mt-6 flex flex-wrap justify-center gap-2 border-t border-white/10 pt-6">
                    {links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/12 hover:text-white ${ring}`}>
                        {l.label || l.kind} <span aria-hidden className="opacity-60">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </Spotlight>
            </TiltCard>
          </Reveal>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-20">
        {/* ─────────────── PROJECTS ─────────────── */}
        {projects.length > 0 && (
          <section id="projects" className="mt-8">
            <SectionHeading eyebrow="Selected work" title="Featured projects" />
            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.1}>
              {projects.map((p, i) => {
                const lead = i === 0;
                return (
                  <Item as="article" key={p.name} className={lead ? "md:col-span-2" : ""}>
                    <TiltCard max={lead ? 3 : 6} glareColor="rgba(255,255,255,0.16)" className="h-full rounded-[1.75rem]">
                      <div className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white/[0.055] shadow-[0_18px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-colors ${lead ? "border-white/20 ring-1 ring-fuchsia-300/15" : "border-white/12 hover:border-white/22"}`}>
                        <ProjectCover
                          name={p.name}
                          imageUrl={p.imageUrl}
                          palette={["rgba(129,140,248,0.6)", "rgba(236,72,153,0.5)", "rgba(34,211,238,0.45)"]}
                          base="#0B0D1A"
                          ink="rgba(255,255,255,0.09)"
                          grid="rgba(255,255,255,0.05)"
                          overlay="linear-gradient(to top, rgba(5,6,11,0.9), rgba(5,6,11,0.2) 55%, transparent)"
                          className={lead ? "h-72 md:h-96" : "h-56"}
                        >
                          <div className="flex h-full flex-col justify-between p-6">
                            {p.featured || lead ? (
                              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-xl">
                                ★ Featured
                              </span>
                            ) : <span />}
                            <div>
                              <h3 className={`font-black tracking-tight text-white ${lead ? "text-3xl" : "text-2xl"}`}>{p.name}</h3>
                              {p.tech.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {p.tech.slice(0, lead ? 6 : 4).map((t) => <Chip key={t}>{t}</Chip>)}
                                </div>
                              )}
                            </div>
                          </div>
                        </ProjectCover>
                        <div className="flex flex-1 flex-col p-6">
                          {p.tagline && <p className="text-sm font-semibold text-indigo-200/90">{p.tagline}</p>}
                          {p.description && <p className="mt-3 text-sm leading-relaxed text-slate-300">{p.description}</p>}
                          {p.bullets.length > 0 && (
                            <ul className="mt-4 space-y-2">
                              {p.bullets.map((b, j) => (
                                <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300">
                                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {(p.liveUrl || p.repoUrl) && (
                            <div className="mt-auto flex items-center gap-3 pt-6 text-sm font-semibold">
                              {p.liveUrl && (
                                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-white backdrop-blur-xl transition-colors hover:bg-white/25 ${ring}`}>
                                  Live demo <span aria-hidden>↗</span>
                                </a>
                              )}
                              {p.repoUrl && (
                                <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-slate-300 transition-colors hover:text-white ${ring}`}>
                                  Code <span aria-hidden>↗</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </Item>
                );
              })}
            </Stagger>
          </section>
        )}

        {/* ─────────────── EXPERIENCE (frosted timeline) ─────────────── */}
        {experiences.length > 0 && (
          <section id="experience" className="mt-24 sm:mt-28">
            <SectionHeading eyebrow="Career" title="Experience" />
            <Spotlight
              color="rgba(120,160,255,0.12)"
              className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8"
            >
              <Stagger className="relative" stagger={0.09}>
                {/* vertical rail */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-fuchsia-400/40 via-indigo-400/30 to-cyan-400/40 sm:left-[9px]"
                />
                <div className="space-y-8">
                  {experiences.map((e, i) => (
                    <Item key={i} className="relative pl-8 sm:pl-10">
                      <span
                        aria-hidden
                        className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md sm:h-5 sm:w-5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400" />
                      </span>
                      <div className="flex flex-col gap-x-4 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between">
                        <h3 className="text-base font-bold text-white sm:text-lg">
                          {e.title}
                          {e.organization && (
                            <>
                              <span className="font-normal text-slate-500"> · </span>
                              <span className="text-indigo-200">
                                {e.organization}
                              </span>
                            </>
                          )}
                        </h3>
                        {(e.startDate || e.endDate) && (
                          <span className="shrink-0 font-mono text-xs text-slate-400">
                            {e.startDate ?? ""} — {e.endDate ?? "Present"}
                          </span>
                        )}
                      </div>
                      {e.location && (
                        <p className="mt-0.5 text-xs text-slate-400">{e.location}</p>
                      )}
                      {e.bullets.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {e.bullets.map((b, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300"
                            >
                              <span
                                aria-hidden
                                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/70"
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Item>
                  ))}
                </div>
              </Stagger>
            </Spotlight>
          </section>
        )}

        {/* ─────────────── SKILLS + EDUCATION ─────────────── */}
        {(skills.length > 0 || educations.length > 0) && (
          <section id="skills" className="mt-24 grid grid-cols-1 gap-6 sm:mt-28 lg:grid-cols-2">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <SectionHeading eyebrow="Toolkit" title="Skills" />
                <Stagger className="space-y-4" stagger={0.08}>
                  {skills.map((s) => (
                    <Item key={s.category}>
                      <div className="rounded-[1.4rem] border border-white/12 bg-white/[0.05] p-5 backdrop-blur-2xl">
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-200/80">
                          {s.category}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {s.items.map((it) => (
                            <Chip key={it}>{it}</Chip>
                          ))}
                        </div>
                      </div>
                    </Item>
                  ))}
                </Stagger>
              </div>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <div>
                <SectionHeading eyebrow="Background" title="Education" />
                <Stagger className="space-y-4" stagger={0.08}>
                  {educations.map((ed, i) => (
                    <Item key={i}>
                      <div className="rounded-[1.4rem] border border-white/12 bg-white/[0.05] p-5 backdrop-blur-2xl">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-base font-bold text-white">
                            {ed.institution}
                          </h3>
                          {(ed.startYear || ed.endYear) && (
                            <span className="shrink-0 font-mono text-xs text-slate-400">
                              {ed.startYear ?? ""}
                              {ed.startYear && ed.endYear ? "–" : ""}
                              {ed.endYear ?? ""}
                            </span>
                          )}
                        </div>
                        {ed.degree && (
                          <p className="mt-1 text-sm text-slate-300">{ed.degree}</p>
                        )}
                        {ed.score && (
                          <p className="mt-1 text-xs font-medium text-indigo-200/80">
                            {ed.score}
                          </p>
                        )}
                      </div>
                    </Item>
                  ))}
                </Stagger>
              </div>
            )}
          </section>
        )}

        {/* ─────────────── CUSTOM SECTIONS ─────────────── */}
        {sections.length > 0 && (
          <section className="mt-24 grid grid-cols-1 gap-6 sm:mt-28 lg:grid-cols-2">
            {sections.map((sec) => (
              <div key={sec.title}>
                <SectionHeading eyebrow="More" title={sec.title} />
                <Stagger className="space-y-4" stagger={0.08}>
                  {sec.items.map((it, i) => (
                    <Item key={i}>
                      <div className="rounded-[1.4rem] border border-white/12 bg-white/[0.05] p-5 backdrop-blur-2xl">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="text-base font-bold text-white">
                            {it.url ? (
                              <a href={it.url} target="_blank" rel="noreferrer" className="hover:text-indigo-200">{it.title} ↗</a>
                            ) : it.title}
                          </h3>
                          {it.date && <span className="shrink-0 font-mono text-xs text-slate-400">{it.date}</span>}
                        </div>
                        {it.subtitle && <p className="mt-1 text-sm text-slate-300">{it.subtitle}</p>}
                        {it.description && <p className="mt-1 text-xs leading-relaxed text-slate-400">{it.description}</p>}
                      </div>
                    </Item>
                  ))}
                </Stagger>
              </div>
            ))}
          </section>
        )}

        {/* ─────────────── CONTACT ─────────────── */}
        {(profile.email || links.length > 0) && (
          <Reveal as="section" className="mt-24 sm:mt-28">
            <Spotlight
              color="rgba(236,72,153,0.16)"
              size={620}
              className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] px-7 py-12 text-center shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:px-10 sm:py-16"
            >
              <p id="contact" className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300/70">
                {profile.openToWork ? "Open to work" : "Contact"}
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                <GradientText colors={["#c7d2fe", "#f0abfc", "#67e8f9", "#c7d2fe"]} duration={7}>
                  Let&apos;s build something together.
                </GradientText>
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {profile.email && (
                  <Magnetic as="span" strength={0.4}>
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(168,140,255,0.6)] backdrop-blur-xl transition-colors hover:bg-white/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/70"
                    >
                      {profile.email} <span aria-hidden>→</span>
                    </a>
                  </Magnetic>
                )}
                {resume && (
                  <Magnetic as="span" strength={0.25}>
                    <a href={resume}
                      className={`inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-5 py-3.5 text-sm font-medium text-slate-200 backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/12 hover:text-white ${ring}`}>
                      Resume ↓
                    </a>
                  </Magnetic>
                )}
                {links.slice(0, 3).map((l) => (
                  <Magnetic as="span" key={l.url} strength={0.25}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-5 py-3.5 text-sm font-medium text-slate-200 backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                    >
                      {l.label || l.kind}
                    </a>
                  </Magnetic>
                ))}
              </div>
            </Spotlight>
          </Reveal>
        )}

        {/* ─────────────── FOOTER ─────────────── */}
        <Reveal as="footer" className="mt-16 sm:mt-24">
          <div className="flex flex-col items-center justify-between gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-6 py-5 text-sm text-slate-400 backdrop-blur-2xl sm:flex-row">
            <span>
              © {profile.fullName}
            </span>
            <a
              href="https://portxz.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
            >
              Built with Portxz ↗
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

/* ─────────────── small local building blocks ─────────────── */

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-9">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300/70">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/12 bg-white/[0.07] px-2.5 py-1 text-xs font-medium text-slate-200 backdrop-blur-md">
      {children}
    </span>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="inline-block h-1 w-1 rounded-full bg-slate-500"
    />
  );
}

/* ─────────────── deterministic, reduced-motion-safe keyframes ─────────────── */

function GlassStyles() {
  return (
    <style>{`
      @keyframes pxz-blob-a {
        0%,100% { transform: translate3d(0,0,0) scale(1); }
        33%     { transform: translate3d(6%,8%,0) scale(1.12); }
        66%     { transform: translate3d(-5%,4%,0) scale(0.94); }
      }
      @keyframes pxz-blob-b {
        0%,100% { transform: translate3d(0,0,0) scale(1); }
        33%     { transform: translate3d(-7%,6%,0) scale(0.9); }
        66%     { transform: translate3d(4%,-6%,0) scale(1.14); }
      }
      @keyframes pxz-blob-c {
        0%,100% { transform: translate3d(0,0,0) scale(1); }
        50%     { transform: translate3d(8%,-7%,0) scale(1.16); }
      }
      @keyframes pxz-blob-d {
        0%,100% { transform: translate3d(0,0,0) scale(1); }
        50%     { transform: translate3d(-6%,-5%,0) scale(1.1); }
      }
      @keyframes pxz-halo-spin { to { transform: rotate(360deg); } }
      @keyframes pxz-ping {
        75%,100% { transform: scale(2); opacity: 0; }
      }
      .pxz-blob { will-change: transform; }
      .pxz-blob-a { animation: pxz-blob-a 22s ease-in-out infinite; }
      .pxz-blob-b { animation: pxz-blob-b 26s ease-in-out infinite; }
      .pxz-blob-c { animation: pxz-blob-c 30s ease-in-out infinite; }
      .pxz-blob-d { animation: pxz-blob-d 24s ease-in-out infinite; }
      .pxz-halo { animation: pxz-halo-spin 14s linear infinite; transform-origin: center; }
      .pxz-ping { animation: pxz-ping 1.6s cubic-bezier(0,0,0.2,1) infinite; }

      @media (prefers-reduced-motion: reduce) {
        .pxz-blob-a, .pxz-blob-b, .pxz-blob-c, .pxz-blob-d,
        .pxz-halo, .pxz-ping {
          animation: none !important;
        }
      }
    `}</style>
  );
}
