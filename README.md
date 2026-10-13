<p align="center">
  <img src="portx/app/favicon.ico" alt="Portxz logo" width="72" />
</p>

<h1 align="center">Portxz</h1>

<p align="center">
  <b>One profile. Portfolio, resume &amp; README — always in sync.</b><br/>
  Fill one profile → get a live portfolio website, an ATS-ready resume PDF, and a GitHub profile README.<br/>
  Edit anything once, everything updates.
</p>

<p align="center">
  <a href="https://portxz.xyz"><b>portxz.xyz</b></a> · Live in ~3 minutes · Zero code needed
</p>

---

## ✨ Features

- **🧭 Guided onboarding wizard** — 8 steps from signup to a published page: claim your username, add your work, pick a look, go live
- **🎨 8 templates** — Minimal (free), plus premium: an **interactive CLI terminal** (visitors literally type commands — try `sudo hire-me`), Glassmorphism, serif-magazine **Editorial**, black-and-gold **Noir**, tile-grid **Bento**, corporate-clean **Executive**, and glowing **Aurora**. Switch anytime — same data, new look
- **📄 ATS-ready resume** — single-column, parser-friendly resume rendered from your profile, downloadable as PDF. No Word wrestling
- **🐙 GitHub tools** — one-click repo import (repos become portfolio projects) and a generated profile README with badges, projects, and stats
- **🤖 AI assist** — Enhance rewrites weak bullets; the AI Portfolio Review scores your profile against a recruiter-style rubric with specific fixes
- **📊 Analytics** — page views and resume downloads, per profile
- **💸 Simple billing** — free plan forever; Pro passes via UPI with manual verification and expiry stacking. Launch offer: first 50 users get a month of Pro for ₹49
- **🌗 Dark / light theme**, mobile-responsive dashboard with a floating icon-rail navigation

## 🧰 Tech stack

| Layer      | Choice |
|------------|--------|
| Framework  | Next.js 16 (App Router, Turbopack) |
| Language   | TypeScript |
| Database   | PostgreSQL on [Neon](https://neon.tech), via Prisma 7 (`@prisma/adapter-pg`) |
| Auth       | [Clerk](https://clerk.com) |
| AI         | [OpenRouter](https://openrouter.ai) (enhance + review) |
| PDF        | Puppeteer-core + `@sparticuz/chromium` on Vercel serverless |
| Styling    | Tailwind CSS v4, Framer Motion on the landing |
| Validation | Zod on every API route |
| Hosting    | Vercel |

## 🚀 Getting started

```bash
git clone https://github.com/shirajgit/PortX.git
cd PortX/portx
npm install
```

Create `portx/.env`:

```env
DATABASE_URL="postgresql://..."           # Neon connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENROUTER_API_KEY="sk-or-..."
ADMIN_CLERK_ID="user_..."                 # your Clerk user id → unlocks the payments admin panel
NEXT_PUBLIC_UPI_ID="you@upi"              # where Pro payments go
NEXT_PUBLIC_UPI_NAME="Portxz"
# CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"  # local PDF generation
```

Then:

```bash
npx prisma migrate dev   # create the schema
npm run dev              # http://localhost:3000
```

### Production notes

- The build script is self-healing: `prisma generate && prisma migrate deploy && next build` — every deploy regenerates the client and applies pending migrations, so code and database can never drift
- Set the same env vars in Vercel; `NEXT_PUBLIC_APP_URL` must be the real deployed URL (the PDF route navigates to it)
- `serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"]` in `next.config.ts` is required for PDF generation on Vercel

## 🗂️ Project structure

```
portx/
├── app/
│   ├── page.tsx              # animated landing page
│   ├── setup/                # 8-step onboarding wizard
│   ├── [username]/           # public portfolio (+ /resume view)
│   ├── preview/[template]/   # full-screen template previews (demo data)
│   ├── dashboard/            # editors, template gallery, billing, AI review, admin
│   └── api/                  # profile, projects, skills, billing, AI, pdf, github import
├── components/templates/     # minimal · cli · glass · editorial · noir · bento · executive · aurora
├── lib/                      # db, billing rules, AI critic, readme generator, demo data
└── prisma/                   # schema + migrations
```

## 💳 Plans

| | Free | Pro |
|---|---|---|
| Published portfolio + your link | ✅ | ✅ |
| GitHub import & README | ✅ | ✅ |
| Templates | Minimal | All 8 |
| Projects / experience / links | 5 each | Unlimited |
| AI Enhance | 5 / month | Unlimited |
| AI Portfolio Review | — | ✅ |
| ATS resume view + PDF | — | ✅ |

Pro passes: **₹49 launch offer** (first 50, one month) · ₹149 / month · ₹649 / 6 months · ₹999 / year. All limits are enforced server-side.

## 🧑‍💻 Author

**Shiraj Mujawar** — built solo, after work.
[Portfolio](https://portxz.xyz/shiraj02) · [GitHub](https://github.com/shirajgit)

---

<p align="center"><i>Built for people who ship.</i> 🚀</p>
