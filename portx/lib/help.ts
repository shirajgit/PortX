import { FREE_AI_LIMITS, FREE_LIMITS, LAUNCH_OFFER_LIMIT, PRO_AI_LIMITS } from "./billing";

/* Help Center articles — shown on /help, grouped by topic and searchable.
   Keep answers in step with the product: the limits come from lib/billing.ts. */

export type HelpArticle = { q: string; a: string };
export type HelpTopic = { id: string; title: string; blurb: string; articles: HelpArticle[] };

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "getting-started",
    title: "Getting started",
    blurb: "Create your account and get your page live.",
    articles: [
      { q: "How do I create my portfolio?", a: "Sign up and pick a username — it becomes your link, portxz.xyz/username. A short guided setup walks you through the basics. After that, fill in your details from the dashboard: About you, Projects, Work experience, Education, Skills and Social links." },
      { q: "How do I publish my page?", a: "Open Design & publish in the dashboard, pick a template and press Publish. Your page goes live at portxz.xyz/username straight away. You can unpublish it from the same screen at any time." },
      { q: "Can I import my projects from GitHub?", a: "Yes. Go to Projects and choose Import from GitHub. Pick the repositories you want and they're added as projects, which you can then edit like any other." },
      { q: "I'm not a developer. Is Portxz for me?", a: "Yes. Designers, product managers, marketers and consultants all use it. Projects can be anything you've made — an app, a design, a campaign or a case study — and the GitHub features are optional." },
    ],
  },
  {
    id: "portfolio",
    title: "Portfolio & templates",
    blurb: "Designs, sections and your public page.",
    articles: [
      { q: "How do I switch templates?", a: "Go to Design & publish and choose another template. Your content is stored separately from the design, so switching never changes or loses anything you've written." },
      { q: "Which templates are free?", a: "Minimal is free for everyone. Aurora, Executive, CLI Terminal, Noir, Editorial, Bento and Glassmorphism come with Pro." },
      { q: "What are the limits on the free plan?", a: `The free plan includes up to ${FREE_LIMITS.projects} projects, ${FREE_LIMITS.experiences} work experiences, ${FREE_LIMITS.educations} education entries, ${FREE_LIMITS.links} social links, ${FREE_LIMITS.skillItems} skills and ${FREE_AI_LIMITS.enhance} AI enhances a month. Pro removes the content limits.` },
      { q: "Can I add sections like certifications or awards?", a: "Yes. Education has its own page in the dashboard. For everything else, use Add section: certifications, awards, volunteering, languages, publications, or a custom section with any title. Each one appears on your portfolio and your resume." },
      { q: "Can I see who viewed my page?", a: "Your dashboard home shows how many times your page was viewed and your resume downloaded, including a chart of the last 7 days." },
    ],
  },
  {
    id: "resume",
    title: "Resume & job tailoring",
    blurb: "PDF resumes, tailoring and AI tools.",
    articles: [
      { q: "How do I download my resume as a PDF?", a: "Open Resume in the dashboard and download the PDF. Your page needs to be published first. The resume is built from the same profile as your portfolio, so it's always up to date." },
      { q: "How do I tailor my resume to a job?", a: `Open Tailor to a job and paste the job description. You'll get a match score, the keywords you're missing, your bullets rewritten in the job's language and a tailored summary. Turn on the suggestions you want, then download a resume for that role. Your saved profile and public page don't change. Tailoring is part of Pro (up to ${PRO_AI_LIMITS.tailor} jobs a month).` },
      { q: "Is the resume ATS-friendly?", a: "Yes. Every resume layout is single column with real, selectable text and standard section headings, so applicant tracking systems can read it." },
      { q: "Which resume templates can I use?", a: "Classic is free. Pro unlocks all 6 resume templates and the resume editor, where you can change the font, colour, spacing and section order." },
      { q: "What is AI feedback?", a: `AI feedback (Pro) reviews your portfolio, scores it by category and gives you specific suggestions to fix. Pro includes up to ${PRO_AI_LIMITS.critic} reviews and ${PRO_AI_LIMITS.enhance} AI rewrites a month.` },
      { q: "How do I use the GitHub README?", a: "Open GitHub README in the dashboard and copy the generated Markdown. On GitHub, create a repository with the same name as your GitHub username, add the text as its README.md, and it shows at the top of your GitHub profile." },
    ],
  },
  {
    id: "billing",
    title: "Billing & Pro",
    blurb: "Payments, passes and refunds.",
    articles: [
      { q: "How do I upgrade to Pro?", a: "Open Billing in the dashboard, choose a pass and pay securely through Razorpay. In India, UPI, cards, netbanking and wallets all work; elsewhere, all major cards. Pro switches on as soon as the payment goes through." },
      { q: "Will I be charged again automatically?", a: "No. Pro is a one-time prepaid pass, not a subscription. When it ends, your account returns to the free plan. Your portfolio stays live and nothing is deleted." },
      { q: "What is the launch offer?", a: `One month of Pro at a launch price, for the first ${LAUNCH_OFFER_LIMIT} users. It can be used once per account.` },
      { q: "What happens if I buy a pass while Pro is still active?", a: "The new pass is added on top of the time you have left, so you never lose days." },
      { q: "I paid but Pro isn't active. What do I do?", a: "Refresh your Billing page first. If Pro still isn't active, contact us with your username and the payment reference shown under History on your Billing page, and we'll sort it out." },
      { q: "Can I get a refund?", a: "Passes activate immediately, so they're usually non-refundable. We do refund if you were charged but Pro wasn't activated, charged twice, or charged the wrong amount. Contact us within 7 days of the payment. See the Refund & Cancellation policy for details." },
    ],
  },
  {
    id: "account",
    title: "Account & privacy",
    blurb: "Sign-in, your data and your account.",
    articles: [
      { q: "How do I change my email or password?", a: "In the dashboard, open the account menu (your avatar) and choose Manage account. You can update your email, password and connected sign-in methods there." },
      { q: "How do I hide my portfolio?", a: "Go to Design & publish and unpublish your page. It stops being publicly visible, and your content stays saved so you can publish again later." },
      { q: "How do I delete my account or my data?", a: "Contact us from the email address on your account and we'll delete your account and data. See the Privacy Policy for how your data is handled." },
    ],
  },
];
