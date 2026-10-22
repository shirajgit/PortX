import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/* Every page needs a signed-in user. Whether that user is the admin is checked in
   app/(board)/layout.tsx and again inside every server action. */
const isPublic = createRouteMatcher(["/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) await auth.protect();
}, { signInUrl: "/sign-in" });

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
