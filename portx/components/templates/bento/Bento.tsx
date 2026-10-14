"use client";

import type { TemplateProps } from "../types";
import {
  Stagger,
  Item,
  TiltCard,
  Magnetic,
  GradientText,
  Spotlight,
  Marquee,
  ScrollProgress,
  CountUp,
  Avatar3D,
} from "../tem_comps/Motion";
import { getInsights } from "../insights";

/* ── Bento template ─────────────────────────────────────────────────────
   A premium Apple/Vercel/Linear-style bento mosaic: varied-span rounded
   tiles on a refined dark canvas, cursor spotlight glow on every surface,
   3D tilt on feature tiles, magnetic contact buttons, a marquee skill
   strip and data-derived stat tiles. Reduced-motion safe, SSR-stable. */

const ACCENT = ["#7DD3FC", "#A78BFA", "#F0ABFC", "#7DD3FC"];

const tileBase =
  "group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/[0.08] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] transition duration-300 will-change-transform hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] sm:p-7";

/* A single bento surface: dark tinted card + cursor spotlight. */
function Tile({
  children,
  className,
  glow = "rgba(129,140,248,0.16)",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}) {
  return (
    <Spotlight color={glow} className={`${tileBase} ${className ?? ""}`}>
      {children}
    </Spotlight>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
    {children}
  </p>
);

const chip =
  "rounded-full border border-white/[0.08] bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-white/70";

export function Bento({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations, sections } = data;

  const featured = projects.filter((p) => p.featured);
  const shown = (featured.length ? featured : projects.slice(0, 2)).slice(0, 2);
  const rest = projects.filter((p) => !shown.includes(p));

  const allSkillItems = skills.flatMap((s) => s.items);
  /* Stat tiles, current role and monogram all derive from the profile data. */
  const { initials, current, stats } = getInsights(data);
  const statCols =
    ["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-2 lg:grid-cols-4"][stats.length] ??
    "grid-cols-2 lg:grid-cols-4";

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#08090D] px-4 py-12 font-sans text-[#EAECF2] antialiased sm:px-6 sm:py-16"
      data-fixed-theme
    >
      <ScrollProgress color="linear-gradient(90deg,#7DD3FC,#A78BFA,#F0ABFC)" />
      {/* ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[#5B6CFF]/15 blur-[130px]" />
        <div className="absolute -bottom-40 right-0 h-[34rem] w-[34rem] rounded-full bg-[#B14BF0]/12 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Stagger
        stagger={0.06}
        className="relative z-10 mx-auto grid max-w-6xl auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 [grid-auto-flow:dense] sm:grid-cols-2 lg:grid-cols-6"
      >
        {/* ── Hero identity ─────────────────────────────────────────── */}
        <Item className="h-full sm:col-span-2 lg:col-span-4">
          <TiltCard className="h-full" max={4}>
            <Tile className="justify-between bg-gradient-to-br from-[#161A2B] via-[#101320] to-[#0B0D16]">
              <div className="flex items-start justify-between gap-4">
                {profile.openToWork ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#39D98A]/30 bg-[#39D98A]/10 px-3 py-1 text-xs font-medium text-[#5FE7AA]">
                    <span className="relative flex h-2 w-2">
                      <span className="pxz-pulse absolute inline-flex h-full w-full rounded-full bg-[#5FE7AA]/70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5FE7AA]" />
                    </span>
                    Open to work
                  </span>
                ) : (
                  <span />
                )}
                <Avatar3D
                  src={profile.avatarUrl}
                  name={profile.fullName}
                  initials={initials}
                  size={72}
                  shape="squircle"
                  colors={["#7DD3FC", "#A78BFA", "#F0ABFC"]}
                  surface="linear-gradient(135deg,#1B2140,#141627)"
                  className="mr-3 mt-3"
                />
              </div>

              <div className="mt-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                  <GradientText colors={ACCENT}>{profile.fullName}</GradientText>
                </h1>
                {profile.headline && (
                  <p className="mt-3 text-lg text-white/70 sm:text-xl">
                    {profile.headline}
                  </p>
                )}
                {current && (
                  <p className="mt-2 text-sm text-white/50">
                    Currently <span className="text-white/85">{current.title}</span>
                    {current.organization && (
                      <span className="text-[#7DD3FC]"> @ {current.organization}</span>
                    )}
                  </p>
                )}
                {profile.summary && (
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
                    {profile.summary}
                  </p>
                )}
              </div>
            </Tile>
          </TiltCard>
        </Item>

        {/* ── Contact / links ───────────────────────────────────────── */}
        <Item className="h-full sm:col-span-2 lg:col-span-2">
          <Tile
            glow="rgba(125,211,252,0.16)"
            className="justify-between bg-[#0E1119]"
          >
            <div>
              <Label>Connect</Label>
              <div className="mt-4 flex flex-col gap-2.5">
                {profile.email && (
                  <Magnetic as="span" className="w-full" strength={0.25}>
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-sm transition hover:border-[#7DD3FC]/50 hover:bg-white/[0.06]"
                    >
                      <span>Email</span>
                      <span aria-hidden className="text-white/40">
                        ↗
                      </span>
                    </a>
                  </Magnetic>
                )}
                {links.map((l) => (
                  <Magnetic
                    key={l.url}
                    as="span"
                    className="w-full"
                    strength={0.25}
                  >
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-sm transition hover:border-[#7DD3FC]/50 hover:bg-white/[0.06]"
                    >
                      <span className="truncate">{l.label}</span>
                      <span aria-hidden className="text-white/40">
                        ↗
                      </span>
                    </a>
                  </Magnetic>
                ))}
                {!profile.email && links.length === 0 && (
                  <p className="text-sm text-white/40">No links yet.</p>
                )}
              </div>
            </div>
            {profile.location && (
              <p className="mt-5 flex items-center gap-1.5 text-xs text-white/45">
                <span aria-hidden>📍</span>
                {profile.location}
              </p>
            )}
          </Tile>
        </Item>

        {/* ── Stat tiles ────────────────────────────────────────────── */}
        {stats.length > 0 && (
          <Item className="col-span-full">
            <div className={`grid gap-4 ${statCols}`}>
              {stats.map((s) => (
                <TiltCard key={s.label} className="h-full" max={9}>
                  <Tile className="items-start justify-center bg-gradient-to-br from-[#12141F] to-[#0B0D14]">
                    <span className="block text-4xl font-bold tracking-tight sm:text-5xl">
                      <GradientText colors={ACCENT}>
                        <CountUp value={s.value} suffix={s.suffix} pad={2} />
                      </GradientText>
                    </span>
                    <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      {s.label}
                    </span>
                  </Tile>
                </TiltCard>
              ))}
            </div>
          </Item>
        )}

        {/* ── Featured projects ─────────────────────────────────────── */}
        {shown.map((p, i) => (
          <Item
            key={p.name}
            className="h-full sm:col-span-2 lg:col-span-3"
          >
            <TiltCard className="h-full" max={6}>
              <Tile
                glow={i % 2 === 0 ? "rgba(125,211,252,0.18)" : "rgba(240,171,252,0.18)"}
                className={
                  i % 2 === 0
                    ? "bg-gradient-to-br from-[#111a2e] to-[#0B0F1A]"
                    : "bg-gradient-to-br from-[#1c1230] to-[#100B1A]"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Label>Featured</Label>
                    <h3 className="mt-2 text-xl font-semibold">{p.name}</h3>
                  </div>
                  <span aria-hidden className="text-sm text-[#FFC24B]">
                    ★
                  </span>
                </div>
                {p.tagline && (
                  <p className="mt-1.5 text-sm text-white/60">{p.tagline}</p>
                )}
                {p.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/45">
                    {p.description}
                  </p>
                )}
                {p.tech.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 6).map((t) => (
                      <span key={t} className={chip}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto flex gap-4 pt-5 text-xs font-medium">
                  {p.liveUrl && (
                    <a
                      className="text-[#7DD3FC] transition hover:text-white"
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live ↗
                    </a>
                  )}
                  {p.repoUrl && (
                    <a
                      className="text-[#7DD3FC] transition hover:text-white"
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Code ↗
                    </a>
                  )}
                </div>
              </Tile>
            </TiltCard>
          </Item>
        ))}

        {/* ── Skills ────────────────────────────────────────────────── */}
        {skills.length > 0 && (
          <Item className="h-full sm:col-span-2 lg:col-span-4">
            <Tile glow="rgba(167,139,250,0.16)" className="bg-[#0E1119]">
              <Label>Skills &amp; Tooling</Label>

              {allSkillItems.length > 4 && (
                <div className="mt-4 -mx-6 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] sm:-mx-7">
                  <Marquee speed={34} className="px-6 sm:px-7">
                    {allSkillItems.map((s, i) => (
                      <span key={`${s}-${i}`} className={chip}>
                        {s}
                      </span>
                    ))}
                  </Marquee>
                </div>
              )}

              <div className="mt-5 space-y-3">
                {skills.map((s) => (
                  <div key={s.category}>
                    <p className="text-xs font-medium text-[#A78BFA]">
                      {s.category}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {s.items.map((it) => (
                        <span key={it} className={chip}>
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Tile>
          </Item>
        )}

        {/* ── Experience timeline ───────────────────────────────────── */}
        {experiences.length > 0 && (
          <Item className="h-full sm:col-span-2 lg:col-span-3">
            <Tile className="bg-[#0E1119]">
              <Label>Experience</Label>
              <ol className="mt-5 space-y-5">
                {experiences.map((e, i) => (
                  <li key={i} className="relative pl-5">
                    <span
                      aria-hidden
                      className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[#7DD3FC]"
                    />
                    {i < experiences.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[3px] top-4 h-[calc(100%+0.75rem)] w-px bg-white/10"
                      />
                    )}
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-sm font-semibold">
                        {e.title}
                        <span className="text-[#7DD3FC]">
                          {" "}
                          @ {e.organization}
                        </span>
                      </h3>
                      <span className="text-[11px] tabular-nums text-white/40">
                        {e.startDate ?? ""} – {e.endDate ?? "Now"}
                      </span>
                    </div>
                    {e.bullets[0] && (
                      <p className="mt-1 text-xs leading-relaxed text-white/55">
                        {e.bullets[0]}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </Tile>
          </Item>
        )}

        {/* ── Education ─────────────────────────────────────────────── */}
        {educations.length > 0 && (
          <Item className="h-full sm:col-span-2 lg:col-span-3">
            <Tile glow="rgba(240,171,252,0.14)" className="bg-[#0E1119]">
              <Label>Education</Label>
              <div className="mt-5 space-y-4">
                {educations.map((ed, i) => (
                  <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <div>
                      <p className="text-sm font-semibold text-white/90">
                        {ed.institution}
                      </p>
                      {ed.degree && (
                        <p className="text-xs text-white/55">{ed.degree}</p>
                      )}
                    </div>
                    <span className="text-[11px] tabular-nums text-white/40">
                      {ed.endYear ?? ""}
                      {ed.score ? ` · ${ed.score}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </Tile>
          </Item>
        )}

        {/* ── Custom sections ───────────────────────────────────────── */}
        {sections.map((sec) => (
          <Item key={sec.title} className="h-full sm:col-span-2 lg:col-span-3">
            <Tile glow="rgba(125,211,252,0.12)" className="bg-[#0E1119]">
              <Label>{sec.title}</Label>
              <div className="mt-5 space-y-4">
                {sec.items.map((it, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <div>
                        {it.url ? (
                          <a href={it.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-white/90 hover:text-white">
                            {it.title} ↗
                          </a>
                        ) : (
                          <p className="text-sm font-semibold text-white/90">{it.title}</p>
                        )}
                        {it.subtitle && <p className="text-xs text-white/55">{it.subtitle}</p>}
                      </div>
                      {it.date && <span className="text-[11px] tabular-nums text-white/40">{it.date}</span>}
                    </div>
                    {it.description && <p className="mt-1 text-xs leading-relaxed text-white/55">{it.description}</p>}
                  </div>
                ))}
              </div>
            </Tile>
          </Item>
        ))}

        {/* ── Remaining projects ────────────────────────────────────── */}
        {rest.map((p) => (
          <Item key={p.name} className="h-full sm:col-span-1 lg:col-span-2">
            <Tile className="bg-[#0E1119]">
              <h3 className="text-sm font-semibold">{p.name}</h3>
              {p.tagline && (
                <p className="mt-1 line-clamp-2 text-xs text-white/55">
                  {p.tagline}
                </p>
              )}
              {p.tech.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 3).map((t) => (
                    <span key={t} className={chip}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto flex gap-3 pt-4 text-xs font-medium">
                {p.liveUrl && (
                  <a
                    className="text-[#7DD3FC] transition hover:text-white"
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live ↗
                  </a>
                )}
                {p.repoUrl && (
                  <a
                    className="text-[#7DD3FC] transition hover:text-white"
                    href={p.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Code ↗
                  </a>
                )}
              </div>
            </Tile>
          </Item>
        ))}

        {/* ── Closing contact tile ──────────────────────────────────── */}
        {profile.email && (
          <Item className="col-span-full">
            <TiltCard max={3}>
              <Tile
                glow="rgba(240,171,252,0.2)"
                className="items-center bg-gradient-to-br from-[#161A2B] via-[#1c1230] to-[#0B0D16] py-12 text-center sm:py-16"
              >
                <Label>{profile.openToWork ? "Open to work" : "Contact"}</Label>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                  <GradientText colors={ACCENT}>Let&apos;s work together.</GradientText>
                </h2>
                <div className="mt-7 flex justify-center">
                  <Magnetic as="span" strength={0.3}>
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B0D16] transition hover:bg-[#7DD3FC]"
                    >
                      {profile.email} <span aria-hidden>↗</span>
                    </a>
                  </Magnetic>
                </div>
              </Tile>
            </TiltCard>
          </Item>
        )}

        <footer className="col-span-full pt-4 text-center text-xs text-white/35">
          built with Portxz
        </footer>
      </Stagger>

      {/* reduced-motion-safe custom keyframe */}
      <style>{`
        @keyframes pxz-ping-soft { 75%,100% { transform: scale(2); opacity: 0 } }
        .pxz-pulse { animation: pxz-ping-soft 1.8s cubic-bezier(0,0,0.2,1) infinite; }
        @media (prefers-reduced-motion: reduce) { .pxz-pulse { animation: none; } }
      `}</style>
    </main>
  );
}
