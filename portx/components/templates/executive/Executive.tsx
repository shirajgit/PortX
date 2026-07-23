"use client";
import { motion } from "framer-motion";
import type { TemplateProps } from "../types";

/* ── Executive template · premium edition ───────────────────────────────
   Corporate-clean, light by design. Premium = restraint: soft staggered
   reveals, hover depth, a timeline spine, and one quiet gradient accent.
   No neon. This one gets sent before interview week.                   */

const NAVY = "#1E3A5F";
const ACCENT = "#2563EB";

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export function Executive({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  return (
    <main
      className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B] antialiased selection:bg-[#2563EB]/10 selection:text-[#2563EB]"
      data-fixed-theme
    >
      {/* top accent bar with a slow sheen */}
      <div className="relative h-2 w-full overflow-hidden" style={{ background: `linear-gradient(90deg, ${NAVY}, ${ACCENT})` }}>
        <div
          className="absolute inset-y-0 w-1/3 bg-white/25 blur-sm"
          style={{ animation: "execSheen 6s ease-in-out infinite" }}
        />
      </div>
      <style>{`
        @keyframes execSheen { 0%{transform:translateX(-150%)} 60%,100%{transform:translateX(450%)} }
        @media (prefers-reduced-motion: reduce) { [style*="execSheen"] { animation: none !important; } }
      `}</style>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.06)] sm:p-10"
        >
          {/* whisper-quiet corner tint */}
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#2563EB]/[0.04] blur-3xl" />

          <div className="relative flex flex-col-reverse justify-between gap-6 sm:flex-row sm:items-start">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl" style={{ color: NAVY }}>
                {profile.fullName}
              </h1>

              {profile.headline && (
                <p className="text-base font-semibold sm:text-lg" style={{ color: ACCENT }}>
                  {profile.headline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs font-medium text-slate-500 sm:text-sm">
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                  </span>
                )}
                {profile.email && (
                  <a className="flex items-center gap-1.5 transition-colors hover:text-[#2563EB]" href={`mailto:${profile.email}`}>
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {profile.email}
                  </a>
                )}
              </div>
            </div>

            {profile.openToWork && (
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Open to opportunities
                </span>
              </div>
            )}
          </div>

          {profile.summary && (
            <p className="relative mt-6 border-t border-slate-100 pt-6 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              {profile.summary}
            </p>
          )}

          {links.length > 0 && (
            <div className="relative mt-6 flex flex-wrap gap-2.5">
              {links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-[#2563EB] hover:bg-white hover:text-[#2563EB] hover:shadow-md hover:shadow-blue-500/5">
                  <span>{l.label || l.kind}</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </a>
              ))}
            </div>
          )}
        </motion.header>

        {/* EXPERIENCE — timeline spine */}
        {experiences.length > 0 && (
          <ExecSection title="Professional Experience">
            <div className="relative space-y-4 pl-6">
              <div aria-hidden className="absolute bottom-6 left-[7px] top-2 w-px bg-gradient-to-b from-[#2563EB]/50 via-slate-200 to-transparent" />
              {experiences.map((e, i) => (
                <motion.article key={i} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}
                  className="relative rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
                  <span aria-hidden className="absolute -left-6 top-8 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-[#2563EB] shadow-[0_0_0_1px_#2563EB33]" />
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                    <h3 className="text-base font-bold sm:text-lg" style={{ color: NAVY }}>
                      {e.title} <span className="font-normal text-slate-500">· {e.organization}</span>
                    </h3>
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      {e.startDate ?? ""} – {e.endDate ?? "Present"}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <span className="mt-1 shrink-0 text-xs font-black" style={{ color: ACCENT }}>▸</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.article>
              ))}
            </div>
          </ExecSection>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <ExecSection title="Key Projects">
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p, i) => (
                <motion.div key={p.name} {...reveal} transition={{ ...reveal.transition, delay: (i % 2) * 0.08 }}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold transition-colors group-hover:text-[#2563EB]" style={{ color: NAVY }}>
                        {p.name}
                      </h3>
                      {p.featured && (
                        <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                          Featured
                        </span>
                      )}
                    </div>
                    {p.tagline && <p className="mt-2 text-xs leading-relaxed text-slate-600">{p.tagline}</p>}
                    {p.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-500">
                        {p.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0 font-black" style={{ color: ACCENT }}>·</span>
                            <span>{b}</span>
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
                  </div>
                </motion.div>
              ))}
            </div>
          </ExecSection>
        )}

        {/* SKILLS & EDUCATION */}
        {(skills.length > 0 || educations.length > 0) && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {skills.length > 0 && (
              <motion.div {...reveal} className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="h-4 w-1 rounded-full" style={{ background: ACCENT }} />
                  <h2 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: NAVY }}>
                    Core Capabilities
                  </h2>
                </div>
                <div className="mt-4 space-y-4">
                  {skills.map((s) => (
                    <div key={s.category}>
                      <p className="text-xs font-bold text-slate-500">{s.category}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.items.map((i) => (
                          <span key={i}
                            className="rounded-md border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-[#2563EB]/40 hover:bg-blue-50 hover:text-[#2563EB]">
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {educations.length > 0 && (
              <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.08 }}
                className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="h-4 w-1 rounded-full" style={{ background: ACCENT }} />
                  <h2 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: NAVY }}>
                    Education & Qualifications
                  </h2>
                </div>
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
              </motion.div>
            )}
          </div>
        )}

        <motion.footer {...reveal} className="mt-16 text-center text-xs font-medium text-slate-400">
          Built with Portxz
        </motion.footer>
      </div>
    </main>
  );
}

function ExecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mb-4 flex items-center gap-2.5"
      >
        <span className="h-5 w-1.5 rounded-full" style={{ background: ACCENT }} />
        <h2 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: NAVY }}>
          {title}
        </h2>
      </motion.div>
      {children}
    </section>
  );
}