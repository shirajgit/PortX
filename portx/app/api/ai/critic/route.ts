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

    // A review is worth careful reasoning. Same profile → same review from cache, at no cost.
    const ai = await chat({
      tier: "smart",
      thinking: "high",
      json: true,
      cache: true,
      validate: (s) => parseCriticResponse(s) !== null,
      maxTokens: 1500,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    if (!ai.ok) return Response.json({ error: ai.error }, { status: ai.status });

    const parsed = parseCriticResponse(ai.content);
    if (!parsed) return Response.json({ error: "ai_bad_response" }, { status: 502 });

    // Cached answers don't use up the monthly allowance.
    if (!ai.cached)
      await db.pageView.create({
        data: { profileId: profile.id, kind: "ai_critic", ref: String(parsed.score) },
      });
    return Response.json({ ...parsed, cached: ai.cached });
  } catch (e) {
    return handleAuthError(e);
  }
}
