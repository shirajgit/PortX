import { z } from "zod";
import type { PortfolioData } from "@/components/templates/types";
import { extractJson } from "@/lib/json";

/* ── Resume Tailor ──────────────────────────────────────────────────────
   Compares the user's PortfolioData with a pasted job description and
   returns a match score, keyword gaps, a tailored summary and bullet
   rewrites. Every line we can rewrite gets a stable id ("exp:0:1"), so
   the model can only target real lines — never add new ones — and we
   restore the original text from our data, not from the model.        */

export const TailorResult = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string().max(300),
  role: z.string().max(120).default(""),
  matched: z.array(z.string().max(40)).max(20).default([]),
  missing: z.array(z.string().max(40)).max(15).default([]),
  summary: z.string().max(700).default(""),
  highlightSkills: z.array(z.string().max(40)).max(12).default([]),
  rewrites: z
    .array(
      z.object({
        id: z.string().max(20),
        suggestion: z.string().min(3).max(320),
        reason: z.string().max(160).default(""),
      })
    )
    .max(12)
    .default([]),
  tips: z.array(z.string().max(220)).max(4).default([]),
});
export type TailorResultT = z.infer<typeof TailorResult>;

export type Rewrite = { id: string; label: string; original: string; suggestion: string; reason: string };
export type TailorResponse = Omit<TailorResultT, "rewrites"> & { rewrites: Rewrite[] };

/** Every rewritable line, keyed by id. */
export function rewritableLines(data: PortfolioData): Map<string, { label: string; text: string }> {
  const lines = new Map<string, { label: string; text: string }>();
  data.experiences.forEach((e, i) =>
    e.bullets.forEach((b, j) => b.trim() && lines.set(`exp:${i}:${j}`, { label: `${e.title} · ${e.organization}`, text: b }))
  );
  data.projects.forEach((p, i) => {
    if (p.bullets.length)
      p.bullets.forEach((b, j) => b.trim() && lines.set(`proj:${i}:${j}`, { label: p.name, text: b }));
    else if (p.tagline.trim()) lines.set(`proj:${i}:tagline`, { label: p.name, text: p.tagline });
  });
  return lines;
}

const SYSTEM = `You are an expert resume writer and ATS specialist. You tailor a candidate's
existing resume to one specific job description.

HARD RULES — honesty first:
- Use ONLY facts present in the candidate JSON. Never invent employers, titles, dates, metrics,
  tools, certifications or outcomes. If a job requirement isn't supported by the data, it goes
  in "missing" — it must NOT appear in rewrites or the summary.
- Rewrites may rephrase, reorder and adopt the job's vocabulary for things the candidate
  genuinely did (e.g. "built REST endpoints" -> "designed REST APIs" when the job says "API design").
  Keep any numbers exactly as given. One line each, max ~30 words, action-verb first.
- Only rewrite lines by their "id" from the candidate JSON. Pick the 4-10 lines that matter most
  for this job. Skip lines that are already a strong match.
- Respond with ONLY a JSON object, no markdown fences, no preamble.

SCORING (0-100): how well the CURRENT resume matches the job — required skills/tools coverage
(50%), relevant experience (30%), keyword/title alignment (20%). Be honest; 90+ is rare.

FIELDS:
- verdict: 1-2 sentences. Strongest fit first, then the biggest gap.
- role: the job title (and company if stated), e.g. "Frontend Engineer at Razorpay".
- matched: job keywords (skills, tools, domains) the candidate clearly has. Short terms.
- missing: important job keywords the candidate's data does not show. Short terms.
- summary: a tailored 2-3 sentence professional summary, using only real facts.
- highlightSkills: existing candidate skills (exact spelling from the data) most relevant to this job, most relevant first.
- rewrites: [{"id","suggestion","reason"}] — reason says which job need it targets (max 12 words).
- tips: up to 3 short, honest suggestions (e.g. "The role asks for AWS — add it to Skills only if you've used it").

OUTPUT SHAPE (exactly):
{"score":72,"verdict":"...","role":"...","matched":["React"],"missing":["AWS"],"summary":"...","highlightSkills":["React"],"rewrites":[{"id":"exp:0:1","suggestion":"...","reason":"..."}],"tips":["..."]}`;

