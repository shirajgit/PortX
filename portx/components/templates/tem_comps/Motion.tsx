"use client";

/* ── Portxz premium motion toolkit ───────────────────────────────────────
   Shared, reduced-motion-safe animation primitives for every template.
   Built on framer-motion. Import what a template needs; each primitive
   degrades gracefully when the visitor prefers reduced motion, and every
   value is deterministic so SSR and client hydration always match.

   Primitives:
     <Reveal>        fade + rise as it scrolls into view
     <Stagger>/<Item> orchestrated reveal of a list of children
     <TiltCard>      subtle 3D tilt toward the cursor + glare
     <Magnetic>      element eases toward the cursor on hover
     <GradientText>  animated multi-stop shimmer text
     <Spotlight>     cursor-following radial glow layer for a container
     <Marquee>       seamless infinite scroll strip (e.g. tech stack)
   ------------------------------------------------------------------------ */

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  type Variants,
} from "framer-motion";

/* ---------- Reveal: fade + rise on scroll into view ---------- */
export function Reveal({
  children,
  y = 24,
  delay = 0,
  duration = 0.6,
  once = true,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  y?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav" | "article" | "aside" | "li" | "ul" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/* ---------- Stagger: orchestrate a list of <Item> children ---------- */
const staggerParent = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export function Stagger({
  children,
  stagger = 0.08,
  delay = 0,
  className,
  once = true,
}: {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function Item({
  children,
  y = 20,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article" | "span";
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <M className={className} variants={variants}>
      {children}
    </M>
  );
}

/* ---------- TiltCard: 3D tilt toward cursor + moving glare ---------- */
export function TiltCard({
  children,
  className,
  max = 7,
  glare = true,
  glareColor = "rgba(255,255,255,0.14)",
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  glareColor?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareBg = useMotionTemplate`radial-gradient(240px circle at ${gx}% ${gy}%, ${glareColor}, transparent 65%)`;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        rx.set((0.5 - py) * max * 2);
        ry.set((px - 0.5) * max * 2);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
        gx.set(50);
        gy.set(50);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`relative [transform-style:preserve-3d] ${className ?? ""}`}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}

/* ---------- Magnetic: element eases toward cursor on hover ---------- */
export function Magnetic({
  children,
  className,
  strength = 0.35,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: "div" | "a" | "span" | "button";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 20 });
  const M = motion[as] as typeof motion.div;

  if (reduce) return <span className={className}>{children}</span>;

  return (
    <M
      ref={ref as never}
      className={className}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={(e: React.MouseEvent) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </M>
  );
}

/* ---------- GradientText: animated shimmer across a gradient ---------- */
export function GradientText({
  children,
  colors = ["#67E8F9", "#A78BFA", "#F472B6", "#67E8F9"],
  className,
  duration = 6,
}: {
  children: React.ReactNode;
  colors?: string[];
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <span
      className={`bg-clip-text text-transparent ${className ?? ""}`}
      style={{
        backgroundImage: `linear-gradient(110deg, ${colors.join(", ")})`,
        backgroundSize: "200% auto",
        animation: reduce ? undefined : `pxz-shimmer ${duration}s linear infinite`,
      }}
    >
      {children}
      <style>{`@keyframes pxz-shimmer{to{background-position:200% center}}`}</style>
    </span>
  );
}

/* ---------- Spotlight: cursor-following radial glow over a container ---------- */
export function Spotlight({
  children,
  className,
  color = "rgba(120,160,255,0.12)",
  size = 460,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(${size}px circle at ${mx}px ${my}px, ${color}, transparent 70%)`;

  return (
    <div
      className={`relative ${className ?? ""}`}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
        if (!on) setOn(true);
      }}
      onMouseLeave={() => setOn(false)}
    >
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{ background: bg, opacity: on ? 1 : 0 }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ---------- Marquee: seamless infinite scroll strip ---------- */
export function Marquee({
  children,
  speed = 28,
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={`flex flex-wrap gap-3 ${className ?? ""}`}>{children}</div>;
  }
  return (
    <div className={`group relative flex overflow-hidden ${className ?? ""}`}>
      <div
        className="flex shrink-0 items-center gap-3 pr-3 group-hover:[animation-play-state:paused]"
        style={{ animation: `pxz-marquee ${speed}s linear infinite`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 items-center gap-3 pr-3 group-hover:[animation-play-state:paused]"
        style={{ animation: `pxz-marquee ${speed}s linear infinite`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {children}
      </div>
      <style>{`@keyframes pxz-marquee{from{transform:translateX(0)}to{transform:translateX(-100%)}}`}</style>
    </div>
  );
}
