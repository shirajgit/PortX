# Portxz Board

Private admin dashboard for Portxz. A separate Next.js app on the same stack as the main
site (Next 16, Tailwind 4, Prisma 7, Clerk, Recharts), reading the same database.

- **Overview**: users, signups chart, published pages, active Pro, revenue, launch-offer slots, payments waiting for review.
- **Users**: search and filter every profile; per-user stats, payments, grant/extend or end Pro, publish/unpublish.
- **Payments**: every payment with status/pass/currency filters; approve or reject pending ones.
- **Traffic & waitlist**: views, resume downloads and link clicks for 30 days, top portfolios and referrers, waitlist emails.

Nothing here deletes users or data.

## Access

Only the Clerk user whose id is `ADMIN_CLERK_ID` gets in — the same variable the main app
uses for its payments page. Anyone else who signs in sees "No access". Every server action
checks again, so the actions can't be called by another account either.

## Setup

```bash
cp .env.example .env   # fill in the same values as the main app
npm install            # also copies the schema and generates the Prisma client
npm run dev            # http://localhost:3001
```

## Database schema

`prisma/schema.prisma` is a copy of `../portx/prisma/schema.prisma`. `npm install` (and
`npm run sync-schema`) refreshes it from the main app. **Never run `prisma migrate` here** —
the main app owns migrations. After a schema change in the main app, run `npm run sync-schema`
and commit the updated copy.

`lib/plans.ts` mirrors the pass rules in `../portx/lib/billing.ts`; change both together.

## Deploying

Deploy as its own Vercel project with **Root Directory** set to `portxz-board`, with the
env vars from `.env.example`. Use a subdomain of the main site (e.g. `admin.portxz.xyz`) so it
can share the main site's Clerk production instance — check Clerk's docs on subdomains and
allowed origins when you set it up.
