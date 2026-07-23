import type { PortfolioData } from "@/components/templates/types";

/* Demo profile used by /preview — profession-neutral so both
   developers and working professionals can judge the template.
   Deliberately dense: previews should show how a FULL profile looks. */

export const DEMO_USERNAME = "aarav";

export const DEMO_DATA: PortfolioData = {
  profile: {
    fullName: "Aarav Mehta",
    headline: "Product Designer & Frontend Developer",
    summary:
      "I design and build digital products end-to-end — from research and wireframes to shipped, measurable features. 4+ years across fintech and SaaS, working with founders and cross-functional teams of 2 to 20. I care about interfaces that feel obvious, numbers that prove they work, and shipping every single week.",
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
    { kind: "x", label: "X / Twitter", url: "https://x.com/aaravdesigns" },
    { kind: "custom", label: "Dribbble", url: "https://dribbble.com/aarav" },
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
        "Built and maintain the design system used by 3 product squads (50+ components, tokens, docs)",
        "Run monthly usability tests and turn findings into a prioritized fix pipeline",
        "Partner with engineering on a shared component library — design-to-dev handoff time cut in half",
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
        "Ran discovery workshops with founders to turn vague briefs into scoped, testable MVPs",
      ],
    },
    {
      title: "UI/UX Design Intern",
      organization: "Zylo Labs",
      location: "Pune",
      startDate: "Jan 2022",
      endDate: "May 2022",
      bullets: [
        "Redesigned the settings and billing screens of the flagship app (2M+ downloads)",
        "Created 40+ production-ready screens and a mini style guide adopted by the full-time team",
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
        "Cut onboarding drop-off 22% by replacing forms with a 3-question setup",
      ],
      tech: ["Figma", "React", "TypeScript", "Recharts"],
      liveUrl: "https://example.com",
      repoUrl: "https://github.com/aarav/ledgerly",
      imageUrl: null,
      featured: true,
    },
    {
      name: "Brief.day",
      tagline: "A one-page morning brief for busy teams",
      description: "",
      bullets: [
        "Concept to launch in 6 weeks; 800 signups in the first month",
        "Digest engine merges calendar, tasks, and metrics into one glanceable page",
      ],
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
      bullets: [
        "Tokens, dark mode, and accessibility baked in — WCAG AA across all components",
      ],
      tech: ["Figma", "Storybook", "React"],
      liveUrl: null,
      repoUrl: "https://github.com/aarav/ds-kit",
      imageUrl: null,
      featured: false,
    },
    {
      name: "Interview Prep OS",
      tagline: "Notion-based prep system — 3.5k copies claimed",
      description: "",
      bullets: [
        "Free resource that became a lead magnet: 3,500+ duplicates, 900 newsletter signups",
      ],
      tech: ["Notion", "Figma"],
      liveUrl: "https://example.com",
      repoUrl: null,
      imageUrl: null,
      featured: false,
    },
    {
      name: "Palette — color a11y checker",
      tagline: "Weekend build: contrast checking for real UI, not swatches",
      description: "",
      bullets: [
        "Paste a screenshot, get WCAG contrast issues highlighted in place — 1.2k users",
      ],
      tech: ["Next.js", "Canvas API"],
      liveUrl: "https://example.com",
      repoUrl: "https://github.com/aarav/palette",
      imageUrl: null,
      featured: false,
    },
  ],
  skills: [
    { category: "Design", items: ["Product Design", "Design Systems", "Prototyping", "User Research", "Interaction Design"] },
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
    { category: "Product", items: ["A/B Testing", "Analytics", "Roadmapping", "Stakeholder Workshops"] },
    { category: "Tools", items: ["Figma", "Framer", "Storybook", "Notion", "Linear"] },
  ],
  educations: [
    {
      institution: "National Institute of Design",
      degree: "B.Des, Interaction Design",
      startYear: 2018,
      endYear: 2022,
      score: "8.6 CGPA",
    },
    {
      institution: "Interaction Design Foundation",
      degree: "Certification — Design Systems & Accessibility",
      startYear: 2023,
      endYear: 2023,
      score: "Completed",
    },
  ],
};