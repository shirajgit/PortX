"use client";
import { motion } from "framer-motion";
import type { TemplateProps } from "../types";

/* ── Noir template · premium edition ────────────────────────────────────
   Dark luxury, now cinematic: film-grain texture, breathing gold glow,
   slow serif reveals, numbers that slide on hover, shimmering hairlines.
   Everything unhurried — expensive things don't rush.                  */

const GOLD = "#D4B36A";
const INK = "#EDEAE2";
const DIM = "#8F8A7E";
const BODY = "#B8B3A6";

const slow = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

export function Noir({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-[#0B0B0D] font-sans text-[#EDEAE2] antialiased selection:bg-[#D4B36A]/20 selection:text-[#D4B36A]"
      data-fixed-theme
    >
      <style>{`
        @keyframes noirBreathe { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
        @keyframes noirShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes noirGrain { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-2%,1%)} 50%{transform:translate(1%,-2%)} 75%{transform:translate(-1%,2%)} }
        @media (prefers-reduced-motion: reduce) { .noir-anim { animation: none !important; } }
      `}</style>

      {/* breathing candle-glow */}
      <div
        aria-hidden
        className="noir-anim pointer-events-none absolute left-1/2 top-0 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4B36A] via-transparent to-transparent"
        style={{ animation: "noirBreathe 9s ease-in-out infinite", opacity: 0.03 }}
      />

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

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 sm:py-28">
        {/* HERO */}
        <header className="text-center">
          {profile.openToWork && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2"
            >
              <span className="h-1 w-1 animate-pulse rounded-full" style={{ background: GOLD }} />
              <p className="text-[10px] font-medium uppercase tracking-[0.4em]" style={{ color: GOLD }}>
                Available for select engagements
              </p>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl font-normal leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl"
          >
            {profile.fullName}
          </motion.h1>

          {/* shimmering hairline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="noir-anim mx-auto mt-8 h-px w-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, #F5E3B3, ${GOLD}, transparent)`,
              backgroundSize: "200% auto",
              animation: "noirShimmer 5s linear infinite",
            }}
          />

          {profile.headline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-8 text-xs font-medium uppercase tracking-[0.35em] sm:text-sm"
              style={{ color: DIM }}
            >
              {profile.headline}
            </motion.p>
          )}

          {profile.summary && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.85 }}
              className="mx-auto mt-8 max-w-xl text-[15px] font-light leading-relaxed sm:text-base sm:leading-loose"
              style={{ color: BODY }}
            >
              {profile.summary}
            </motion.p>
          )}

          {(links.length > 0 || profile.email) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3.5 text-xs font-medium uppercase tracking-[0.25em]"
            >
              {links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="group relative py-1 transition-colors duration-300 hover:text-white" style={{ color: GOLD }}>
                  <span>{l.label || l.kind}</span>
                  <span className="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-500 group-hover:w-full"
                    style={{ background: `linear-gradient(90deg, ${GOLD}, #F5E3B3)`, boxShadow: `0 0 8px ${GOLD}66` }} />
                </a>
              ))}
              {profile.email && (
                <a href={`mailto:${profile.email}`}
                  className="group relative py-1 transition-colors duration-300 hover:text-white" style={{ color: GOLD }}>
                  <span>Email</span>
                  <span className="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-500 group-hover:w-full"
                    style={{ background: `linear-gradient(90deg, ${GOLD}, #F5E3B3)`, boxShadow: `0 0 8px ${GOLD}66` }} />
                </a>
              )}
            </motion.div>
          )}
        </header>

        {/* PROJECTS */}
        {projects.length > 0 && (
          <NoirSection title="Selected Work">
            <div className="space-y-12">
              {projects.map((p, i) => (
                <motion.article key={p.name} {...slow} transition={{ ...slow.transition, delay: i * 0.1 }}
                  className="group relative">
                  <div className="flex items-baseline gap-5 sm:gap-7">
                    <span
                      className="font-serif text-2xl font-light transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-90 sm:text-3xl"
                      style={{ color: GOLD, opacity: 0.45, textShadow: `0 0 24px ${GOLD}00` }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 space-y-2 border-b border-transparent pb-6 transition-colors duration-500 group-hover:border-[#2A2820]">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-serif text-2xl font-normal transition-colors duration-300 group-hover:text-white">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-5 text-[10px] font-medium uppercase tracking-[0.25em]">
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                              className="transition-all duration-300 hover:tracking-[0.35em] hover:opacity-100"
                              style={{ color: GOLD, opacity: 0.85 }}>
                              View ↗
                            </a>
                          )}
                          {p.repoUrl && (
                            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer"
                              className="transition-opacity duration-300 hover:opacity-100"
                              style={{ color: DIM, opacity: 0.8 }}>
                              Source ↗
                            </a>
                          )}
                        </div>
                      </div>

                      {p.tagline && (
                        <p className="text-sm font-light leading-relaxed" style={{ color: BODY }}>
                          {p.tagline}
                        </p>
                      )}

                      {p.bullets.length > 0 && (
                        <ul className="space-y-1.5 pt-1 text-sm font-light leading-relaxed" style={{ color: BODY }}>
                          {p.bullets.map((b, j) => (
                            <li key={j} className="relative pl-5">
                              <span className="absolute left-0" style={{ color: GOLD, opacity: 0.7 }}>·</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}

                      {p.tech.length > 0 && (
                        <p className="pt-1 text-[10px] font-medium uppercase tracking-[0.25em]" style={{ color: DIM }}>
                          {p.tech.join("  ·  ")}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </NoirSection>
        )}

        {/* EXPERIENCE */}
        {experiences.length > 0 && (
          <NoirSection title="Experience">
            <div className="space-y-10">
              {experiences.map((e, i) => (
                <motion.div key={i} {...slow} transition={{ ...slow.transition, delay: i * 0.1 }} className="group space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl font-normal">
                      {e.title}{" "}
                      <span style={{ color: DIM }} className="font-light">— {e.organization}</span>
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: DIM }}>
                      {e.startDate ?? ""} — {e.endDate ?? "Present"}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="mt-3 space-y-2.5 text-sm font-light leading-relaxed" style={{ color: BODY }}>
                      {e.bullets.map((b, j) => (
                        <li key={j} className="relative pl-5">
                          <span className="absolute left-0" style={{ color: GOLD, opacity: 0.7 }}>·</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </NoirSection>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <NoirSection title="Capabilities">
            <div className="space-y-5">
              {skills.map((s, i) => (
                <motion.div key={s.category} {...slow} transition={{ ...slow.transition, delay: i * 0.08 }}
                  className="flex flex-col gap-1 text-sm font-light sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="min-w-[140px] shrink-0 text-[10px] font-medium uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                    {s.category}
                  </span>
                  <span className="leading-relaxed" style={{ color: BODY }}>
                    {s.items.join(", ")}
                  </span>
                </motion.div>
              ))}
            </div>
          </NoirSection>
        )}

        {/* EDUCATION */}
        {educations.length > 0 && (
          <NoirSection title="Education">
            <div className="space-y-4 text-sm font-light" style={{ color: BODY }}>
              {educations.map((ed, i) => (
                <motion.div key={i} {...slow} transition={{ ...slow.transition, delay: i * 0.08 }}
                  className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-serif text-base font-normal" style={{ color: INK }}>{ed.institution}</span>
                    {ed.degree && <span className="ml-2" style={{ color: BODY }}>— {ed.degree}</span>}
                    {ed.score && <span className="ml-2" style={{ color: DIM }}>· {ed.score}</span>}
                  </div>
                  {ed.endYear && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: DIM }}>
                      {ed.startYear ? `${ed.startYear}–` : ""}{ed.endYear}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </NoirSection>
        )}

        {/* FOOTER */}
        <motion.footer {...slow} className="mt-28 text-center">
          <div
            className="noir-anim mx-auto mb-6 h-px w-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${GOLD}, #F5E3B3, ${GOLD}, transparent)`,
              backgroundSize: "200% auto",
              animation: "noirShimmer 5s linear infinite",
              opacity: 0.4,
            }}
          />
          <p className="text-[10px] font-medium uppercase tracking-[0.4em]" style={{ color: DIM }}>
            built with Portxz
          </p>
        </motion.footer>
      </div>
    </main>
  );
}

function NoirSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-24">
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 flex items-center gap-6"
      >
        <h2 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.4em]" style={{ color: GOLD }}>
          {title}
        </h2>
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #2A2820, transparent)" }} />
      </motion.div>
      {children}
    </section>
  );
}