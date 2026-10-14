"use client";

import type { TemplateProps } from "../types";
import {
  Reveal,
  Stagger,
  Item,
  TiltCard,
  Magnetic,
  GradientText,
  Spotlight,
  Marquee,
  ScrollProgress,
  CountUp,
  Parallax,
  Avatar3D,
} from "../tem_comps/Motion";
import { getInsights } from "../insights";

/* ── Aurora template · premium edition ──────────────────────────────────
   Living aurora washes (CSS keyframes) + deterministic starfield depth,
   gradient-shimmer name, orchestrated reveals, cursor-spotlit tilt cards,
   magnetic link pills, and a drifting skills marquee. Built on the shared
   Portxz motion toolkit so it stays cohesive across templates.
   All decorative geometry is deterministic (golden-angle spread) so SSR
   and client hydration always match; every custom @keyframes respects
   prefers-reduced-motion.                                                */

const card =
  "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm";

/* deterministic starfield — fixed positions so SSR/client always match */
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 137.508) % 100, // golden-angle spread
  y: (i * 61.803) % 100,
  s: 1 + (i % 3), // 1–3px
  d: 2 + ((i * 7) % 5), // twinkle duration 2–6s
  o: 0.25 + ((i * 13) % 40) / 100, // base opacity
}));

export function Aurora({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations, sections } = data;

  /* flatten skills for the drifting marquee strip (deterministic order) */
  const skillStrip = skills.flatMap((s) => s.items);
  const { initials, current, stats } = getInsights(data);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#070912] font-sans text-[#E9EDF7]"
      data-fixed-theme
    >
      <ScrollProgress />
      <style>{`
        @keyframes aur-wash1 { 0%,100%{transform:rotate(12deg) translate(0,0) scale(1)} 50%{transform:rotate(18deg) translate(60px,40px) scale(1.15)} }
        @keyframes aur-wash2 { 0%,100%{transform:rotate(-12deg) translate(0,0) scale(1)} 50%{transform:rotate(-20deg) translate(-50px,30px) scale(1.1)} }
        @keyframes aur-wash3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-50px) scale(1.2)} }
        @keyframes aur-twinkle { 0%,100%{opacity:var(--o)} 50%{opacity:0.05} }
        @media (prefers-reduced-motion: reduce) {
          .aur-anim { animation: none !important; }
        }
      `}</style>

      {/* aurora washes — living gradient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="aur-anim absolute -top-40 left-[10%] h-[500px] w-[700px] rounded-full bg-[#22D3EE]/20 blur-[140px]"
          style={{ animation: "aur-wash1 16s ease-in-out infinite" }}
        />
        <div
          className="aur-anim absolute top-40 right-[5%] h-[450px] w-[550px] rounded-full bg-[#8B5CF6]/20 blur-[140px]"
          style={{ animation: "aur-wash2 20s ease-in-out infinite" }}
        />
        <div
          className="aur-anim absolute top-[55%] left-[20%] h-[400px] w-[600px] rounded-full bg-[#EC4899]/12 blur-[150px]"
          style={{ animation: "aur-wash3 24s ease-in-out infinite" }}
        />
        {/* legibility scrim so text stays crisp over the glow */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,rgba(7,9,18,0.55)_100%)]" />
      </div>

      {/* starfield depth — drifts slower than the page for parallax */}
      <Parallax offset={140} className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="aur-anim absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              // @ts-expect-error css custom property
              "--o": s.o,
              opacity: s.o,
              animation: `aur-twinkle ${s.d}s ease-in-out infinite`,
              animationDelay: `${(i % 10) * 0.4}s`,
            }}
          />
        ))}
      </Parallax>

      <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* hero */}
        <header className="flex flex-col-reverse gap-12 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <Stagger stagger={0.1} className="min-w-0 flex-1">
            {profile.openToWork && (
              <Item>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-4 py-1.5 text-xs font-medium text-[#67E8F9] shadow-[0_0_24px_rgba(34,211,238,0.15)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#67E8F9]" />
                  open to work
                </span>
              </Item>
            )}
            <Item>
              <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                <GradientText
                  colors={["#67E8F9", "#A78BFA", "#F472B6", "#67E8F9"]}
                >
                  {profile.fullName}
                </GradientText>
              </h1>
            </Item>
            {profile.headline && (
              <Item>
                <p className="mt-4 text-xl text-[#9BA6C6]">{profile.headline}</p>
              </Item>
            )}
            {current && (
              <Item>
                <p className="mt-3 text-sm text-[#8B96B5]">
                  Currently <span className="text-[#E9EDF7]">{current.title}</span>
                  {current.organization && (
                    <>
                      {" "}
                      <span className="text-[#A78BFA]">@ {current.organization}</span>
                    </>
                  )}
                </p>
              </Item>
            )}
            {profile.location && (
              <Item>
                <p className="mt-2 text-sm text-[#6B7694]">{profile.location}</p>
              </Item>
            )}
            {profile.summary && (
              <Item>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#8B96B5]">
                  {profile.summary}
                </p>
              </Item>
            )}
            {(links.length > 0 || profile.email) && (
              <Item>
                <div className="mt-8 flex flex-wrap gap-3">
                  {links.map((l) => (
                    <Magnetic as="span" key={l.url} strength={0.3}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-[#C7CFE5] transition hover:border-[#67E8F9]/50 hover:text-[#67E8F9] hover:shadow-[0_0_20px_rgba(103,232,249,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]/60"
                      >
                        {l.label}
                      </a>
                    </Magnetic>
                  ))}
                  {profile.email && (
                    <Magnetic as="span" strength={0.3}>
                      <a
                        href={`mailto:${profile.email}`}
                        className="block rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-[#C7CFE5] transition hover:border-[#F472B6]/50 hover:text-[#F472B6] hover:shadow-[0_0_20px_rgba(244,114,182,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F472B6]/60"
                      >
                        Email
                      </a>
                    </Magnetic>
                  )}
                </div>
              </Item>
            )}
          </Stagger>

          {/* a small planet: portrait inside three orbiting rings */}
          <Avatar3D
            src={profile.avatarUrl}
            name={profile.fullName}
            initials={initials}
            size={128}
            rings={3}
            colors={["#67E8F9", "#A78BFA", "#F472B6"]}
            surface="linear-gradient(135deg,#0E1630,#1B1140)"
            glow={0.55}
            className="mx-auto mt-10 sm:mx-14 sm:mt-0"
          />
        </header>

        {/* at a glance */}
        {stats.length > 1 && (
          <Stagger className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4" stagger={0.08} delay={0.3}>
            {stats.map((s, i) => {
              const glow = ["#67E8F9", "#A78BFA", "#F472B6", "#67E8F9"][i % 4];
              return (
                <Item key={s.label}>
                  <TiltCard max={10} glareColor={`${glow}26`} className="rounded-2xl">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-5 text-center backdrop-blur-sm [transform-style:preserve-3d]">
                      <div
                        className="text-3xl font-bold tracking-tight [transform:translateZ(26px)]"
                        style={{ color: glow, textShadow: `0 0 28px ${glow}66` }}
                      >
                        <CountUp value={s.value} suffix={s.suffix} />
                      </div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B7694] [transform:translateZ(12px)]">
                        {s.label}
                      </div>
                    </div>
                  </TiltCard>
                </Item>
              );
            })}
          </Stagger>
        )}

        {/* projects */}
        {projects.length > 0 && (
          <AuroraSection title="Projects" glow="#67E8F9">
            <Stagger className="space-y-4" stagger={0.09}>
              {projects.map((p) => (
                <Item key={p.name}>
                  <TiltCard max={6} glareColor="rgba(103,232,249,0.12)">
                    <Spotlight
                      className={`${card} group overflow-hidden transition hover:border-[#67E8F9]/30 hover:shadow-[0_12px_48px_rgba(34,211,238,0.12)]`}
                      color="rgba(34,211,238,0.14)"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-lg font-semibold">{p.name}</h3>
                        <div className="flex gap-4 text-xs font-medium">
                          {p.liveUrl && (
                            <a
                              className="text-[#67E8F9] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]/60"
                              href={p.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Live ↗
                            </a>
                          )}
                          {p.repoUrl && (
                            <a
                              className="text-[#9BA6C6] transition hover:text-[#67E8F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]/60"
                              href={p.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Code ↗
                            </a>
                          )}
                        </div>
                      </div>
                      {p.tagline && (
                        <p className="mt-1.5 text-sm text-[#8B96B5]">
                          {p.tagline}
                        </p>
                      )}
                      {p.bullets.length > 0 && (
                        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[#8B96B5]">
                          {p.bullets.map((b, j) => (
                            <li key={j} className="relative pl-4">
                              <span className="absolute left-0 text-[#67E8F9]">
                                ·
                              </span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                      {p.tech.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {p.tech.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-gradient-to-r from-[#22D3EE]/10 to-[#8B5CF6]/10 px-2.5 py-0.5 text-[11px] text-[#A5B0D0]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </Spotlight>
                  </TiltCard>
                </Item>
              ))}
            </Stagger>
          </AuroraSection>
        )}

        {/* experience */}
        {experiences.length > 0 && (
          <AuroraSection title="Experience" glow="#A78BFA">
            <Stagger className="relative space-y-4 pl-6" stagger={0.1}>
              {/* timeline spine */}
              <div
                aria-hidden
                className="absolute bottom-4 left-1.5 top-2 w-px bg-gradient-to-b from-[#A78BFA]/60 via-[#A78BFA]/20 to-transparent"
              />
              {experiences.map((e, i) => (
                <Item key={i} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-6 top-7 h-3 w-3 rounded-full border-2 border-[#A78BFA] bg-[#070912] shadow-[0_0_12px_rgba(167,139,250,0.6)]"
                  />
                  <Spotlight
                    className={`${card} transition hover:border-[#A78BFA]/30`}
                    color="rgba(167,139,250,0.14)"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold">
                        {e.title}{" "}
                        <span className="text-[#A78BFA]">
                          @ {e.organization}
                        </span>
                      </h3>
                      <span className="text-xs text-[#6B7694]">
                        {e.startDate ?? ""} – {e.endDate ?? "Present"}
                      </span>
                    </div>
                    {e.location && (
                      <p className="mt-1 text-xs text-[#6B7694]">{e.location}</p>
                    )}
                    {e.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[#8B96B5]">
                        {e.bullets.map((b, j) => (
                          <li key={j} className="relative pl-4">
                            <span className="absolute left-0 text-[#A78BFA]">
                              ·
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Spotlight>
                </Item>
              ))}
            </Stagger>
          </AuroraSection>
        )}

        {/* skills */}
        {skills.length > 0 && (
          <AuroraSection title="Skills" glow="#F472B6">
            <Reveal>
              <Spotlight className={card} color="rgba(244,114,182,0.14)">
                <div className="space-y-4">
                  {skills.map((s) => (
                    <div key={s.category}>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#F472B6]">
                        {s.category}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.items.map((it) => (
                          <span
                            key={it}
                            className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-[#C7CFE5] transition hover:-translate-y-0.5 hover:border-[#F472B6]/50 hover:text-[#F472B6] hover:shadow-[0_0_16px_rgba(244,114,182,0.2)]"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Spotlight>
            </Reveal>

            {/* drifting skills marquee — tasteful ambient strip */}
            {skillStrip.length > 4 && (
              <div
                aria-hidden
                className="relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
              >
                <Marquee speed={34}>
                  {skillStrip.map((it, i) => (
                    <span
                      key={`${it}-${i}`}
                      className="whitespace-nowrap rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[11px] text-[#8B96B5]"
                    >
                      {it}
                    </span>
                  ))}
                </Marquee>
              </div>
            )}
          </AuroraSection>
        )}

        {/* education */}
        {educations.length > 0 && (
          <AuroraSection title="Education" glow="#67E8F9">
            <Reveal>
              <Spotlight
                className={`${card} space-y-2 text-sm text-[#8B96B5]`}
                color="rgba(103,232,249,0.14)"
              >
                {educations.map((ed, i) => (
                  <p key={i}>
                    <span className="font-semibold text-[#E9EDF7]">
                      {ed.institution}
                    </span>
                    {ed.degree && ` — ${ed.degree}`}
                    {ed.endYear &&
                      ` (${ed.startYear ? `${ed.startYear}–` : ""}${ed.endYear})`}
                    {ed.score && ` · ${ed.score}`}
                  </p>
                ))}
              </Spotlight>
            </Reveal>
          </AuroraSection>
        )}

        {/* custom sections */}
        {sections.map((sec, si) => (
          <AuroraSection key={sec.title} title={sec.title} glow={["#A78BFA", "#F472B6", "#67E8F9"][si % 3]}>
            <Reveal>
              <Spotlight
                className={`${card} space-y-3 text-sm text-[#8B96B5]`}
                color="rgba(167,139,250,0.14)"
              >
                {sec.items.map((it, i) => (
                  <div key={i}>
                    <p>
                      {it.url ? (
                        <a href={it.url} target="_blank" rel="noreferrer" className="font-semibold text-[#E9EDF7] hover:text-[#67E8F9]">
                          {it.title} ↗
                        </a>
                      ) : (
                        <span className="font-semibold text-[#E9EDF7]">{it.title}</span>
                      )}
                      {it.subtitle && ` — ${it.subtitle}`}
                      {it.date && ` (${it.date})`}
                    </p>
                    {it.description && <p className="mt-0.5 text-[13px] leading-relaxed">{it.description}</p>}
                  </div>
                ))}
              </Spotlight>
            </Reveal>
          </AuroraSection>
        ))}

        {/* contact */}
        {(profile.email || links.length > 0) && (
          <Reveal as="section" className="mt-24 text-center">
            <p
              className="text-sm font-bold uppercase tracking-[0.25em] text-[#F472B6]"
              style={{ textShadow: "0 0 24px #F472B655" }}
            >
              {profile.openToWork ? "Open to work" : "Contact"}
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              <GradientText colors={["#67E8F9", "#A78BFA", "#F472B6", "#67E8F9"]}>
                Let&apos;s make something glow.
              </GradientText>
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {profile.email && (
                <Magnetic as="span" strength={0.35}>
                  <a
                    href={`mailto:${profile.email}`}
                    className="block rounded-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#EC4899] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.45)] transition hover:shadow-[0_0_60px_rgba(236,72,153,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    {profile.email}
                  </a>
                </Magnetic>
              )}
              {links.slice(0, 3).map((l) => (
                <Magnetic as="span" key={l.url} strength={0.3}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-[#C7CFE5] transition hover:border-[#67E8F9]/50 hover:text-[#67E8F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#67E8F9]/60"
                  >
                    {l.label || l.kind}
                  </a>
                </Magnetic>
              ))}
            </div>
          </Reveal>
        )}

        <footer className="mt-20 text-center text-xs text-[#6B7694]">
          built with Portxz
        </footer>
      </div>
    </main>
  );
}

function AuroraSection({
  title,
  glow,
  children,
}: {
  title: string;
  glow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <Reveal y={0}>
        <h2
          className="mb-5 text-sm font-bold uppercase tracking-[0.25em]"
          style={{ color: glow, textShadow: `0 0 24px ${glow}55` }}
        >
          {title}
        </h2>
      </Reveal>
      {children}
    </section>
  );
}
