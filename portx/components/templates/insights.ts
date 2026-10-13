import type { PortfolioData } from "./types";

/* ── Profile insights ───────────────────────────────────────────────────
   Facts every template can show "at a glance", derived only from what the
   person already entered. They let a short profile still read as complete
   and informative: years of experience, current role, counts, top stack.  */

export type Stat = { value: number; suffix: string; label: string };

const yearsIn = (v: string | null) =>
  (v?.match(/\b(?:19|20)\d{2}\b/g) ?? []).map(Number);

export function getInsights(data: PortfolioData) {
  const { profile, experiences, projects, skills } = data;

  const initials =
    profile.fullName
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "•";

  // The role still running (no end date) — "what they do right now".
  const current = experiences.find((e) => !e.endDate) ?? null;

  // Years of experience: earliest start year → this year if a role is
  // still running, otherwise the latest year mentioned.
  const starts = experiences.flatMap((e) => yearsIn(e.startDate));
  const all = [...starts, ...experiences.flatMap((e) => yearsIn(e.endDate))];
  const stillWorking = experiences.some((e) => e.startDate && !e.endDate);
  const latest = stillWorking ? new Date().getFullYear() : all.length ? Math.max(...all) : 0;
  const years = starts.length ? Math.min(60, Math.max(0, latest - Math.min(...starts))) : 0;

  const skillCount = skills.reduce((n, s) => n + s.items.length, 0);

  // Technologies ranked by how many projects use them (ties keep first-seen order).
  const freq = new Map<string, number>();
  for (const p of projects) for (const t of p.tech) freq.set(t, (freq.get(t) ?? 0) + 1);
  const topTech = [...freq.entries()].sort((x, y) => y[1] - x[1]).map(([t]) => t);

  const stats: Stat[] = [
    { value: years, suffix: "+", label: years === 1 ? "Year experience" : "Years experience" },
    { value: projects.length, suffix: "", label: projects.length === 1 ? "Project" : "Projects" },
    { value: experiences.length, suffix: "", label: experiences.length === 1 ? "Role" : "Roles" },
    { value: skillCount, suffix: "", label: skillCount === 1 ? "Skill" : "Skills" },
  ].filter((s) => s.value > 0);

  return { initials, current, years, skillCount, topTech, stats };
}
