import { z } from "zod";
import type { PortfolioData } from "@/components/templates/types";

/* ── Resume templates & resume-only edits ─────────────────────────────
   The resume is still generated from the portfolio data, so it stays in sync.
   ResumeConfig (profiles.resume_config) only layers resume-specific choices on
   top: a template, an optional headline/summary, section order, and what to hide.
   Shared by server (PDF/public page) and browser (editor live preview).        */

export const SECTION_KEYS = ["summary", "skills", "experience", "projects", "education", "custom"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Summary",
  skills: "Skills",
  experience: "Work Experience",
  projects: "Projects",
  education: "Education",
  custom: "Your added sections",
};

export const TEMPLATE_IDS = ["classic", "modern", "compact", "executive", "technical", "custom"] as const;
export type ResumeTemplateId = (typeof TEMPLATE_IDS)[number];

export const FONTS = ["arimo", "carlito", "tinos", "gelasio"] as const;
export type ResumeFont = (typeof FONTS)[number];
/* Metric-compatible open fonts, bundled with the app: Chrome on Vercel has no Arial or
   Georgia, so naming system fonts would silently print in a fallback font. */
export const FONT_LABELS: Record<ResumeFont, string> = {
  arimo: "Arimo — like Arial",
  carlito: "Carlito — like Calibri",
  tinos: "Tinos — like Times New Roman",
  gelasio: "Gelasio — like Georgia",
};

/** Dark enough to print well and keep text contrast; ATS ignores color anyway. */
export const ACCENTS = ["#111111", "#1d4ed8", "#0f766e", "#7c2d12", "#6d28d9", "#be123c"] as const;

export type ResumeStyle = {
  font: ResumeFont;
  accent: string;
  size: "small" | "normal" | "large";
  spacing: "compact" | "normal" | "relaxed";
  align: "left" | "center";
  /** Colored headings and rules, or black text with only the accent rule. */
  colorHeadings: boolean;
};

export type ResumeTemplate = {
  id: ResumeTemplateId;
  name: string;
  blurb: string;
  style: ResumeStyle;
  order: SectionKey[];
};

const DEFAULT_ORDER: SectionKey[] = ["summary", "skills", "experience", "projects", "education", "custom"];

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic", name: "Classic", blurb: "Black and white, the safest choice for any job portal.",
    style: { font: "arimo", accent: "#111111", size: "normal", spacing: "normal", align: "left", colorHeadings: false },
    order: DEFAULT_ORDER,
  },
  {
    id: "modern", name: "Modern", blurb: "Clean layout with colored headings.",
    style: { font: "carlito", accent: "#1d4ed8", size: "normal", spacing: "normal", align: "left", colorHeadings: true },
    order: DEFAULT_ORDER,
  },
  {
    id: "compact", name: "Compact", blurb: "Smaller text and tight spacing — fits more on one page.",
    style: { font: "arimo", accent: "#111111", size: "small", spacing: "compact", align: "left", colorHeadings: false },
    order: DEFAULT_ORDER,
  },
  {
    id: "executive", name: "Executive", blurb: "Serif type and a centered name for senior roles.",
    style: { font: "gelasio", accent: "#111111", size: "normal", spacing: "relaxed", align: "center", colorHeadings: false },
    order: ["summary", "experience", "education", "skills", "projects", "custom"],
  },
  {
    id: "technical", name: "Technical", blurb: "Skills and projects first — made for tech roles.",
    style: { font: "arimo", accent: "#0f766e", size: "normal", spacing: "normal", align: "left", colorHeadings: true },
    order: ["summary", "skills", "projects", "experience", "education", "custom"],
  },
  {
    id: "custom", name: "Custom", blurb: "Pick your own font, color, size and spacing.",
    style: { font: "arimo", accent: "#1d4ed8", size: "normal", spacing: "normal", align: "left", colorHeadings: true },
    order: DEFAULT_ORDER,
  },
];

export const templateById = (id: string) => RESUME_TEMPLATES.find((t) => t.id === id) ?? RESUME_TEMPLATES[0];

/* Stored config. Lenient parsing: bad or old values fall back to defaults instead of failing. */
const StyleSchema = z.object({
  font: z.enum(FONTS).catch("arimo"),
  accent: z.string().regex(/^#[0-9a-f]{6}$/i).catch("#1d4ed8"),
  size: z.enum(["small", "normal", "large"]).catch("normal"),
  spacing: z.enum(["compact", "normal", "relaxed"]).catch("normal"),
  align: z.enum(["left", "center"]).catch("left"),
  colorHeadings: z.boolean().catch(true),
});

export const ResumeConfigSchema = z.object({
  template: z.enum(TEMPLATE_IDS).catch("classic"),
  /** Only used by the Custom template. */
  custom: StyleSchema.catch(RESUME_TEMPLATES[5].style),
  /** Empty = use the portfolio's headline/summary. */
  headline: z.string().max(120).catch(""),
  summary: z.string().max(1200).catch(""),
  /** null = the template's own order. */
  order: z.array(z.enum(SECTION_KEYS)).nullable().catch(null),
  hiddenSections: z.array(z.enum(SECTION_KEYS)).catch([]),
  /** Item keys from itemKey(): hidden entries inside a section. */
  hiddenItems: z.array(z.string().max(300)).max(500).catch([]),
});
export type ResumeConfig = z.infer<typeof ResumeConfigSchema>;

export const parseResumeConfig = (raw: unknown): ResumeConfig =>
  ResumeConfigSchema.parse(raw && typeof raw === "object" ? raw : {});

export const DEFAULT_RESUME_CONFIG: ResumeConfig = parseResumeConfig({});

/* Entries have no stable id in PortfolioData, so they're keyed by their content.
   Renaming an entry un-hides it, which is the safe direction. */
type D = PortfolioData;
export const itemKey = {
  experience: (e: D["experiences"][number]) => `exp:${e.title}|${e.organization}`,
  project: (p: D["projects"][number]) => `proj:${p.name}`,
  education: (e: D["educations"][number]) => `edu:${e.institution}|${e.degree}`,
  custom: (s: D["sections"][number]) => `sec:${s.title}`,
};

/** Every section exactly once: saved order first, then any missing keys in default order. */
export function sectionOrder(config: ResumeConfig): SectionKey[] {
  const base = config.order ?? templateById(config.template).order;
  return [...new Set([...base, ...DEFAULT_ORDER])];
}

export function resumeStyle(config: ResumeConfig): ResumeStyle {
  return config.template === "custom" ? config.custom : templateById(config.template).style;
}

/** Portfolio data with the resume-only edits applied. */
export function applyResumeConfig(data: PortfolioData, config: ResumeConfig): PortfolioData {
  const hidden = new Set(config.hiddenItems);
  const off = new Set(config.hiddenSections);
  return {
    ...data,
    profile: {
      ...data.profile,
      headline: config.headline.trim() || data.profile.headline,
      summary: off.has("summary") ? "" : config.summary.trim() || data.profile.summary,
    },
    skills: off.has("skills") ? [] : data.skills,
    experiences: off.has("experience") ? [] : data.experiences.filter((e) => !hidden.has(itemKey.experience(e))),
    projects: off.has("projects") ? [] : data.projects.filter((p) => !hidden.has(itemKey.project(p))),
    educations: off.has("education") ? [] : data.educations.filter((e) => !hidden.has(itemKey.education(e))),
    sections: off.has("custom") ? [] : data.sections.filter((s) => !hidden.has(itemKey.custom(s))),
  };
}
