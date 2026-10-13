"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

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

/* Grouped nav — sections give the sidebar rhythm and scannability. */
type NavItem = { href: string; label: string; icon: string };
const NAV_GROUPS: { label: string | null; items: NavItem[] }[] = [
  {
    label: null,
    items: [{ href: "/dashboard", label: "Overview", icon: "overview" }],
  },
  {
    label: "Build",
    items: [
      { href: "/dashboard/profile", label: "Profile", icon: "profile" },
      { href: "/dashboard/projects", label: "Projects", icon: "projects" },
      { href: "/dashboard/experience", label: "Experience", icon: "experience" },
      { href: "/dashboard/skills", label: "Skills", icon: "skills" },
      { href: "/dashboard/education", label: "Education", icon: "education" },
      { href: "/dashboard/links", label: "Links", icon: "links" },
    ],
  },
  {
    label: "Publish",
    items: [
      { href: "/dashboard/template", label: "Template & Publish", icon: "template" },
      { href: "/dashboard/resume", label: "Resume PDF", icon: "resume" },
      { href: "/dashboard/review", label: "AI Review", icon: "review" },
    ],
  },
  {
    label: "Account",
    items: [{ href: "/dashboard/billing", label: "Billing", icon: "billing" }],
  },
];

type Props = { username: string | null; isAdmin: boolean };

function NavRow({
  item,
  active,
  onNavigate,
  accent = "#4DA6FF",
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
  accent?: string;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150 ${
        active
          ? "bg-gradient-to-r from-[#4DA6FF]/[0.14] to-transparent text-white ring-1 ring-inset ring-[#4DA6FF]/25"
          : "text-[#8B98B8] hover:translate-x-0.5 hover:bg-[#111A36] hover:text-white"
      }`}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-y-1.5 left-0 w-0.5 rounded-full"
          style={{ backgroundColor: accent }}
        />
      )}
      <span
        className={active ? "" : "text-[#6B7A99] transition-colors group-hover:text-[#8FC4FF]"}
        style={active ? { color: accent } : undefined}
      >
        <Icon name={item.icon} />
      </span>
      {item.label}
    </Link>
  );
}

function NavLinks({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5 text-sm">
      {NAV_GROUPS.map((group, gi) => (
        <div key={group.label ?? `g${gi}`} className={group.label ? "mt-4" : ""}>
          {group.label && (
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5C6A87]">
              {group.label}
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <NavRow
                key={item.href}
                item={item}
                active={pathname === item.href}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
      {isAdmin && (
        <div className="mt-4">
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5C6A87]">
            Admin
          </p>
          <NavRow
            item={{ href: "/dashboard/admin/payments", label: "Payments admin", icon: "admin" }}
            active={pathname === "/dashboard/admin/payments"}
            onNavigate={onNavigate}
            accent="#FFB454"
          />
        </div>
      )}
    </nav>
  );
}

function Brand({ onNavigate, size = "lg" }: { onNavigate?: () => void; size?: "lg" | "sm" }) {
  return (
    <Link href="/" onClick={onNavigate} className="flex items-center">
      <Logo size="md" className={size === "lg" ? "" : "!text-lg"} />
    </Link>
  );
}

export function DashboardNav({ username, isAdmin }: Props) {
  const [open, setOpen] = useState(false);

  const footer = (
    <div className="mt-auto space-y-3 pt-6">
      {username && (
        <a
          href={`/${username}`}
          target="_blank"
          className="flex items-center justify-between rounded-lg border border-[#1E2C52] bg-[#0F1730] px-3 py-2 font-mono text-xs text-[#8FC4FF] transition hover:border-[#4DA6FF] hover:text-white"
        >
          <span className="truncate">/{username}</span>
          <span className="shrink-0 text-[#5C6A87]">↗</span>
        </a>
      )}
      <div className="flex items-center gap-3 border-t border-[#1E2C52]/60 pt-4">
        <UserButton />
        <ThemeToggle />
      </div>
    </div>
    
  );

  return (
    <>
      {/* ── desktop sidebar ── */}
      <aside className="sticky top-0 hidden h-screen w-60 flex-col overflow-y-auto border-r border-[#1E2C52] bg-[#0A0F1E]/1 p-5 backdrop-blur-sm sm:flex">
        <div className="mb-7">
          <Brand />
        </div>
        <NavLinks isAdmin={isAdmin} />
        {footer}
      </aside>

      {/* ── mobile top bar ── */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-[#1E2C52] bg-[#0A0F1E]/90 px-4 py-3 backdrop-blur sm:hidden">
        <Brand size="sm" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-lg border border-[#1E2C52] p-2 text-[#8B98B8] transition hover:border-[#4DA6FF] hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" className="h-5 w-5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── mobile drawer ── */}
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-[#1E2C52] bg-[#0A0F1E] p-5">
            <div className="mb-6 flex items-center justify-between">
              <Brand size="sm" onNavigate={() => setOpen(false)} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg border border-[#1E2C52] p-2 text-[#8B98B8] transition hover:border-[#4DA6FF] hover:text-white"
              >
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
