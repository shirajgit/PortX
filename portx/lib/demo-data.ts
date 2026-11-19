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
      "I design and build digital products end-to-end — from research and wireframes to shipped, measurable features. 5+ years across fintech, SaaS and consumer apps, working with founders and cross-functional teams of 2 to 20. I care about interfaces that feel obvious, numbers that prove they work, and shipping every single week.",
    location: "Bengaluru, India",
    email: "hello@aarav.design",
    avatarUrl: "/demo/avatar.jpg",
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
        "Mentor 2 junior designers through weekly critiques and a shared growth plan",
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
        "Built the studio's Framer site template, reused on 12 client launches",
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
    {
      title: "Freelance UI Designer",
      organization: "Self-employed",
      location: "Remote",
      startDate: "Jul 2021",
      endDate: "Dec 2021",
      bullets: [
        "Designed landing pages and brand kits for 8 early-stage startups",
        "Two clients raised seed rounds with the decks and sites delivered",
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
    {
      name: "Habitloop",
      tagline: "A calm habit tracker with streaks that forgive a bad day",
      description: "",
      bullets: [
        "Designed the iOS app end-to-end; 4.8★ from 600+ ratings",
        "Featured in the App Store's \"New Apps We Love\" in India",
      ],
      tech: ["Figma", "React Native", "Expo"],
      liveUrl: "https://example.com",
      repoUrl: null,
      imageUrl: null,
      featured: false,
    },
    {
      name: "Figma Tokens Sync",
      tagline: "Open-source plugin: Figma variables → Tailwind config in one click",
      description: "",
      bullets: [
        "2.1k installs and 340 GitHub stars; used by two design-system teams in production",
      ],
      tech: ["TypeScript", "Figma API", "Tailwind CSS"],
      liveUrl: null,
      repoUrl: "https://github.com/aarav/tokens-sync",
      imageUrl: null,
      featured: false,
    },
  ],
  skills: [
    { category: "Design", items: ["Product Design", "Design Systems", "Prototyping", "User Research", "Interaction Design", "Accessibility", "Motion Design"] },
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "React Native", "Storybook"] },
    { category: "Product", items: ["A/B Testing", "Analytics", "Roadmapping", "Stakeholder Workshops", "Copywriting"] },
    { category: "Tools", items: ["Figma", "Framer", "Notion", "Linear", "Mixpanel", "Maze"] },
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
  sections: [
    {
      title: "Certifications",
      kind: "certifications",
      items: [
        { title: "Google UX Design Certificate", subtitle: "Coursera", date: "2024", url: "", description: "" },
        { title: "Accessibility for Designers", subtitle: "Interaction Design Foundation", date: "2023", url: "", description: "" },
        { title: "Meta Front-End Developer", subtitle: "Coursera", date: "2023", url: "", description: "" },
        { title: "Product Analytics Certification", subtitle: "Mixpanel", date: "2022", url: "", description: "" },
      ],
    },
    {
      title: "Awards",
      kind: "awards",
      items: [
        { title: "Best Fintech UX — Product Hunt", subtitle: "Ledgerly", date: "2025", url: "", description: "Top 3 product of the day with 1,200+ upvotes." },
        { title: "Design Hackathon Winner", subtitle: "Figma Config India", date: "2023", url: "", description: "First place out of 140 teams for an accessible transit-ticketing flow." },
      ],
    },
    {
      title: "Talks & Writing",
      kind: "publications",
      items: [
        { title: "Design systems for teams of three", subtitle: "Talk · UX Bangalore", date: "2025", url: "", description: "How small teams get 80% of a design system for 20% of the effort." },
        { title: "Onboarding that doesn't feel like a form", subtitle: "Article · UX Collective", date: "2024", url: "", description: "Read 25k+ times; the Ledgerly onboarding case study." },
      ],
    },
    {
      title: "Volunteering",
      kind: "volunteering",
      items: [
        { title: "Design mentor", subtitle: "ADPList", date: "2023 — now", url: "", description: "100+ free mentoring sessions with early-career designers." },
      ],
    },
    {
      title: "Languages",
      kind: "languages",
      items: [
        { title: "English", subtitle: "Professional", date: "", url: "", description: "" },
        { title: "Hindi", subtitle: "Native", date: "", url: "", description: "" },
        { title: "Kannada", subtitle: "Conversational", date: "", url: "", description: "" },
      ],
    },
  ],
};