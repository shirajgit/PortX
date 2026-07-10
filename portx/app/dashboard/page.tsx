import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isPro } from "@/lib/billing";
import { ViewsChart } from "@/components/views-chart";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    { done: !!profile.headline && !!profile.summary, label: "Fill your profile", href: "/dashboard/profile" },
    { done: profile._count.links > 0, label: "Add your links (GitHub, LinkedIn)", href: "/dashboard/links" },
    { done: profile._count.projects > 0, label: "Add at least one project", href: "/dashboard/projects" },
    { done: profile._count.experiences > 0, label: "Add experience", href: "/dashboard/experience" },
    { done: profile._count.skills > 0, label: "Add skills", href: "/dashboard/skills" },
    { done: profile._count.educations > 0, label: "Add education", href: "/dashboard/education" },
    { done: profile.isPublished, label: "Publish your portfolio", href: "/dashboard/template" },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);

  return (
    <div className="w-full max-w-none space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-[#1E2C52]/50 pb-6 light:border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white light:text-slate-900">
              Welcome, {profile.fullName.split(" ")[0]} 👋
            </h1>
            {pro ? (
              <span className="rounded-full border border-[#1E3A2E] bg-[#0E2018] px-3 py-1 font-mono text-[11px] text-[#39D98A]">
                ● PRO until {profile.planExpiresAt!.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            ) : (
              <Link href="/dashboard/billing"
                className="rounded-full border border-[#1E2C52] bg-[#0F1730] px-3 py-1 font-mono text-[11px] text-[#8B98B8] hover:border-[#4DA6FF] hover:text-[#8FC4FF] light:bg-slate-100 light:border-slate-200 light:text-slate-600">
                FREE · upgrade ↗
              </Link>
            )}
          </div>
          <p className="mt-1 text-[#8B98B8] light:text-slate-500 text-sm">
            Your page:{" "}
            <a className="font-mono text-[#8FC4FF] hover:text-white light:text-blue-600 light:hover:text-blue-700" href={`/${profile.username}`} target="_blank">
              Portxz.vercel.app/{profile.username} ↗
            </a>
            {!profile.isPublished && <span className="ml-2 font-mono text-xs text-[#FFB454]">(unpublished)</span>}
          </p>
        </div>
        
        <ThemeToggle />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Total views" value={views} accent="#4DA6FF" />
        <Stat label="Views this week" value={weekViews} accent="#39D98A" />
        <Stat label="Resume downloads" value={downloads} accent="#FFB454" />
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-[#1E2C52] bg-[#111A36] p-5 light:bg-white light:border-slate-200 shadow-sm">
        <p className="text-xs font-mono uppercase tracking-widest text-[#8B98B8] mb-4">Traffic Performance</p>
        <div className="h-[200px] w-full">
          <ViewsChart data={chartData} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Action href={`/${profile.username}`} label="View page" external />
        <Action href="/dashboard/review" label="✨ AI Review" />
        <Action href="/dashboard/readme" label="Copy README" />
        <Action href="/dashboard/resume" label="Resume PDF" />
      </div>

      {/* Checklist */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-sm uppercase tracking-widest text-[#4DA6FF]">Launch checklist</h2>
          <span className="font-mono text-xs text-[#8B98B8]">
            {doneCount}/{checklist.length} {pct === 100 && "🎉"}
          </span>
        </div>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#111A36] light:bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4DA6FF] to-[#39D98A] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {checklist.map((c) => (
            <li key={c.label}>
              <Link href={c.href}
                className="flex items-center gap-3 rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-3 transition hover:border-[#4DA6FF] light:bg-white light:border-slate-200 light:hover:border-blue-400">
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] ${
                  c.done
                    ? "border-[#39D98A] bg-[#39D98A]/15 text-[#39D98A]"
                    : "border-[#2A3E6E] text-[#8B98B8] light:border-slate-300"}`}>
                  {c.done ? "✓" : ""}
                </span>
                <span className={`text-sm ${c.done ? "text-[#5C6A87] line-through light:text-slate-400" : "text-white light:text-slate-700"}`}>
                  {c.label}
                </span>
                <span className="ml-auto text-[#5C6A87]">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {pct === 100 && (
        <div className="rounded-xl border border-[#1E3A2E] bg-[#0E2018] p-5 light:bg-emerald-50 light:border-emerald-200">
          <p className="font-semibold text-[#39D98A] light:text-emerald-700">You're fully launched 🚀</p>
          <p className="mt-1 text-sm text-[#8B98B8] light:text-slate-600">
            Share <span className="font-mono text-[#8FC4FF] light:text-blue-600">Portxz.vercel.app/{profile.username}</span> on
            LinkedIn and X — every view shows up in your stats above.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-[#1E2C52] bg-[#111A36] p-5 light:bg-white light:border-slate-200">
      <p className="text-3xl font-bold" style={{ color: accent }}>{value}</p>
      <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-[#8B98B8] light:text-slate-400">{label}</p>
    </div>
  );
}

function Action({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <Link href={href} target={external ? "_blank" : undefined}
      className="rounded-lg border border-[#1E2C52] bg-[#0F1730] px-4 py-2.5 text-center text-sm text-[#8FC4FF] transition hover:border-[#4DA6FF] hover:bg-[#111A36] light:bg-white light:border-slate-200 light:text-slate-700 light:hover:bg-slate-50">
      {label}{external && " ↗"}
    </Link>
  );
}