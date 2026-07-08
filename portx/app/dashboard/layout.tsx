import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/experience", label: "Experience" },
  { href: "/dashboard/skills", label: "Skills" },
  { href: "/dashboard/education", label: "Education" },
  { href: "/dashboard/links", label: "Links" },
  { href: "/dashboard/template", label: "Template & Publish" },
  { href: "/dashboard/resume", label: "Resume PDF" },
  { href: "/dashboard/readme", label: "GitHub README" },
  { href: "/dashboard/review", label: "AI Review" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await db.profile.findUnique({ where: { clerkId: userId } });

  return (
    <div className="flex min-h-screen bg-[#0A0F1E] text-[#E8EDF7]">
      <aside className="hidden w-60 flex-col border-r border-[#1E2C52] p-5 sm:flex">
        <Link href="/" className="mb-8 text-xl font-bold">
          port<span className="text-[#4DA6FF]">X</span>
        </Link>
        <nav className="flex flex-col gap-1 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className="rounded-lg px-3 py-2 text-[#8B98B8] hover:bg-[#111A36] hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 pt-6">
          <UserButton />
          {profile && (
            <a href={`/${profile.username}`} target="_blank"
               className="font-mono text-xs text-[#8FC4FF] hover:text-white">
              /{profile.username} ↗
            </a>
          )}
        </div>
      </aside>
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
