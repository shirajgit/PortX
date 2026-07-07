import type { TemplateProps } from "../types";

/* ── Glassmorphism template ─────────────────────────────────────────────
   Frosted translucent cards floating over soft gradient orbs.
   Server component — no interactivity needed, stays fast.             */

const glass =
  "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.35)]";

export function Glass({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070B18] font-sans text-[#EDF1F9]">
      {/* gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-[#4DA6FF]/25 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-[#7C5CFF]/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 h-[380px] w-[380px] rounded-full bg-[#39D98A]/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-6">
        {/* ── header ── */}
        <header className={`${glass} p-8 text-center sm:p-10`}>
          {profile.openToWork && (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1 text-xs text-[#39D98A]">
              <span className="h-2 w-2 rounded-full bg-[#39D98A] shadow-[0_0_10px_#39D98A]" />
              open to work
            </span>
          )}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{profile.fullName}</h1>
          {profile.headline && (
            <p className="mt-3 bg-gradient-to-r from-[#8FC4FF] to-[#B79CFF] bg-clip-text text-lg font-medium text-transparent">
              {profile.headline}
            </p>
          )}
          {profile.summary && (
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">{profile.summary}</p>
          )}
          {links.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-sm text-[#8FC4FF] transition hover:border-[#4DA6FF]/60 hover:bg-white/[0.1]">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </header>

        {/* ── projects ── */}
        {projects.length > 0 && (
          <Section title="Projects">
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <article key={p.name} className={`${glass} p-5 transition hover:bg-white/[0.09]`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold">{p.name}</h3>
                    {p.featured && <span className="text-xs text-[#FFB454]">★</span>}
                  </div>
                  {p.tagline && <p className="mt-1.5 text-sm text-white/55">{p.tagline}</p>}
                  {p.tech.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span key={t} className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[11px] text-[#8FC4FF]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-4 text-xs font-medium">
                    {p.liveUrl && <a className="text-[#8FC4FF] hover:text-white" href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live ↗</a>}
                    {p.repoUrl && <a className="text-[#8FC4FF] hover:text-white" href={p.repoUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>}
                  </div>
                </article>
              ))}
            </div>
          </Section>
        )}

        {/* ── experience ── */}
        {experiences.length > 0 && (
          <Section title="Experience">
            <div className="space-y-4">
              {experiences.map((e, i) => (
                <div key={i} className={`${glass} p-5`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">
                      {e.title} <span className="text-white/40">·</span>{" "}
                      <span className="text-[#8FC4FF]">{e.organization}</span>
                    </h3>
                    <span className="text-xs text-white/45">
                      {e.startDate ?? ""} – {e.endDate ?? "Present"}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm text-white/60">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="relative pl-4 before:absolute before:left-0 before:text-[#4DA6FF] before:content-['›']">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── skills ── */}
        {skills.length > 0 && (
          <Section title="Skills">
            <div className={`${glass} space-y-4 p-6`}>
              {skills.map((s) => (
                <div key={s.category}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#8FC4FF]">{s.category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((i) => (
                      <span key={i} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/75">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── education ── */}
        {educations.length > 0 && (
          <Section title="Education">
            <div className={`${glass} space-y-3 p-6`}>
              {educations.map((ed, i) => (
                <p key={i} className="text-sm text-white/60">
                  <span className="font-medium text-white/90">{ed.institution}</span>
                  {ed.degree && ` — ${ed.degree}`}
                  {ed.endYear && ` (${ed.startYear ? `${ed.startYear}–` : ""}${ed.endYear})`}
                  {ed.score && ` · ${ed.score}`}
                </p>
              ))}
            </div>
          </Section>
        )}

        <footer className="mt-14 text-center text-xs text-white/35">built with portX</footer>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{title}</h2>
      {children}
    </section>
  );
}
