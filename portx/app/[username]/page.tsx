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
import type { PortfolioData } from "@/components/templates/types";
import { SITE_URL, jsonLd } from "@/lib/site";

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
  const path = `/${username.toLowerCase()}`;
  const title = profile.headline ? `${profile.fullName} — ${profile.headline}` : profile.fullName;
  const description =
    profile.summary?.slice(0, 155) ||
    `${profile.fullName}'s portfolio${profile.headline ? ` — ${profile.headline}` : ""}. Projects, experience and skills.`;
  const image = profile.avatarUrl?.startsWith("https://") ? profile.avatarUrl : "/brand/og.png";
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "profile",
      url: path,
      title,
      description,
      images: [{ url: image, alt: profile.fullName }],
    },
    twitter: { card: "summary", title, description, images: [image] },
  };
}

/* Tells search engines this page is about a person: name, role, links. */
function personJsonLd(username: string, data: PortfolioData) {
  const { profile, links, experiences } = data;
  const current = experiences.find((e) => !e.endDate);
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE_URL}/${username}`,
    mainEntity: {
      "@type": "Person",
      name: profile.fullName,
      ...(profile.headline && { jobTitle: profile.headline }),
      ...(profile.summary && { description: profile.summary }),
      ...(profile.avatarUrl?.startsWith("https://") && { image: profile.avatarUrl }),
      ...(profile.location && { address: { "@type": "PostalAddress", addressLocality: profile.location } }),
      ...(current?.organization && { worksFor: { "@type": "Organization", name: current.organization } }),
      ...(links.length > 0 && { sameAs: links.map((l) => l.url) }),
      url: `${SITE_URL}/${username}`,
    },
  });
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;
  const result = await getPortfolioData(username.toLowerCase());
  if (!result) notFound();
  const Template = TEMPLATES[result.template] ?? Minimal;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLd(username.toLowerCase(), result.data) }}
      />
      <Template data={result.data} username={username.toLowerCase()} />
      <ViewTracker username={username.toLowerCase()} />
    </>
  );
}
