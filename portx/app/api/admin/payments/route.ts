import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isAdminId } from "@/lib/auth";

async function requireAdmin() {
  const { userId } = await auth();
  if (!isAdminId(userId)) return null;
  return userId;
}

export async function GET() {
  if (!(await requireAdmin()))
    return Response.json({ error: "forbidden" }, { status: 403 });

  const requests = await db.paymentRequest.findMany({
    where: { status: { not: "created" } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 50,
    include: { profile: { select: { username: true, fullName: true, plan: true, planExpiresAt: true } } },
  });
  return Response.json(requests);
}
