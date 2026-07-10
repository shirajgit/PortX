import type { TemplateProps } from "../types";

/* ── Aurora template ────────────────────────────────────────────────────
   Deep-space canvas with aurora gradient washes (teal → violet → magenta),
   glowing accents, soft glass cards. Modern and luminous. Server component;
   the aurora is pure CSS gradients — zero JS.                           */

const card = "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm";

export function Aurora({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070912] font-sans text-[#E9EDF7]" data-fixed-theme>
      {/* aurora washes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-[10%] h-[500px] w-[700px] rotate-12 rounded-full bg-[#22D3EE]/20 blur-[140px]" />
        <div className="absolute top-40 right-[5%] h-[450px] w-[550px] -rotate-12 rounded-full bg-[#8B5CF6]/20 blur-[140px]" />
        <div className="absolute top-[55%] left-[20%] h-[400px] w-[600px] rounded-full bg-[#EC4899]/12 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* hero */}
        <header>
          {profile.openToWork && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-4 py-1.5 text-xs font-medium text-[#67E8F9]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#67E8F9]" /> open to work
            </span>
          )}
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6] bg-clip-text text-transparent">
              {profile.fullName}
            </span>
          </h1>
          {profile.headline && <p className="mt-4 text-xl text-[#9BA6C6]">{profile.headline}</p>}
          {profile.summary && (
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#8B96B5]">{profile.summary}</p>
          )}
          {(links.length > 0 || profile.email) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-[#C7CFE5] transition hover:border-[#67E8F9]/50 hover:text-[#67E8F9] hover:shadow-[0_0_20px_rgba(103,232,249,0.15)]">
                  {l.label}
                </a>
              ))}
              {profile.email && (
                <a href={`mailto:${profile.email}`}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-[#C7CFE5] transition hover:border-[#F472B6]/50 hover:text-[#F472B6] hover:shadow-[0_0_20px_rgba(244,114,182,0.15)]">
                  Email
                </a>
              )}
            </div>
          )}
        </header>

        {/* projects */}
        {projects.length > 0 && (
          <AuroraSection title="Projects" glow="#67E8F9">
            <div className="space-y-4">
              {projects.map((p) => (
                <article key={p.name} className={`${card} transition hover:border-[#67E8F9]/30`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <div className="flex gap-4 text-xs font-medium">
                      {p.liveUrl && <a className="text-[#67E8F9] hover:underline" href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live ↗</a>}
                      {p.repoUrl && <a className="text-[#9BA6C6] hover:text-[#67E8F9]" href={p.repoUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>}
                    </div>
                  </div>
                  {p.tagline && <p className="mt-1.5 text-sm text-[#8B96B5]">{p.tagline}</p>}
                  {p.tech.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span key={t} className="rounded-full bg-gradient-to-r from-[#22D3EE]/10 to-[#8B5CF6]/10 px-2.5 py-0.5 text-[11px] text-[#A5B0D0]">{t}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </AuroraSection>
        )}

        {/* experience */}
        {experiences.length > 0 && (
          <AuroraSection title="Experience" glow="#A78BFA">
            <div className="space-y-4">
              {experiences.map((e, i) => (
                <div key={i} className={card}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">
                      {e.title} <span className="text-[#A78BFA]">@ {e.organization}</span>
                    </h3>
                    <span className="text-xs text-[#6B7694]">{e.startDate ?? ""} – {e.endDate ?? "Present"}</span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[#8B96B5]">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="relative pl-4">
                          <span className="absolute left-0 text-[#A78BFA]">·</span>{b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </AuroraSection>
        )}

        {/* skills */}
        {skills.length > 0 && (
          <AuroraSection title="Skills" glow="#F472B6">
            <div className={card}>
              <div className="space-y-4">
                {skills.map((s) => (
                  <div key={s.category}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#F472B6]">{s.category}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.items.map((i) => (
                        <span key={i} className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-[#C7CFE5]">{i}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AuroraSection>
        )}

        {/* education */}
        {educations.length > 0 && (
          <AuroraSection title="Education" glow="#67E8F9">
            <div className={`${card} space-y-2 text-sm text-[#8B96B5]`}>
              {educations.map((ed, i) => (
                <p key={i}>
                  <span className="font-semibold text-[#E9EDF7]">{ed.institution}</span>
                  {ed.degree && ` — ${ed.degree}`}
                  {ed.endYear && ` (${ed.startYear ? `${ed.startYear}–` : ""}${ed.endYear})`}
                  {ed.score && ` · ${ed.score}`}
                </p>
              ))}
            </div>
          </AuroraSection>
        )}

        <footer className="mt-20 text-center text-xs text-[#6B7694]">built with Portxz</footer>
      </div>
    </main>
  );
}

function AuroraSection({ title, glow, children }: { title: string; glow: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.25em]" style={{ color: glow, textShadow: `0 0 24px ${glow}55` }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
