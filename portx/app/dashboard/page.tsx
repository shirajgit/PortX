import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

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

  const [views, downloads] = await Promise.all([
    db.pageView.count({ where: { profileId: profile.id, kind: "view" } }),
    db.pageView.count({ where: { profileId: profile.id, kind: "pdf_download" } }),
  ]);

  const checklist = [
    { done: !!profile.headline && !!profile.summary, label: "Fill your profile", href: "/dashboard/profile" },
    { done: profile._count.links > 0, label: "Add your links (GitHub, LinkedIn)", href: "/dashboard/links" },
    { done: profile._count.projects > 0, label: "Add at least one project", href: "/dashboard/projects" },
    { done: profile._count.experiences > 0, label: "Add experience", href: "/dashboard/experience" },
    { done: profile._count.skills > 0, label: "Add skills", href: "/dashboard/skills" },
    { done: profile._count.educations > 0, label: "Add education", href: "/dashboard/education" },
    { done: profile.isPublished, label: "Publish your portfolio", href: "/dashboard/template" },
    { done: profile.isPublished, label: "Export your GitHub README", href: "/dashboard/readme" },
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Welcome, {profile.fullName.split(" ")[0]} 👋</h1>
      <p className="mt-1 text-[#8B98B8]">
        Your page: <a className="font-mono text-[#8FC4FF]" href={`/${profile.username}`} target="_blank">portx.in/{profile.username}</a>
        {!profile.isPublished && <span className="ml-2 font-mono text-xs text-[#FFB454]">(unpublished)</span>}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Stat label="Profile views" value={views} />
        <Stat label="Resume downloads" value={downloads} />
      </div>

      <h2 className="mb-3 mt-10 font-mono text-sm uppercase tracking-widest text-[#4DA6FF]">Launch checklist</h2>
      <ul className="space-y-2">
        {checklist.map((c) => (
          <li key={c.label}>
            <Link href={c.href}
              className="flex items-center gap-3 rounded-lg border border-[#1E2C52] bg-[#111A36] px-4 py-3 hover:border-[#4DA6FF]">
              <span className={c.done ? "text-[#39D98A]" : "text-[#8B98B8]"}>{c.done ? "✓" : "○"}</span>
              <span className={c.done ? "text-[#8B98B8] line-through" : ""}>{c.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#1E2C52] bg-[#111A36] p-5">
      <p className="text-3xl font-bold text-[#4DA6FF]">{value}</p>
      <p className="font-mono text-xs uppercase tracking-wider text-[#8B98B8]">{label}</p>
    </div>
  );
}