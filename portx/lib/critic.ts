import { z } from "zod";
import type { PortfolioData } from "@/components/templates/types";
import { extractJson } from "@/lib/json";

/* ── AI Portfolio Critic ────────────────────────────────────────────────
   Sends the user's PortfolioData through a structured rubric and returns
   a readiness score with specific, actionable fixes. Strictly grounded:
   the model judges ONLY the provided data.                            */

/** Trim to `max` chars, preferring a sentence end, then a word break. */
function clip(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : max).replace(/[,;:s]+$/, "") + "…";
}

const Score = z.number().transform((n) => Math.round(Math.min(100, Math.max(0, n))));

/* Lenient on length: models overshoot the limits in the prompt now and then, and a
   slightly long review is still a good review — trim it rather than throw it away.
   Only a structurally broken reply is rejected (and retried). */
export const CriticResult = z.object({
  score: Score,
  summary: z.string().min(1).transform((s) => clip(s, 450)),
  categories: z.array(
    z.object({
      name: z.string().min(1).transform((s) => clip(s, 40)),
      score: Score,
      verdict: z.enum(["good", "needs_work", "missing"]),
      fixes: z.array(z.string()).transform((f) => f.slice(0, 4).map((x) => clip(x, 240))),
    })
  ).min(3).transform((c) => c.slice(0, 8)),
});
export type CriticResultT = z.infer<typeof CriticResult>;

const SYSTEM = `You are a strict but constructive reviewer of professional portfolios (any field:
engineering, design, marketing, sales, finance and more). Judge against what recruiters
and clients in THIS person's field expect, inferred from their headline and experience,
grading how ready this profile is for recruiters and freelance clients.

HARD RULES:
- Judge ONLY the JSON profile data provided. Never assume or invent facts about the person.
- Every fix must be specific and actionable ("Add a metric to the Dture bullet, e.g. user count"),
  never generic advice ("improve your bullets").
- Reference actual project/experience names from the data in your fixes where possible.
- Respond with ONLY a JSON object, no markdown fences, no preamble.

RUBRIC — score each category 0-100 and give an overall weighted score:
1. "Profile & Summary"  — headline specificity, summary quality (concrete > buzzwords), contact/links present
2. "Projects"           — count (3-6 ideal), taglines, live/repo links present, tech listed, at least one featured
3. "Impact & Metrics"   — do bullets show outcomes/numbers, or only "built X"? This is where most portfolios fail.
4. "Experience"         — clear titles/orgs, dated, bullets action-led
5. "Completeness"       — skills grouped sensibly, education present, links (LinkedIn minimum; GitHub for developers, Behance/Dribbble for designers)

verdict per category: "good" (>=75), "needs_work" (40-74), "missing" (<40).
summary: 2-3 sentences, under 350 characters, honest, lead with the strongest thing then the #1 priority fix.
fixes: at most 4 per category, each ONE sentence under 180 characters.

OUTPUT SHAPE (exactly):
{"score":84,"summary":"...","categories":[{"name":"Projects","score":90,"verdict":"good","fixes":["..."]}]}`;

export function buildCriticPrompt(data: PortfolioData): { system: string; user: string } {
  // strip fields the model doesn't need (theme config, avatar)
  const slim = {
    profile: {
      fullName: data.profile.fullName,
      headline: data.profile.headline,
      summary: data.profile.summary,
      location: data.profile.location,
      email: !!data.profile.email,
      openToWork: data.profile.openToWork,
    },
    links: data.links.map((l) => l.kind),
    experiences: data.experiences,
    projects: data.projects.map(({ imageUrl, ...p }) => ({ ...p, hasImage: !!imageUrl })),
    skills: data.skills,
    educations: data.educations,
  };
  return { system: SYSTEM, user: JSON.stringify(slim) };
}

export function parseCriticResponse(raw: string): CriticResultT | null {
  const parsed = CriticResult.safeParse(extractJson(raw));
  return parsed.success ? parsed.data : null;
}