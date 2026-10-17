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

// Pages a signed-in user has no reason to see — send them straight to the app.
const isGuestOnly = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();

  if (isGuestOnly(req) && (await auth()).userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Tell the UI which currency to show. Display only — orders re-derive it server-side.
  const currency = currencyFromHeaders(req.headers);
  if (req.cookies.get(CURRENCY_COOKIE)?.value !== currency) {
    const res = NextResponse.next();
    res.cookies.set(CURRENCY_COOKIE, currency, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 30 });
    return res;
  }
}, { signInUrl: "/sign-in", signUpUrl: "/sign-up" });

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
