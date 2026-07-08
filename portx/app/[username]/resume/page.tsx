import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getPortfolioData } from "@/lib/data";
import { isPro } from "@/lib/billing";
import { Resume } from "@/components/templates/resume/Resume";

export const revalidate = 60;

type Props = { params: Promise<{ username: string }> };

export default async function ResumePage({ params }: Props) {
  const { username } = await params;
  const result = await getPortfolioData(username.toLowerCase());
  if (!result) notFound();
  const owner = await db.profile.findUnique({
    where: { username: username.toLowerCase() },
    select: { plan: true, planExpiresAt: true },
  });
  if (!owner || !isPro(owner)) notFound();
  return <Resume data={result.data} />;
}
