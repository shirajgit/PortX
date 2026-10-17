import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Minimal } from "@/components/templates/minimal/Minimal";
import { Cli } from "@/components/templates/cli/Cli";
import { Glass } from "@/components/templates/glass/Glass";
import { Editorial } from "@/components/templates/editorial/Editorial";
import { Noir } from "@/components/templates/noir/Noir";
import { Bento } from "@/components/templates/bento/Bento";
import { Executive } from "@/components/templates/executive/Executive";
import { Aurora } from "@/components/templates/aurora/Aurora";
import { DEMO_DATA, DEMO_USERNAME } from "@/lib/demo-data";

/* Full-screen template preview — demo data, no dashboard chrome. */

const TEMPLATES: Record<string, typeof Minimal> = {
  minimal: Minimal,
  cli: Cli,
  glass: Glass,
  editorial: Editorial,
  noir: Noir,
  bento: Bento,
  executive: Executive,
  aurora: Aurora,
};

type Props = {
  params: Promise<{ template: string }>;
  searchParams: Promise<{ thumb?: string }>;
};

export default async function PreviewPage({ params, searchParams }: Props) {
  const { template } = await params;
  const Template = TEMPLATES[template];
  if (!Template) notFound();

  // ?thumb=1: a live thumbnail (dashboard picker, landing page phone) — just the template,
  // no banner. Demo data only, so it's open to signed-out visitors too.
  if ((await searchParams).thumb)
    return (
      <>
        {/* Thumbnails are scaled-down pictures of the page — a scrollbar inside one looks broken. */}
        <style>{`html,body{scrollbar-width:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none}`}</style>
        <Template data={DEMO_DATA} username={DEMO_USERNAME} />
      </>
    );

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-3 border-b border-[#3A2E10] bg-[#1F1A08] px-4 py-2 font-mono text-xs text-[#FFB454]">
        <span>PREVIEW — {template} template · demo data · your content appears once you apply</span>
        <Link href="/dashboard/template" className="inline-flex items-center gap-1 rounded border border-[#FFB454]/40 px-2 py-0.5 hover:bg-[#FFB454]/10">
          <ArrowLeft className="h-3.5 w-3.5" /> back to picker
        </Link>
      </div>
      <Template data={DEMO_DATA} username={DEMO_USERNAME} />
    </>
  );
}