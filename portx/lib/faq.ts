import { PRICES, formatPrice, type Currency } from "./pricing";

/* Landing-page FAQ — shared by the page and its FAQ structured data. Prices follow the visitor's currency. */
export const faqFor = (currency: Currency) => {
  const fmt = (n: number) => formatPrice(n, currency);
  const p = PRICES[currency];
  return [
    { q: "Is the free plan actually free?", a: "Forever. You get a published portfolio with the Minimal template, 5 projects, 5 experience entries, skills, education, links, and GitHub import. Pro adds the premium templates, AI review, the synced resume PDF, and removes all limits." },
    { q: `What does the ${fmt(p.launch)} launch offer include?`, a: `One full month of Pro — every premium template, AI portfolio review, unlimited entries, and the ATS resume PDF. It's limited to the first 50 users, once per user. After that, Pro is ${fmt(p.month)}/month (or less on 6-month and yearly passes).` },
    { q: "How does payment work?", a: `Pick a pass on your Billing page and pay securely through Razorpay — ${currency === "INR" ? "UPI, cards, netbanking and wallets all work" : "all major cards work"}. Pro activates on your account the moment the payment goes through.` },
    { q: "Will I be charged again automatically?", a: "No. Pro is a one-time prepaid pass, not a subscription. When it ends, your account simply returns to the free plan — your portfolio stays live and nothing is deleted. Buy another pass whenever you like." },
    { q: "Is the resume really ATS-friendly?", a: "Yes — single column, real selectable text, standard section headings, no graphics. It's built to parse cleanly, and the AI review pushes your content toward measurable, recruiter-ready bullets." },
    { q: "I'm not a developer. Is this for me?", a: "Absolutely. Designers, PMs, marketers, consultants — the Executive and Noir templates were designed for working professionals. GitHub features are optional; everything else is profession-neutral." },
    { q: "Can I switch templates later?", a: "Anytime, in one click. Your data lives separately from the design — switching templates never touches your content." },
  ];
};
