import type { TemplateProps } from "../types";

/* ── Executive template ─────────────────────────────────────────────────
   Corporate-clean: white canvas, slate text, navy accent bar, structured
   two-column header. The LinkedIn-professional look — built for working
   professionals. Light by design. Server component.                    */

const NAVY = "#1E3A5F";
const ACCENT = "#2563EB";

export function Executive({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  return (
    <main className="min-h-screen bg-[#F6F8FB] font-sans text-[#1F2937]" data-fixed-theme>
      {/* top band */}
      <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${NAVY}, ${ACCENT})` }} />

      <div className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
        {/* header card */}
        <header className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: NAVY }}>
                {profile.fullName}
              </h1>
              {profile.headline && (
                <p className="mt-2 text-lg font-medium" style={{ color: ACCENT }}>{profile.headline}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#64748B]">
                {profile.location && <span>📍 {profile.location}</span>}
                {profile.email && <a className="hover:text-[#2563EB]" href={`mailto:${profile.email}`}>✉ {profile.email}</a>}
              </div>
            </div>
            {profile.openToWork && (
              <span className="rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-1.5 text-sm font-medium text-[#15803D]">
                Open to opportunities
              </span>
            )}
          </div>
          {profile.summary && (
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[#475569]">{profile.summary}</p>
          )}
          {links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-1.5 text-sm font-medium text-[#334155] transition hover:border-[#2563EB] hover:text-[#2563EB]">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </header>

        {/* experience */}
        {experiences.length > 0 && (
          <ExecSection title="Professional Experience">
            <div className="space-y-6">
              {experiences.map((e, i) => (
                <div key={i} className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold" style={{ color: NAVY }}>
                      {e.title} <span className="font-normal text-[#64748B]">· {e.organization}</span>
                    </h3>
                    <span className="text-sm font-medium text-[#64748B]">
                      {e.startDate ?? ""} – {e.endDate ?? "Present"}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-[#475569]">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="relative pl-5">
                          <span className="absolute left-0 font-bold" style={{ color: ACCENT }}>▸</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </ExecSection>
        )}

        {/* projects */}
        {projects.length > 0 && (
          <ExecSection title="Key Projects">
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <div key={p.name} className="rounded-xl border border-[#E2E8F0] bg-white p-6 transition hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold" style={{ color: NAVY }}>{p.name}</h3>
                    {p.featured && <span className="text-xs font-medium" style={{ color: ACCENT }}>Featured</span>}
                  </div>
                  {p.tagline && <p className="mt-1.5 text-sm text-[#475569]">{p.tagline}</p>}
                  {p.tech.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span key={t} className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-medium text-[#1D4ED8]">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-4 text-sm font-medium">
                    {p.liveUrl && <a style={{ color: ACCENT }} href={p.liveUrl} target="_blank" rel="noopener noreferrer">View →</a>}
                    {p.repoUrl && <a className="text-[#64748B] hover:text-[#2563EB]" href={p.repoUrl} target="_blank" rel="noopener noreferrer">Source →</a>}
                  </div>
                </div>
              ))}
            </div>
          </ExecSection>
        )}

        {/* skills + education row */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {skills.length > 0 && (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: NAVY }}>Core Skills</h2>
              <div className="mt-4 space-y-3">
                {skills.map((s) => (
                  <div key={s.category}>
                    <p className="text-xs font-semibold text-[#64748B]">{s.category}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {s.items.map((i) => (
                        <span key={i} className="rounded-full border border-[#E2E8F0] px-3 py-1 text-xs text-[#334155]">{i}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {educations.length > 0 && (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: NAVY }}>Education</h2>
              <div className="mt-4 space-y-3 text-sm text-[#475569]">
                {educations.map((ed, i) => (
                  <p key={i}>
                    <span className="font-semibold text-[#1F2937]">{ed.institution}</span>
                    {ed.degree && <><br />{ed.degree}</>}
                    {(ed.endYear || ed.score) && (
                      <span className="text-[#64748B]">
                        {ed.endYear && ` · ${ed.startYear ? `${ed.startYear}–` : ""}${ed.endYear}`}
                        {ed.score && ` · ${ed.score}`}
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="mt-14 text-center text-xs text-[#94A3B8]">built with Portxz</footer>
      </div>
    </main>
  );
}

function ExecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-5 w-1 rounded-full" style={{ background: ACCENT }} />
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: NAVY }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
