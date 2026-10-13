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
import { getInsights } from "../insights";

/* ─────────────────────────────────────────────────────────────────────────
   GLASS — "Apple-keynote" frosted glassmorphism.
   A living animated color-mesh sits behind layered frosted-glass panels.
   Every decorative keyframe is deterministic and respects reduced motion.
   ──────────────────────────────────────────────────────────────────────── */

export function Glass({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  const { initials, current, stats } = getInsights(data);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#05060B] font-sans text-slate-100 antialiased selection:bg-fuchsia-500/30 selection:text-white">
      <GlassStyles />
      <ScrollProgress color="linear-gradient(90deg,#818cf8,#ec4899,#22d3ee)" />

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

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        {/* ─────────────── HERO ─────────────── */}
        <Reveal as="header" duration={0.8}>
          <Spotlight
            color="rgba(168,140,255,0.16)"
            size={620}
            className="group overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] p-7 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-10 lg:p-12"
          >
            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5 sm:gap-6">
                {/* Avatar / monogram — floats inside orbiting 3D rings */}
                <Avatar3D
                  src={profile.avatarUrl}
                  name={profile.fullName}
                  initials={initials}
                  size={92}
                  shape="squircle"
                  colors={["#818cf8", "#ec4899", "#22d3ee"]}
                  surface="rgba(255,255,255,0.10)"
                  className="m-4"
                />

                <div className="space-y-3">
                  {profile.openToWork && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-md">
                      <span className="relative flex h-2 w-2">
                        <span className="pxz-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      </span>
                      Open to work
                    </span>
                  )}
                  <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                    <GradientText
                      colors={["#c7d2fe", "#f0abfc", "#67e8f9", "#c7d2fe"]}
                      duration={7}
                    >
                      {profile.fullName}
                    </GradientText>
                  </h1>
                  {profile.headline && (
                    <p className="max-w-xl text-base font-medium text-slate-300 sm:text-lg">
                      {profile.headline}
                    </p>
                  )}
                  {current && (
                    <p className="text-sm text-slate-400">
                      Currently{" "}
                      <span className="font-semibold text-slate-200">{current.title}</span>
                      {current.organization && (
                        <>
                          {" "}at{" "}
                          <span className="font-semibold text-indigo-200">{current.organization}</span>
                        </>
                      )}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                    {profile.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <Dot /> {profile.location}
                      </span>
                    )}
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-1.5 rounded-sm text-slate-300 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                      >
                        <Dot /> {profile.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Magnetic primary CTA */}
              {profile.email && (
                <Magnetic as="span" strength={0.4} className="shrink-0">
                  <a
                    href={`mailto:${profile.email}`}
                    className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(168,140,255,0.6)] backdrop-blur-xl transition-colors hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/70"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/25 via-fuchsia-500/25 to-cyan-500/25 opacity-0 transition-opacity duration-300 group-hover/cta:opacity-100"
                    />
                    <span className="relative">Get in touch</span>
                    <span className="relative transition-transform duration-300 group-hover/cta:translate-x-0.5">
                      →
                    </span>
                  </a>
                </Magnetic>
              )}
            </div>

            {profile.summary && (
              <p className="relative mt-8 max-w-3xl border-t border-white/10 pt-6 text-base leading-relaxed text-slate-300">
                {profile.summary}
              </p>
            )}

            {/* Links row */}
            {links.length > 0 && (
              <div className="relative mt-6 flex flex-wrap gap-2.5">
                {links.map((l) => (
                  <Magnetic as="span" key={l.url} strength={0.25}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                    >
                      {l.label || l.kind}
                      <span aria-hidden className="text-xs opacity-60">
                        ↗
                      </span>
                    </a>
                  </Magnetic>
                ))}
              </div>
            )}
          </Spotlight>
        </Reveal>

        {/* ─────────────── AT A GLANCE ─────────────── */}
        {stats.length > 1 && (
          <Stagger className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4" stagger={0.08} delay={0.2}>
            {stats.map((s) => (
              <Item key={s.label}>
                <TiltCard max={10} glareColor="rgba(255,255,255,0.18)" className="rounded-[1.4rem]">
                  <div className="relative rounded-[1.4rem] border border-white/12 bg-white/[0.055] px-5 py-5 backdrop-blur-2xl [transform-style:preserve-3d]">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    />
                    <div className="text-3xl font-black tracking-tight [transform:translateZ(26px)] sm:text-4xl">
                      <GradientText colors={["#c7d2fe", "#f0abfc", "#67e8f9", "#c7d2fe"]} duration={7}>
                        <CountUp value={s.value} suffix={s.suffix} />
                      </GradientText>
                    </div>
                    <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 [transform:translateZ(12px)]">
                      {s.label}
                    </div>
                  </div>
                </TiltCard>
              </Item>
            ))}
          </Stagger>
        )}

        {/* ─────────────── PROJECTS ─────────────── */}
        {projects.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <SectionHeading eyebrow="Selected work" title="Projects" />
            <Stagger
              className={`grid grid-cols-1 gap-6 ${projects.length > 1 ? "md:grid-cols-2" : ""}`}
              stagger={0.1}
            >
              {projects.map((p) => (
                <Item as="article" key={p.name}>
                  <TiltCard
                    max={6}
                    glareColor="rgba(255,255,255,0.16)"
                    className="h-full"
                  >
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.055] p-6 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-colors hover:border-white/22">
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      />
                      {p.featured && (
                        <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-fuchsia-200">
                          ★ Featured
                        </span>
                      )}
                      <h3 className="text-lg font-bold tracking-tight text-white">
                        {p.name}
                      </h3>
                      {p.tagline && (
                        <p className="mt-1.5 text-sm font-medium text-indigo-200/80">
                          {p.tagline}
                        </p>
                      )}
                      {p.description && (
                        <p className="mt-3 text-sm leading-relaxed text-slate-300">
                          {p.description}
                        </p>
                      )}

                      {p.bullets.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {p.bullets.map((b, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300"
                            >
                              <span
                                aria-hidden
                                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400"
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {p.tech.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {p.tech.map((t) => (
                            <Chip key={t}>{t}</Chip>
                          ))}
                        </div>
                      )}

                      {(p.liveUrl || p.repoUrl) && (
                        <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-4 text-sm font-semibold">
                          {p.liveUrl && (
                            <a
                              href={p.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-sm text-cyan-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                            >
                              Live demo <span aria-hidden>↗</span>
                            </a>
                          )}
                          {p.repoUrl && (
                            <a
                              href={p.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                            >
                              Code <span aria-hidden>↗</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </TiltCard>
                </Item>
              ))}
            </Stagger>
          </section>
        )}

        {/* ─────────────── EXPERIENCE (frosted timeline) ─────────────── */}
        {experiences.length > 0 && (
          <section className="mt-16 sm:mt-20">
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
          <section className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 lg:grid-cols-2">
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

        {/* ─────────────── CONTACT ─────────────── */}
        {(profile.email || links.length > 0) && (
          <Reveal as="section" className="mt-16 sm:mt-20">
            <Spotlight
              color="rgba(236,72,153,0.16)"
              size={620}
              className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] px-7 py-12 text-center shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:px-10 sm:py-16"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300/70">
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
              href="https://www.portxz.xyz"
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
    <Reveal className="mb-7">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300/70">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
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
