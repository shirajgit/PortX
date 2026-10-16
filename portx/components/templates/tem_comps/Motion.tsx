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
     <ScrollProgress> reading-progress bar pinned to the top
     <CountUp>       number that ticks up when first seen
     <Float>         slow weightless bob for decorative objects
     <Parallax>      layer that drifts with page scroll
     <SplitText>     words rise out of a mask one by one
     <Avatar3D>      portrait / monogram inside orbiting 3D rings
   ------------------------------------------------------------------------ */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  useInView,
  useReducedMotion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
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
  id,
}: {
  children: React.ReactNode;
  y?: number;
  className?: string;
  /** Anchor for in-page navigation. */
  id?: string;
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
    <M id={id} className={className} variants={variants}>
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

/* ---------- ScrollProgress: thin reading-progress bar pinned to the top ---------- */
export function ScrollProgress({
  color = "linear-gradient(90deg,#67E8F9,#A78BFA,#F472B6)",
  height = 2,
}: {
  color?: string;
  height?: number;
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] origin-left print:hidden"
      style={{ scaleX, height, background: color }}
    />
  );
}

/* ---------- CountUp: number ticks up from 0 the first time it is seen ---------- */
export function CountUp({
  value,
  suffix = "",
  pad = 0,
  duration = 1.4,
  className,
}: {
  value: number;
  suffix?: string;
  pad?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const final = String(value).padStart(pad, "0") + suffix;

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v)).padStart(pad, "0") + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, pad, duration, reduce]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`} suppressHydrationWarning>
      {final}
    </span>
  );
}

/* ---------- Float: slow weightless bob for decorative 3D objects ---------- */
export function Float({
  children,
  className,
  y = 10,
  rotate = 0,
  duration = 6,
  delay = 0,
}: {
  children?: React.ReactNode;
  className?: string;
  y?: number;
  rotate?: number;
  duration?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -y, 0], rotate: [0, rotate, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Parallax: layer drifts with page scroll for depth ---------- */
export function Parallax({
  children,
  className,
  offset = 80,
}: {
  children?: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);
  return (
    <motion.div className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/* ---------- SplitText: words rise out of a mask, one after another ---------- */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.07,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ").filter(Boolean);
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom [perspective:600px]">
            <motion.span
              className="inline-block origin-bottom"
              initial={reduce ? { opacity: 0 } : { y: "105%", rotateX: -55, opacity: 0 }}
              animate={{ y: 0, rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/* ---------- Avatar3D: portrait / monogram floating inside orbiting 3D rings ----------
   The face sits forward in Z while tilted rings spin around it in real 3D
   (they pass in front of and behind the portrait). The whole object leans
   toward the cursor. Static when the visitor prefers reduced motion.      */
export function Avatar3D({
  src,
  name,
  initials,
  size = 112,
  colors = ["#67E8F9", "#A78BFA", "#F472B6"],
  shape = "circle",
  rings = 2,
  surface = "rgba(255,255,255,0.08)",
  textColor = "#FFFFFF",
  glow = 0.45,
  className,
}: {
  src?: string | null;
  name: string;
  initials: string;
  size?: number;
  colors?: string[];
  shape?: "circle" | "squircle";
  rings?: 0 | 1 | 2 | 3;
  surface?: string;
  textColor?: string;
  glow?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 16 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      rx.set((0.5 - e.clientY / window.innerHeight) * 22);
      ry.set((e.clientX / window.innerWidth - 0.5) * 28);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, rx, ry]);

  const [a, b, c] = [colors[0], colors[1] ?? colors[0], colors[2] ?? colors[0]];
  const radius = shape === "circle" ? "9999px" : "28%";
  const ringSpecs = [
    { inset: "-16%", color: a, anim: "pxz-orbit-a 9s linear infinite" },
    { inset: "-30%", color: b, anim: "pxz-orbit-b 14s linear infinite" },
    { inset: "-44%", color: c, anim: "pxz-orbit-c 19s linear infinite" },
  ].slice(0, rings);

  return (
    <div
      className={`relative shrink-0 ${className ?? ""}`}
      style={{ width: size, height: size, perspective: 900 }}
    >
      <motion.div
        className="pxz-a3d relative h-full w-full [transform-style:preserve-3d]"
        style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
      >
        {/* soft light behind the object */}
        <span
          aria-hidden
          className="absolute rounded-full blur-2xl"
          style={{
            inset: "-22%",
            opacity: glow,
            background: `conic-gradient(from 0deg, ${a}, ${b}, ${c}, ${a})`,
            transform: "translateZ(-40px)",
          }}
        />
        {/* orbit rings, each carrying a small satellite */}
        {ringSpecs.map((r, i) => (
          <span
            key={i}
            aria-hidden
            className="pxz-a3d-ring absolute rounded-full [transform-style:preserve-3d]"
            style={{ inset: r.inset, border: `1px solid ${r.color}66`, animation: r.anim }}
          >
            <span
              className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: r.color, boxShadow: `0 0 10px ${r.color}` }}
            />
          </span>
        ))}
        {/* the face */}
        <span
          className="absolute inset-0 block p-[2px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
          style={{
            borderRadius: radius,
            background: `conic-gradient(from 140deg, ${a}, ${b}, ${c}, ${a})`,
            transform: "translateZ(26px)",
          }}
        >
          <span
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
            style={{ borderRadius: radius, background: surface, color: textColor }}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-bold tracking-tight" style={{ fontSize: size * 0.32 }}>
                {initials}
              </span>
            )}
            {/* glass highlight */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 42%)",
              }}
            />
          </span>
        </span>
      </motion.div>
      <style>{`
        @keyframes pxz-orbit-a{from{transform:rotateX(70deg) rotateY(-12deg) rotateZ(0)}to{transform:rotateX(70deg) rotateY(-12deg) rotateZ(360deg)}}
        @keyframes pxz-orbit-b{from{transform:rotateX(64deg) rotateY(22deg) rotateZ(360deg)}to{transform:rotateX(64deg) rotateY(22deg) rotateZ(0)}}
        @keyframes pxz-orbit-c{from{transform:rotateX(78deg) rotateY(-30deg) rotateZ(0)}to{transform:rotateX(78deg) rotateY(-30deg) rotateZ(360deg)}}
        @keyframes pxz-a3d-bob{0%,100%{translate:0 0}50%{translate:0 -6px}}
        .pxz-a3d{animation:pxz-a3d-bob 6s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.pxz-a3d,.pxz-a3d-ring{animation:none!important}}
      `}</style>
    </div>
  );
}
