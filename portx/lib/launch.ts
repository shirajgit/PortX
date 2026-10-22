import { db } from "@/lib/db";
import { LAUNCH_HOLD_MS, LAUNCH_OFFER_LIMIT } from "@/lib/billing";

/** Launch-offer slots still open. Paid passes count, and so do other people's checkouts
    opened in the last LAUNCH_HOLD_MS (so two buyers can't both take the last slot). */
export async function launchSlotsLeft(profileId?: string): Promise<number> {
  const claimed = await db.paymentRequest.count({
    where: {
      plan: "launch",
      OR: [
        // "pending" rows are legacy manual-UPI claims that were never verified as paid
        { status: "approved" },
        {
          status: "created",
          ...(profileId ? { profileId: { not: profileId } } : {}),
          createdAt: { gt: new Date(Date.now() - LAUNCH_HOLD_MS) },
        },
      ],
    },
  });
  return Math.max(0, LAUNCH_OFFER_LIMIT - claimed);
}

/** The launch offer is once per user. */
export async function launchUsedBy(profileId: string): Promise<boolean> {
  const paid = await db.paymentRequest.findFirst({
    where: { profileId, plan: "launch", status: "approved" },
    select: { id: true },
  });
  return !!paid;
}
