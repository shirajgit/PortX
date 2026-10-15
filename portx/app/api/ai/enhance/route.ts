import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { isPro, FREE_AI_LIMITS, PRO_AI_LIMITS } from "@/lib/billing";
import { aiConfigured, chat } from "@/lib/ai";

const SYSTEM = `You improve resume/portfolio text for a software developer.
Rules: rewrite ONLY the provided text. Never invent metrics, employers,
technologies, or outcomes not present in the input. Keep it concise and
action-verb-led. Return plain text only, no preamble, no quotes.`;

const MODES = {
  bullet: "Rewrite as one strong resume bullet (max 25 words).",
  summary: "Rewrite as a 2-3 sentence professional summary.",
  tagline: "Rewrite as a one-line project tagline (max 15 words).",
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

    const ai = await chat({
      maxTokens: 300,
      messages: [
        { role: "system", content: `${SYSTEM}\n${MODES[body.data.mode]}` },
        { role: "user", content: body.data.text },
      ],
    });
    if (!ai.ok) return Response.json({ error: ai.error }, { status: ai.status });
    // Models sometimes wrap the answer in quotes despite the instruction.
    const suggestion = ai.content.replace(/^["“']+|["”']+$/g, "").trim();

    await db.pageView.create({
      data: { profileId: profile.id, kind: "ai_enhance", ref: body.data.mode },
    });
    return Response.json({ suggestion });
  } catch (e) {
    return handleAuthError(e);
  }
}
