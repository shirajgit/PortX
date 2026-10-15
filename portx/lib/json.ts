/** Pull the JSON object out of an AI reply, tolerating code fences or stray text around it.
    Kept free of server imports so client code (lib/tailor) can use it too. */
export function extractJson(raw: string): unknown {
  const s = raw.replace(/```(?:json)?/gi, "").trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(s.slice(start, end + 1));
  } catch {
    return null;
  }
}
