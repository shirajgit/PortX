/* ── One place for AI calls ─────────────────────────────────────────────
   DeepSeek when DEEPSEEK_API_KEY is set, otherwise OpenRouter. Both speak
   the OpenAI chat-completions format, so routes don't care which one runs.

   Env:
     DEEPSEEK_API_KEY            enables DeepSeek (preferred)
     DEEPSEEK_MODEL              default "deepseek-flash" (fast, cheap)
     DEEPSEEK_MODEL_SMART        default DEEPSEEK_MODEL — e.g. "deepseek-v4-pro" for reviews
     OPENROUTER_API_KEY          fallback provider                          */

type Message = { role: "system" | "user" | "assistant"; content: string };

export type ChatOptions = {
  messages: Message[];
  maxTokens: number;
  temperature?: number;
  /** Ask for a JSON object back. The prompt must mention "JSON" and show the shape. */
  json?: boolean;
  /** "smart" for heavier reasoning (portfolio review); "fast" for everything else. */
  tier?: "fast" | "smart";
};

export type ChatResult = { ok: true; content: string } | { ok: false; status: number; error: string };

type Provider = { name: string; url: string; key: string; model: (tier: "fast" | "smart") => string; headers?: Record<string, string> };

function provider(): Provider | null {
  if (process.env.DEEPSEEK_API_KEY) {
    const fast = process.env.DEEPSEEK_MODEL || "deepseek-flash";
    return {
      name: "deepseek",
      url: "https://api.deepseek.com/chat/completions",
      key: process.env.DEEPSEEK_API_KEY,
      model: (tier) => (tier === "smart" ? process.env.DEEPSEEK_MODEL_SMART || fast : fast),
    };
  }
  if (process.env.OPENROUTER_API_KEY) {
    return {
      name: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      key: process.env.OPENROUTER_API_KEY,
      model: (tier) => (tier === "smart" ? "openai/gpt-4o" : "openai/gpt-4o-mini"),
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://portxz.xyz",
        "X-Title": "Portxz",
      },
    };
  }
  return null;
}

export const aiConfigured = () => provider() !== null;

export async function chat(opts: ChatOptions): Promise<ChatResult> {
  const p = provider();
  if (!p) return { ok: false, status: 501, error: "ai_not_configured" };

  const body = JSON.stringify({
    model: p.model(opts.tier ?? "fast"),
    max_tokens: opts.maxTokens,
    temperature: opts.temperature ?? 0.4,
    messages: opts.messages,
    ...(opts.json ? { response_format: { type: "json_object" } } : {}),
  });

  // DeepSeek's JSON mode can occasionally return empty content — retry once.
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(p.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json", ...p.headers },
      body,
    });
    if (!res.ok) {
      console.error(`${p.name} error:`, res.status, (await res.text().catch(() => "")).slice(0, 500));
      return { ok: false, status: 502, error: `${p.name}_${res.status}` };
    }
    const data = await res.json().catch(() => null);
    const content: string = data?.choices?.[0]?.message?.content?.trim() ?? "";
    if (content) return { ok: true, content };
  }
  return { ok: false, status: 502, error: "ai_empty_response" };
}
