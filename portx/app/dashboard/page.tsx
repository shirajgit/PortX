import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isPro } from "@/lib/billing";
import { HomeView } from "@/components/HomeView";

export default async function Overview() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await db.profile.findUnique({
    where: { clerkId: userId },
    include: {
      _count: {
        select: { projects: true, experiences: true, skills: true, links: true, educations: true },
      },
    },
  });
  if (!profile) redirect("/dashboard/onboarding");

  // Fetch past 7 days of views for the chart data
  const chartDataPromises = Array.from({ length: 7 }).map(async (_, index) => {
    const d = new Date();
    d.setDate(d.getDate() - index);
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);

    const count = await db.pageView.count({
      where: {
        profileId: profile.id,
        kind: "view",
        createdAt: { gte: d, lt: nextDay },
      },
    });

    return {
      date: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
      views: count,
    };
  });

  const rawChartData = await Promise.all(chartDataPromises);
  const chartData = rawChartData.reverse();

  const [views, downloads, weekViews] = await Promise.all([
    db.pageView.count({ where: { profileId: profile.id, kind: "view" } }),
    db.pageView.count({ where: { profileId: profile.id, kind: "pdf_download" } }),
    db.pageView.count({
      where: {
        profileId: profile.id,
        kind: "view",
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  const pro = isPro(profile);

  const checklist = [
    { done: !!profile.headline && !!profile.summary, label: "Write a short intro about you", why: "A headline and a few sentences so visitors know who you are.", href: "/dashboard/profile", cta: "Write my intro" },
    { done: profile._count.projects > 0, label: "Add a project", why: "Show something you've made or worked on — it's what people look at first.", href: "/dashboard/projects", cta: "Add a project" },
    { done: profile._count.experiences > 0, label: "Add your work experience", why: "Jobs, internships or freelance work — anything counts.", href: "/dashboard/experience", cta: "Add experience" },
    { done: profile._count.educations > 0, label: "Add your education", why: "Where you studied and what you studied.", href: "/dashboard/education", cta: "Add education" },
    { done: profile._count.skills > 0, label: "List your skills", why: "A few skills grouped together, like Design or Tools.", href: "/dashboard/skills", cta: "Add skills" },
    { done: profile._count.links > 0, label: "Add your social links", why: "LinkedIn and anywhere else people can find you.", href: "/dashboard/links", cta: "Add links" },
    { done: profile.isPublished, label: "Publish your page", why: "Pick a design and go live — then share your link anywhere.", href: "/dashboard/template", cta: "Choose a design" },
  ];
  // greeting + date in India time (servers usually run on UTC)
  const now = new Date();
  const hour = Number(now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false }));
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateLabel = now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long" });

  return (
    <HomeView
      d={{
        greeting,
        dateLabel,
        firstName: profile.fullName.split(" ")[0],
        username: profile.username,
        published: profile.isPublished,
        pro,
        proUntil: pro && profile.planExpiresAt
          ? profile.planExpiresAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
          : null,
        stats: { views, weekViews, downloads },
        chartData,
        checklist,
      }}
    />
  );
}
