import type { PortfolioData } from "@/components/templates/types";

/* Demo profile used by /dashboard/preview — profession-neutral so both
   developers and working professionals can judge the template. */

export const DEMO_USERNAME = "aarav";

export const DEMO_DATA: PortfolioData = {
  profile: {
    fullName: "Aarav Mehta",
    headline: "Product Designer & Frontend Developer",
    summary:
      "I design and build digital products end-to-end — from research and wireframes to shipped, measurable features. 4+ years across fintech and SaaS, working with founders and cross-functional teams.",
    location: "Bengaluru, India",
    email: "hello@aarav.design", 
    avatarUrl: null,
    openToWork: true,
    themeConfig: {},
  },
  links: [
    { kind: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/aarav" },
    { kind: "github", label: "GitHub", url: "https://github.com/aarav" },
    { kind: "website", label: "Website", url: "https://aarav.design" },
  ],
  experiences: [
    {
      title: "Senior Product Designer",
      organization: "Finlay",
      location: "Bengaluru",
      startDate: "Mar 2024",
      endDate: null,
      bullets: [
        "Led redesign of the onboarding flow, lifting activation from 31% to 52% in one quarter",
        "Built and maintain the design system used by 3 product squads",
        "Run monthly usability tests and turn findings into a prioritized fix pipeline",
      ],
    },
    {
      title: "Product Designer",
      organization: "Craftbase Studio",
      location: "Remote",
      startDate: "Jun 2022",
      endDate: "Feb 2024",
      bullets: [
        "Shipped 20+ client projects across SaaS dashboards, marketing sites, and mobile apps",
        "Introduced component-driven handoff, cutting dev rework by ~30%",
      ],
    },
  ],
  projects: [
    {
      name: "Ledgerly",
      tagline: "Expense tracking that categorizes itself — 12k monthly users",
      description: "",
      bullets: [
        "Designed and built the analytics dashboard with weekly insight digests",
        "Grew to 12k MAU with a 4.7★ store rating",
      ],
      tech: ["Figma", "React", "TypeScript"],
      liveUrl: "https://example.com",
      repoUrl: "https://github.com/aarav/ledgerly",
      imageUrl: null,
      featured: true,
    },
    {
      name: "Brief.day",
      tagline: "A one-page morning brief for busy teams",
      description: "",
      bullets: ["Concept to launch in 6 weeks; 800 signups in the first month"],
      tech: ["Next.js", "Tailwind", "Postgres"],
      liveUrl: "https://example.com",
      repoUrl: null,
      imageUrl: null,
      featured: true,
    },
    {
      name: "Design System Kit",
      tagline: "50-component Figma + code library used by 3 teams",
      description: "",
      bullets: [],
      tech: ["Figma", "Storybook"],
      liveUrl: null,
      repoUrl: "https://github.com/aarav/ds-kit",
      imageUrl: null,
      featured: false,
    },
  ],
  skills: [
    { category: "Design", items: ["Product Design", "Design Systems", "Prototyping", "User Research"] },
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { category: "Tools", items: ["Figma", "Framer", "Notion", "Linear"] },
  ],
  educations: [
    {
      institution: "National Institute of Design",
      degree: "B.Des, Interaction Design",
      startYear: 2018,
      endYear: 2022,
      score: "8.6 CGPA",
    },
  ],
};
