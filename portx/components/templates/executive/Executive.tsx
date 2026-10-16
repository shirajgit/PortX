"use client";

import { motion } from "framer-motion";
import type { TemplateProps } from "../types";
import {
  Reveal,
  Stagger,
  Item,
  TiltCard,
  Magnetic,
  Spotlight,
  ScrollProgress,
  CountUp,
  Avatar3D,
} from "../tem_comps/Motion";
import {
  FloatingNav,
  HeroBackdrop,
  ProjectCover,
  StatusPill,
  jumpTo,
  linkIcon,
  resumeHref,
  type NavItem,
} from "../tem_comps/Premium";
import { getInsights } from "../insights";

/* ── Executive template · premium edition ───────────────────────────────
   Corporate-clean and LIGHT by design — LinkedIn, but luxe. Premium here
   means restraint: a confident hero, a credible KPI row derived from the
   data, a refined experience timeline as the centerpiece, and quiet,
   professional motion (gentle reveals, staggered cards, whisper hovers).
   One trustworthy accent, deliberate whitespace, precise alignment.     */

const NAVY = "#16273D"; // deep slate-navy for headings
const ACCENT = "#2563EB"; // one trustworthy accent
const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

/* Emphasise metrics/impact (numbers, %, $, +, ×) inside a bullet without
   any randomness — pure string parsing, stable across SSR + hydration. */
