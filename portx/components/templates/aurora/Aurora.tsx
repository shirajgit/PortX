"use client";

import type { TemplateProps } from "../types";
import { AuroraCanvas } from "../tem_comps/AuroraCanvas";
import { GlassCard } from "../tem_comps/GlassCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Aurora({ data }: TemplateProps) {
  const { profile, links, experiences, projects, skills, educations } = data;

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-[#05070F] font-sans text-[#E9EDF7] antialiased selection:bg-[#67E8F9]/30 selection:text-[#67E8F9]"
      data-fixed-theme
    >
      {/* Animated 3D Aurora Background Canvas */}
      <AuroraCanvas />

      {/* Grid overlay texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-3xl px-6 py-16 sm:py-24"
      >
        {/* Hero Section */}
        <motion.header variants={{itemVariants}}>
          {profile.openToWork && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#67E8F9] shadow-[0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#67E8F9] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#67E8F9]" />
              </span>
              AVAILABLE FOR WORK
            </span>
          )}

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6] bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              {profile.fullName}
            </span>
          </h1>

          {profile.headline && (
            <p className="mt-4 text-xl font-medium text-[#B2BDDC] sm:text-2xl">
              {profile.headline}
            </p>
          )}

          {profile.summary && (
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#8B96B5]">
              {profile.summary}
            </p>
          )}

          {(links.length > 0 || profile.email) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-medium text-[#C7CFE5] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#67E8F9]/50 hover:text-[#67E8F9] hover:shadow-[0_0_20px_rgba(103,232,249,0.2)]"
                >
                  {l.label}
                </a>
              ))}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="group relative rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-medium text-[#C7CFE5] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#F472B6]/50 hover:text-[#F472B6] hover:shadow-[0_0_20px_rgba(244,114,182,0.2)]"
                >
                  Email
                </a>
              )}
            </div>
          )}
        </motion.header>

        {/* Projects Section */}
        {projects.length > 0 && (
          <AuroraSection title="Projects" glow="#67E8F9">
            <div className="space-y-4">
              {projects.map((p) => (
                <GlassCard key={p.name} glowColor="#67E8F9">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-[#67E8F9]">
                      {p.name}
                    </h3>
                    <div className="flex gap-4 text-xs font-semibold">
                      {p.liveUrl && (
                        <a
                          className="text-[#67E8F9] transition-transform hover:scale-110"
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live ↗
                        </a>
                      )}
                      {p.repoUrl && (
                        <a
                          className="text-[#9BA6C6] hover:text-[#67E8F9]"
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
                    <p className="mt-2 text-sm text-[#8B96B5]">{p.tagline}</p>
                  )}
                  {p.tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-3 py-1 text-[11px] font-medium text-[#A5B0D0]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          </AuroraSection>
        )}

        {/* Experience Section */}
        {experiences.length > 0 && (
          <AuroraSection title="Experience" glow="#A78BFA">
            <div className="space-y-4">
              {experiences.map((e, i) => (
                <GlassCard key={i} glowColor="#A78BFA">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-bold text-white">
                      {e.title}{" "}
                      <span className="text-[#A78BFA]">@ {e.organization}</span>
                    </h3>
                    <span className="text-xs font-medium text-[#6B7694]">
                      {e.startDate ?? ""} – {e.endDate ?? "Present"}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#8B96B5]">
                      {e.bullets.map((b, j) => (
                        <li key={j} className="relative pl-5">
                          <span className="absolute left-0 text-[#A78BFA]">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </GlassCard>
              ))}
            </div>
          </AuroraSection>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <AuroraSection title="Skills" glow="#F472B6">
            <GlassCard glowColor="#F472B6">
              <div className="space-y-5">
                {skills.map((s) => (
                  <div key={s.category}>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#F472B6]">
                      {s.category}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {s.items.map((i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[#C7CFE5] transition-colors hover:border-[#F472B6]/40 hover:text-white"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </AuroraSection>
        )}

        {/* Education Section */}
        {educations.length > 0 && (
          <AuroraSection title="Education" glow="#67E8F9">
            <GlassCard glowColor="#67E8F9">
              <div className="space-y-3 text-sm text-[#8B96B5]">
                {educations.map((ed, i) => (
                  <p key={i}>
                    <span className="font-bold text-[#E9EDF7]">
                      {ed.institution}
                    </span>
                    {ed.degree && ` — ${ed.degree}`}
                    {ed.endYear &&
                      ` (${ed.startYear ? `${ed.startYear}–` : ""}${ed.endYear})`}
                    {ed.score && ` · ${ed.score}`}
                  </p>
                ))}
              </div>
            </GlassCard>
          </AuroraSection>
        )}

        <footer className="mt-20 text-center text-xs font-medium text-[#6B7694]">
          Built with Portxz
        </footer>
      </motion.div>
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
    <motion.section variants={{itemVariants}} className="mt-20">
      <h2
        className="mb-6 text-xs font-bold uppercase tracking-[0.3em]"
        style={{
          color: glow,
          textShadow: `0 0 20px ${glow}88`,
        }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}