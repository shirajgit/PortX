import type { TemplateProps } from "../types";

/* ── Noir template ──────────────────────────────────────────────────────
   Dark luxury: near-black canvas, champagne-gold accents, oversized serif
   display name, hairline gold rules. Quiet, expensive. Server component. */

const GOLD = "#D4B36A";
const INK = "#EDEAE2";
const DIM = "#8F8A7E";

export function Noir({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  return (
    <main className="min-h-screen bg-[#0B0B0D] text-[#EDEAE2]" data-fixed-theme>
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        {/* hero */}
        <header className="text-center">
          {profile.openToWork && (
            <p className="mb-8 text-[10px] uppercase tracking-[0.4em]" style={{ color: GOLD }}>
              Available for select engagements
            </p>
          )}
          <h1 className="font-serif text-6xl font-medium leading-none tracking-tight sm:text-8xl">
            {profile.fullName}
          </h1>
          <div className="mx-auto mt-8 h-px w-24" style={{ background: GOLD }} />
          {profile.headline && (
            <p className="mt-8 text-sm uppercase tracking-[0.3em]" style={{ color: DIM }}>
              {profile.headline}
            </p>
          )}
          {profile.summary && (
            <p className="mx-auto mt-8 max-w-xl text-[15px] leading-loose" style={{ color: "#B8B3A6" }}>
              {profile.summary}
            </p>
          )}
          {(links.length > 0 || profile.email) && (
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.25em]">
              {links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="transition hover:opacity-100" style={{ color: GOLD, opacity: 0.85 }}>
                  {l.label}
                </a>
              ))}
              {profile.email && (
                <a href={`mailto:${profile.email}`}
                  className="transition hover:opacity-100" style={{ color: GOLD, opacity: 0.85 }}>
                  Email
                </a>
              )}
            </div>
          )}
        </header>

        {/* projects */}
        {projects.length > 0 && (
          <NoirSection title="Selected Work">
            <div className="space-y-12">
              {projects.map((p, i) => (
                <article key={p.name}>
                  <div className="flex items-baseline gap-5">
                    <span className="font-serif text-3xl" style={{ color: GOLD, opacity: 0.55 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-serif text-2xl">{p.name}</h3>
                        <div className="flex gap-5 text-[10px] uppercase tracking-[0.25em]">
                          {p.liveUrl && <a style={{ color: GOLD }} href={p.liveUrl} target="_blank" rel="noopener noreferrer">View</a>}
                          {p.repoUrl && <a style={{ color: DIM }} href={p.repoUrl} target="_blank" rel="noopener noreferrer">Source</a>}
                        </div>
                      </div>
                      {p.tagline && <p className="mt-2 text-sm leading-relaxed" style={{ color: "#B8B3A6" }}>{p.tagline}</p>}
                      {p.tech.length > 0 && (
                        <p className="mt-3 text-[10px] uppercase tracking-[0.25em]" style={{ color: DIM }}>
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

        {/* experience */}
        {experiences.length > 0 && (
          <NoirSection title="Experience">
            <div className="space-y-10">
              {experiences.map((e, i) => (
                <div key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl">
                      {e.title} <span style={{ color: DIM }}>— {e.organization}</span>
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: DIM }}>
                      {e.startDate ?? ""} — {e.endDate ?? "Present"}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: "#B8B3A6" }}>
                      {e.bullets.map((b, j) => (
                        <li key={j} className="relative pl-5">
                          <span className="absolute left-0" style={{ color: GOLD }}>·</span>
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

        {/* skills */}
        {skills.length > 0 && (
          <NoirSection title="Capabilities">
            <div className="space-y-4">
              {skills.map((s) => (
                <p key={s.category} className="text-sm leading-relaxed">
                  <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                    {s.category}
                  </span>
                  <span className="ml-4" style={{ color: "#B8B3A6" }}>{s.items.join(", ")}</span>
                </p>
              ))}
            </div>
          </NoirSection>
        )}

        {/* education */}
        {educations.length > 0 && (
          <NoirSection title="Education">
            <div className="space-y-2 text-sm" style={{ color: "#B8B3A6" }}>
              {educations.map((ed, i) => (
                <p key={i}>
                  <span className="font-serif text-base" style={{ color: INK }}>{ed.institution}</span>
                  {ed.degree && ` — ${ed.degree}`}
                  {ed.endYear && ` (${ed.startYear ? `${ed.startYear}–` : ""}${ed.endYear})`}
                  {ed.score && ` · ${ed.score}`}
                </p>
              ))}
            </div>
          </NoirSection>
        )}

        <footer className="mt-24 text-center">
          <div className="mx-auto mb-6 h-px w-24" style={{ background: GOLD, opacity: 0.5 }} />
          <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: DIM }}>
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
        <h2 className="shrink-0 text-[11px] uppercase tracking-[0.4em]" style={{ color: GOLD }}>
          {title}
        </h2>
        <div className="h-px flex-1" style={{ background: "#2A2820" }} />
      </div>
      {children}
    </section>
  );
}
