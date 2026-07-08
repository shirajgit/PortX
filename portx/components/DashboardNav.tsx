"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

/* ── inline SVG icon set (no deps) ─────────────────────────────────── */
const ICONS: Record<string, React.ReactNode> = {
  overview: (
    <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>
  ),
  profile: (
    <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></>
  ),
  projects: (
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
  ),
  experience: (
    <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></>
  ),
  skills: (
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  ),
  education: (
    <><path d="M2 8.5 12 4l10 4.5L12 13 2 8.5z" /><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" /></>
  ),
  links: (
    <><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7L12.5 19" /></>
  ),
  template: (
    <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18c-1.5 0-2-1-2-2s.5-2-1-2.5S5 16 5 14" /><circle cx="9" cy="8" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="8" r="1" fill="currentColor" stroke="none" /><circle cx="16.5" cy="12" r="1" fill="currentColor" stroke="none" /></>
  ),
  resume: (
    <><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></>
  ),
  review: (
    <><path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8L12 3z" /><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" /></>
  ),
  billing: (
    <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M6 15h4" /></>
  ),
  admin: (
    <><path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" /><path d="M9 12l2 2 4-4" /></>
  ),
};

function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0">
      {ICONS[name]}
    </svg>
  );
}

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/profile", label: "Profile", icon: "profile" },
  { href: "/dashboard/projects", label: "Projects", icon: "projects" },
  { href: "/dashboard/experience", label: "Experience", icon: "experience" },
  { href: "/dashboard/skills", label: "Skills", icon: "skills" },
  { href: "/dashboard/education", label: "Education", icon: "education" },
  { href: "/dashboard/links", label: "Links", icon: "links" },
  { href: "/dashboard/template", label: "Template & Publish", icon: "template" },
  { href: "/dashboard/resume", label: "Resume PDF", icon: "resume" },
  { href: "/dashboard/review", label: "AI Review", icon: "review" },
  { href: "/dashboard/billing", label: "Billing", icon: "billing" },
];

type Props = { username: string | null; isAdmin: boolean };

function NavLinks({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 text-sm">
      {NAV.map((n) => {
        const active = pathname === n.href;
        return (
          <Link key={n.href} href={n.href} onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
              active
                ? "bg-[#111A36] text-white"
                : "text-[#8B98B8] hover:bg-[#111A36] hover:text-white"}`}>
            <span className={active ? "text-[#4DA6FF]" : ""}><Icon name={n.icon} /></span>
            {n.label}
          </Link>
        );
      })}
      {isAdmin && (
        <Link href="/dashboard/admin/payments" onClick={onNavigate}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
            pathname === "/dashboard/admin/payments"
              ? "bg-[#111A36] text-[#FFB454]"
              : "text-[#FFB454] hover:bg-[#111A36]"}`}>
          <Icon name="admin" />
          Payments admin
        </Link>
      )}
    </nav>
  );
}

export function DashboardNav({ username, isAdmin }: Props) {
  const [open, setOpen] = useState(false);

  const footer = (
    <div className="mt-auto flex items-center gap-3 pt-6">
      <UserButton />
      {username && (
        <a href={`/${username}`} target="_blank"
          className="font-mono text-xs text-[#8FC4FF] hover:text-white">
          /{username} ↗
        </a>
      )}
    </div>
  );

  return (
    <>
      {/* ── desktop sidebar ── */}
      <aside className="sticky top-0 hidden h-screen w-60 flex-col overflow-y-auto border-r border-[#1E2C52] p-5 sm:flex">
        <Link href="/" className="mb-8 text-xl font-bold">
          Portx<span className="text-[#4DA6FF]">Z</span>
        </Link>
        <NavLinks isAdmin={isAdmin} />
        {footer}
      </aside>

      {/* ── mobile top bar ── */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-[#1E2C52] bg-[#0A0F1E]/90 px-4 py-3 backdrop-blur sm:hidden">
        <Link href="/" className="text-lg font-bold">
          port<span className="text-[#4DA6FF]">X</span>
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu"
          className="rounded-lg border border-[#1E2C52] p-2 text-[#8B98B8] hover:border-[#4DA6FF] hover:text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" className="h-5 w-5">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* ── mobile drawer ── */}
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-[#1E2C52] bg-[#0A0F1E] p-5">
            <div className="mb-6 flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="text-xl font-bold">
                port<span className="text-[#4DA6FF]">X</span>
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Close menu"
                className="rounded-lg border border-[#1E2C52] p-2 text-[#8B98B8] hover:border-[#4DA6FF] hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" className="h-5 w-5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavLinks isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
            </div>
            {footer}
          </aside>
        </div>
      )}
    </>
  );
}
