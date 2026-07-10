import { notFound } from "next/navigation";
import { getPortfolioData } from "@/lib/data";
import { Minimal } from "@/components/templates/minimal/Minimal";
import { Cli } from "@/components/templates/cli/Cli";
import { Glass } from "@/components/templates/glass/Glass";
import { Editorial } from "@/components/templates/editorial/Editorial";
import { Noir } from "@/components/templates/noir/Noir";
import { Bento } from "@/components/templates/bento/Bento";
import { Executive } from "@/components/templates/executive/Executive";
import { Aurora } from "@/components/templates/aurora/Aurora";
import { ViewTracker } from "@/components/ViewTracker";

export const revalidate = 60;

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

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const result = await getPortfolioData(username.toLowerCase());
  if (!result) return {};
  const { profile } = result.data;
  return {
    title: `${profile.fullName} — ${profile.headline}`,
    description: profile.summary?.slice(0, 155),
    openGraph: { title: profile.fullName, description: profile.headline },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;
  const result = await getPortfolioData(username.toLowerCase());
  if (!result) notFound();
  const Template = TEMPLATES[result.template] ?? Minimal;
  return (
    <>
      <Template data={result.data} username={username.toLowerCase()} />
      <ViewTracker username={username.toLowerCase()} />
    </>
  );
}
