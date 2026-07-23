"use client";

import { useState, useEffect } from "react";
import type { TemplateProps } from "../types";

export function Glass({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("Portxz-cyber-theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    updateDOM(initialTheme);
  }, []);

  const updateDOM = (mode: "light" | "dark") => {
    if (mode === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("Portxz-cyber-theme", nextTheme);
    updateDOM(nextTheme);
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#FAFAFA] p-3 font-sans text-[#1E293B] antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:bg-[#04060A] dark:text-[#E2E8F0] sm:p-6 md:p-8 transition-colors duration-500">
      
      {/* Decorative Technical Grid Background */}
      <div 
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]" 
      />

      {/* Frame Accent Corners */}
      <div aria-hidden className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-slate-300 dark:border-slate-800/80 opacity-50" />
      <div aria-hidden className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r border-t border-slate-300 dark:border-slate-800/80 opacity-50" />

      {/* Luminous Glow Vector Backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[140px] dark:bg-indigo-600/10 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute -bottom-[5%] -left-[5%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px] dark:bg-blue-500/10 animate-[pulse_7s_ease-in-out_infinite]" />
      </div>

      {/* Main Responsive Command Container */}
      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        
        {/* INTERACTIVE HUD HEADER */}
        <header className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-6 md:p-8 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all duration-300 dark:border-slate-800/80 dark:bg-[#080C14]/80 dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-widest">
                <span className="rounded bg-slate-900 px-2 py-0.5 font-bold text-white dark:bg-white dark:text-black">
                  CORE_V3
                </span>
                <span className="font-semibold text-indigo-600 dark:text-[#4DA6FF]">
                  // STATUS: OPERATIONAL
                </span>
                {profile.openToWork && (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-[#39D98A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    [OPEN_TO_WORK]
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl xl:text-6xl">
                {profile.fullName}
              </h1>
              
              {profile.headline && (
                <div className="inline-block rounded-lg border border-slate-200/60 bg-slate-100/80 px-3 py-1 font-mono text-xs font-semibold text-slate-700 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                  &lambda; {profile.headline}
                </div>
              )}
            </div>

            {/* Utility / Theme Controller Anchor */}
            <div className="flex shrink-0 flex-wrap items-center gap-2.5 border-t border-slate-200/60 pt-4 md:border-t-0 md:pt-0 dark:border-slate-800/60">
              {links.length > 0 && (
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white/80 px-3 py-2 font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0D121F]/80 dark:text-slate-400 dark:hover:border-indigo-400 dark:hover:text-white"
                    >
                      <span>{l.label || l.kind}</span>
                      <span className="text-[10px] opacity-40 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">↗</span>
                    </a>
                  ))}
                </div>
              )}
              
              {mounted && (
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle runtime mode"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0D121F]/80 dark:hover:bg-slate-800/80"
                >
                  {theme === "light" ? (
                    <svg className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.136 5.136l1.591 1.591m11.144 11.144l1.591 1.591M3 12h2.25m13.5 0H21M5.136 18.864l1.591-1.591M17.864 5.136l1.591-1.591M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {profile.summary && (
            <p className="mt-6 max-w-4xl border-t border-slate-200/60 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800/60 dark:text-slate-400">
              {profile.summary}
            </p>
          )}
        </header>

        {/* ASYMMETRICAL 3-COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* COLUMN 1 & 2: Primary Repos & Timeline Deployments */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Projects Registry Grid */}
            {projects.length > 0 && (
              <Section method="init_projects()" title="Project Repositories">
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((p) => (
                    <article 
                      key={p.name} 
                      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white/50 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 dark:border-slate-800/80 dark:bg-[#080C14]/50 dark:hover:border-[#4DA6FF]/50 dark:hover:bg-[#0A101C] dark:hover:shadow-indigo-500/10"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-[#4DA6FF]">
                            {p.name}
                          </h3>
                          {p.featured && (
                            <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-widest text-indigo-600 dark:text-[#4DA6FF]">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        {p.tagline && (
                          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                            {p.tagline}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        {p.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {p.tech.map((t) => (
                              <span key={t} className="rounded border border-slate-200/50 bg-slate-100/80 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600 dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-slate-400">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 border-t border-slate-200/60 pt-3 font-mono text-[11px] font-bold dark:border-slate-800/60">
                          {p.liveUrl && (
                            <a className="text-indigo-600 transition-colors hover:underline dark:text-[#4DA6FF]" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                              LIVE_DEMO ↗
                            </a>
                          )}
                          {p.repoUrl && (
                            <a className="text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white" href={p.repoUrl} target="_blank" rel="noopener noreferrer">
                              CODE ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </Section>
            )}

            {/* Experience Timeline Grid Track */}
            {experiences.length > 0 && (
              <Section method="get_experience_history()" title="Deployment Track">
                <div className="space-y-4">
                  {experiences.map((e, i) => (
                    <div key={i} className="rounded-xl border border-slate-200/80 bg-white/50 p-5 backdrop-blur-xl transition-all duration-300 hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#080C14]/50 dark:hover:border-slate-700">
                      <div className="flex flex-col justify-between gap-x-4 gap-y-1 border-b border-slate-200/60 pb-3 dark:border-slate-800/60 sm:flex-row sm:items-baseline">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {e.title} <span className="font-normal text-slate-400">@</span> <span className="text-indigo-600 dark:text-[#4DA6FF]">{e.organization}</span>
                        </h4>
                        <span className="shrink-0 font-mono text-xs text-slate-400 dark:text-slate-500">
                          [{e.startDate ?? ""} — {e.endDate ?? "PRESENT"}]
                        </span>
                      </div>
                      {e.bullets.length > 0 && (
                        <ul className="mt-4 space-y-2 font-mono text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {e.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-2.5">
                              <span className="shrink-0 font-bold text-indigo-500 dark:text-[#4DA6FF]">=&gt;</span>
                              <span className="font-sans text-slate-600 dark:text-slate-400">{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

          </div>

          {/* COLUMN 3: Capabilities, Stack Modules & Education */}
          <div className="space-y-6">
            
            {/* Core Capability Inventory Panels */}
            {skills.length > 0 && (
              <Section method="load_capabilities()" title="Technical Stack">
                <div className="space-y-3">
                  {skills.map((s) => (
                    <div key={s.category} className="rounded-xl border border-slate-200/80 bg-white/50 p-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#080C14]/50">
                      <span className="mb-2.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#4DA6FF]">
                        :: {s.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {s.items.map((i) => (
                          <span key={i} className="rounded border border-slate-200/60 bg-slate-100/60 px-2 py-0.5 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Academic Track Array */}
            {educations.length > 0 && (
              <Section method="verify_credentials()" title="Academic Grid">
                <div className="space-y-4 rounded-xl border border-slate-200/80 bg-white/50 p-5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#080C14]/50">
                  {educations.map((ed, i) => (
                    <div key={i} className="space-y-1 border-l-2 border-indigo-500/40 pl-3.5 text-xs dark:border-indigo-400/40">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{ed.institution}</span>
                        {ed.endYear && <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">({ed.endYear})</span>}
                      </div>
                      <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {ed.degree} {ed.score && `[VAL: ${ed.score}]`}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

          </div>

        </div>

        {/* SYSTEM STATUS GRID FOOTER MODULE */}
        <footer className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/40 px-6 py-4 font-mono text-[10px] tracking-widest text-slate-400 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#080C14]/30 sm:flex-row">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM_NODE // DISPATCH_STABLE_OK
          </span>
          <a href="https://portxz.vercel.app" target="_blank" rel="noopener noreferrer" className="text-slate-500 transition-colors hover:text-indigo-600 dark:hover:text-[#4DA6FF]">
            INITIALIZE_INSTANCE ↗
          </a>
        </footer>

      </div>
    </main>
  );
}

interface SectionProps {
  title: string;
  method: string;
  children: React.ReactNode;
}

function Section({ title, method, children }: SectionProps) {
  return (
    <section className="w-full space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 dark:border-slate-800/80">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
            {title}
          </h2>
          <span className="hidden font-mono text-[10px] lowercase text-slate-400 dark:text-slate-600 sm:inline">
            .{method}
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-300 dark:text-slate-800">
          //0x_
        </span>
      </div>
      {children}
    </section>
  );
}