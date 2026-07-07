import type { PortfolioData } from "@/components/templates/types";

/* README.md generator — the fourth renderer of PortfolioData.
   Same data as the portfolio, resume, and PDF. */

const KIND_BADGE: Record<string, { logo: string; color: string }> = {
  github: { logo: "github", color: "181717" },
  linkedin: { logo: "linkedin", color: "0A66C2" },
  x: { logo: "x", color: "000000" },
  website: { logo: "googlechrome", color: "4DA6FF" },
  custom: { logo: "link", color: "4DA6FF" },
};

const esc = (s: string) => s.replace(/\|/g, "\\|");

export function generateReadme(data: PortfolioData, appUrl: string, username: string): string {
  const { profile, links, experiences, projects, skills, educations } = data;
  const portfolioUrl = `${appUrl}/${username}`;
  const lines: string[] = [];

  // ---- header ----
  lines.push(`<div align="center">`, ``);
  lines.push(`# ${profile.fullName}`, ``);
  if (profile.headline) lines.push(`**${profile.headline}**`, ``);

  const badges: string[] = [];
  for (const l of links) {
    const b = KIND_BADGE[l.kind] ?? KIND_BADGE.custom;
    const label = (l.label || l.kind).replace(/-/g, "--").replace(/ /g, "_");
    badges.push(
      `[![${l.label || l.kind}](https://img.shields.io/badge/${encodeURIComponent(label)}-${b.color}?style=flat-square&logo=${b.logo}&logoColor=white)](${l.url})`
    );
  }
  badges.push(
    `[![Portfolio](https://img.shields.io/badge/Portfolio-${encodeURIComponent(username)}-4DA6FF?style=flat-square)](${portfolioUrl})`
  );
  lines.push(badges.join("\n"), ``, `</div>`, ``, `---`, ``);

  // ---- about ----
  if (profile.summary) {
    lines.push(`## 👋 About Me`, ``, profile.summary, ``);
    if (profile.openToWork) lines.push(`⭐ **Open to work & freelance projects**`, ``);
    lines.push(`---`, ``);
  }

  // ---- projects ----
  const featured = projects.filter((p) => p.featured);
  const shown = featured.length > 0 ? featured : projects.slice(0, 4);
  if (shown.length > 0) {
    lines.push(`## 🚀 Featured Projects`, ``);
    for (const p of shown) {
      const title = p.liveUrl ? `[${p.name}](${p.liveUrl})` : p.name;
      lines.push(`### ${title}`);
      if (p.tagline) lines.push(`> ${p.tagline}`, ``);
      if (p.tech.length) lines.push(`- **Stack:** ${p.tech.join(" · ")}`);
      const linksLine = [
        p.liveUrl ? `[Live](${p.liveUrl})` : null,
        p.repoUrl ? `[Code](${p.repoUrl})` : null,
      ].filter(Boolean);
      if (linksLine.length) lines.push(`- **Links:** ${linksLine.join(" · ")}`);
      lines.push(``);
    }
    lines.push(`---`, ``);
  }

  // ---- skills ----
  if (skills.length > 0) {
    lines.push(`## 🛠️ Tech Stack`, ``);
    for (const s of skills) {
      lines.push(`**${s.category}:** ${s.items.join(", ")}`, ``);
    }
    lines.push(`---`, ``);
  }

  // ---- experience ----
  if (experiences.length > 0) {
    lines.push(`## 💼 Experience`, ``);
    lines.push(`| Role | Organization | When |`, `|------|--------------|------|`);
    for (const e of experiences) {
      const when = `${e.startDate ?? ""} – ${e.endDate ?? "Present"}`;
      lines.push(`| ${esc(e.title)} | ${esc(e.organization)} | ${esc(when)} |`);
    }
    lines.push(``, `---`, ``);
  }

  // ---- education ----
  if (educations.length > 0) {
    lines.push(`## 🎓 Education`, ``);
    for (const ed of educations) {
      const yr = ed.endYear ? ` (${ed.startYear ? `${ed.startYear}–` : ""}${ed.endYear})` : "";
      lines.push(`- **${ed.institution}**${ed.degree ? ` — ${ed.degree}` : ""}${yr}${ed.score ? ` · ${ed.score}` : ""}`);
    }
    lines.push(``, `---`, ``);
  }

  // ---- footer ----
  lines.push(`<div align="center">`, ``);
  lines.push(`🌐 **Full portfolio & resume:** [${portfolioUrl.replace(/^https?:\/\//, "")}](${portfolioUrl})`, ``);
  lines.push(`<sub>Generated with [portX](${appUrl}) — one profile, always in sync.</sub>`, ``);
  lines.push(`</div>`, ``);

  return lines.join("\n");
}
