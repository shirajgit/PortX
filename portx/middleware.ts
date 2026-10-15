import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { CURRENCY_COOKIE, currencyFromHeaders } from "@/lib/pricing";

const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/api/profile(.*)",
  "/api/projects(.*)",
  "/api/experiences(.*)",
  "/api/skills(.*)",
  "/api/sections(.*)",
  "/api/import(.*)",
  "/api/ai(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();

  // Tell the UI which currency to show. Display only — orders re-derive it server-side.
  const currency = currencyFromHeaders(req.headers);
  if (req.cookies.get(CURRENCY_COOKIE)?.value !== currency) {
    const res = NextResponse.next();
    res.cookies.set(CURRENCY_COOKIE, currency, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 30 });
    return res;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
