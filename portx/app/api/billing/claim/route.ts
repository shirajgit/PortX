import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { launchSlotsLeft } from "@/lib/launch";

export async function GET() {
  try {
    const profile = await requireProfile();
    const requests = await db.paymentRequest.findMany({
      // "created" = Razorpay checkout opened but never paid
      where: { profileId: profile.id, status: { not: "created" } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return Response.json({
      plan: profile.plan,
      planExpiresAt: profile.planExpiresAt,
      requests,
      launchLeft: await launchSlotsLeft(profile.id),
    });
  } catch (e) {
    return handleAuthError(e);
  }
}
