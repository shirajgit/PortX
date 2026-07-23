import type { TemplateProps } from "../types";

/* ── Noir template ──────────────────────────────────────────────────────
   Dark luxury: near-black canvas, champagne-gold accents, oversized serif
   display name, hairline gold rules. Quiet, expensive. Server component. */

const GOLD = "#D4B36A";
const INK = "#EDEAE2";
const DIM = "#8F8A7E";
const BODY = "#B8B3A6";

export function Noir({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-[#0B0B0D] font-sans text-[#EDEAE2] antialiased selection:bg-[#D4B36A]/20 selection:text-[#D4B36A]"
      data-fixed-theme
    >
      {/* Ambient luxury radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4B36A]/[0.03] via-transparent to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 sm:py-28">
        
        {/* HERO HEADER */}
        <header className="text-center">
          {profile.openToWork && (
            <div className="mb-8 inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full animate-pulse" style={{ background: GOLD }} />
              <p
                className="text-[10px] font-medium uppercase tracking-[0.4em]"
                style={{ color: GOLD }}
              >
                Available for select engagements
              </p>
            </div>
          )}

          <h1 className="font-serif text-5xl font-normal leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
            {profile.fullName}
          </h1>

          <div
            className="mx-auto mt-8 h-px w-20"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
          />

          {profile.headline && (
            <p
              className="mt-8 text-xs font-medium uppercase tracking-[0.35em] sm:text-sm"
              style={{ color: DIM }}
            >
              {profile.headline}
            </p>
          )}

          {profile.summary && (
            <p
              className="mx-auto mt-8 max-w-xl text-[15px] font-light leading-relaxed sm:text-base sm:leading-loose"
              style={{ color: BODY }}
            >
              {profile.summary}
            </p>
          )}

          {(links.length > 0 || profile.email) && (
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3.5 text-xs font-medium uppercase tracking-[0.25em]">
              {links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative py-1 transition-colors hover:text-white"
                  style={{ color: GOLD }}
                >
                  <span>{l.label || l.kind}</span>
                  <span
                    className="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full"
                    style={{ background: GOLD }}
                  />
                </a>
              ))}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="group relative py-1 transition-colors hover:text-white"
                  style={{ color: GOLD }}
                >
                  <span>Email</span>
                  <span
                    className="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full"
                    style={{ background: GOLD }}
                  />
                </a>
              )}
            </div>
          )}
        </header>

        {/* PROJECTS SECTION */}
        {projects.length > 0 && (
          <NoirSection title="Selected Work">
            <div className="space-y-12">
              {projects.map((p, i) => (
                <article key={p.name} className="group relative">
                  <div className="flex items-baseline gap-5 sm:gap-7">
                    <span
                      className="font-serif text-2xl font-light sm:text-3xl"
                      style={{ color: GOLD, opacity: 0.45 }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-serif text-2xl font-normal transition-colors duration-200 group-hover:text-white">
                          {p.name}
                        </h3>

                        <div className="flex items-center gap-5 text-[10px] font-medium uppercase tracking-[0.25em]">
                          {p.liveUrl && (
                            <a
                              href={p.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-opacity hover:opacity-100"
                              style={{ color: GOLD, opacity: 0.85 }}
                            >
                              View ↗
                            </a>
                          )}
                          {p.repoUrl && (
                            <a
                              href={p.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-opacity hover:opacity-100"
                              style={{ color: DIM, opacity: 0.8 }}
                            >
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

                      {p.tech.length > 0 && (
                        <p
                          className="pt-1 text-[10px] font-medium uppercase tracking-[0.25em]"
                          style={{ color: DIM }}
                        >
                          {p.tech.join("  ·  ")}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </NoirSection>
        )}

        {/* EXPERIENCE SECTION */}
        {experiences.length > 0 && (
          <NoirSection title="Experience">
            <div className="space-y-10">
              {experiences.map((e, i) => (
                <div key={i} className="group space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl font-normal">
                      {e.title}{" "}
                      <span style={{ color: DIM }} className="font-light">
                        — {e.organization}
                      </span>
                    </h3>
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: DIM }}
                    >
                      {e.startDate ?? ""} — {e.endDate ?? "Present"}
                    </span>
                  </div>

                  {e.bullets.length > 0 && (
                    <ul className="mt-3 space-y-2.5 text-sm font-light leading-relaxed" style={{ color: BODY }}>
                      {e.bullets.map((b, j) => (
                        <li key={j} className="relative pl-5">
                          <span className="absolute left-0" style={{ color: GOLD, opacity: 0.7 }}>
                            ·
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </NoirSection>
        )}

        {/* CAPABILITIES / SKILLS SECTION */}
        {skills.length > 0 && (
          <NoirSection title="Capabilities">
            <div className="space-y-5">
              {skills.map((s) => (
                <div
                  key={s.category}
                  className="flex flex-col gap-1 text-sm font-light sm:flex-row sm:items-baseline sm:gap-4"
                >
                  <span
                    className="min-w-[140px] shrink-0 text-[10px] font-medium uppercase tracking-[0.25em]"
                    style={{ color: GOLD }}
                  >
                    {s.category}
                  </span>
                  <span className="leading-relaxed" style={{ color: BODY }}>
                    {s.items.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </NoirSection>
        )}

        {/* EDUCATION SECTION */}
        {educations.length > 0 && (
          <NoirSection title="Education">
            <div className="space-y-4 text-sm font-light" style={{ color: BODY }}>
              {educations.map((ed, i) => (
                <div key={i} className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-serif text-base font-normal" style={{ color: INK }}>
                      {ed.institution}
                    </span>
                    {ed.degree && <span className="ml-2" style={{ color: BODY }}>— {ed.degree}</span>}
                    {ed.score && <span className="ml-2" style={{ color: DIM }}>· {ed.score}</span>}
                  </div>
                  {ed.endYear && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: DIM }}>
                      {ed.startYear ? `${ed.startYear}–` : ""}{ed.endYear}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </NoirSection>
        )}

        {/* FOOTER */}
        <footer className="mt-28 text-center">
          <div
            className="mx-auto mb-6 h-px w-20"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, opacity: 0.4 }}
          />
          <p className="text-[10px] font-medium uppercase tracking-[0.4em]" style={{ color: DIM }}>
            built with Portxz
          </p>
        </footer>

      </div>
    </main>
  );
}

function NoirSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-24">
      <div className="mb-10 flex items-center gap-6">
        <h2 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.4em]" style={{ color: GOLD }}>
          {title}
        </h2>
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #2A2820, transparent)" }} />
      </div>
      {children}
    </section>
  );
}