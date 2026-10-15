import type { TemplateProps } from "../types";
import {
  DEFAULT_RESUME_CONFIG, SECTION_LABELS, applyResumeConfig, resumeStyle, sectionOrder,
  type ResumeConfig, type SectionKey,
} from "@/lib/resume";
import { RESUME_FONT_FAMILY } from "./fonts";

/* ATS-friendly resume: single column, standard headings, real text only. Six templates
   (lib/resume.ts) change only type, size, spacing and color, never the structure, so every
   one parses the same. This is exactly what Puppeteer prints to PDF. Parser-safety rules:
   - Bundled metric-compatible fonts, no ligatures — "fi"/"fl" glyphs extract as junk.
   - No letter-spacing or CSS uppercase on headings — some parsers read them as "S U M M A R Y".
   - Plain ASCII separators ("|", "-"), no icons, tables, columns or text in images.
   - Contact details in the body (not a header/footer), each labelled, links clickable. */

const SIZE = { small: 12, normal: 13, large: 14 } as const;
const SPACING = {
  compact: { section: 10, item: 6, line: 1.4 },
  normal: { section: 16, item: 12, line: 1.55 },
  relaxed: { section: 20, item: 14, line: 1.65 },
} as const;

export function Resume({ data: raw, config = DEFAULT_RESUME_CONFIG }: TemplateProps & { config?: ResumeConfig }) {
  const data = applyResumeConfig(raw, config);
  const { profile, links, experiences, projects, skills, educations, sections } = data;
  const style = resumeStyle(config);
  const space = SPACING[style.spacing];
  const base = SIZE[style.size];
  const contact = [profile.email, profile.phone, profile.location].filter(Boolean);
  const item = { marginBottom: space.item, breakInside: "avoid-page" } as const;

  const blocks: Record<SectionKey, React.ReactNode> = {
    summary: profile.summary && <p>{profile.summary}</p>,

    skills: skills.length > 0 && skills.map((s) => (
      <p key={s.category}><b>{s.category}:</b> {s.items.join(", ")}</p>
    )),

    experience: experiences.length > 0 && experiences.map((e, i) => (
      <div key={i} style={item}>
        <p className="font-bold">{e.title}</p>
        <p>{e.organization}{e.location ? `, ${e.location}` : ""}</p>
        <p>{dateRange(e.startDate, e.endDate)}</p>
        <ul className="ml-5 list-disc">
          {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
        </ul>
      </div>
    )),

    projects: projects.length > 0 && projects.map((p, i) => (
      <div key={i} style={item}>
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
    )),

    education: educations.length > 0 && educations.map((ed, i) => (
      <div key={i} style={{ ...item, marginBottom: space.item / 2 }}>
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
    )),

    // Rendered as one block per section below, each under its own heading.
    custom: null,
  };

  const heading = (title: string) => (
    <h2
      className="mb-1 border-b font-bold"
      style={{
        fontSize: base + 1,
        color: style.colorHeadings ? style.accent : "#000",
        borderColor: style.accent,
      }}
    >
      {title}
    </h2>
  );

  return (
    <main
      // On screen: an A4 sheet (210 x 297mm) with the PDF's 14/15mm margins, so lines wrap
      // exactly as they print. In print the page margins come from @page / Puppeteer instead.
      className="mx-auto box-border w-full max-w-[210mm] min-h-[297mm] bg-white px-4 py-[14mm] text-black shadow-md sm:px-[15mm] print:min-h-0 print:max-w-none print:p-0 print:shadow-none"
      style={{
        fontFamily: RESUME_FONT_FAMILY[style.font],
        fontVariantLigatures: "none",
        fontSize: base,
        lineHeight: space.line,
      }}
    >
      <header style={{ marginBottom: space.section, textAlign: style.align }}>
        <h1 className="font-bold" style={{ fontSize: base * 1.85, lineHeight: 1.2, color: style.colorHeadings ? style.accent : "#000" }}>
          {profile.fullName}
        </h1>
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

      {sectionOrder(config).map((key) =>
        key === "custom" ? (
          // Certifications, Awards, etc. — ATS parsers look for these headings by name.
          sections.map((sec) => (
            <section key={`custom-${sec.title}`} style={{ marginBottom: space.section }}>
              {heading(sec.title)}
              {sec.items.map((it, i) => (
                <div key={i} style={{ ...item, marginBottom: space.item / 2 }}>
                  <p>
                    <b>{it.title}</b>
                    {it.subtitle && `, ${it.subtitle}`}
                    {it.date && ` | ${it.date}`}
                  </p>
                  {it.url && <p><a href={it.url} className="text-black no-underline">{bareUrl(it.url)}</a></p>}
                  {it.description && <p>{it.description}</p>}
                </div>
              ))}
            </section>
          ))
        ) : blocks[key] ? (
          <section key={key} style={{ marginBottom: space.section }}>
            {heading(SECTION_LABELS[key])}
            {blocks[key]}
          </section>
        ) : null
      )}
    </main>
  );
}

const bareUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const dateRange = (start: string | null, end: string | null) =>
  [start, end ?? "Present"].filter(Boolean).join(" - ");
