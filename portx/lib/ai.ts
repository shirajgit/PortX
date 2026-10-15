import { createHash } from "crypto";
import { db } from "./db";

/* ── One place for AI calls ─────────────────────────────────────────────
   DeepSeek when DEEPSEEK_API_KEY is set, otherwise OpenRouter. Both speak
   the OpenAI chat-completions format, so routes don't care which one runs.

   Cost & quality levers:
   - thinking: DeepSeek reasons by default (high effort), which bills a lot
     of hidden tokens. Each call opts in explicitly; quick rewrites turn it off.
   - prompt caching: DeepSeek bills repeated prompt prefixes ~50x cheaper, so
     keep system prompts static and put stable content before variable content.
   - result cache: `cache: true` stores the answer by request hash for 30 days,
     so an identical request is answered for free.

   Env:
     DEEPSEEK_API_KEY       enables DeepSeek (preferred)
     DEEPSEEK_MODEL         default "deepseek-flash"
     DEEPSEEK_MODEL_SMART   default DEEPSEEK_MODEL, e.g. "deepseek-v4-pro" for reviews
     OPENROUTER_API_KEY     fallback provider                                 */

type Message = { role: "system" | "user" | "assistant"; content: string };

export type ChatOptions = {
  messages: Message[];
  /** Budget for the visible answer. Reasoning tokens are budgeted on top. */
  maxTokens: number;
  temperature?: number;
  /** Ask for a JSON object back. The prompt must mention "JSON" and show the shape. */
  json?: boolean;
  /** "smart" picks the stronger model for heavier reviews. */
  tier?: "fast" | "smart";
  /** Reasoning before answering: off, light, or thorough. */
  thinking?: false | "low" | "high";
  /** Reuse a stored answer for an identical request (30 days). */
  cache?: boolean;
  /** Reject unusable replies: they are retried once and never cached. */
  validate?: (content: string) => boolean;
};

export type ChatResult =
  | { ok: true; content: string; cached: boolean }
  | { ok: false; status: number; error: string };

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const THINKING_BUDGET = { low: 3000, high: 8000 } as const;

type Provider = {
  name: "deepseek" | "openrouter";
  url: string;
  key: string;
  model: (tier: "fast" | "smart") => string;
  headers?: Record<string, string>;
};

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

function requestBody(p: Provider, opts: ChatOptions) {
  const thinking = opts.thinking ?? false;
  const body: Record<string, unknown> = {
    model: p.model(opts.tier ?? "fast"),
    messages: opts.messages,
    max_tokens: opts.maxTokens + (thinking && p.name === "deepseek" ? THINKING_BUDGET[thinking] : 0),
  };
  if (p.name === "deepseek") {
    body.thinking = { type: thinking ? "enabled" : "disabled" };
    if (thinking) body.reasoning_effort = thinking;
  }
  // Thinking mode ignores temperature; JSON mode is only documented without thinking,
  // so with thinking on we rely on the prompt + extractJson() instead.
  if (!thinking || p.name !== "deepseek") {
    body.temperature = opts.temperature ?? 0.4;
    if (opts.json) body.response_format = { type: "json_object" };
  }
  return body;
}

export async function chat(opts: ChatOptions): Promise<ChatResult> {
  const p = provider();
  if (!p) return { ok: false, status: 501, error: "ai_not_configured" };

  const body = requestBody(p, opts);
  const payload = JSON.stringify(body);
  const key = opts.cache ? createHash("sha256").update(`${p.name}|${payload}`).digest("hex") : null;

  if (key) {
    const hit = await db.aiCache.findUnique({ where: { key } }).catch(() => null);
    if (hit && Date.now() - hit.createdAt.getTime() < CACHE_TTL_MS)
      return { ok: true, content: hit.value, cached: true };
  }

  // DeepSeek can occasionally return empty or malformed content — retry once.
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(p.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json", ...p.headers },
      body: payload,
    });
    if (!res.ok) {
      console.error(`${p.name} error:`, res.status, (await res.text().catch(() => "")).slice(0, 500));
      return { ok: false, status: 502, error: `${p.name}_${res.status}` };
    }
    const data = await res.json().catch(() => null);
    const content: string = data?.choices?.[0]?.message?.content?.trim() ?? "";
    if (process.env.NODE_ENV !== "production" && data?.usage) console.info(`[ai] ${body.model}`, data.usage);
    if (!content || (opts.validate && !opts.validate(content))) continue;

    if (key) {
      await db.aiCache
        .upsert({ where: { key }, create: { key, value: content }, update: { value: content, createdAt: new Date() } })
        .catch((e) => console.error("ai cache write failed", e));
      // Occasionally sweep expired entries so the table stays small.
      if (Math.random() < 0.02)
        db.aiCache.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - CACHE_TTL_MS) } } }).catch(() => {});
    }
    return { ok: true, content, cached: false };
  }
  return { ok: false, status: 502, error: "ai_bad_response" };
}
