"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { BarChart3, CreditCard, ExternalLink, LayoutDashboard, Users } from "lucide-react";
import { SITE_URL } from "@/lib/format";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/traffic", label: "Traffic & waitlist", icon: BarChart3 },
];

export function Sidebar() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <aside className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur lg:h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-4 lg:px-5 lg:py-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#3B9BFF] to-[#A16BFF] text-xs font-bold text-white">P</span>
          <span className="text-sm font-semibold tracking-tight">Portxz <span className="text-muted">Board</span></span>
        </Link>
        <div className="lg:hidden"><UserButton /></div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
              active(href) ? "bg-surface-2 text-text" : "text-muted hover:bg-surface hover:text-text"}`}>
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="absolute inset-x-0 bottom-0 hidden border-t border-border p-4 lg:block">
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer"
          className="mb-4 flex items-center gap-2 text-xs text-muted transition-colors hover:text-text">
          <ExternalLink className="h-3.5 w-3.5" /> Open portxz.xyz
        </a>
        <UserButton showName />
      </div>
    </aside>
  );
}
