import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Logo } from "@/components/Logo";
import { NO_INDEX } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in", robots: NO_INDEX };

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#0A0F1E] px-4 py-10 text-white">
      <Link href="/">
        <Logo size="lg" />
      </Link>
      <SignIn fallbackRedirectUrl="/dashboard" />
    </main>
  );
}
