import type { PortfolioData } from "@/components/templates/types";
import { SITE_NAME } from "@/lib/site";

/* README.md generator — another renderer of PortfolioData.
   Same data as the portfolio, resume, and PDF. */

const KIND_BADGE: Record<string, { logo: string; color: string }> = {
  github: { logo: "github", color: "181717" },
  linkedin: { logo: "linkedin", color: "0A66C2" },
  x: { logo: "x", color: "000000" },
  twitter: { logo: "x", color: "000000" },
  website: { logo: "googlechrome", color: "4DA6FF" },
  email: { logo: "gmail", color: "EA4335" },
  custom: { logo: "link", color: "4DA6FF" },
};

const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

/** shields.io static-badge text: "-" → "--", "_" → "__", space → "_". */
const badgeText = (s: string) =>
  encodeURIComponent(s.replace(/-/g, "--").replace(/_/g, "__").replace(/ /g, "_"));

export function generateReadme(data: PortfolioData, appUrl: string, username: string): string {
  const { profile, links, experiences, projects, skills, educations, sections } = data;
  const portfolioUrl = `${appUrl}/${username}`;
  const lines: string[] = [];

  // ---- header ----
  lines.push(`<div align="center">`, ``);
  lines.push(`# ${profile.fullName}`, ``);
  if (profile.headline) lines.push(`**${profile.headline}**`, ``);
  if (profile.location) lines.push(`📍 ${profile.location}`, ``);

  const badges: string[] = [];
  for (const l of links) {
    if (!l.url) continue;
    const b = KIND_BADGE[l.kind] ?? KIND_BADGE.custom;
    const label = l.label || l.kind;
    badges.push(
      `[![${label}](https://img.shields.io/badge/${badgeText(label)}-${b.color}?style=flat-square&logo=${b.logo}&logoColor=white)](${l.url})`
    );
  }
  if (profile.email)
    badges.push(
      `[![Email](https://img.shields.io/badge/Email-${KIND_BADGE.email.color}?style=flat-square&logo=${KIND_BADGE.email.logo}&logoColor=white)](mailto:${profile.email})`
    );
  badges.push(
    `[![Portfolio](https://img.shields.io/badge/Portfolio-${badgeText(username)}-4DA6FF?style=flat-square)](${portfolioUrl})`
  );
  lines.push(badges.join("\n"), ``, `</div>`, ``, `---`, ``);

  // ---- about ----
  if (profile.summary || profile.openToWork) {
    lines.push(`## 👋 About Me`, ``);
    if (profile.summary) lines.push(profile.summary, ``);
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
  const filledSkills = skills.filter((s) => s.items.length > 0);
  if (filledSkills.length > 0) {
    lines.push(`## 🛠️ Tech Stack`, ``);
    for (const s of filledSkills) {
      lines.push(`**${s.category}:** ${s.items.join(", ")}`, ``);
    }
    lines.push(`---`, ``);
  }

  // ---- experience ----
  if (experiences.length > 0) {
    lines.push(`## 💼 Experience`, ``);
    lines.push(`| Role | Organization | When |`, `|------|--------------|------|`);
    for (const e of experiences) {
      const when = e.startDate ? `${e.startDate} – ${e.endDate ?? "Present"}` : e.endDate ?? "";
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

  // ---- custom sections (Certifications, Awards…) ----
  for (const sec of sections) {
    lines.push(`## ${sec.title}`, ``);
    for (const it of sec.items) {
      const title = it.url ? `[${it.title}](${it.url})` : it.title;
      const meta = [it.subtitle, it.date].filter(Boolean).join(" · ");
      lines.push(`- **${title}**${meta ? ` — ${meta}` : ""}`);
      if (it.description) lines.push(`  ${it.description.replace(/\r?\n/g, " ")}`);
    }
    lines.push(``, `---`, ``);
  }

  // ---- footer ----
  lines.push(`<div align="center">`, ``);
  lines.push(`🌐 **Full portfolio & resume:** [${portfolioUrl.replace(/^https?:\/\//, "")}](${portfolioUrl})`, ``);
  lines.push(`<sub>Generated with [${SITE_NAME}](${appUrl}) — one profile, always in sync.</sub>`, ``);
  lines.push(`</div>`, ``);

  return lines.join("\n");
}
