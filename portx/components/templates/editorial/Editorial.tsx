import type { TemplateProps } from "../types";

/* ── Editorial template ─────────────────────────────────────────────────
   Warm paper background, serif display type, numbered sections, hairline
   rules. Magazine/editorial feel — made for working professionals as much
   as developers. Server component, zero JS. Always light by design.    */

export function Editorial({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;
  let section = 0;
  const num = () => String(++section).padStart(2, "0");

  return (
    <main className="min-h-screen bg-[#FAF7F1] font-serif text-[#191714]" data-fixed-theme>
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* masthead */}
        <header className="border-b-2 border-[#191714] pb-10">
          <div className="flex items-baseline justify-between font-sans text-[11px] uppercase tracking-[0.25em] text-[#8A8377]">
            <span>{profile.location || "Portfolio"}</span>
            {profile.openToWork && <span className="text-[#B4532A]">● Open to opportunities</span>}
          </div>
          <h1 className="mt-6 text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            {profile.fullName}
          </h1>
          {profile.headline && (
            <p className="mt-4 text-xl italic text-[#5C554B] sm:text-2xl">{profile.headline}</p>
          )}
          {profile.summary && (
            <p className="mt-6 max-w-xl font-sans text-[15px] leading-relaxed text-[#44403A]">
              {profile.summary}
            </p>
          )}
          {(links.length > 0 || profile.email) && (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
              {links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="border-b border-[#191714]/30 pb-0.5 transition hover:border-[#B4532A] hover:text-[#B4532A]">
                  {l.label}
                </a>
              ))}
              {profile.email && (
                <a href={`mailto:${profile.email}`}
                  className="border-b border-[#191714]/30 pb-0.5 transition hover:border-[#B4532A] hover:text-[#B4532A]">
                  {profile.email}
                </a>
              )}
            </div>
          )}
        </header>

        {/* work / projects */}
        {projects.length > 0 && (
          <Section n={num()} title="Selected Work">
            <div className="space-y-10">
              {projects.map((p) => (
                <article key={p.name} className="group">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-2xl font-medium">
                      {p.name}
                      {p.featured && <span className="ml-2 align-middle font-sans text-[10px] uppercase tracking-widest text-[#B4532A]">Featured</span>}
                    </h3>
                    <div className="flex gap-4 font-sans text-xs uppercase tracking-widest">
                      {p.liveUrl && <a className="text-[#B4532A] hover:underline" href={p.liveUrl} target="_blank" rel="noopener noreferrer">View</a>}
                      {p.repoUrl && <a className="text-[#8A8377] hover:text-[#B4532A]" href={p.repoUrl} target="_blank" rel="noopener noreferrer">Source</a>}
                    </div>
                  </div>
                  {p.tagline && <p className="mt-1 font-sans text-[15px] text-[#5C554B]">{p.tagline}</p>}
                  {p.tech.length > 0 && (
                    <p className="mt-2 font-sans text-xs uppercase tracking-[0.15em] text-[#8A8377]">
                      {p.tech.join(" · ")}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </Section>
        )}

        {/* experience */}
        {experiences.length > 0 && (
          <Section n={num()} title="Experience">
            <div className="space-y-9">
              {experiences.map((e, i) => (
                <div key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-xl font-medium">
                      {e.title} <span className="italic text-[#8A8377]">at</span> {e.organization}
                    </h3>
                    <span className="font-sans text-xs uppercase tracking-widest text-[#8A8377]">
                      {e.startDate ?? ""} — {e.endDate ?? "Present"}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="mt-3 space-y-1.5 font-sans text-[15px] leading-relaxed text-[#44403A]">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="relative pl-5 before:absolute before:left-0 before:content-['—'] before:text-[#B4532A]">
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

        {/* skills */}
        {skills.length > 0 && (
          <Section n={num()} title="Capabilities">
            <div className="grid gap-6 font-sans sm:grid-cols-3">
              {skills.map((s) => (
                <div key={s.category}>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#B4532A]">{s.category}</p>
                  <ul className="mt-2 space-y-1 text-[15px] text-[#44403A]">
                    {s.items.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* education */}
        {educations.length > 0 && (
          <Section n={num()} title="Education">
            <div className="space-y-3 font-sans text-[15px] text-[#44403A]">
              {educations.map((ed, i) => (
                <p key={i}>
                  <span className="font-serif text-lg text-[#191714]">{ed.institution}</span>
                  {ed.degree && ` — ${ed.degree}`}
                  {ed.endYear && ` (${ed.startYear ? `${ed.startYear}–` : ""}${ed.endYear})`}
                  {ed.score && ` · ${ed.score}`}
                </p>
              ))}
            </div>
          </Section>
        )}

        <footer className="mt-20 border-t-2 border-[#191714] pt-6 text-center font-sans text-[11px] uppercase tracking-[0.25em] text-[#8A8377]">
          built with Portxz
        </footer>
      </div>
    </main>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <div className="mb-6 flex items-baseline gap-4 border-b border-[#191714]/20 pb-3">
        <span className="font-sans text-xs tracking-[0.2em] text-[#B4532A]">{n}</span>
        <h2 className="text-sm font-medium uppercase tracking-[0.25em]">{title}</h2>
      </div>
      {children}
    </section>
  );
}
