import type { TemplateProps } from "../types";

/* ── Bento template ─────────────────────────────────────────────────────
   Trendy bento-grid: soft-tinted rounded cards on a deep canvas, each
   section its own tile. Modern, dense, scannable. Server component.    */

const card = "rounded-3xl border border-white/[0.08] p-6";

export function Bento({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;
  const featured = projects.filter((p) => p.featured);
  const shown = featured.length ? featured : projects.slice(0, 2);
  const rest = projects.filter((p) => !shown.includes(p));

  return (
    <main className="min-h-screen bg-[#0C0E14] px-4 py-10 font-sans text-[#EDF0F7] sm:px-6 sm:py-16" data-fixed-theme>
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-6">

        {/* intro — big tile */}
        <section className={`${card} bg-gradient-to-br from-[#182036] to-[#10131D] sm:col-span-4`}>
          {profile.openToWork && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#39D98A]/30 bg-[#39D98A]/10 px-3 py-1 text-xs text-[#4FE3A0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4FE3A0]" /> open to work
            </span>
          )}
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{profile.fullName}</h1>
          {profile.headline && <p className="mt-2 text-lg text-[#8FA3CC]">{profile.headline}</p>}
          {profile.summary && (
            <p className="mt-4 text-sm leading-relaxed text-[#9AA5BC]">{profile.summary}</p>
          )}
        </section>

        {/* connect tile */}
        <section className={`${card} flex flex-col justify-between bg-[#11151F] sm:col-span-2`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5E6B85]">Connect</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            {links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 transition hover:border-[#6E9BFF]/50 hover:bg-white/[0.06]">
                <span>{l.label}</span><span className="text-[#5E6B85]">↗</span>
              </a>
            ))}
            {profile.email && (
              <a href={`mailto:${profile.email}`}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 transition hover:border-[#6E9BFF]/50 hover:bg-white/[0.06]">
                <span>Email</span><span className="text-[#5E6B85]">↗</span>
              </a>
            )}
          </div>
          {profile.location && (
            <p className="mt-4 text-xs text-[#5E6B85]">📍 {profile.location}</p>
          )}
        </section>

        {/* featured projects — half tiles */}
        {shown.map((p, i) => (
          <section key={p.name}
            className={`${card} sm:col-span-3 ${i % 2 === 0 ? "bg-gradient-to-br from-[#1A2440] to-[#111524]" : "bg-gradient-to-br from-[#241A3E] to-[#141021]"}`}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <span className="text-xs text-[#FFC24B]">★</span>
            </div>
            {p.tagline && <p className="mt-1.5 text-sm text-[#9AA5BC]">{p.tagline}</p>}
            {p.tech.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[11px] text-[#8FA3CC]">{t}</span>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-4 text-xs font-medium">
              {p.liveUrl && <a className="text-[#6E9BFF] hover:text-white" href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live ↗</a>}
              {p.repoUrl && <a className="text-[#6E9BFF] hover:text-white" href={p.repoUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>}
            </div>
          </section>
        ))}

        {/* skills tile */}
        {skills.length > 0 && (
          <section className={`${card} bg-[#11151F] sm:col-span-3`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5E6B85]">Skills</p>
            <div className="mt-4 space-y-3">
              {skills.map((s) => (
                <div key={s.category}>
                  <p className="text-xs text-[#6E9BFF]">{s.category}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {s.items.map((i) => (
                      <span key={i} className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[11px] text-[#C4CCE0]">{i}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* experience tile */}
        {experiences.length > 0 && (
          <section className={`${card} bg-[#11151F] sm:col-span-3`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5E6B85]">Experience</p>
            <div className="mt-4 space-y-5">
              {experiences.map((e, i) => (
                <div key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <h3 className="text-sm font-semibold">
                      {e.title} <span className="text-[#6E9BFF]">@ {e.organization}</span>
                    </h3>
                    <span className="text-[11px] text-[#5E6B85]">{e.startDate ?? ""} – {e.endDate ?? "Now"}</span>
                  </div>
                  {e.bullets[0] && <p className="mt-1 text-xs leading-relaxed text-[#9AA5BC]">{e.bullets[0]}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* remaining projects — compact tiles */}
        {rest.map((p) => (
          <section key={p.name} className={`${card} bg-[#11151F] sm:col-span-2`}>
            <h3 className="text-sm font-semibold">{p.name}</h3>
            {p.tagline && <p className="mt-1 text-xs text-[#9AA5BC]">{p.tagline}</p>}
            <div className="mt-3 flex gap-3 text-xs">
              {p.liveUrl && <a className="text-[#6E9BFF]" href={p.liveUrl} target="_blank" rel="noopener noreferrer">Live ↗</a>}
              {p.repoUrl && <a className="text-[#6E9BFF]" href={p.repoUrl} target="_blank" rel="noopener noreferrer">Code ↗</a>}
            </div>
          </section>
        ))}

        {/* education tile */}
        {educations.length > 0 && (
          <section className={`${card} bg-[#11151F] ${rest.length % 3 === 0 ? "sm:col-span-6" : rest.length % 3 === 1 ? "sm:col-span-4" : "sm:col-span-2"}`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5E6B85]">Education</p>
            <div className="mt-3 space-y-2 text-sm text-[#9AA5BC]">
              {educations.map((ed, i) => (
                <p key={i}>
                  <span className="text-[#EDF0F7]">{ed.institution}</span>
                  {ed.degree && ` — ${ed.degree}`}
                  {ed.endYear && ` (${ed.endYear})`}
                  {ed.score && ` · ${ed.score}`}
                </p>
              ))}
            </div>
          </section>
        )}

        <footer className="py-4 text-center text-xs text-[#5E6B85] sm:col-span-6">
          built with Portxz
        </footer>
      </div>
    </main>
  );
}
