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
  const isAdmin = userId === process.env.ADMIN_CLERK_ID;

  return (
    <div className="flex min-h-screen bg-[#0A0F1E] text-[#E8EDF7]">
      <DashboardNav username={profile?.username ?? null} isAdmin={isAdmin} />
      <main className="flex-1 p-6 pt-20 sm:p-10 sm:pt-10">{children}</main>
    </div>
  );
}
