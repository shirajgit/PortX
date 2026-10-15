import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getPortfolioData } from "@/lib/data";
import { Resume } from "@/components/templates/resume/Resume";

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
  // Always fresh: /api/pdf prints this page right after an edit and caches the PDF by
  // content hash, so a stale render would be stored under the new version for a day.
  await connection();
  const { username } = await params;
  const result = await getPortfolioData(username.toLowerCase(), { forResume: true });
  if (!result) notFound();
  return (
    <div className="pb-16 print:pb-0">
      <Resume data={result.data} config={result.resumeConfig} />
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
