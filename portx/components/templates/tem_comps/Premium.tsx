"use client";

/* ── Portxz premium layout kit ───────────────────────────────────────────
   The page-level pieces that make a portfolio feel like a product site
   rather than a document. Motion.tsx animates elements; this file gives
   templates their frame: navigation, hero depth, covers and calls to action.
   Nothing here has its own palette — every template passes its own colours
   and classes, so each keeps its identity.

     <FloatingNav>   glass bar pinned to the top, active-section highlight,
                     mobile menu, optional resume button
     <HeroBackdrop>  cursor-following glow + drifting blobs + faded grid
     <StatusPill>    "open to work" badge with a pulsing dot
     <SocialRail>    vertical icon rail fixed to the left edge (desktop)
     <ProjectCover>  project image with hover zoom, or a generated cover
     jumpTo()        smooth in-page scroll that clears the floating nav
     resumeHref()    the PDF download link for a username
   ------------------------------------------------------------------------ */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Globe, Link2, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/BrandIcons";
import type { PortfolioData } from "../types";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Room left above a section when jumping to it, so the floating nav doesn't cover its title. */
const NAV_CLEARANCE = 88;

/** Smooth-scroll to a section id. Use as an anchor's onClick so "#id" still works without JS. */
export function jumpTo(e: React.MouseEvent, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE,
    behavior: reduce ? "auto" : "smooth",
  });
  history.replaceState(null, "", `#${id}`);
}

/** The resume PDF for a published profile; null in previews without a username. */
export function resumeHref(username?: string) {
  return username ? `/api/pdf?username=${encodeURIComponent(username)}` : null;
}

/* ---------- FloatingNav ---------- */

export type NavItem = { id: string; label: string };

export type NavTone = {
  /** The bar itself: background, border, blur, radius, text font. */
  bar: string;
  /** A section link at rest. */
  link: string;
  /** The current section's link text. */
  linkActive: string;
  /** The sliding highlight behind the current link. */
  pill: string;
  brand?: string;
  /** Resume / call-to-action button. */
  cta?: string;
  /** Mobile menu panel. */
  menu?: string;
  /** Bar when the page has scrolled (usually a stronger shadow/background). */
  scrolled?: string;
};

