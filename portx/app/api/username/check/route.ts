import { db } from "@/lib/db";
import { isValidUsername } from "@/lib/reserved-usernames";

export async function GET(req: Request) {
  const u = new URL(req.url).searchParams.get("u")?.toLowerCase().trim() ?? "";
  if (!isValidUsername(u))
    return Response.json({ available: false, reason: "invalid" });
  const exists = await db.profile.findUnique({ where: { username: u }, select: { id: true } });
  return Response.json({ available: !exists });
}
