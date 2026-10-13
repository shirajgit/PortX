import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Logo } from "@/components/Logo";

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
