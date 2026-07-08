import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isPro } from "@/lib/billing";

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
    <div className="max-w-2xl">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Welcome, {profile.fullName.split(" ")[0]} 👋</h1>
        {pro ? (
          <span className="rounded-full border border-[#1E3A2E] bg-[#0E2018] px-3 py-1 font-mono text-[11px] text-[#39D98A]">
            ● PRO until {profile.planExpiresAt!.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        ) : (
          <Link href="/dashboard/billing"
            className="rounded-full border border-[#1E2C52] bg-[#0F1730] px-3 py-1 font-mono text-[11px] text-[#8B98B8] hover:border-[#4DA6FF] hover:text-[#8FC4FF]">
            FREE · upgrade ↗
          </Link>
        )}
      </div>
      <p className="mt-1 text-[#8B98B8]">
        Your page:{" "}
        <a className="font-mono text-[#8FC4FF] hover:text-white" href={`/${profile.username}`} target="_blank">
          Portxz.in/{profile.username} ↗
        </a>
        {!profile.isPublished && <span className="ml-2 font-mono text-xs text-[#FFB454]">(unpublished)</span>}
      </p>

      {/* stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Total views" value={views} accent="#4DA6FF" />
        <Stat label="Views this week" value={weekViews} accent="#39D98A" />
        <Stat label="Resume downloads" value={downloads} accent="#FFB454" />
      </div>

      {/* quick actions */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Action href={`/${profile.username}`} label="View page" external />
        <Action href="/dashboard/review" label="✨ AI Review" />
        <Action href="/dashboard/readme" label="Copy README" />
        <Action href="/dashboard/resume" label="Resume PDF" />
      </div>

      {/* checklist with progress */}
      <div className="mb-3 mt-10 flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-widest text-[#4DA6FF]">Launch checklist</h2>
        <span className="font-mono text-xs text-[#8B98B8]">
          {doneCount}/{checklist.length} {pct === 100 && "🎉"}
        </span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#111A36]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#4DA6FF] to-[#39D98A] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-2">
        {checklist.map((c) => (
          <li key={c.label}>
            <Link href={c.href}
              className="flex items-center gap-3 rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-3 transition hover:border-[#4DA6FF]">
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] ${
                c.done
                  ? "border-[#39D98A] bg-[#39D98A]/15 text-[#39D98A]"
                  : "border-[#2A3E6E] text-[#8B98B8]"}`}>
                {c.done ? "✓" : ""}
              </span>
              <span className={c.done ? "text-[#8B98B8] line-through" : ""}>{c.label}</span>
              <span className="ml-auto text-[#5C6A87]">→</span>
            </Link>
          </li>
        ))}
      </ul>

      {pct === 100 && (
        <div className="mt-6 rounded-xl border border-[#1E3A2E] bg-[#0E2018] p-5">
          <p className="font-semibold text-[#39D98A]">You're fully launched 🚀</p>
          <p className="mt-1 text-sm text-[#8B98B8]">
            Share <span className="font-mono text-[#8FC4FF]">Portxz.in/{profile.username}</span> on
            LinkedIn and X — every view shows up in your stats above.
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-xl border border-[#1E2C52] bg-[#111A36] p-5">
      <p className="text-3xl font-bold" style={{ color: accent }}>{value}</p>
      <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-[#8B98B8]">{label}</p>
    </div>
  );
}

function Action({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <Link href={href} target={external ? "_blank" : undefined}
      className="rounded-lg border border-[#1E2C52] bg-[#0F1730] px-4 py-2.5 text-center text-sm text-[#8FC4FF] transition hover:border-[#4DA6FF] hover:bg-[#111A36]">
      {label}{external && " ↗"}
    </Link>
  );
}