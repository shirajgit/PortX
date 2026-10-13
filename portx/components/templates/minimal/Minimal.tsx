"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
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
import { getInsights } from "../insights";

/* ── Minimal / Developer Matrix Template ──────────────────────────────
   Sleek dual-pane layout: a sticky profile sidebar paired with a
   scrolling feed of repos, deployment history, and stack. Free-tier
   identity kept intact — crisp light/dark themes with localStorage
   persistence ("Portxz-theme") — but elevated with premium motion:
   animated name gradient, magnetic links, staggered + tilting cards,
   scroll reveals, and animated section dividers. A 3D orbiting avatar,
   count-up overview stats and a closing contact card keep even a short
   profile feeling complete.                                            */

export function Minimal({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;
  const { initials, current, stats } = getInsights(data);

  // Default to light mode, fall back to localStorage if set
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("Portxz-theme") as
      | "light"
      | "dark"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
      updateDOM(savedTheme);
    } else {
      updateDOM("light");
    }
  }, []);

  const updateDOM = (mode: "light" | "dark") => {
    if (mode === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("Portxz-theme", nextTheme);
    updateDOM(nextTheme);
  };

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#2563EB]/20 selection:text-[#2563EB] transition-colors duration-300 dark:bg-[#030712] dark:text-[#F1F5F9]">
      <ScrollProgress color="linear-gradient(90deg,#2563EB,#4F46E5,#0EA5E9)" />

      {/* Background ambient lighting accents */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-500 dark:opacity-20"
      >
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-blue-600/30 blur-[120px]" />
        <div className="absolute -right-20 top-1/3 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-[150px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* LEFT COLUMN: Sticky Profile Dashboard */}
        <aside className="w-full shrink-0 border-b border-slate-200/80 bg-white/70 backdrop-blur-md dark:border-slate-800/60 dark:bg-[#070D19]/50 lg:sticky lg:top-0 lg:h-screen lg:w-[380px] lg:overflow-y-auto lg:border-b-0 lg:border-r xl:w-[420px]">
          <Spotlight
            className="h-full"
            color="rgba(37,99,235,0.10)"
            size={420}
          >
            <div className="flex h-full flex-col justify-between gap-8 px-6 py-10 lg:px-10 lg:py-16">
              <div>
                {/* Header Status & Theme Switcher */}
                <div className="mb-8 flex items-center justify-between">
                  {profile.openToWork ? (
                    <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-emerald-600 dark:text-[#39D98A]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      AVAILABLE FOR WORK
                    </div>
                  ) : (
                    <div />
                  )}

                  <Magnetic strength={0.4}>
                    <button
                      onClick={toggleTheme}
                      aria-label="Toggle theme mode"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-xs outline-none transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500/50 active:scale-95 dark:border-slate-800 dark:bg-[#0E172A] dark:hover:border-slate-700 dark:hover:bg-slate-800"
                    >
                      {theme === "light" ? (
                        <Moon className="h-4 w-4 text-slate-700" strokeWidth={2} />
                      ) : (
                        <Sun className="h-4 w-4 text-amber-400" strokeWidth={2} />
                      )}
                    </button>
                  </Magnetic>
                </div>

                <Avatar3D
                  src={profile.avatarUrl}
                  name={profile.fullName}
                  initials={initials}
                  size={84}
                  colors={["#2563EB", "#0EA5E9", "#4F46E5"]}
                  surface="linear-gradient(135deg,#2563EB,#4F46E5)"
                  glow={0.3}
                  className="mb-10 ml-6 mt-4"
                />

                <Reveal y={16} duration={0.7}>
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl xl:text-5xl">
                    <GradientText
                      colors={["#2563EB", "#4F46E5", "#0EA5E9", "#2563EB"]}
                      duration={7}
                    >
                      {profile.fullName}
                    </GradientText>
                  </h1>
                </Reveal>

                {profile.headline && (
                  <Reveal y={12} delay={0.08}>
                    <p className="mt-3 font-mono text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-[#4DA6FF]">
                      // {profile.headline}
                    </p>
                  </Reveal>
                )}

                {current && (
                  <Reveal y={12} delay={0.11}>
                    <p className="mt-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="text-emerald-600 dark:text-[#39D98A]">now →</span>{" "}
                      {current.title}
                      {current.organization && (
                        <>
                          {" "}
                          <span className="text-slate-400 dark:text-slate-600">@</span>{" "}
                          {current.organization}
                        </>
                      )}
                    </p>
                  </Reveal>
                )}

                {profile.summary && (
                  <Reveal y={12} delay={0.14}>
                    <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 xl:text-[15px]">
                      {profile.summary}
                    </p>
                  </Reveal>
                )}

                {(profile.location || profile.email) && (
                  <Reveal y={12} delay={0.2}>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      {profile.location && <span>◍ {profile.location}</span>}
                      {profile.email && (
                        <a
                          href={`mailto:${profile.email}`}
                          className="transition-colors hover:text-blue-600 dark:hover:text-[#4DA6FF]"
                        >
                          ✉ {profile.email}
                        </a>
                      )}
                    </div>
                  </Reveal>
                )}
              </div>

              {/* Profile Contact & Links */}
              <div className="space-y-6">
                {links.length > 0 && (
                  <div>
                    <span className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Connect Matrix
                    </span>
                    <Stagger stagger={0.06} className="flex flex-col gap-2 font-mono text-xs">
                      {links.map((l) => (
                        <Item key={l.url} y={10}>
                          <Magnetic strength={0.2} className="!block w-full">
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between rounded-lg border border-slate-200/80 bg-white/60 p-2.5 shadow-xs outline-none transition-all hover:border-blue-500/40 hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-800/80 dark:bg-[#0A1120]/50 dark:hover:border-blue-500/40 dark:hover:bg-[#0E172A]"
                            >
                              <span className="text-slate-700 group-hover:text-blue-600 dark:text-slate-300 dark:group-hover:text-white">
                                {l.label || l.kind}
                              </span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500" />
                            </a>
                          </Magnetic>
                        </Item>
                      ))}
                    </Stagger>
                  </div>
                )}

                <div className="hidden items-center justify-between border-t border-slate-200/80 pt-4 font-mono text-[10px] text-slate-400 dark:border-slate-800/60 dark:text-slate-600 lg:flex">
                  <span>SYSTEM: PORTXZ_V2</span>
                  <Magnetic strength={0.3}>
                    <a
                      href="https://www.portxz.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded outline-none transition-colors hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:hover:text-white"
                    >
                      CLAIM LINK ↗
                    </a>
                  </Magnetic>
                </div>
              </div>
            </div>
          </Spotlight>
        </aside>

        {/* RIGHT COLUMN: Scrolling Feed */}
        <div className="flex-1 px-6 py-10 lg:px-12 lg:py-16 xl:px-20">
          <div className="mx-auto max-w-4xl space-y-16">
            {/* At-a-glance overview */}
            {stats.length > 1 && (
              <Section title="System Overview">
                <Stagger stagger={0.07} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {stats.map((s) => (
                    <Item key={s.label} y={16}>
                      <TiltCard max={10} glareColor="rgba(37,99,235,0.12)" className="rounded-xl">
                        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs [transform-style:preserve-3d] dark:border-slate-800/80 dark:bg-[#090F1C]/60">
                          <div className="text-3xl font-extrabold tracking-tight text-blue-600 [transform:translateZ(24px)] dark:text-[#4DA6FF]">
                            <CountUp value={s.value} suffix={s.suffix} />
                          </div>
                          <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 [transform:translateZ(12px)] dark:text-slate-500">
                            {s.label}
                          </div>
                        </div>
                      </TiltCard>
                    </Item>
                  ))}
                </Stagger>
              </Section>
            )}

            {/* Projects Showcase */}
            {projects.length > 0 && (
              <Section title="Production Repositories">
                <Stagger
                  stagger={0.09}
                  className={`grid gap-4 ${projects.length > 1 ? "sm:grid-cols-2" : ""}`}
                >
                  {projects.map((p) => (
                    <Item key={p.name} as="article" y={22} className="h-full">
                      <TiltCard
                        max={5}
                        glareColor="rgba(37,99,235,0.10)"
                        className="h-full rounded-xl"
                      >
                        <div className="group flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors duration-300 [transform-style:preserve-3d] hover:border-blue-500/40 hover:shadow-md dark:border-slate-800/80 dark:bg-[#090F1C]/50 dark:hover:border-blue-500/40 dark:hover:bg-[#0D1527]">
                          <div className="[transform:translateZ(22px)]">
                            {p.featured && (
                              <span className="mb-3 inline-block rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-blue-600 dark:text-[#4DA6FF]">
                                ★ featured
                              </span>
                            )}
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-base font-bold text-slate-900 transition-colors duration-150 group-hover:text-blue-600 dark:text-white dark:group-hover:text-[#4DA6FF]">
                                {p.name}
                              </h3>
                              <div className="flex shrink-0 gap-2.5 pt-0.5 font-mono text-[11px] font-medium">
                                {p.liveUrl && (
                                  <a
                                    className="text-blue-600 hover:underline dark:text-[#4DA6FF]"
                                    href={p.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    live ↗
                                  </a>
                                )}
                                {p.repoUrl && (
                                  <a
                                    className="text-slate-400 hover:text-slate-900 hover:underline dark:text-slate-500 dark:hover:text-white"
                                    href={p.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    code
                                  </a>
                                )}
                              </div>
                            </div>
                            {p.tagline && (
                              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                {p.tagline}
                              </p>
                            )}
                            {p.bullets.length > 0 && (
                              <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400/90">
                                {p.bullets.slice(0, 3).map((b, j) => (
                                  <li key={j} className="flex items-start gap-2">
                                    <span className="shrink-0 font-mono text-blue-500/70 dark:text-[#4DA6FF]/70">
                                      ›
                                    </span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {p.tech.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-1.5 [transform:translateZ(12px)]">
                              {p.tech.map((t) => (
                                <span
                                  key={t}
                                  className="rounded border border-slate-200/60 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600 dark:border-slate-800 dark:bg-[#121B30] dark:text-[#8FC4FF]/90"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </TiltCard>
                    </Item>
                  ))}
                </Stagger>
              </Section>
            )}

            {/* Work History Timeline */}
            {experiences.length > 0 && (
              <Section title="Deployment History">
                <Stagger
                  stagger={0.1}
                  className="relative space-y-8 border-l border-slate-200 pl-6 dark:border-slate-800/80"
                >
                  {experiences.map((e, i) => (
                    <Item key={i} y={16} className="group relative">
                      <div className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full border border-slate-100 bg-slate-400 transition-colors duration-200 group-hover:bg-blue-500 group-hover:ring-4 group-hover:ring-blue-500/20 dark:border-slate-900 dark:bg-slate-700 dark:group-hover:bg-[#4DA6FF]" />

                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {e.title}{" "}
                          <span className="font-normal text-slate-400 dark:text-slate-500">
                            @
                          </span>{" "}
                          <span className="text-blue-600 dark:text-[#4DA6FF]">
                            {e.organization}
                          </span>
                        </h3>
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                          {e.startDate ?? ""} — {e.endDate ?? "Present"}
                        </span>
                      </div>

                      {e.bullets.length > 0 && (
                        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {e.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <span className="shrink-0 font-mono text-blue-500/70 dark:text-[#4DA6FF]/70">
                                └
                              </span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Item>
                  ))}
                </Stagger>
              </Section>
            )}

            {/* Stack / Skills Block */}
            {skills.length > 0 && (
              <Section title="Core Capabilities">
                <Stagger stagger={0.07} className="grid gap-3 sm:grid-cols-2">
                  {skills.map((s) => (
                    <Item key={s.category} y={16}>
                      <div className="h-full rounded-xl border border-slate-200/80 bg-white/60 p-4 shadow-xs transition-colors hover:border-blue-500/30 dark:border-slate-800/60 dark:bg-[#080E1A]/40 dark:hover:border-blue-500/30">
                        <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-[#4DA6FF]">
                          {s.category}
                        </span>
                        <span className="mt-2 block text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {s.items.join(" • ")}
                        </span>
                      </div>
                    </Item>
                  ))}
                </Stagger>
              </Section>
            )}

            {/* Education History */}
            {educations.length > 0 && (
              <Section title="Academic Grounding">
                <Stagger stagger={0.07} className="grid gap-4 sm:grid-cols-2">
                  {educations.map((ed, i) => (
                    <Item key={i} y={16}>
                      <div className="h-full rounded-xl border border-slate-200/80 bg-white/60 p-4 text-xs shadow-xs transition-colors hover:border-blue-500/30 dark:border-slate-800/60 dark:bg-[#080E1A]/30 dark:hover:border-blue-500/30">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {ed.institution}
                          </span>
                          {ed.endYear && (
                            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                              {ed.startYear ? `${ed.startYear} - ` : ""}
                              {ed.endYear}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-slate-600 dark:text-slate-400">
                          {ed.degree}
                          {ed.score && (
                            <span className="text-slate-300 dark:text-slate-700">
                              {" "}
                              |{" "}
                            </span>
                          )}
                          {ed.score}
                        </p>
                      </div>
                    </Item>
                  ))}
                </Stagger>
              </Section>
            )}

            {/* Closing contact card */}
            {(profile.email || links.length > 0) && (
              <Reveal y={20}>
                <Spotlight
                  color="rgba(37,99,235,0.14)"
                  size={520}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xs dark:border-slate-800/80 dark:bg-[#090F1C]/60 sm:p-10"
                >
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-[#4DA6FF]">
                    {"// open a channel"}
                  </p>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {profile.openToWork
                      ? "Available for new work — let's talk."
                      : "Have something in mind? Let's talk."}
                  </h2>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {profile.email && (
                      <Magnetic strength={0.3}>
                        <a
                          href={`mailto:${profile.email}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 outline-none transition-colors hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/50"
                        >
                          {profile.email}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Magnetic>
                    )}
                    {links.slice(0, 3).map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-slate-200 px-4 py-2.5 font-mono text-xs text-slate-600 outline-none transition-colors hover:border-blue-500/40 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white"
                      >
                        {l.label || l.kind}
                      </a>
                    ))}
                  </div>
                </Spotlight>
              </Reveal>
            )}

            {/* Mobile Footer */}
            <footer className="flex items-center justify-between border-t border-slate-200/80 pt-6 font-mono text-[10px] text-slate-400 dark:border-slate-800/60 dark:text-slate-600 lg:hidden">
              <span>SYSTEM // PORTXZ</span>
              <a
                href="https://www.portxz.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 dark:hover:text-white"
              >
                CLAIM YOUR LINK ↗
              </a>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <h2 className="whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          {title}
        </h2>
        <motion.div
          aria-hidden
          className="h-px w-full origin-left bg-gradient-to-r from-blue-500/40 via-slate-200 to-transparent dark:via-slate-800/80"
          initial={reduce ? { opacity: 1 } : { scaleX: 0, opacity: 0 }}
          whileInView={reduce ? { opacity: 1 } : { scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {children}
    </section>
  );
}
