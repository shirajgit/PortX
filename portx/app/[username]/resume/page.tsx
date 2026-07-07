import { notFound } from "next/navigation";
import { getPortfolioData } from "@/lib/data";
import { Resume } from "@/components/templates/resume/Resume";

export const revalidate = 60;

type Props = { params: Promise<{ username: string }> };

export default async function ResumePage({ params }: Props) {
  const { username } = await params;
  const result = await getPortfolioData(username.toLowerCase());
  if (!result) notFound();
  return <Resume data={result.data} />;
}
