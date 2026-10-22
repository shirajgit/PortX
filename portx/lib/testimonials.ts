/* ── Testimonials ── shown on the landing page between "why portxz" and pricing.
   The section stays hidden while this list is empty. Only add real quotes from real
   users, with their permission — invented reviews mislead buyers and break consumer law.

   Example entry:
   { quote: "Set it up in one evening…", name: "Priya S.", role: "Frontend Developer", photo: "/testimonials/priya.jpg", url: "https://portxz.xyz/priya" } */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Path under /public. Without one, the card shows the person's initials. */
  photo?: string;
  /** Their Portxz page or another public profile. */
  url?: string;
};

export const TESTIMONIALS: Testimonial[] = [];
