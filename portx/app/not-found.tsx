import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Page not found" };

/* Shown for unknown URLs and unpublished or missing portfolios. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0A0F1E] px-4 text-center text-white">
      <Link href="/"><Logo size="lg" /></Link>
      <div>
        <p className="font-mono text-sm text-[#8B98B8]">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page doesn&apos;t exist</h1>
        <p className="mt-3 max-w-sm text-[#8B98B8]">
          The link may be mistyped, or the portfolio may have been taken offline.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1E2C52] px-5 py-3 text-sm font-medium hover:bg-[#111A36]">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <Link href="/sign-up" className="inline-flex items-center justify-center rounded-xl bg-[#4F6EFF] px-5 py-3 text-sm font-medium text-[#FFFFFF] hover:bg-[#3F5EEF]">
          Make your own portfolio
        </Link>
      </div>
    </main>
  );
}
