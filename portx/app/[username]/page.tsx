import { notFound } from "next/navigation";
import { getPortfolioData } from "@/lib/data";
import { Minimal } from "@/components/templates/minimal/Minimal";
import { ViewTracker } from "@/components/ViewTracker";

export const revalidate = 60;

const TEMPLATES: Record<string, typeof Minimal> = {
  minimal: Minimal,
  // cli: Cli,     // week 9-10
  // glass: Glass, // week 9-10
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
      <Template data={result.data} />
      <ViewTracker username={username.toLowerCase()} />
    </>
  );
}
