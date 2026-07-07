import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getOwnPortfolioData } from "@/lib/data";
import { Minimal } from "@/components/templates/minimal/Minimal";
import { Cli } from "@/components/templates/cli/Cli";
import { Glass } from "@/components/templates/glass/Glass";

/* Owner-only template preview — renders YOUR data in any template,
   even while unpublished. Nothing here touches the live page. */

const TEMPLATES: Record<string, typeof Minimal> = {
  minimal: Minimal,
  cli: Cli,
  glass: Glass,
};

type Props = { params: Promise<{ template: string }> };

export default async function PreviewPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await db.profile.findUnique({ where: { clerkId: userId } });
  if (!profile) redirect("/dashboard/onboarding");

  const { template } = await params;
  const Template = TEMPLATES[template];
  if (!Template) notFound();

  const result = await getOwnPortfolioData(profile.id);
  if (!result) notFound();

  return (
    <>
      {/* preview banner */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-3 border-b border-[#3A2E10] bg-[#1F1A08] px-4 py-2 font-mono text-xs text-[#FFB454]">
        <span>PREVIEW — {template} template · not your live page</span>
        <a href="/dashboard/template" className="rounded border border-[#FFB454]/40 px-2 py-0.5 hover:bg-[#FFB454]/10">
          ← back to picker
        </a>
      </div>
      <Template data={result.data} username={result.username} />
    </>
  );
}
