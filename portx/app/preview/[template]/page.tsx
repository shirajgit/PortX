import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Minimal } from "@/components/templates/minimal/Minimal";
import { Cli } from "@/components/templates/cli/Cli";
import { Glass } from "@/components/templates/glass/Glass";
import { Noir } from "@/components/templates/noir/Noir";
import { Executive } from "@/components/templates/executive/Executive";
import { Aurora } from "@/components/templates/aurora/Aurora";
import { DEMO_DATA, DEMO_USERNAME } from "@/lib/demo-data";

/* Full-screen template preview — demo data, no dashboard chrome. */

const TEMPLATES: Record<string, typeof Minimal> = {
  minimal: Minimal,
  cli: Cli,
  glass: Glass,
  noir: Noir,
  executive: Executive,
  aurora: Aurora,
};

type Props = { params: Promise<{ template: string }> };

export default async function PreviewPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { template } = await params;
  const Template = TEMPLATES[template];
  if (!Template) notFound();

  return (
    <>
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-3 border-b border-[#3A2E10] bg-[#1F1A08] px-4 py-2 font-mono text-xs text-[#FFB454]">
        <span>PREVIEW — {template} template · demo data · your content appears once you apply</span>
        <a href="/dashboard/template" className="rounded border border-[#FFB454]/40 px-2 py-0.5 hover:bg-[#FFB454]/10">
          ← back to picker
        </a>
      </div>
      <Template data={DEMO_DATA} username={DEMO_USERNAME} />
    </>
  );
}