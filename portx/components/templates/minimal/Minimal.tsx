"use client";
import { useState, useEffect } from "react";
import type { TemplateProps } from "../types";

export function Minimal({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;
  
  // Default to light mode, fall back to localStorage if already toggled by user
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("Portxz-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      updateDOM(savedTheme);
    } else {
      // Ensure initial mount matches default light state explicitly
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
    <main className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] transition-colors duration-300 dark:bg-[#030712] dark:text-[#F1F5F9] antialiased selection:bg-[#4DA6FF]/30">
      
      {/* Background ambient mesh grid accents (Only visible in dark mode for aesthetic polish) */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-0 dark:opacity-30 transition-opacity duration-300">
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -right-20 top-1/3 h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[150px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        
        {/* LEFT COLUMN: Sticky Profile Dashboard */}
        <div className="w-full shrink-0 border-b border-slate-200 bg-white/60 dark:border-slate-800/60 dark:bg-[#070D19]/40 px-6 py-12 backdrop-blur-md lg:sticky lg:top-0 lg:h-screen lg:w-[380px] lg:border-b-0 lg:border-r lg:px-10 lg:py-20 xl:w-[420px]">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                {profile.openToWork ? (
                  <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-emerald-600 dark:text-[#39D98A]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    AVAILABLE FOR WORK
                  </div>
                ) : <div />}

                {/* THEME TOGGLE BUTTON */}
                <button 
                  onClick={toggleTheme}
                  aria-label="Toggle theme layout"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-[#0E172A] dark:hover:bg-slate-800"
                >
                  {theme === "light" ? (
                    /* Dark Mode Moon Icon */
                    <svg className="h-4 w-4 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  ) : (
                    /* Light Mode Sun Icon */
                    <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.136 5.136l1.591 1.591m11.144 11.144l1.591 1.591M3 12h2.25m13.5 0H21M5.136 18.864l1.591-1.591M17.864 5.136l1.591-1.591M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl xl:text-5xl">
                {profile.fullName}
              </h1>
              
              {profile.headline && (
                <p className="mt-3 font-mono text-sm font-semibold tracking-wide text-[#4DA6FF] dark:text-[#4DA6FF] uppercase">
                  // {profile.headline}
                </p>
              )}
              
              {profile.summary && (
                <p className="mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 xl:text-base">
                  {profile.summary}
                </p>
              )}
            </div>

            {/* Profiles Links Wrapper */}
            <div className="mt-12 lg:mt-0">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Connect Matrix</span>
              {links.length > 0 && (
                <div className="flex flex-col gap-2 font-mono text-xs">
                  {links.map((l) => (
                    <a 
                      key={l.url} 
                      href={l.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white/50 p-2.5 transition-all hover:border-[#4DA6FF]/40 hover:bg-white dark:border-slate-800/50 dark:bg-[#0A1120]/50 dark:hover:border-[#4DA6FF]/30 dark:hover:bg-[#0E172A]"
                    >
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{l.label}</span>
                      <span className="text-slate-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#4DA6FF]">↗</span>
                    </a>
                  ))}
                </div>
              )}
              
              <div className="mt-8 hidden items-center justify-between border-t border-slate-200 dark:border-slate-800/60 pt-4 font-mono text-[10px] text-slate-400 dark:text-slate-600 lg:flex">
                <span>SYSTEM: PORTXZ_V2</span>
                <a href="https://Portxz.vercel.app" className="hover:text-slate-900 dark:hover:text-white">CLAIM LINK ↗</a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrolling Live Feed Grid */}
        <div className="flex-1 px-6 py-12 lg:px-12 lg:py-20 xl:px-20">
          <div className="mx-auto max-w-5xl space-y-16">
            
            {/* Projects Showcase Grid */}
            {projects.length > 0 && (
              <Section title="Production Repositories">
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((p) => (
                    <article 
                      key={p.name} 
                      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4DA6FF]/40 hover:shadow-md dark:border-slate-800/80 dark:bg-[#090F1C]/40 dark:hover:border-[#4DA6FF]/40 dark:hover:bg-[#0D1527]/70"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white transition-colors duration-150 group-hover:text-[#4DA6FF]">
                            {p.name}
                          </h3>
                          <div className="flex gap-3 font-mono text-[11px] font-medium shrink-0">
                            {p.liveUrl && (
                              <a className="text-[#4DA6FF] opacity-90 hover:opacity-100 hover:underline" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                                live
                              </a>
                            )}
                            {p.repoUrl && (
                              <a className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:underline" href={p.repoUrl} target="_blank" rel="noopener noreferrer">
                                code
                              </a>
                            )}
                          </div>
                        </div>
                        {p.tagline && <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{p.tagline}</p>}
                      </div>
                      
                      {p.tech.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-1">
                          {p.tech.map((t) => (
                            <span 
                              key={t} 
                              className="rounded bg-slate-100 dark:bg-[#121B30] px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-600 dark:text-[#8FC4FF]/80"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </Section>
            )}

            {/* Work History Section */}
            {experiences.length > 0 && (
              <Section title="Deployment History">
                <div className="relative border-l border-slate-200 dark:border-slate-800/80 pl-6 space-y-8">
                  {experiences.map((e, i) => (
                    <div key={i} className="group relative">
                      <div className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full border border-slate-100 bg-slate-400 transition-colors duration-200 group-hover:bg-[#4DA6FF] group-hover:ring-4 group-hover:ring-[#4DA6FF]/20 dark:border-slate-900 dark:bg-slate-700" />
                      
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {e.title} <span className="font-normal text-slate-400 dark:text-slate-500">@</span> <span className="text-[#4DA6FF]">{e.organization}</span>
                        </h3>
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                          {e.startDate ?? ""} — {e.endDate ?? "Present"}
                        </span>
                      </div>
                      {e.bullets.length > 0 && (
                        <ul className="mt-2.5 space-y-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {e.bullets.map((b, j) => (
                            <li key={j}>
                              <span className="text-[#4DA6FF]/50 font-mono mr-1.5">└</span> {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Stack / Skills Block */}
            {skills.length > 0 && (
              <Section title="Core Capabilities">
                <div className="grid gap-3 sm:grid-cols-2">
                  {skills.map((s) => (
                    <div key={s.category} className="rounded-xl border border-slate-200 bg-white/50 dark:border-slate-800/40 dark:bg-[#080E1A]/20 p-4">
                      <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#4DA6FF]">
                        {s.category}
                      </span>
                      <span className="mt-1.5 block text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {s.items.join(" • ")}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Education History */}
            {educations.length > 0 && (
              <Section title="Academic Grounding">
                <div className="grid gap-4 sm:grid-cols-2">
                  {educations.map((ed, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 bg-white/40 dark:border-slate-800/40 dark:bg-[#080E1A]/10 p-4 text-xs">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{ed.institution}</span>
                        {ed.endYear && <span className="font-mono text-[10px] text-slate-400 dark:text-slate-600">{ed.endYear}</span>}
                      </div>
                      <p className="mt-1 text-slate-500 dark:text-slate-400">
                        {ed.degree}{ed.score && <span className="text-slate-300 dark:text-slate-700"> | </span>}{ed.score}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Responsive Mobile Footer */}
            <footer className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/40 pt-6 font-mono text-[10px] text-slate-400 dark:text-slate-600 lg:hidden">
              <span>SYSTEM // PORTXZ</span>
              <a href="https://Portxz.vercel.app" className="hover:text-[#4DA6FF]">CLAIM YOUR LINK ↗</a>
            </footer>

          </div>
        </div>

      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 whitespace-nowrap">
          {title}
        </h2>
        <div className="h-[1px] w-full bg-gradient-to-r from-slate-200 matrix to-transparent dark:from-slate-800/80" />
      </div>
      {children}
    </section>
  );
}