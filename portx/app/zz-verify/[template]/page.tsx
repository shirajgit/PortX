import { notFound } from "next/navigation";
import { Minimal } from "@/components/templates/minimal/Minimal";
import { Cli } from "@/components/templates/cli/Cli";
import { Glass } from "@/components/templates/glass/Glass";
import { Editorial } from "@/components/templates/editorial/Editorial";
import { Noir } from "@/components/templates/noir/Noir";
import { Bento } from "@/components/templates/bento/Bento";
import { Executive } from "@/components/templates/executive/Executive";
import { Aurora } from "@/components/templates/aurora/Aurora";
import { DEMO_DATA, DEMO_USERNAME } from "@/lib/demo-data";

const TEMPLATES: Record<string, typeof Minimal> = {
  minimal: Minimal, cli: Cli, glass: Glass, editorial: Editorial,
  noir: Noir, bento: Bento, executive: Executive, aurora: Aurora,
};

export default async function Page({ params }: { params: Promise<{ template: string }> }) {
  const { template } = await params;
  const Template = TEMPLATES[template];
  if (!Template) notFound();
  return <Template data={DEMO_DATA} username={DEMO_USERNAME} />;
}
