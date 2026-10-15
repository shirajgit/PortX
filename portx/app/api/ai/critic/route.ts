import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { getOwnPortfolioData } from "@/lib/data";
import { buildCriticPrompt, parseCriticResponse } from "@/lib/critic";
import { isPro, PRO_AI_LIMITS } from "@/lib/billing";
import { aiConfigured, chat } from "@/lib/ai";

export const maxDuration = 30;

export async function POST() {
  try {
    const profile = await requireProfile();
    if (!aiConfigured())
      return Response.json({ error: "ai_not_configured" }, { status: 501 });

    if (!isPro(profile))
      return Response.json(
        { error: "pro_required", upgrade: "/dashboard/billing" },
        { status: 403 }
      );

    const used = await db.pageView.count({
      where: {
        profileId: profile.id,
        kind: "ai_critic",
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });
    if (used >= PRO_AI_LIMITS.critic)
      return Response.json({ error: "pro_limit_reached", limit: PRO_AI_LIMITS.critic }, { status: 429 });

    const result = await getOwnPortfolioData(profile.id);
    if (!result) return Response.json({ error: "no_profile" }, { status: 404 });

    const { system, user } = buildCriticPrompt(result.data);

    const ai = await chat({
      tier: "smart",
      json: true,
      maxTokens: 1500,
      temperature: 0.3,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    if (!ai.ok) return Response.json({ error: ai.error }, { status: ai.status });

    const parsed = parseCriticResponse(ai.content);
    if (!parsed) return Response.json({ error: "ai_bad_response" }, { status: 502 });

    await db.pageView.create({
      data: { profileId: profile.id, kind: "ai_critic", ref: String(parsed.score) },
    });
    return Response.json(parsed);
  } catch (e) {
    return handleAuthError(e);
  }
}
