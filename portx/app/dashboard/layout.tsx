import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { DashboardNav } from "@/components/DashboardNav";

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
    <div className="relative isolate flex min-h-screen bg-[#0A0F1E] text-[#E8EDF7]">
      {/* ambient background glow — subtle depth, degrades gracefully in light mode */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-40 h-96 w-96 rounded-full bg-[#4DA6FF]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-[#39D98A]/[0.06] blur-[130px]" />
      </div>
      <DashboardNav username={profile?.username ?? null} isAdmin={isAdmin} />
      <main className="flex-1 p-6 pt-20 sm:p-10 sm:pt-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
