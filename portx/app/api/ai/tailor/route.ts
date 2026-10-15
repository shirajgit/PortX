import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { getOwnPortfolioData } from "@/lib/data";
import { isPro, PRO_AI_LIMITS } from "@/lib/billing";
import { buildTailorPrompt, parseTailorResponse, rewritableLines } from "@/lib/tailor";

export const maxDuration = 45;

const Input = z.object({ job: z.string().trim().min(80).max(8000) });

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

/** Tailor the user's resume to a pasted job description. Returns suggestions plus the resume data they apply to. */
export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    if (!process.env.OPENROUTER_API_KEY)
      return Response.json({ error: "ai_not_configured" }, { status: 501 });
    if (!isPro(profile))
      return Response.json({ error: "pro_required", upgrade: "/dashboard/billing" }, { status: 403 });

    const body = Input.safeParse(await req.json().catch(() => null));
    if (!body.success) return Response.json({ error: "job_too_short" }, { status: 400 });

    const used = await db.pageView.count({
      where: { profileId: profile.id, kind: "ai_tailor", createdAt: { gte: new Date(Date.now() - THIRTY_DAYS) } },
    });
    if (used >= PRO_AI_LIMITS.tailor)
      return Response.json({ error: "pro_limit_reached", limit: PRO_AI_LIMITS.tailor }, { status: 429 });

    const own = await getOwnPortfolioData(profile.id);
    if (!own) return Response.json({ error: "no_profile" }, { status: 404 });
    const { data } = own;
    if (!data.experiences.length && !data.projects.length && !data.skills.length)
      return Response.json({ error: "profile_too_empty" }, { status: 422 });

    const { system, user } = buildTailorPrompt(data, body.data.job);
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://portxz.xyz",
        "X-Title": "Portxz",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        max_tokens: 2000,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      console.error("OpenRouter error:", res.status, await res.text().catch(() => ""));
      return Response.json({ error: `openrouter_${res.status}` }, { status: 502 });
    }

    const raw: string = (await res.json()).choices?.[0]?.message?.content ?? "";
    const result = parseTailorResponse(raw, data);
    if (!result) return Response.json({ error: "ai_bad_response" }, { status: 502 });

    await db.pageView.create({ data: { profileId: profile.id, kind: "ai_tailor", ref: String(result.score) } });
    return Response.json({
      result,
      data,
      lines: rewritableLines(data).size,
      remaining: PRO_AI_LIMITS.tailor - used - 1,
    });
  } catch (e) {
    return handleAuthError(e);
  }
}
