import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId || userId !== process.env.ADMIN_CLERK_ID) return null;
  return userId;
}

export async function GET() {
  if (!(await requireAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });

  const requests = await db.paymentRequest.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 50,
    include: { profile: { select: { username: true, fullName: true, plan: true, planExpiresAt: true } } },
  });
  return Response.json(requests);
}
