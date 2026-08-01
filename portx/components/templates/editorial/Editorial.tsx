"use client";

import type { TemplateProps } from "../types";
import { Reveal, Stagger, Item } from "../tem_comps/Motion";

/* ── Editorial template ─────────────────────────────────────────────────
   A light, art-directed magazine feature. Didone-style display serif for
   headlines, a clean sans for labels & data, a drop-capped lead, a large
   pull-quote, hairline rules and generous vertical rhythm. Refined neutral
   paper palette with a single oxblood accent. Motion is deliberately quiet:
   slow masthead reveal, gentle scroll fades, whisper-thin hover underlines.
   Always light by design.                                                */

const PAPER = "#F6F2E9"; // warm printed paper
const INK = "#1B1713"; // near-black ink
const MUTE = "#655C4F"; // secondary text
const FAINT = "#98907F"; // labels / meta
const RULE = "#1B1713"; // rule ink
const ACCENT = "#6E2436"; // oxblood

export function Editorial({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  // Pull-quote sourced from the strongest available editorial line.
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const pullQuote = profile.headline || featured?.tagline || "";

  return (
    <main
      className="pxz-ed min-h-screen font-serif antialiased"
      style={{ background: PAPER, color: INK }}
      data-fixed-theme
    >
      <PxzStyle />

      <div className="mx-auto max-w-[74rem] px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
        {/* ── Masthead ────────────────────────────────────────────── */}
        <Reveal as="header" duration={1.1} y={16}>
          <div
            className="pxz-sans flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.3em]"
            style={{ color: FAINT }}
          >
            <span>{profile.location || "Portfolio"}</span>
            <span aria-hidden className="mx-4 hidden h-px flex-1 sm:block" style={{ background: `${RULE}22` }} />
            {profile.openToWork ? (
              <span style={{ color: ACCENT }}>Open to opportunities</span>
            ) : (
              <span>Selected Works</span>
            )}
          </div>

          <h1
            className="pxz-d mt-8 text-balance text-[clamp(2.75rem,8vw,6rem)] font-medium leading-[0.98] tracking-[-0.02em]"
          >
            {profile.fullName}
          </h1>

          {profile.headline && (
            <p className="mt-6 max-w-[38ch] text-pretty text-xl italic leading-snug sm:text-2xl" style={{ color: MUTE }}>
              {profile.headline}
            </p>
          )}

          <div className="mt-10 h-px w-full" style={{ background: `${RULE}` }} />
        </Reveal>

        {/* ── Lead + details rail ─────────────────────────────────── */}
        {(profile.summary || profile.email || links.length > 0) && (
          <Reveal as="section" className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-[1.7fr_1fr]">
            <div>
              {profile.summary ? (
                <p className="pxz-lead max-w-[65ch] text-pretty text-[1.15rem] leading-[1.75]" style={{ color: INK }}>
                  {profile.summary}
                </p>
              ) : (
                <p className="max-w-[65ch] text-lg leading-relaxed" style={{ color: MUTE }}>
                  {profile.headline}
                </p>
              )}
            </div>

            <aside className="pxz-sans md:border-l md:pl-10" style={{ borderColor: `${RULE}1f` }}>
              <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: FAINT }}>
                Details
              </p>
              <dl className="mt-4 space-y-3 text-sm" style={{ color: MUTE }}>
                {profile.location && (
                  <div>
                    <dt className="sr-only">Location</dt>
                    <dd>{profile.location}</dd>
                  </div>
                )}
                {profile.email && (
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd>
                      <a href={`mailto:${profile.email}`} className="pxz-link" style={{ color: INK }}>
                        {profile.email}
                      </a>
                    </dd>
                  </div>
                )}
                {links.map((l) => (
                  <div key={l.url}>
                    <dt className="sr-only">{l.kind || "Link"}</dt>
                    <dd>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pxz-link"
                        style={{ color: INK }}
                      >
                        {l.label}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </Reveal>
        )}

        {/* ── Pull-quote ──────────────────────────────────────────── */}
        {pullQuote && (
          <Reveal as="section" className="my-20 sm:my-28">
            <figure className="mx-auto max-w-4xl text-center">
              <blockquote
                className="pxz-d text-balance text-[clamp(1.75rem,4.5vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.01em]"
              >
                <span style={{ color: ACCENT }}>“</span>
                {pullQuote}
                <span style={{ color: ACCENT }}>”</span>
              </blockquote>
            </figure>
          </Reveal>
        )}

        {/* ── Selected Work ───────────────────────────────────────── */}
        {projects.length > 0 && (
          <Section title="Selected Work" meta={`${projects.length} ${projects.length === 1 ? "piece" : "pieces"}`}>
            <Stagger className="space-y-0">
              {projects.map((p, i) => (
                <Item key={p.name} as="article" className="group grid gap-4 border-t border-[#1B17131f] py-9 md:grid-cols-[1fr_2fr]">
                  <div>
                    <div
                      className="pxz-mono text-xs tabular-nums"
                      style={{ color: FAINT }}
                    >
                      {String(i + 1).padStart(2, "0")}
                      {p.featured && (
                        <span className="ml-3 uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                          Featured
                        </span>
                      )}
                    </div>
                    {p.tech.length > 0 && (
                      <p className="pxz-sans mt-4 text-xs uppercase tracking-[0.18em]" style={{ color: FAINT }}>
                        {p.tech.join(" · ")}
                      </p>
                    )}
                    {(p.liveUrl || p.repoUrl) && (
                      <div className="pxz-sans mt-4 flex gap-5 text-xs uppercase tracking-[0.18em]">
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pxz-link"
                            style={{ color: ACCENT }}
                          >
                            View
                          </a>
                        )}
                        {p.repoUrl && (
                          <a
                            href={p.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pxz-link"
                            style={{ color: MUTE }}
                          >
                            Source
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="pxz-d text-3xl font-medium leading-tight tracking-[-0.01em] sm:text-4xl">
                      {p.name}
                    </h3>
                    {p.tagline && (
                      <p className="mt-2 text-lg italic" style={{ color: MUTE }}>
                        {p.tagline}
                      </p>
                    )}
                    {p.description && (
                      <p className="mt-4 max-w-[65ch] text-pretty leading-[1.7]" style={{ color: INK }}>
                        {p.description}
                      </p>
                    )}
                    {p.bullets.length > 0 && (
                      <ul className="pxz-sans mt-4 space-y-1.5 text-[15px] leading-relaxed" style={{ color: MUTE }}>
                        {p.bullets.map((b, j) => (
                          <li key={j} className="relative pl-5">
                            <span aria-hidden className="absolute left-0" style={{ color: ACCENT }}>
                              —
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Item>
              ))}
              <div className="border-t" style={{ borderColor: `${RULE}1f` }} />
            </Stagger>
          </Section>
        )}

        {/* ── Experience ──────────────────────────────────────────── */}
        {experiences.length > 0 && (
          <Section title="Experience">
            <Stagger className="space-y-0">
              {experiences.map((e, i) => (
                <Item key={i} className="grid gap-3 border-t border-[#1B17131f] py-8 md:grid-cols-[1fr_2fr]">
                  <div className="pxz-mono text-xs uppercase tracking-[0.14em] tabular-nums" style={{ color: FAINT }}>
                    {e.startDate ?? ""}
                    {(e.startDate || e.endDate) && " — "}
                    {e.endDate ?? "Present"}
                    {e.location && <div className="mt-1 normal-case tracking-normal">{e.location}</div>}
                  </div>
                  <div>
                    <h3 className="pxz-d text-2xl font-medium leading-snug">
                      {e.title}
                      {e.organization && (
                        <>
                          <span className="italic" style={{ color: FAINT }}>
                            {" "}
                            for{" "}
                          </span>
                          <span style={{ color: ACCENT }}>{e.organization}</span>
                        </>
                      )}
                    </h3>
                    {e.bullets.length > 0 && (
                      <ul className="pxz-sans mt-3 space-y-1.5 text-[15px] leading-relaxed" style={{ color: MUTE }}>
                        {e.bullets.map((b, j) => (
                          <li key={j} className="relative pl-5">
                            <span aria-hidden className="absolute left-0" style={{ color: ACCENT }}>
                              —
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Item>
              ))}
              <div className="border-t" style={{ borderColor: `${RULE}1f` }} />
            </Stagger>
          </Section>
        )}

        {/* ── Capabilities ────────────────────────────────────────── */}
        {skills.length > 0 && (
          <Section title="Capabilities">
            <Stagger className="grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((s) => (
                <Item key={s.category} className="pxz-sans">
                  <p className="text-[11px] uppercase tracking-[0.24em]" style={{ color: ACCENT }}>
                    {s.category}
                  </p>
                  <div className="mt-3 h-px w-8" style={{ background: `${RULE}33` }} />
                  <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed" style={{ color: MUTE }}>
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </Item>
              ))}
            </Stagger>
          </Section>
        )}

        {/* ── Education ───────────────────────────────────────────── */}
        {educations.length > 0 && (
          <Section title="Education">
            <Stagger className="space-y-0">
              {educations.map((ed, i) => (
                <Item key={i} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-[#1B17131f] py-6">
                  <div>
                    <span className="pxz-d text-xl font-medium">{ed.institution}</span>
                    {ed.degree && (
                      <span className="pxz-sans ml-2 text-sm" style={{ color: MUTE }}>
                        {ed.degree}
                      </span>
                    )}
                  </div>
                  <div className="pxz-mono text-xs uppercase tracking-[0.14em] tabular-nums" style={{ color: FAINT }}>
                    {(ed.startYear || ed.endYear) && (
                      <span>
                        {ed.startYear ? `${ed.startYear}–` : ""}
                        {ed.endYear ?? "Present"}
                      </span>
                    )}
                    {ed.score && <span style={{ color: MUTE }}> · {ed.score}</span>}
                  </div>
                </Item>
              ))}
              <div className="border-t" style={{ borderColor: `${RULE}1f` }} />
            </Stagger>
          </Section>
        )}

        {/* ── Colophon ────────────────────────────────────────────── */}
        <footer
          className="pxz-sans mt-24 flex items-center justify-between border-t-2 pt-6 text-[11px] uppercase tracking-[0.3em]"
          style={{ borderColor: RULE, color: FAINT }}
        >
          <span>{profile.fullName}</span>
          <span>Set in Portxz</span>
        </footer>
      </div>
    </main>
  );
}

/* ── Section: quiet reveal + hairline kicker header ──────────────────── */
function Section({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className="mt-20 sm:mt-24">
      <div className="pxz-sans mb-8 flex items-baseline gap-5">
        <h2 className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color: INK }}>
          {title}
        </h2>
        <span aria-hidden className="h-px flex-1" style={{ background: `${RULE}1f` }} />
        {meta && (
          <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: FAINT }}>
            {meta}
          </span>
        )}
      </div>
      {children}
    </Reveal>
  );
}

/* ── Scoped static styles: font stacks, drop cap, hover underlines ───── */
function PxzStyle() {
  return (
    <style>{`
      .pxz-ed{
        --pxz-d:"Didot","Bodoni MT","Bodoni 72","Playfair Display",Georgia,"Times New Roman",serif;
        --pxz-serif:Georgia,"Times New Roman",ui-serif,serif;
        --pxz-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI","Helvetica Neue",Arial,sans-serif;
        --pxz-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
        font-family:var(--pxz-serif);
      }
      .pxz-d{font-family:var(--pxz-d);font-feature-settings:"liga" 1,"kern" 1;}
      .pxz-sans{font-family:var(--pxz-sans);}
      .pxz-mono{font-family:var(--pxz-mono);}
      .pxz-lead::first-letter{
        float:left;
        font-family:var(--pxz-d);
        font-size:3.9em;
        line-height:0.78;
        padding:0.06em 0.12em 0 0;
        color:${ACCENT};
        font-weight:500;
      }
      .pxz-link{
        background-image:linear-gradient(currentColor,currentColor);
        background-size:0% 1px;
        background-position:0 100%;
        background-repeat:no-repeat;
        padding-bottom:2px;
        transition:background-size .4s cubic-bezier(.22,1,.36,1),color .2s ease;
      }
      .pxz-link:hover,.pxz-link:focus-visible{background-size:100% 1px;color:${ACCENT};}
      .pxz-ed a:focus-visible{outline:2px solid ${ACCENT};outline-offset:3px;border-radius:2px;}
      @media (prefers-reduced-motion:reduce){
        .pxz-link{transition:none;}
      }
    `}</style>
  );
}
