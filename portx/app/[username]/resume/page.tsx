import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getPortfolioData } from "@/lib/data";
import { isPro } from "@/lib/billing";
import { Resume } from "@/components/templates/resume/Resume";

export const revalidate = 60;

type Props = { params: Promise<{ username: string }> };

/* The resume repeats the portfolio's content, so point search engines at the portfolio. */
export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const result = await getPortfolioData(username.toLowerCase());
  if (!result) return {};
  return {
    title: `${result.data.profile.fullName} — Resume`,
    alternates: { canonical: `/${username.toLowerCase()}` },
    robots: { index: false, follow: true },
  };
}

export default async function ResumePage({ params }: Props) {
  const { username } = await params;
  const result = await getPortfolioData(username.toLowerCase(), { forResume: true });
  if (!result) notFound();
  const owner = await db.profile.findUnique({
    where: { username: username.toLowerCase() },
    select: { plan: true, planExpiresAt: true },
  });
  if (!owner || !isPro(owner)) notFound();
  return (
    <div className="pb-16 print:pb-0">
      <Resume data={result.data} />
      {/* Web view only: hidden when printed, so the PDF has no extra text for ATS to parse. */}
      <footer className="fixed inset-x-0 bottom-0 flex justify-center pb-3 print:hidden">
        <a
          href="https://portxz.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-black/10 bg-white/90 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur hover:text-black"
        >
          Built with Portxz
        </a>
      </footer>
    </div>
  );
}