export function FloatingNav({
  brand,
  items,
  tone,
  cta,
  className,
}: {
  brand: React.ReactNode;
  /** Only the sections this page actually renders. */
  items: NavItem[];
  tone: NavTone;
  cta?: { label: string; href: string } | null;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  // The current section is the last one whose top has passed 40% of the screen. Worked out
  // from the scroll position (not an observer band) so a fast scroll can't skip a section.
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    const line = window.innerHeight * 0.4;
    let current: string | null = null;
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (el && el.getBoundingClientRect().top <= line) current = it.id;
    }
    setActive(current);
  });

  const go = (e: React.MouseEvent, id: string) => {
    setOpen(false);
    jumpTo(e, id);
  };

  return (
    <div className={cx("pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-3 sm:top-4", className)}>
      <motion.nav
        aria-label="Sections"
        initial={reduce ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={cx(
          "pointer-events-auto relative w-full max-w-5xl px-4 py-2.5 transition-[background-color,box-shadow,border-color] duration-300 sm:px-5",
          tone.bar,
          scrolled && tone.scrolled,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <a href="#top" onClick={(e) => { setOpen(false); if (!reduce) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
            className={cx("shrink-0 truncate", tone.brand)}>
            {brand}
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {items.map((it) => (
              <a key={it.id} href={`#${it.id}`} onClick={(e) => go(e, it.id)}
                aria-current={active === it.id ? "true" : undefined}
                className={cx("relative px-3.5 py-1.5 text-sm transition-colors", active === it.id ? tone.linkActive : tone.link)}>
                {active === it.id && (
                  <motion.span layoutId="pxz-nav-pill" aria-hidden className={cx("absolute inset-0", tone.pill)}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative z-10">{it.label}</span>
              </a>
            ))}
            {cta && (
              <a href={cta.href} className={cx("ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold transition", tone.cta)}>
                {cta.label}
              </a>
            )}
          </div>

          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={cx("flex h-9 w-9 items-center justify-center rounded-lg md:hidden", tone.link)}>
            <span aria-hidden className="relative block h-3 w-5">
              <span className={cx("absolute left-0 top-0 h-[2px] w-5 rounded bg-current transition", open && "translate-y-[5px] rotate-45")} />
              <span className={cx("absolute left-0 top-[5px] h-[2px] w-5 rounded bg-current transition", open && "opacity-0")} />
              <span className={cx("absolute left-0 top-[10px] h-[2px] w-5 rounded bg-current transition", open && "-translate-y-[5px] -rotate-45")} />
            </span>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden md:hidden"
            >
              <div className={cx("mt-3 flex flex-col gap-1 border-t pt-3", tone.menu)}>
                {items.map((it) => (
                  <a key={it.id} href={`#${it.id}`} onClick={(e) => go(e, it.id)}
                    className={cx("rounded-lg px-3 py-2.5 text-sm", active === it.id ? tone.linkActive : tone.link)}>
                    {it.label}
                  </a>
                ))}
                {cta && (
                  <a href={cta.href} className={cx("mt-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold", tone.cta)}>
                    {cta.label}
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

/* ---------- HeroBackdrop ---------- */

/**
 * Depth layers for a hero: a soft glow that follows the cursor, slow drifting
 * colour blobs and a grid that fades out toward the edges. Place it as the first
 * child of a `relative overflow-hidden` section.
 */
export function HeroBackdrop({
  glow,
  blobs = [],
  grid,
  gridSize = 60,
  gridOpacity = 0.06,
  className,
}: {
  /** Colour of the cursor glow, e.g. "rgba(250,204,21,0.07)". */
  glow?: string;
  /** Up to three blob colours, e.g. "rgba(250,204,21,0.12)". */
  blobs?: string[];
  /** Grid line colour; omit for no grid. */
  grid?: string;
  gridSize?: number;
  gridOpacity?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue("50%");
  const my = useMotionValue("40%");
  const bg = useMotionTemplate`radial-gradient(700px circle at ${mx} ${my}, ${glow ?? "transparent"}, transparent 60%)`;

  useEffect(() => {
    if (reduce || !glow) return;
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r || e.clientY < r.top || e.clientY > r.bottom) return; // only while over the hero
      mx.set(`${e.clientX - r.left}px`);
      my.set(`${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, glow, mx, my]);

  const spots = [
    "-top-40 -left-40 h-[520px] w-[520px]",
    "-bottom-24 -right-24 h-[460px] w-[460px]",
    "top-1/3 left-1/2 h-[360px] w-[360px]",
  ];

  return (
    <div ref={ref} aria-hidden className={cx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {blobs.slice(0, 3).map((c, i) => (
        <motion.div
          key={i}
          className={cx("absolute rounded-full blur-3xl", spots[i])}
          style={{ background: c }}
          animate={reduce ? undefined : { x: [0, i % 2 ? -40 : 40, 0], y: [0, i % 2 ? 30 : -30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 14 + i * 4, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
        />
      ))}
      {grid && (
        <div
          className="absolute inset-0"
          style={{
            opacity: gridOpacity,
            backgroundImage: `linear-gradient(to right, ${grid} 1px, transparent 1px), linear-gradient(to bottom, ${grid} 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 45%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 45%, black, transparent)",
          }}
        />
      )}
      {glow && !reduce && <motion.div className="absolute inset-0" style={{ background: bg }} />}
    </div>
  );
}

/* ---------- StatusPill ---------- */

export function StatusPill({
  children,
  className,
  dot = "bg-emerald-400",
}: {
  children: React.ReactNode;
  className?: string;
  /** Background class for the pulsing dot. */
  dot?: string;
}) {
  return (
    <span className={cx("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs", className)}>
      <span className="relative flex h-2 w-2">
        <span className={cx("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden", dot)} />
        <span className={cx("relative inline-flex h-2 w-2 rounded-full", dot)} />
      </span>
      {children}
    </span>
  );
}

/* ---------- SocialRail ---------- */

export function linkIcon(kind: string, className = "h-[18px] w-[18px]") {
  switch (kind) {
    case "github": return <GithubIcon className={className} />;
    case "linkedin": return <LinkedinIcon className={className} />;
    case "x": case "twitter": return <XIcon className={className} />;
    case "email": return <Mail className={className} />;
    case "website": return <Globe className={className} />;
    default: return <Link2 className={className} />;
  }
}

export function SocialRail({
  links,
  email,
  icon,
  line,
  className,
}: {
  links: PortfolioData["links"];
  email?: string;
  /** Classes for each icon link (colour + hover colour). */
  icon: string;
  /** Background class for the line under the icons, e.g. a gradient. */
  line: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const items = [
    ...links.slice(0, 5).map((l) => ({ key: l.url, href: l.url, label: l.label, kind: l.kind })),
    ...(email ? [{ key: "email", href: `mailto:${email}`, label: "Email", kind: "email" }] : []),
  ];
  if (!items.length) return null;
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className={cx("fixed bottom-0 left-8 z-40 hidden flex-col items-center gap-5 lg:flex", className)}
    >
      {items.map((it) => (
        <a key={it.key} href={it.href} target={it.kind === "email" ? undefined : "_blank"} rel="noopener noreferrer"
          aria-label={it.label} title={it.label}
          className={cx("transition hover:-translate-y-1", icon)}>
          {linkIcon(it.kind)}
        </a>
      ))}
      <span aria-hidden className={cx("h-24 w-px", line)} />
    </motion.div>
  );
}

/* ---------- ProjectCover ---------- */

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * A project's cover: its image with a slow zoom on hover (the parent needs the
 * `group` class), or — when there is no image or it fails to load — a cover
 * drawn from the template's palette, laid out differently per project name.
 * Children are drawn on top (title, tags, badges).
 */
export function ProjectCover({
  name,
  imageUrl,
  palette,
  base,
  ink = "rgba(255,255,255,0.10)",
  grid = "rgba(255,255,255,0.06)",
  overlay = "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.25) 50%, transparent)",
  className,
  children,
}: {
  name: string;
  imageUrl: string | null;
  /** Two or three colours the generated cover glows with. */
  palette: string[];
  /** Background colour under the generated cover. */
  base: string;
  /** Colour of the large lettering on the generated cover. */
  ink?: string;
  grid?: string;
  /** Gradient laid over the cover so text on top stays readable; "none" to skip. */
  overlay?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = !!imageUrl && !failed;
  const h = hash(name);
  const at = (n: number) => `${15 + ((h >> n) % 70)}% ${10 + ((h >> (n + 3)) % 80)}%`;
  const word = (name.split(/[\s—–:-]+/).find((w) => w.length > 1) ?? name).slice(0, 10);

  return (
    <div className={cx("relative overflow-hidden", className)} style={{ background: base }}>
      {showImage ? (
        // Any external host, so next/image (which needs allow-listed hosts) doesn't fit.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl!} alt="" loading="lazy" onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 group-hover:rotate-[0.6deg] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
      ) : (
        <div aria-hidden className="absolute inset-0 transition duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <div className="absolute inset-0" style={{
            background: palette.map((c, i) => `radial-gradient(circle at ${at(i * 5)}, ${c}, transparent 55%)`).join(","),
          }} />
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, ${grid} 1px, transparent 1px), linear-gradient(to bottom, ${grid} 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }} />
          {/* Sits high on the right, clear of the title that templates place at the bottom. */}
          <span className="absolute -right-[0.04em] top-[12%] select-none whitespace-nowrap font-black uppercase leading-none tracking-tighter"
            style={{ color: ink, fontSize: "clamp(3.5rem, 10vw, 7rem)" }}>
            {word}
          </span>
        </div>
      )}
      {overlay !== "none" && <div aria-hidden className="absolute inset-0" style={{ background: overlay }} />}
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}

/* ---------- FloatingChips ---------- */

const CHIP_SPOTS = ["-left-4 top-[8%] sm:-left-10", "-right-2 top-[46%] sm:-right-8", "left-[6%] -bottom-3"];

/**
 * Up to three small labels floating around a hero portrait (role, top skills…).
 * Put inside the portrait's `relative` wrapper. Decorative: the same facts appear
 * in the page body, so they're hidden from screen readers.
 */
export function FloatingChips({ chips, chipClass }: { chips: string[]; chipClass: string }) {
  const reduce = useReducedMotion();
  return (
    <>
      {chips.filter(Boolean).slice(0, 3).map((c, i) => (
        <motion.span
          key={c}
          aria-hidden
          className={cx("absolute z-20 max-w-[12rem] truncate whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium shadow-lg", CHIP_SPOTS[i], chipClass)}
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 0.9 + i * 0.2, duration: 0.5 },
            scale: { delay: 0.9 + i * 0.2, duration: 0.5 },
            y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i },
          }}
        >
          {c}
        </motion.span>
      ))}
    </>
  );
}