/** JSON.stringify replacer: leave out empty strings, nulls and empty arrays — fewer tokens, same meaning. */
const dropEmpty = (_: string, v: unknown) =>
  v === "" || v === null || (Array.isArray(v) && v.length === 0) ? undefined : v;

export function buildTailorPrompt(data: PortfolioData, job: string): { system: string; user: string } {
  const candidate = {
    headline: data.profile.headline,
    summary: data.profile.summary,
    location: data.profile.location,
    skills: data.skills,
    experiences: data.experiences.map((e, i) => ({
      title: e.title,
      organization: e.organization,
      dates: `${e.startDate ?? ""} - ${e.endDate ?? "Present"}`,
      bullets: e.bullets.map((b, j) => ({ id: `exp:${i}:${j}`, text: b })),
    })),
    projects: data.projects.map((p, i) => ({
      name: p.name,
      tech: p.tech,
      lines: p.bullets.length
        ? p.bullets.map((b, j) => ({ id: `proj:${i}:${j}`, text: b }))
        : p.tagline ? [{ id: `proj:${i}:tagline`, text: p.tagline }] : [],
    })),
    educations: data.educations.map((ed) => ({ institution: ed.institution, degree: ed.degree, endYear: ed.endYear })),
    extra: data.sections.map((s) => ({ title: s.title, items: s.items.map((it) => it.title) })),
  };
  // Candidate first, job second: the profile is the same across every job a user tailors for,
  // so DeepSeek's prefix cache bills it at the cheap rate from the second job on.
  const cleanJob = job.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return {
    system: SYSTEM,
    user: `CANDIDATE (JSON):\n${JSON.stringify(candidate, dropEmpty)}\n\nJOB DESCRIPTION:\n"""\n${cleanJob}\n"""`,
  };
}

export function parseTailorResponse(raw: string, data: PortfolioData): TailorResponse | null {
  const r = TailorResult.safeParse(extractJson(raw));
  if (!r.success) return null;
  const parsed: TailorResultT = r.data;

  const lines = rewritableLines(data);
  const seen = new Set<string>();
  const rewrites: Rewrite[] = [];
  for (const r of parsed.rewrites) {
    const line = lines.get(r.id);
    if (!line || seen.has(r.id) || r.suggestion.trim() === line.text.trim()) continue;
    seen.add(r.id);
    rewrites.push({ id: r.id, label: line.label, original: line.text, suggestion: r.suggestion.trim(), reason: r.reason });
  }

  // Only keep skills that really exist on the profile.
  const own = new Map(data.skills.flatMap((s) => s.items).map((i) => [i.toLowerCase(), i]));
  const highlightSkills = parsed.highlightSkills
    .map((s) => own.get(s.toLowerCase()))
    .filter((s): s is string => !!s);

  return { ...parsed, score: Math.round(parsed.score), highlightSkills, rewrites };
}

/** The resume data with the accepted changes applied. The saved profile is never touched. */
export function applyTailoring(
  data: PortfolioData,
  t: { summary: string | null; rewrites: { id: string; suggestion: string }[]; highlightSkills: string[] }
): PortfolioData {
  const next: PortfolioData = structuredClone(data);
  if (t.summary) next.profile.summary = t.summary;

  for (const r of t.rewrites) {
    const [kind, a, b] = r.id.split(":");
    const i = Number(a);
    if (kind === "exp" && next.experiences[i]) next.experiences[i].bullets[Number(b)] = r.suggestion;
    if (kind === "proj" && next.projects[i]) {
      if (b === "tagline") next.projects[i].tagline = r.suggestion;
      else next.projects[i].bullets[Number(b)] = r.suggestion;
    }
  }

  // Lead with the skills this job cares about: matching groups first, matching items first.
  const rank = new Map(t.highlightSkills.map((s, i) => [s.toLowerCase(), i]));
  const score = (item: string) => rank.get(item.toLowerCase()) ?? Infinity;
  next.skills = next.skills
    .map((g) => ({ ...g, items: [...g.items].sort((x, y) => score(x) - score(y)) }))
    .sort((g, h) => Math.min(...g.items.map(score)) - Math.min(...h.items.map(score)));

  return next;
}
