"use client";
import { useState, useEffect } from "react";
import type { TemplateProps } from "../types";

export function Glass({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("portx-cyber-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      updateDOM(savedTheme);
    } else {
      updateDOM("dark");
    }
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
    localStorage.setItem("portx-cyber-theme", nextTheme);
    updateDOM(nextTheme);
  };

  return (
    <main className="min-h-screen w-full bg-[#FAFAFA] text-[#1E293B] transition-colors duration-500 dark:bg-[#04060A] dark:text-[#E2E8F0] antialiased overflow-x-hidden relative p-3 sm:p-6 md:p-8 selection:bg-[#4DA6FF]/30 font-sans">
      
      {/* Decorative Technical Crosshairs & Matrix Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)]" />
      <div className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-slate-300 dark:border-slate-800 opacity-40" />
      <div className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r border-t border-slate-300 dark:border-slate-800 opacity-40" />

      {/* Dynamic Luminous Vector Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-[140px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-5%] left-[-5%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 dark:bg-blue-500/5 blur-[120px] animate-[pulse_7s_ease-in-out_infinite]" />
      </div>

      {/* Main Responsive Command Wrapper */}
      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        
        {/* INTERACTIVE HUD HEADER */}
        <header className="w-full rounded-2xl border border-slate-200/80 bg-white/60 p-6 md:p-8 backdrop-blur-xl dark:border-slate-900 dark:bg-[#080C14]/80 shadow-[0_12px_40px_rgba(0,0,0,0.02)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-widest">
                <span className="rounded bg-slate-900 px-2 py-0.5 font-bold text-white dark:bg-white dark:text-black">
                  CORE_V3
                </span>
                <span className="text-indigo-600 dark:text-[#4DA6FF] font-semibold">
                  // STATUS: OPERATIONAL
                </span>
                {profile.openToWork && (
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-[#39D98A] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    [OPEN_TO_WORK]
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl xl:text-6xl">
                {profile.fullName}
              </h1>
              
              {profile.headline && (
                <div className="inline-block rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  &lambda; {profile.headline}
                </div>
              )}
            </div>

            {/* Utility / Theme Controller Anchor */}
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0 shrink-0">
              {links.length > 0 && (
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-600 transition-all hover:-translate-y-0.5 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#0D121F] dark:text-slate-400 dark:hover:text-white"
                    >
                      {l.label} <span className="text-[10px] opacity-40">↗</span>
                    </a>
                  ))}
                </div>
              )}
              
              <button
                onClick={toggleTheme}
                aria-label="Toggle runtime mode"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0D121F] dark:hover:bg-slate-800"
              >
                {theme === "light" ? (
                  <svg className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                ) : (
                  <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.136 5.136l1.591 1.591m11.144 11.144l1.591 1.591M3 12h2.25m13.5 0H21M5.136 18.864l1.591-1.591M17.864 5.136l1.591-1.591M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" /></svg>
                )}
              </button>
            </div>
          </div>
          
          {profile.summary && (
            <p className="mt-6 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-900 dark:text-slate-400 max-w-4xl">
              {profile.summary}
            </p>
          )}
        </header>

        {/* HIGH TECH PORTFOLIO SECTION LABELS AND ASYMMETRICAL WRAP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN 1 & 2: Primary Repos and Timeline Deployments */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Projects Registry Grid */}
            {projects.length > 0 && (
              <Section method="init_projects()" title="Project Repositories">
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((p) => (
                    <article 
                      key={p.name} 
                      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/70 bg-white/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/40 hover:bg-white dark:border-slate-900 dark:bg-[#080C14]/50 dark:hover:border-[#4DA6FF]/40 dark:hover:bg-[#0A101C] hover:shadow-xl hover:shadow-indigo-500/[0.01]"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#4DA6FF] transition-colors">
                            {p.name}
                          </h3>
                          {p.featured && (
                            <span className="font-mono text-[9px] font-bold tracking-widest text-indigo-600 dark:text-[#4DA6FF] border border-indigo-500/20 rounded bg-indigo-500/5 px-1.5 py-0.5">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        {p.tagline && <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{p.tagline}</p>}
                      </div>
                      
                      <div className="mt-6 space-y-4">
                        {p.tech.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {p.tech.map((t) => (
                              <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 font-mono text-[11px] font-bold border-t border-slate-100 pt-3 dark:border-slate-900">
                          {p.liveUrl && <a className="text-indigo-600 dark:text-[#4DA6FF] hover:underline" href={p.liveUrl} target="_blank" rel="noopener noreferrer">LIVE_DEMO ↗</a>}
                          {p.repoUrl && <a className="text-slate-400 hover:text-slate-900 dark:hover:text-white" href={p.repoUrl} target="_blank" rel="noopener noreferrer">CODE ↗</a>}
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
                    <div key={i} className="rounded-xl border border-slate-200/70 bg-white/40 p-5 dark:border-slate-900 dark:bg-[#080C14]/40">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-x-4 gap-y-1 pb-3 border-b border-slate-100 dark:border-slate-900">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {e.title} <span className="font-normal text-slate-400">@</span> <span className="text-indigo-600 dark:text-[#4DA6FF]">{e.organization}</span>
                        </h4>
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-500 shrink-0">
                          [{e.startDate ?? ""} — {e.endDate ?? "PRESENT"}]
                        </span>
                      </div>
                      {e.bullets.length > 0 && (
                        <ul className="mt-4 space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-mono">
                          {e.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-2.5">
                              <span className="text-indigo-500 dark:text-[#4DA6FF] font-bold shrink-0">=&gt;</span>
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

          {/* COLUMN 3: Capability Inventories, Stack Modules & Academic Matrices */}
          <div className="space-y-6">
            
            {/* Core Capability Inventory Panels */}
            {skills.length > 0 && (
              <Section method="load_capabilities()" title="Technical Stack">
                <div className="space-y-3">
                  {skills.map((s) => (
                    <div key={s.category} className="rounded-xl border border-slate-200/70 bg-white/50 p-4 dark:border-slate-900 dark:bg-[#080C14]/60">
                      <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#4DA6FF] mb-2.5">
                        :: {s.category}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {s.items.map((i) => (
                          <span key={i} className="rounded border border-slate-100 bg-slate-50/50 px-2 py-0.5 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
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
                <div className="rounded-xl border border-slate-200/70 bg-white/40 p-5 dark:border-slate-900 dark:bg-[#080C14]/40 space-y-4">
                  {educations.map((ed, i) => (
                    <div key={i} className="text-xs border-l-2 border-slate-200 dark:border-slate-800 pl-3.5 space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{ed.institution}</span>
                        {ed.endYear && <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">({ed.endYear})</span>}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
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
        <footer className="w-full rounded-xl border border-slate-200/60 bg-white/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] tracking-widest text-slate-400 dark:border-slate-900/50 dark:bg-[#080C14]/20">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM_NODE // DISPATCH_STABLE_OK
          </span>
          <a href="https://portxz.in" className="text-slate-500 hover:text-indigo-600 dark:hover:text-[#4DA6FF] transition-colors">INITIALIZE_INSTANCE ↗</a>
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
      {/* Decorative Syntax Accent Headers */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-900 pb-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
            {title}
          </h2>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-600 lowercase hidden sm:inline">
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