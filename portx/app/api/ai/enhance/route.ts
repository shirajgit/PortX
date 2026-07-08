import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { isPro, FREE_AI_LIMITS } from "@/lib/billing";

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
    if (!process.env.OPENROUTER_API_KEY)
      return Response.json({ error: "ai_not_configured" }, { status: 501 });

    // free-tier monthly limit; Pro is unlimited
    if (!isPro(profile)) {
      const used = await db.pageView.count({
        where: {
          profileId: profile.id,
          kind: "ai_enhance",
          createdAt: { gte: new Date(Date.now() - THIRTY_DAYS) },
        },
      });
      if (used >= FREE_AI_LIMITS.enhance)
        return Response.json(
          { error: "free_limit_reached", limit: FREE_AI_LIMITS.enhance },
          { status: 429 }
        );
    }

    const body = Input.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://Portxz.in",
        "X-Title": "Portxz",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        max_tokens: 300,
        messages: [
          { role: "system", content: `${SYSTEM}\n${MODES[body.data.mode]}` },
          { role: "user", content: body.data.text },
        ],
      }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("OpenRouter error:", res.status, errBody);
      return Response.json(
        { error: `openrouter_${res.status}`, detail: errBody.slice(0, 300) },
        { status: 502 }
      );
    }
    const data = await res.json();
    const suggestion: string = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!suggestion)
      return Response.json({ error: "ai_empty_response" }, { status: 502 });

    await db.pageView.create({
      data: { profileId: profile.id, kind: "ai_enhance", ref: body.data.mode },
    });
    return Response.json({ suggestion });
  } catch (e) {
    return handleAuthError(e);
  }
}
