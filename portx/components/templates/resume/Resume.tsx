import type { TemplateProps } from "../types";

/* ATS-friendly resume: single column, black on white, standard headings.
   This is exactly what Puppeteer prints to PDF. No web fonts at runtime. */
export function Resume({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;
  return (
    <main className="mx-auto max-w-[720px] bg-white px-8 py-8 font-sans text-[13px] leading-relaxed text-black print:px-0 print:py-0">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">{profile.fullName}</h1>
        {profile.headline && <p className="font-semibold">{profile.headline}</p>}
        <p className="mt-1">
          {[profile.email, profile.location].filter(Boolean).join("  |  ")}
        </p>
        {links.length > 0 && (
          <p>{links.map((l) => l.url.replace(/^https?:\/\//, "")).join("  |  ")}</p>
        )}
      </header>

      {profile.summary && (
        <ResumeSection title="Summary"><p>{profile.summary}</p></ResumeSection>
      )}

      {skills.length > 0 && (
        <ResumeSection title="Technical Skills">
          {skills.map((s) => (
            <p key={s.category}><b>{s.category}:</b> {s.items.join(", ")}</p>
          ))}
        </ResumeSection>
      )}

      {experiences.length > 0 && (
        <ResumeSection title="Work Experience">
          {experiences.map((e, i) => (
            <div key={i} className="mb-3">
              <p className="font-bold">{e.title}</p>
              <p>{e.organization}{e.location ? `, ${e.location}` : ""}  |  {e.startDate ?? ""} - {e.endDate ?? "Present"}</p>
              <ul className="ml-5 list-disc">
                {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </ResumeSection>
      )}

      {projects.length > 0 && (
        <ResumeSection title="Projects">
          {projects.map((p, i) => (
            <div key={i} className="mb-3">
              <p className="font-bold">{p.name}{p.liveUrl ? ` — ${p.liveUrl.replace(/^https?:\/\//, "")}` : ""}</p>
              <ul className="ml-5 list-disc">
                {(p.bullets.length ? p.bullets : [p.tagline].filter(Boolean)).map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </ResumeSection>
      )}

      {educations.length > 0 && (
        <ResumeSection title="Education">
          {educations.map((ed, i) => (
            <p key={i}>
              <b>{ed.institution}</b>
              {ed.degree && ` — ${ed.degree}`}
              {ed.endYear && ` (${ed.startYear ? `${ed.startYear}–` : ""}${ed.endYear})`}
              {ed.score && ` · ${ed.score}`}
            </p>
          ))}
        </ResumeSection>
      )}
    </main>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h2 className="mb-1 border-b border-black text-[14px] font-bold uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  );
}
