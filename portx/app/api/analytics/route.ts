import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";

/* Analytics for the dashboard + mobile app.
   Reads page_views for the signed-in profile. kind: "view" | "pdf_download". */

export async function GET() {
  try {
    const profile = await requireProfile();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [views, downloads, viewsThisWeek, downloadsThisWeek, recent] =
      await Promise.all([
        db.pageView.count({ where: { profileId: profile.id, kind: "view" } }),
        db.pageView.count({ where: { profileId: profile.id, kind: "pdf_download" } }),
        db.pageView.count({
          where: { profileId: profile.id, kind: "view", createdAt: { gte: weekAgo } },
        }),
        db.pageView.count({
          where: { profileId: profile.id, kind: "pdf_download", createdAt: { gte: weekAgo } },
        }),
        db.pageView.findMany({
          where: { profileId: profile.id },
          orderBy: { createdAt: "desc" },
          take: 60,
          select: { kind: true, createdAt: true },
        }),
      ]);

    // last 7 days as a tiny daily series for the sparkline
    const days: { day: string; views: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      days.push({
        day: d.toLocaleDateString("en", { weekday: "short" }),
        views: recent.filter(
          (r) => r.kind === "view" && r.createdAt >= d && r.createdAt < next
        ).length,
      });
    }

    return Response.json({ views, downloads, viewsThisWeek, downloadsThisWeek, days });
  } catch (e) {
    return handleAuthError(e);
  }
}
