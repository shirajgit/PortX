export type PortfolioData = {
  profile: {
    fullName: string;
    headline: string;
    summary: string;
    location: string;
    email: string;
    avatarUrl: string | null;
    openToWork: boolean;
    themeConfig: Record<string, unknown>;
  };
  links: { kind: string; label: string; url: string }[];
  experiences: {
    title: string;
    organization: string;
    location: string;
    startDate: string | null;
    endDate: string | null;
    bullets: string[];
  }[];
  projects: {
    name: string;
    tagline: string;
    description: string;
    bullets: string[];
    tech: string[];
    liveUrl: string | null;
    repoUrl: string | null;
    imageUrl: string | null;
    featured: boolean;
  }[];
  skills: { category: string; items: string[] }[];
  educations: {
    institution: string;
    degree: string;
    startYear: number | null;
    endYear: number | null;
    score: string;
  }[];
};

export type TemplateProps = { data: PortfolioData; username?: string };
