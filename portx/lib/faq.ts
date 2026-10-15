import { PRICES, SALE, SALE_PRICES, formatPrice, saleActive, type Currency } from "./pricing";

/* Landing-page FAQ — shared by the page and its FAQ structured data. Prices follow the visitor's currency. */
export const faqFor = (currency: Currency) => {
  const fmt = (n: number) => formatPrice(n, currency);
  const p = PRICES[currency];
  const s = SALE_PRICES[currency];
  return [
    { q: "Is the free plan actually free?", a: "Forever. You get a published portfolio with the Minimal template, 5 projects, 5 experience entries, skills, education, links, GitHub import, and a Classic ATS resume PDF. Pro adds the premium templates, AI review, resume tailoring for any job, 6 resume templates with a resume editor, and removes all limits." },
    saleActive()
      ? { q: `Is there a launch sale?`, a: `Yes — every Pro plan is ${SALE.percent}% off until ${SALE.endsLabel} 2026: ${fmt(s.month)} for a month (was ${fmt(p.month)}), ${fmt(s.halfyear)} for 6 months (was ${fmt(p.halfyear)}) and ${fmt(s.year)} for a year (was ${fmt(p.year)}). Pro includes every premium template, AI portfolio review, unlimited entries, resume tailoring for any job, and all 6 resume templates.` }
      : { q: "What does Pro include?", a: `Every premium template, AI portfolio review, unlimited entries, resume tailoring for any job, and all 6 resume templates — from ${fmt(p.month)} for a month, or less per month on 6-month and yearly passes.` },
    { q: "How does payment work?", a: `Pick a pass on your Billing page and pay securely through Razorpay — ${currency === "INR" ? "UPI, cards, netbanking and wallets all work" : "all major cards work"}. Pro activates on your account the moment the payment goes through.` },
    { q: "Will I be charged again automatically?", a: "No. Pro is a one-time prepaid pass, not a subscription. When it ends, your account simply returns to the free plan — your portfolio stays live and nothing is deleted. Buy another pass whenever you like." },
    { q: "Can I tailor my resume to a specific job?", a: "Yes. Paste any job description and Portxz gives you a match score, shows the keywords you're missing, rewrites your bullets in the job's language and writes a tailored summary. Pick what to keep, then download a resume made for that role. Your portfolio isn't changed. Resume tailoring is part of Pro (up to 60 jobs a month)." },
    { q: "Is the resume really ATS-friendly?", a: "Yes — single column, real selectable text, standard section headings, no graphics. It's built to parse cleanly, and the AI review pushes your content toward measurable, recruiter-ready bullets." },
    { q: "I'm not a developer. Is this for me?", a: "Absolutely. Designers, PMs, marketers, consultants — the Executive and Noir templates were designed for working professionals. GitHub features are optional; everything else is profession-neutral." },
    { q: "Can I switch templates later?", a: "Anytime, in one click. Your data lives separately from the design — switching templates never touches your content." },
  ];
};
