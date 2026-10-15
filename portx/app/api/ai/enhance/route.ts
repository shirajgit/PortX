import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { isPro, FREE_AI_LIMITS, PRO_AI_LIMITS } from "@/lib/billing";
import { aiConfigured, chat } from "@/lib/ai";

/* Static per mode (no user data), so DeepSeek's prompt cache bills it at the cheap rate. */
const SYSTEM = `You are a senior resume editor. You rewrite one piece of portfolio/resume text
for a professional in any field (engineering, design, marketing, sales, finance, operations…).

RULES
- Keep every fact exactly as given: never add metrics, employers, tools, numbers or outcomes
  that aren't in the input. If the input has a number, keep it.
- Lead with a strong, specific action verb (Built, Led, Designed, Grew, Cut, Launched…).
  Avoid filler: "responsible for", "worked on", "helped with", "various", "etc.", "passionate".
- Prefer concrete nouns over buzzwords. Say what was done, for whom, and the result if given.
- Fix grammar, capitalisation and tense (past tense for past work).
- Match the person's field using the ROLE line, but don't mention the role itself.
- Output ONLY the rewritten text: no quotes, no preamble, no alternatives, no markdown.`;

const MODES = {
  bullet: `TASK: Rewrite as ONE resume bullet, max 25 words, no trailing full stop.
EXAMPLES
In: worked on the website and made it faster
Out: Rebuilt the company website's front end, cutting page load time noticeably
In: handled instagram for the brand, followers went from 2k to 10k
Out: Grew the brand's Instagram from 2K to 10K followers through a consistent content calendar
In: did sales calls with clients
Out: Ran discovery and follow-up calls with prospective clients to move deals through the pipeline`,
  summary: `TASK: Rewrite as a 2-3 sentence professional summary in first person without "I" at the start of every sentence.
Open with who they are and their strongest area, then what they've done, then what they're looking for (only if stated).
EXAMPLE
In: im a designer i like making apps look good, 3 years exp, want remote job
Out: Product designer with 3 years of experience turning complex app flows into clean, intuitive interfaces. Comfortable owning work from research to polished UI. Looking for a remote product design role.`,
  tagline: `TASK: Rewrite as a one-line project tagline, max 15 words, no full stop. Say what it is and who it's for.
EXAMPLES
In: an app i made for tracking expenses
Out: Expense tracker that sorts your spending into categories automatically
In: website redesign for a cafe
Out: A fresh brand and website for a neighbourhood café`,
} as const;

const Input = z.object({
  mode: z.enum(["bullet", "summary", "tagline"]),
  text: z.string().min(3).max(1000),
});

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    if (!aiConfigured())
      return Response.json({ error: "ai_not_configured" }, { status: 501 });

    // monthly allowance: small on free, fair-use cap on Pro
    const pro = isPro(profile);
    const limit = pro ? PRO_AI_LIMITS.enhance : FREE_AI_LIMITS.enhance;
    const used = await db.pageView.count({
      where: {
        profileId: profile.id,
        kind: "ai_enhance",
        createdAt: { gte: new Date(Date.now() - THIRTY_DAYS) },
      },
    });
    if (used >= limit)
      return Response.json(
        { error: pro ? "pro_limit_reached" : "free_limit_reached", limit },
        { status: 429 }
      );

    const body = Input.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });

    // A quick rewrite doesn't need reasoning — thinking off keeps it fast and cheap.
    const ai = await chat({
      maxTokens: 220,
      temperature: 0.5,
      thinking: false,
      messages: [
        { role: "system", content: `${SYSTEM}\n\n${MODES[body.data.mode]}` },
        { role: "user", content: `ROLE: ${profile.headline || "Professional"}\nIn: ${body.data.text.replace(/\s+/g, " ").trim()}\nOut:` },
      ],
    });
    if (!ai.ok) return Response.json({ error: ai.error }, { status: ai.status });
    // Models sometimes wrap the answer in quotes despite the instruction.
    const suggestion = ai.content.replace(/^(out:\s*)/i, "").replace(/^["“']+|["”']+$/g, "").trim();

    await db.pageView.create({
      data: { profileId: profile.id, kind: "ai_enhance", ref: body.data.mode },
    });
    return Response.json({ suggestion });
  } catch (e) {
    return handleAuthError(e);
  }
}
