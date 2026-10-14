import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LEGAL_LINKS, SITE_NAME } from "@/lib/site";
import { ArrowLeft } from "lucide-react";

/* Shared shell for the policy pages: /terms, /privacy, /refund-policy,
   /shipping-policy and /contact. */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[#1E2C52]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/"><Logo size="sm" /></Link>
          <Link href="/" className="inline-flex items-center gap-1 font-mono text-xs text-[#8B98B8] hover:text-[#4DA6FF]"><ArrowLeft className="h-3.5 w-3.5" /> Home</Link>
        </div>
      </header>

      <article
        className="mx-auto max-w-3xl px-6 py-12 text-sm leading-relaxed text-[#8B98B8]
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground
          [&_h2]:mt-9 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground
          [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5
          [&_a]:text-[#4DA6FF] [&_a:hover]:underline [&_strong]:text-foreground">
        {children}
      </article>

      <footer className="border-t border-[#1E2C52]">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-[#8B98B8]">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#4DA6FF]">{l.label}</Link>
            ))}
          </nav>
          <p className="mt-4 font-mono text-xs text-[#6B7A99]">© {new Date().getFullYear()} {SITE_NAME}</p>
        </div>
      </footer>
    </main>
  );
}