function highlightMetrics(text: string): React.ReactNode {
  const parts = text.split(/(\$?\d[\d,.]*\s?(?:%|x|×|\+|k|K|M|B)?)/g);
  return parts.map((part, i) =>
    /\d/.test(part) ? (
      <strong key={i} className="font-bold" style={{ color: NAVY }}>
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2";

export function Executive({ data, username }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations, sections } = data;

  // KPI row, current role and monogram — all derived from the profile data.
  const { initials, current, stats } = getInsights(data);
  const resume = resumeHref(username);

  const nav: NavItem[] = [
    experiences.length > 0 && { id: "experience", label: "Experience" },
    projects.length > 0 && { id: "projects", label: "Projects" },
    (skills.length > 0 || educations.length > 0) && { id: "capabilities", label: "Capabilities" },
    (profile.email || links.length > 0) && { id: "contact", label: "Contact" },
  ].filter((x): x is NavItem => !!x);

  return (
    <main
      id="top"
      className="min-h-screen bg-[#F6F8FB] font-sans text-[#1E293B] antialiased selection:bg-[#2563EB]/10 selection:text-[#2563EB] print:bg-white"
      data-fixed-theme
    >
      <ScrollProgress color={ACCENT} height={3} />
      {/* top accent bar with a slow, restrained sheen */}
      <div
        className="relative h-1.5 w-full overflow-hidden print:hidden"
        style={{ background: `linear-gradient(90deg, ${NAVY}, ${ACCENT})` }}
      >
        <div
          className="absolute inset-y-0 w-1/3 bg-white/25 blur-sm"
          style={{ animation: "execSheen 6s ease-in-out infinite" }}
        />
      </div>
      <FloatingNav
        className="print:hidden"
        brand={
          <span className="text-lg font-semibold tracking-tight" style={{ color: NAVY, fontFamily: SERIF }}>
            {profile.fullName}
          </span>
        }
        items={nav}
        cta={resume ? { label: "Résumé ↓", href: resume } : null}
        tone={{
          bar: "rounded-2xl border border-slate-200/80 bg-white/75 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl",
          scrolled: "bg-white/90 shadow-[0_12px_40px_-14px_rgba(15,23,42,0.25)]",
          link: "rounded-lg font-semibold text-slate-500 hover:text-[#16273D]",
          linkActive: "rounded-lg font-semibold text-[#2563EB]",
          pill: "rounded-lg bg-blue-50 ring-1 ring-blue-100",
          cta: "rounded-lg bg-[#16273D] text-white hover:bg-[#2563EB]",
          menu: "border-slate-100",
        }}
      />
      <style>{`
        @keyframes execSheen { 0%{transform:translateX(-150%)} 60%,100%{transform:translateX(450%)} }
        @media (prefers-reduced-motion: reduce) { [style*="execSheen"] { animation: none !important; } }
      `}</style>

      {/* HERO — confident statement left, profile card right */}
      <header className="relative overflow-hidden">
        <HeroBackdrop
          glow="rgba(37,99,235,0.06)"
          blobs={["rgba(37,99,235,0.07)", "rgba(96,165,250,0.08)"]}
          grid={NAVY}
          gridOpacity={0.05}
          className="print:hidden"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:min-h-[88svh] lg:grid-cols-[1.3fr_1fr] lg:px-8 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {profile.openToWork && (
              <StatusPill dot="bg-emerald-500" className="mb-7 border border-emerald-200 bg-emerald-50 font-semibold text-emerald-700 shadow-sm">
                Open to opportunities
              </StatusPill>
            )}
            {profile.headline && (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{profile.headline}</p>
            )}
            <h1
              className="mt-4 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
              style={{ color: NAVY, fontFamily: SERIF }}
            >
              {profile.fullName}
            </h1>
            <div aria-hidden className="mt-6 h-1 w-16 rounded-full" style={{ background: `linear-gradient(90deg, ${NAVY}, ${ACCENT})` }} />
            {current && (
              <p className="mt-6 text-base text-slate-500 sm:text-lg">
                Currently{" "}
                <span className="font-semibold" style={{ color: NAVY }}>{current.title}</span>
                {current.organization && (
                  <>
                    {" "}at{" "}
                    <span className="font-semibold" style={{ color: ACCENT }}>{current.organization}</span>
                  </>
                )}
              </p>
            )}
            {profile.summary && (
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base">{profile.summary}</p>
            )}

            {/* Primary CTAs — magnetic, quiet, professional */}
            <div className="mt-8 flex flex-wrap items-center gap-3 print:hidden">
              {experiences.length > 0 && (
                <Magnetic as="span" strength={0.25}>
                  <a
                    href="#experience"
                    onClick={(e) => jumpTo(e, "experience")}
                    className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-shadow hover:shadow-xl hover:shadow-blue-500/25 ${focus}`}
                    style={{ background: NAVY }}
                  >
                    View experience <span aria-hidden>→</span>
                  </a>
                </Magnetic>
              )}
              {resume && (
                <Magnetic as="span" strength={0.25}>
                  <a
                    href={resume}
                    className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-[#2563EB] hover:text-[#2563EB] ${focus}`}
                  >
                    Download résumé <span aria-hidden>↓</span>
                  </a>
                </Magnetic>
              )}
            </div>

            {/* KPI ROW — credible figures derived from data */}
            {stats.length > 1 && (
              <Stagger className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4" stagger={0.07} delay={0.3}>
                {stats.map((s) => (
                  <Item key={s.label}>
                    <TiltCard max={8} glareColor="rgba(37,99,235,0.10)" className="rounded-2xl">
                      <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3.5 shadow-xs backdrop-blur [transform-style:preserve-3d]">
                        <div className="text-2xl font-bold tracking-tight [transform:translateZ(22px)]" style={{ color: ACCENT }}>
                          <CountUp value={s.value} suffix={s.suffix} />
                        </div>
                        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 [transform:translateZ(10px)]">
                          {s.label}
                        </div>
                      </div>
                    </TiltCard>
                  </Item>
                ))}
              </Stagger>
            )}
          </motion.div>

          {/* profile card */}
          <Reveal delay={0.15} y={24}>
            <Spotlight color="rgba(37,99,235,0.07)" size={520} className="mx-auto w-full max-w-sm rounded-3xl">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-8 text-center shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)]">
                <div aria-hidden className="absolute inset-x-0 top-0 h-28" style={{ background: `linear-gradient(135deg, ${NAVY}, #24406A 60%, ${ACCENT})` }} />
                <div className="relative mt-6 flex justify-center">
                  <Avatar3D
                    src={profile.avatarUrl}
                    name={profile.fullName}
                    initials={initials}
                    size={132}
                    shape="squircle"
                    rings={1}
                    colors={["#FFFFFF", "#BFDBFE", ACCENT]}
                    surface={`linear-gradient(135deg, ${NAVY}, #24406A)`}
                    glow={0.18}
                  />
                </div>
                <p className="mt-6 text-xl font-semibold" style={{ color: NAVY, fontFamily: SERIF }}>{profile.fullName}</p>
                {current && (
                  <p className="mt-1 text-sm text-slate-500">
                    {current.title}
                    {current.organization && <span style={{ color: ACCENT }}> · {current.organization}</span>}
                  </p>
                )}
                <div className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-left text-sm text-slate-600">
                  {profile.location && (
                    <p className="flex items-center gap-2.5">
                      <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location}
                    </p>
                  )}
                  {profile.email && (
                    <a className="flex items-center gap-2.5 truncate transition-colors hover:text-[#2563EB]" href={`mailto:${profile.email}`}>
                      <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {profile.email}
                    </a>
                  )}
                </div>
                {links.length > 0 && (
                  <div className="mt-5 flex flex-wrap justify-center gap-2 print:hidden">
                    {links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={l.label || l.kind}
                        title={l.label || l.kind}
                        className={`grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:-translate-y-0.5 hover:border-[#2563EB] hover:text-[#2563EB] hover:shadow-md hover:shadow-blue-500/10 ${focus}`}
                      >
                        {linkIcon(l.kind, "h-4 w-4")}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Spotlight>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 sm:pb-16">
        {/* EXPERIENCE — timeline spine (the centerpiece) */}
        {experiences.length > 0 && (
          <ExecSection id="experience" eyebrow="Career" title="Professional Experience">
            <div className="relative space-y-4 pl-6">
              <div
                aria-hidden
                className="absolute bottom-6 left-[7px] top-2 w-px bg-gradient-to-b from-[#2563EB]/50 via-slate-200 to-transparent"
              />
              {experiences.map((e, i) => (
                <Reveal as="article" key={i} delay={i * 0.06} y={18}>
                  <div className="relative rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
                    <span
                      aria-hidden
                      className="absolute -left-6 top-8 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-[#2563EB] shadow-[0_0_0_1px_#2563EB33]"
                    />
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                      <h3 className="text-base font-bold sm:text-lg" style={{ color: NAVY }}>
                        {e.title}
                        {e.organization && (
                          <span className="font-normal text-slate-500"> · {e.organization}</span>
                        )}
                      </h3>
                      <span className="shrink-0 font-mono text-xs font-semibold text-slate-400">
                        {e.startDate ?? ""} – {e.endDate ?? "Present"}
                      </span>
                    </div>
                    {e.location && (
                      <p className="mt-0.5 text-xs font-medium text-slate-400">{e.location}</p>
                    )}
                    {e.bullets.length > 0 && (
                      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                        {e.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-2.5">
                            <span className="mt-1 shrink-0 text-xs font-black" style={{ color: ACCENT }} aria-hidden>▸</span>
                            <span>{highlightMetrics(b)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </ExecSection>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <ExecSection id="projects" eyebrow="Portfolio" title="Key Projects">
            <Stagger className="grid gap-5 sm:grid-cols-2" stagger={0.08}>
              {projects.map((p, i) => {
                const lead = i === 0 && projects.length > 1;
                return (
                  <Item as="article" key={p.name} className={`h-full ${lead ? "sm:col-span-2" : ""}`}>
                    <TiltCard max={lead ? 2 : 4} glareColor="rgba(37,99,235,0.08)" className="h-full rounded-2xl">
                      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10">
                        <ProjectCover
                          name={p.name}
                          imageUrl={p.imageUrl}
                          palette={["rgba(37,99,235,0.28)", "rgba(96,165,250,0.30)", "rgba(22,39,61,0.18)"]}
                          base="#EEF3FB"
                          ink="rgba(22,39,61,0.07)"
                          grid="rgba(22,39,61,0.05)"
                          overlay="none"
                          className={`border-b border-slate-100 ${lead ? "h-56 sm:h-72" : "h-44"}`}
                        >
                          <div className="flex h-full items-start justify-between p-4">
                            {(p.featured || lead) ? (
                              <span className="rounded-md border border-blue-100 bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm" style={{ color: ACCENT }}>
                                Featured
                              </span>
                            ) : <span />}
                          </div>
                        </ProjectCover>
                        <div className="flex flex-1 flex-col justify-between p-6">
                          <div>
                            <h3 className={`font-bold transition-colors group-hover:text-[#2563EB] ${lead ? "text-xl" : "text-base"}`} style={{ color: NAVY, fontFamily: lead ? SERIF : undefined }}>
                              {p.name}
                            </h3>
                            {p.tagline && <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.tagline}</p>}
                            {p.bullets.length > 0 && (
                              <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
                                {p.bullets.map((b, j) => (
                                  <li key={j} className="flex items-start gap-2">
                                    <span className="mt-0.5 shrink-0 font-black" style={{ color: ACCENT }} aria-hidden>·</span>
                                    <span>{highlightMetrics(b)}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="mt-6 space-y-4">
                            {p.tech.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {p.tech.map((t) => (
                                  <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-[#2563EB]">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                            {(p.liveUrl || p.repoUrl) && (
                              <div className="flex items-center gap-4 border-t border-slate-100 pt-3 text-xs font-bold">
                                {p.liveUrl && (
                                  <a style={{ color: ACCENT }} href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                                    className="transition-transform hover:translate-x-0.5 hover:underline">
                                    View Project →
                                  </a>
                                )}
                                {p.repoUrl && (
                                  <a className="text-slate-500 transition-colors hover:text-[#2563EB]" href={p.repoUrl} target="_blank" rel="noopener noreferrer">
                                    Source Code →
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </Item>
                );
              })}
            </Stagger>
          </ExecSection>
        )}

        {/* SKILLS & EDUCATION */}
        {(skills.length > 0 || educations.length > 0) && (
          <div id="capabilities" className="mt-16 grid gap-6 sm:grid-cols-2">
            {skills.length > 0 && (
              <Reveal y={18}>
                <div className="h-full rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs">
                  <SectionLabel title="Core Capabilities" />
                  <div className="mt-4 space-y-4">
                    {skills.map((s) => (
                      <div key={s.category}>
                        <p className="text-xs font-bold text-slate-500">{s.category}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {s.items.map((item) => (
                            <span
                              key={item}
                              className="rounded-md border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-[#2563EB]/40 hover:bg-blue-50 hover:text-[#2563EB]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {educations.length > 0 && (
              <Reveal y={18} delay={0.08}>
                <div className="h-full rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs">
                  <SectionLabel title="Education & Qualifications" />
                  <div className="mt-4 space-y-4 text-xs">
                    {educations.map((ed, i) => (
                      <div key={i} className="space-y-1 border-l-2 border-blue-100 pl-3 transition-colors hover:border-[#2563EB]/50">
                        <p className="text-sm font-bold text-slate-900">{ed.institution}</p>
                        {ed.degree && <p className="font-medium text-slate-700">{ed.degree}</p>}
                        {(ed.endYear || ed.score) && (
                          <p className="font-mono text-slate-400">
                            {ed.endYear && `${ed.startYear ? `${ed.startYear} – ` : ""}${ed.endYear}`}
                            {ed.score && ` · Grade: ${ed.score}`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        )}

        {/* CUSTOM SECTIONS */}
        {sections.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {sections.map((sec, si) => (
              <Reveal key={sec.title} y={18} delay={(si % 2) * 0.08}>
                <div className="h-full rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs">
                  <SectionLabel title={sec.title} />
                  <div className="mt-4 space-y-4 text-xs">
                    {sec.items.map((it, i) => (
                      <div key={i} className="space-y-1 border-l-2 border-blue-100 pl-3 transition-colors hover:border-[#2563EB]/50">
                        {it.url ? (
                          <a href={it.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-900 hover:text-[#2563EB]">
                            {it.title} ↗
                          </a>
                        ) : (
                          <p className="text-sm font-bold text-slate-900">{it.title}</p>
                        )}
                        {it.subtitle && <p className="font-medium text-slate-700">{it.subtitle}</p>}
                        {it.date && <p className="font-mono text-slate-400">{it.date}</p>}
                        {it.description && <p className="leading-relaxed text-slate-500">{it.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* CLOSING CTA */}
        {(profile.email || links.length > 0) && (
          <Reveal y={22} className="mt-16 print:hidden">
            <Spotlight
              color="rgba(96,165,250,0.22)"
              size={560}
              className="scroll-mt-28 overflow-hidden rounded-3xl bg-[#16273D] p-8 text-white shadow-[0_24px_60px_-24px_rgba(22,39,61,0.6)] sm:p-12"
            >
              <div id="contact" className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-200/80">
                    {profile.openToWork ? "Open to opportunities" : "Get in touch"}
                  </p>
                  <h2
                    className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
                    style={{ fontFamily: SERIF }}
                  >
                    Let&apos;s start a conversation.
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {profile.email && (
                    <Magnetic as="span" strength={0.25}>
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#16273D]"
                        style={{ color: NAVY }}
                      >
                        {profile.email}
                        <span aria-hidden>→</span>
                      </a>
                    </Magnetic>
                  )}
                  {resume && (
                    <a href={resume}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                      Résumé ↓
                    </a>
                  )}
                  {!profile.email && links.slice(0, 3).map((l) => (
                    <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                      {l.label || l.kind} ↗
                    </a>
                  ))}
                </div>
              </div>
            </Spotlight>
          </Reveal>
        )}

        <Reveal className="mt-16 text-center text-xs font-medium text-slate-400">
          <footer>© {profile.fullName} · Built with Portxz</footer>
        </Reveal>
      </div>
    </main>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
      <span className="h-4 w-1 rounded-full" style={{ background: ACCENT }} />
      <h2 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: NAVY }}>
        {title}
      </h2>
    </div>
  );
}

function ExecSection({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 first:mt-4">
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mb-7"
      >
        <div className="flex items-center gap-2.5">
          <span className="h-4 w-1.5 rounded-full" style={{ background: ACCENT }} />
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{eyebrow}</p>
        </div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: NAVY, fontFamily: SERIF }}>
          {title}
        </h2>
      </motion.div>
      {children}
    </section>
  );
}
