"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight, Briefcase, FileText, FolderKanban, GraduationCap, House,
  Link2, Menu, Palette, ShieldCheck, Sparkles, SquarePlus, UserRound, X, Zap, type LucideIcon,
} from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

/* Grouped nav in plain words — the order follows how people build a page:
   fill in your details, then share it. */
type NavItem = { href: string; label: string; icon: LucideIcon | ((p: { className?: string }) => React.ReactNode) };
const NAV_GROUPS: { label: string | null; items: NavItem[] }[] = [
  {
    label: null,
    items: [{ href: "/dashboard", label: "Home", icon: House }],
  },
  {
    label: "Your details",
    items: [
      { href: "/dashboard/profile", label: "About you", icon: UserRound },
      { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
      { href: "/dashboard/experience", label: "Work experience", icon: Briefcase },
      { href: "/dashboard/education", label: "Education", icon: GraduationCap },
      { href: "/dashboard/skills", label: "Skills", icon: Zap },
      { href: "/dashboard/links", label: "Social links", icon: Link2 },
      { href: "/dashboard/sections", label: "Add section", icon: SquarePlus },
    ],
  },
  {
    label: "Share",
    items: [
      { href: "/dashboard/template", label: "Design & publish", icon: Palette },
      { href: "/dashboard/resume", label: "Resume", icon: FileText },
      { href: "/dashboard/review", label: "AI feedback", icon: Sparkles },
      { href: "/dashboard/readme", label: "GitHub README", icon: GithubIcon },
    ],
  },
];

type Props = {
  username: string | null;
  fullName: string;
  isAdmin: boolean;
  pro: boolean;
  published: boolean;
};

function NavRow({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group relative flex h-[34px] items-center gap-3 rounded-lg px-2.5 text-[13.5px] transition-colors ${
        active
          ? "bg-lp-accent-soft font-medium text-lp-text"
          : "text-lp-muted hover:bg-lp-surface-2 hover:text-lp-text"
      }`}
    >
      {active && (
        <motion.span layoutId="nav-active" aria-hidden
          className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-lp-accent"
          transition={{ type: "spring", stiffness: 500, damping: 40 }} />
      )}
      <Icon className={`h-[17px] w-[17px] shrink-0 ${active ? "text-lp-accent" : "text-lp-subtle transition-colors group-hover:text-lp-muted"}`} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function NavLinks({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const groups = isAdmin
    ? [...NAV_GROUPS, { label: "Admin", items: [{ href: "/dashboard/admin/payments", label: "Payments admin", icon: ShieldCheck }] }]
    : NAV_GROUPS;
  return (
    <nav className="flex flex-col gap-4" aria-label="Dashboard">
      {groups.map((group, gi) => (
        <div key={group.label ?? `g${gi}`}>
          {group.label && (
            <p className="mb-1 px-2.5 text-[11px] font-medium text-lp-subtle">{group.label}</p>
          )}
          <div className="flex flex-col gap-px">
            {group.items.map((item) => (
              <NavRow key={item.href} item={item} active={pathname === item.href} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

/* Live-page link — always visible under the logo. */
function PageLink({ username, published }: { username: string; published: boolean }) {
  return (
    <a href={`/${username}`} target="_blank"
      className="group flex h-10 items-center gap-2.5 rounded-lg border border-lp-border bg-lp-surface px-2.5 transition hover:border-lp-border-strong">
      <span className="relative flex h-2 w-2 shrink-0">
        {published && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lp-green opacity-50" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${published ? "bg-lp-green" : "bg-lp-warning"}`} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px]">
        <span className="text-lp-subtle">portxz.xyz/</span><span className="font-medium text-lp-text">{username}</span>
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-lp-subtle transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lp-text" />
    </a>
  );
}

/* Slim upgrade strip — two lines, one click. */
function UpgradeStrip({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/dashboard/billing" onClick={onNavigate}
      className="lp-gradient-border group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 transition hover:shadow-[0_10px_28px_-14px_rgba(79,110,255,0.7)]">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lp-accent text-white shadow-[0_4px_14px_-4px_rgba(79,110,255,0.8)]">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold">Upgrade to Pro</span>
        <span className="block text-[11px] text-lp-muted">₹49 for your first month</span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-lp-subtle transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lp-accent" />
    </Link>
  );
}

const iconBtn = "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-lp-muted transition hover:bg-lp-surface-2 hover:text-lp-text [&_svg]:h-4 [&_svg]:w-4";

/* Three zones: brand + page link (top), menu (scrolls only if the screen
   is short), upgrade + account (pinned to the bottom). */
function SidebarBody({ username, fullName, isAdmin, pro, published, onNavigate, onClose }: Props & { onNavigate?: () => void; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 space-y-3.5 px-3 pb-2 pt-4">
        <div className="flex items-center justify-between px-1.5">
          <Link href="/" onClick={onNavigate}><Logo size="sm" /></Link>
          {onClose && (
            <button onClick={onClose} aria-label="Close menu" className={iconBtn}><X /></button>
          )}
        </div>
        {username && <PageLink username={username} published={published} />}
      </div>

      <div className="lp-scroll-thin lp-fade-y min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <NavLinks isAdmin={isAdmin} onNavigate={onNavigate} />
      </div>

      <div className="shrink-0 space-y-2 border-t border-lp-border px-3 pb-3 pt-3">
        {!pro && <UpgradeStrip onNavigate={onNavigate} />}
        <div className="flex items-center gap-2.5 rounded-xl px-1.5 py-1.5">
          <UserButton />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium leading-tight">{fullName}</p>
            <Link href="/dashboard/billing" onClick={onNavigate}
              className="text-[11px] leading-tight text-lp-subtle transition hover:text-lp-accent">
              {pro ? "Pro plan" : "Free plan"}
            </Link>
          </div>
          <ThemeToggle className={iconBtn} />
        </div>
      </div>
    </div>
  );
}

export function DashboardNav(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── desktop sidebar ── */}
      <aside className="sticky top-0 hidden h-screen w-[256px] shrink-0 border-r border-lp-border bg-lp-surface/50 backdrop-blur-xl lg:block">
        <SidebarBody {...props} />
      </aside>

      {/* ── mobile top bar ── */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-lp-border bg-lp-bg/80 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/"><Logo size="sm" /></Link>
        <div className="flex items-center gap-1">
          <ThemeToggle className={iconBtn} />
          <button onClick={() => setOpen(true)} aria-label="Open menu" className={iconBtn}>
            <Menu />
          </button>
        </div>
      </div>

      {/* ── mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute inset-y-0 left-0 w-[280px] border-r border-lp-border bg-lp-bg">
              <SidebarBody {...props} onNavigate={() => setOpen(false)} onClose={() => setOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
