import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/site";

/* The setup page is a client component, so its metadata lives here. */
export const metadata: Metadata = { title: "Set up your profile", robots: NO_INDEX };

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
