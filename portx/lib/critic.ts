import { z } from "zod";
import type { PortfolioData } from "@/components/templates/types";

/* ── AI Portfolio Critic ────────────────────────────────────────────────
   Sends the user's PortfolioData through a structured rubric and returns
   a readiness score with specific, actionable fixes. Strictly grounded:
   the model judges ONLY the provided data.                            */

export const CriticResult = z.object({
  score: z.number().min(0).max(100),
  summary: z.string().max(400),
  categories: z.array(
    z.object({
      name: z.string().max(40),
      score: z.number().min(0).max(100),
      verdict: z.enum(["good", "needs_work", "missing"]),
      fixes: z.array(z.string().max(200)).max(4),
    })
  ).min(3).max(8),
});
export type CriticResultT = z.infer<typeof CriticResult>;

const SYSTEM = `You are a strict but constructive reviewer of developer portfolios,
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
5. "Completeness"       — skills grouped sensibly, education present, links (GitHub+LinkedIn minimum)

verdict per category: "good" (>=75), "needs_work" (40-74), "missing" (<40).
summary: 2-3 sentences, honest, lead with the strongest thing then the #1 priority fix.

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
  const clean = raw.replace(/```json|```/g, "").trim();
  try {
    const parsed = CriticResult.safeParse(JSON.parse(clean));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}