import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isPro } from "@/lib/billing";
import { DashboardNav } from "@/components/DashboardNav";
import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/site";

export const metadata: Metadata = { title: "Dashboard", robots: NO_INDEX };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await db.profile.findUnique({ where: { clerkId: userId } });
  if (!profile || profile.onboardingStep < 8) redirect("/setup");
  const isAdmin = userId === process.env.ADMIN_CLERK_ID;

  return (
    <div className="lp relative isolate flex min-h-screen">
      {/* ambient backdrop — same grid + glow as the landing page */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="lp-grid-bg absolute inset-x-0 top-0 h-[520px]" />
        <div className="absolute left-1/2 top-[-260px] h-[520px] w-[900px] -translate-x-1/3 rounded-full bg-[radial-gradient(closest-side,var(--lp-glow),transparent)]" />
      </div>
      <DashboardNav
        username={profile.username ?? null}
        fullName={profile.fullName}
        isAdmin={isAdmin}
        pro={isPro(profile)}
        published={profile.isPublished}
      />
      <main className="min-w-0 flex-1 px-5 pb-16 pt-24 sm:px-8 lg:px-12 lg:pt-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
