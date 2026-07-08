# portX — Phase 1

One profile → live portfolio + ATS resume PDF, always in sync.

Stack: Next.js (App Router) · PostgreSQL + Prisma 7 · Clerk · Tailwind · Puppeteer

## Setup (10 minutes)

### 1. Install
```bash
npm install
```

### 2. Database
Create a Postgres database, then set the connection string in `.env`:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/portx"
```
Create the tables and generate the client:
```bash
npx prisma migrate dev --name init
```

### 3. Clerk
Create a free app at https://dashboard.clerk.com → API Keys, then fill `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run
```bash
npm run dev
```
Sign up → you'll land on /dashboard → it redirects to onboarding → claim your username → fill profile/projects/experience/skills → Template & Publish → your page is live at `localhost:3000/{username}`.

## Optional features
- **AI enhance button**: add `ANTHROPIC_API_KEY=` to `.env.local`
- **PDF download in local dev**: Puppeteer needs Chrome — add `CHROME_PATH=` pointing at your Chrome binary, e.g.
  - Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe`
  - Mac: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
  - On Vercel this works automatically via @sparticuz/chromium.

## What's implemented (Phase 1 core)
- Clerk auth + onboarding with live username availability check + reserved-word blocklist
- Profile / Projects / Experience / Skills CRUD (zod-validated, owner-scoped)
- AI enhance button (bullet / summary / tagline modes, grounded — never invents facts)
- Public portfolio at `/{username}` — server-rendered, ISR (60s), SEO metadata, 404 when unpublished
- Minimal template (blue-black) + ATS Resume template
- PDF export at `/api/pdf?username=` via Puppeteer printing `/{username}/resume`
- View + PDF-download tracking (counts only) shown on the dashboard overview
- Launch checklist on the dashboard

## Next (weeks 9-12 in the build plan)
CLI + Glass templates → template picker already has the slots · links editor UI ·
education editor UI · then launch to 20 real users.
