import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { isValidUsername } from "@/lib/reserved-usernames";
import { isPro, PRO_TEMPLATES } from "@/lib/billing";

export async function GET() {
  try {
    const profile = await requireProfile();
    return Response.json(profile);
  } catch (e) {
    return handleAuthError(e);
  }
}

const CreateInput = z.object({
  username: z.string().min(3).max(30),
  fullName: z.string().min(1).max(80),
});

/** Onboarding: create the profile row + claim a username. */
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  const body = CreateInput.safeParse(await req.json());
  if (!body.success)
    return Response.json({ error: body.error.flatten() }, { status: 400 });

  const username = body.data.username.toLowerCase().trim();
  if (!isValidUsername(username))
    return Response.json({ error: "invalid_username" }, { status: 400 });

  const existing = await db.profile.findUnique({ where: { clerkId: userId } });
  if (existing) return Response.json(existing);

  const user = await currentUser();
  try {
    const profile = await db.profile.create({
      data: {
        clerkId: userId,
        username,
        fullName: body.data.fullName,
        onboardingStep: 1,
        email: user?.primaryEmailAddress?.emailAddress ?? null,
        avatarUrl: user?.imageUrl ?? null,
      },
    });
    return Response.json(profile, { status: 201 });
  } catch {
    return Response.json({ error: "username_taken" }, { status: 409 });
  }
}

const PatchInput = z.object({
  fullName: z.string().min(1).max(80).optional(),
  headline: z.string().max(120).optional(),
  summary: z.string().max(1500).optional(),
  location: z.string().max(80).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  openToWork: z.boolean().optional(),
  template: z.enum(["minimal", "cli", "glass", "executive", "noir", "aurora"]).optional(),
  isPublished: z.boolean().optional(),
  onboardingStep: z.number().int().min(1).max(8).optional(),
});

export async function PATCH(req: Request) {
  try {
    const profile = await requireProfile();
    const body = PatchInput.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    if (body.data.template && PRO_TEMPLATES.has(body.data.template) && !isPro(profile))
      return Response.json({ error: "pro_required" }, { status: 403 });
    const updated = await db.profile.update({
      where: { id: profile.id },
      data: body.data,
    });
    return Response.json(updated);
  } catch (e) {
    return handleAuthError(e);
  }
}
