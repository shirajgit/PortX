import type { TemplateProps } from "../types";

/* ATS-friendly resume: single column, black on white, standard headings, real text only.
   This is exactly what Puppeteer prints to PDF. Parser-safety rules:
   - System font (Arial/Helvetica), no web font, no ligatures — "fi"/"fl" glyphs extract as junk.
   - No letter-spacing or CSS uppercase on headings — some parsers read them as "S U M M A R Y".
   - Plain ASCII separators ("|", "-"), no icons, tables, columns or text in images.
   - Contact details in the body (not a header/footer), each labelled, links clickable. */
export function Resume({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations, sections } = data;
  const contact = [profile.email, profile.phone, profile.location].filter(Boolean);
  return (
    <main
      // On screen: an A4 sheet (210 x 297mm) with the PDF's 14/15mm margins, so lines wrap
      // exactly as they print. In print the page margins come from @page / Puppeteer instead.
      className="mx-auto box-border w-full max-w-[210mm] min-h-[297mm] bg-white px-4 py-[14mm] text-[13px] leading-relaxed text-black shadow-md sm:px-[15mm] print:min-h-0 print:max-w-none print:p-0 print:shadow-none"
      style={{ fontFamily: "Arial, Helvetica, sans-serif", fontVariantLigatures: "none" }}
    >
      <header className="mb-4">
        <h1 className="text-2xl font-bold">{profile.fullName}</h1>
        {profile.headline && <p className="font-semibold">{profile.headline}</p>}
        {contact.length > 0 && <p className="mt-1">{contact.join(" | ")}</p>}
        {links.length > 0 && (
          <p>
            {links.map((l, i) => (
              <span key={l.url}>
                {i > 0 && " | "}
                {l.label && `${l.label}: `}
                <a href={l.url} className="text-black no-underline">{bareUrl(l.url)}</a>
              </span>
            ))}
          </p>
        )}
      </header>

      {profile.summary && (
        <ResumeSection title="Summary"><p>{profile.summary}</p></ResumeSection>
      )}

      {skills.length > 0 && (
        <ResumeSection title="Skills">
          {skills.map((s) => (
            <p key={s.category}><b>{s.category}:</b> {s.items.join(", ")}</p>
          ))}
        </ResumeSection>
      )}

      {experiences.length > 0 && (
        <ResumeSection title="Work Experience">
          {experiences.map((e, i) => (
            <div key={i} className="mb-3 break-inside-avoid-page">
              <p className="font-bold">{e.title}</p>
              <p>{e.organization}{e.location ? `, ${e.location}` : ""}</p>
              <p>{dateRange(e.startDate, e.endDate)}</p>
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
            <div key={i} className="mb-3 break-inside-avoid-page">
              <p className="font-bold">{p.name}</p>
              {(p.liveUrl || p.repoUrl) && (
                <p>
                  {[p.liveUrl, p.repoUrl].filter((u): u is string => !!u).map((u, j) => (
                    <span key={u}>
                      {j > 0 && " | "}
                      <a href={u} className="text-black no-underline">{bareUrl(u)}</a>
                    </span>
                  ))}
                </p>
              )}
              {p.tech.length > 0 && <p><b>Technologies:</b> {p.tech.join(", ")}</p>}
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
            <div key={i} className="mb-2 break-inside-avoid-page">
              {ed.degree && <p className="font-bold">{ed.degree}</p>}
              <p className={ed.degree ? "" : "font-bold"}>{ed.institution}</p>
              {(ed.endYear || ed.score) && (
                <p>
                  {[
                    ed.endYear && `${ed.startYear ? `${ed.startYear} - ` : ""}${ed.endYear}`,
                    ed.score,
                  ].filter(Boolean).join(" | ")}
                </p>
              )}
            </div>
          ))}
        </ResumeSection>
      )}

      {/* Certifications, Awards, etc. — ATS parsers look for these headings by name. */}
      {sections.map((sec) => (
        <ResumeSection key={sec.title} title={sec.title}>
          {sec.items.map((it, i) => (
            <div key={i} className="mb-2 break-inside-avoid-page">
              <p>
                <b>{it.title}</b>
                {it.subtitle && `, ${it.subtitle}`}
                {it.date && ` | ${it.date}`}
              </p>
              {it.url && <p><a href={it.url} className="text-black no-underline">{bareUrl(it.url)}</a></p>}
              {it.description && <p>{it.description}</p>}
            </div>
          ))}
        </ResumeSection>
      ))}
    </main>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h2 className="mb-1 border-b border-black text-[14px] font-bold">{title}</h2>
      {children}
    </section>
  );
}

const bareUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const dateRange = (start: string | null, end: string | null) =>
  [start, end ?? "Present"].filter(Boolean).join(" - ");
