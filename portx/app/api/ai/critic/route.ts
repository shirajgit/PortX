import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { getOwnPortfolioData } from "@/lib/data";
import { buildCriticPrompt, parseCriticResponse } from "@/lib/critic";
import { isPro } from "@/lib/billing";

export const maxDuration = 30;

export async function POST() {
  try {
    const profile = await requireProfile();
    if (!process.env.OPENROUTER_API_KEY)
      return Response.json({ error: "ai_not_configured" }, { status: 501 });

    if (!isPro(profile))
      return Response.json(
        { error: "pro_required", upgrade: "/dashboard/billing" },
        { status: 403 }
      );

    const result = await getOwnPortfolioData(profile.id);
    if (!result) return Response.json({ error: "no_profile" }, { status: 404 });

    const { system, user } = buildCriticPrompt(result.data);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://Portzx.in",
        "X-Title": "Portzx",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        max_tokens: 1200,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
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
    const raw: string = data.choices?.[0]?.message?.content ?? "";
    const parsed = parseCriticResponse(raw);
    if (!parsed) return Response.json({ error: "ai_bad_response" }, { status: 502 });

    await db.pageView.create({
      data: { profileId: profile.id, kind: "ai_critic", ref: String(parsed.score) },
    });
    return Response.json(parsed);
  } catch (e) {
    return handleAuthError(e);
  }
}
