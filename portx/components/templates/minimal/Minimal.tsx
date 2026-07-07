import type { TemplateProps } from "../types";

/* Minimal template — blue-black, single column, fast. */
export function Minimal({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;
  return (
    <main className="min-h-screen bg-[#0A0F1E] text-[#E8EDF7] font-sans">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* header */}
        <header className="mb-14">
          {profile.openToWork && (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1E2C52] px-3 py-1 font-mono text-xs text-[#39D98A]">
              <span className="h-2 w-2 rounded-full bg-[#39D98A]" /> open to work
            </span>
          )}
          <h1 className="text-4xl font-bold tracking-tight">{profile.fullName}</h1>
          {profile.headline && <p className="mt-2 text-lg text-[#4DA6FF]">{profile.headline}</p>}
          {profile.summary && <p className="mt-4 max-w-xl text-[#8B98B8]">{profile.summary}</p>}
          {links.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-4 font-mono text-sm">
              {links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                   className="text-[#8FC4FF] hover:text-white">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </header>

        {/* projects */}
        {projects.length > 0 && (
          <Section title="Projects">
            <div className="grid gap-4">
              {projects.map((p) => (
                <article key={p.name} className="rounded-xl border border-[#1E2C52] bg-[#111A36] p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <div className="flex gap-3 font-mono text-xs">
                      {p.liveUrl && <a className="text-[#8FC4FF]" href={p.liveUrl} target="_blank" rel="noopener noreferrer">live ↗</a>}
                      {p.repoUrl && <a className="text-[#8FC4FF]" href={p.repoUrl} target="_blank" rel="noopener noreferrer">code ↗</a>}
                    </div>
                  </div>
                  {p.tagline && <p className="mt-1 text-sm text-[#8B98B8]">{p.tagline}</p>}
                  {p.tech.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <span key={t} className="rounded border border-[#1E2C52] px-2 py-0.5 font-mono text-[11px] text-[#8FC4FF]">{t}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </Section>
        )}

        {/* experience */}
        {experiences.length > 0 && (
          <Section title="Experience">
            <div className="space-y-8">
              {experiences.map((e, i) => (
                <div key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">{e.title} · <span className="text-[#4DA6FF]">{e.organization}</span></h3>
                    <span className="font-mono text-xs text-[#8B98B8]">
                      {e.startDate ?? ""} – {e.endDate ?? "Present"}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-[#8B98B8]">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="pl-4 relative before:absolute before:left-0 before:content-['›'] before:text-[#4DA6FF]">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* skills */}
        {skills.length > 0 && (
          <Section title="Skills">
            <div className="space-y-3">
              {skills.map((s) => (
                <p key={s.category} className="text-sm">
                  <span className="font-mono text-[#4DA6FF]">{s.category}: </span>
                  <span className="text-[#8B98B8]">{s.items.join(", ")}</span>
                </p>
              ))}
            </div>
          </Section>
        )}

        {/* education */}
        {educations.length > 0 && (
          <Section title="Education">
            {educations.map((ed, i) => (
              <p key={i} className="text-sm text-[#8B98B8]">
                <span className="text-[#E8EDF7]">{ed.institution}</span>
                {ed.degree && ` — ${ed.degree}`}
                {ed.endYear && ` (${ed.endYear})`}
                {ed.score && ` · ${ed.score}`}
              </p>
            ))}
          </Section>
        )}

        <footer className="mt-16 border-t border-[#1E2C52] pt-6 font-mono text-xs text-[#8B98B8]">
          built with portX
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-5 font-mono text-sm uppercase tracking-[0.14em] text-[#4DA6FF]">{title}</h2>
      {children}
    </section>
  );
}
