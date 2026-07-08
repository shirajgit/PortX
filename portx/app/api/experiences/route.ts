import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { isPro, FREE_LIMITS } from "@/lib/billing";

const ExpInput = z.object({
  title: z.string().min(1).max(80),
  organization: z.string().min(1).max(100),
  location: z.string().max(80).optional().default(""),
  startDate: z.string().optional().nullable(), // "2025-11-01"
  endDate: z.string().optional().nullable(),
  bullets: z.array(z.string().max(300)).max(8).default([]),
});

export async function GET() {
  try {
    const profile = await requireProfile();
    const rows = await db.experience.findMany({
      where: { profileId: profile.id },
      orderBy: { sort: "asc" },
    });
    return Response.json(rows);
  } catch (e) {
    return handleAuthError(e);
  }
}

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    if (!isPro(profile)) {
      const count = await db.experience.count({ where: { profileId: profile.id } });
      if (count >= FREE_LIMITS.experiences)
        return Response.json(
          { error: "free_limit_reached", limit: FREE_LIMITS.experiences, upgrade: "/dashboard/billing" },
          { status: 403 }
        );
    }
    const body = ExpInput.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    const { startDate, endDate, ...rest } = body.data;
    const row = await db.experience.create({
      data: {
        profileId: profile.id,
        ...rest,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    return Response.json(row, { status: 201 });
  } catch (e) {
    return handleAuthError(e);
  }
}
