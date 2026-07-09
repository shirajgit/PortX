"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioData, TemplateProps } from "../types";

/* ── CLI Terminal template ──────────────────────────────────────────────
   Visitors explore the profile by typing commands (or clicking chips).
   Commands: help whoami projects experience skills education links
             resume contact all clear   (+ a few easter eggs)          */

type Line = { html: string };

const C = {
  text: "#E2E8F0",
  dim: "#64748B",
  blue: "#38BDF8",
  green: "#34D399",
  amber: "#FBBF24",
  red: "#F87171",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const span = (color: string, s: string) => `<span style="color:${color}">${s}</span>`;
const link = (url: string, label?: string) =>
  `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" style="color:${C.blue};text-decoration:underline;text-underline-offset:2px;font-weight:500;">${esc(label ?? url.replace(/^https?:\/\//, ""))}</a>`;

function buildCommands(data: PortfolioData, username: string) {
  const { profile, links, experiences, projects, skills, educations } = data;

  const whoami = (): string[] => {
    const out = [
      span(C.green, esc(profile.fullName)) + (profile.headline ? span(C.dim, " — ") + esc(profile.headline) : ""),
    ];
    if (profile.location) out.push(span(C.dim, "📍 " + esc(profile.location)));
    if (profile.summary) out.push("", esc(profile.summary));
    if (profile.openToWork) out.push("", span(C.green, "● open to work & freelance"));
    return out;
  };

  const projectsOut = (): string[] => {
    if (projects.length === 0) return [span(C.dim, "no projects yet")];
    const out: string[] = [];
    projects.forEach((p, i) => {
      out.push(
        span(C.amber, `[${i + 1}]`) + " " + span(C.green, esc(p.name)) +
        (p.featured ? " " + span(C.amber, "★") : "")
      );
      if (p.tagline) out.push("    " + esc(p.tagline));
      if (p.tech.length) out.push("    " + span(C.dim, esc(p.tech.join(" · "))));
      const l = [p.liveUrl && link(p.liveUrl, "live"), p.repoUrl && link(p.repoUrl, "code")].filter(Boolean);
      if (l.length) out.push("    " + l.join(span(C.dim, "  |   ")));
      out.push("");
    });
    return out;
  };

  const experienceOut = (): string[] => {
    if (experiences.length === 0) return [span(C.dim, "no experience yet")];
    const out: string[] = [];
    experiences.forEach((e) => {
      out.push(
        span(C.green, esc(e.title)) + span(C.dim, " @ ") + span(C.blue, esc(e.organization)) +
        span(C.dim, `   ${esc(e.startDate ?? "")} – ${esc(e.endDate ?? "present")}`)
      );
      e.bullets.forEach((b) => out.push("    " + span(C.dim, "›") + " " + esc(b)));
      out.push("");
    });
    return out;
  };

  const skillsOut = (): string[] => {
    if (skills.length === 0) return [span(C.dim, "no skills yet")];
    return skills.map((s) => span(C.blue, esc(s.category) + ":") + " " + esc(s.items.join(", ")));
  };

  const educationOut = (): string[] => {
    if (educations.length === 0) return [span(C.dim, "no education listed")];
    return educations.map((ed) => {
      const yr = ed.endYear ? ` (${ed.startYear ? ed.startYear + "–" : ""}${ed.endYear})` : "";
      return span(C.green, esc(ed.institution)) +
        (ed.degree ? span(C.dim, " — ") + esc(ed.degree) : "") +
        span(C.dim, esc(yr) + (ed.score ? " · " + esc(ed.score) : ""));
    });
  };

  const linksOut = (): string[] => {
    const out = links.map((l) => span(C.dim, esc((l.label || l.kind).padEnd(12))) + link(l.url));
    if (profile.email) out.push(span(C.dim, "email".padEnd(12)) + link(`mailto:${profile.email}`, profile.email));
    return out.length ? out : [span(C.dim, "no links yet")];
  };

  const help = (): string[] => [
    span(C.dim, "available commands:"),
    "  " + span(C.green, "whoami") + span(C.dim, "      — about me"),
    "  " + span(C.green, "projects") + span(C.dim, "    — things I've built"),
    "  " + span(C.green, "experience") + span(C.dim, "  — where I've worked"),
    "  " + span(C.green, "skills") + span(C.dim, "      — my tech stack"),
    "  " + span(C.green, "education") + span(C.dim, "   — where I studied"),
    "  " + span(C.green, "links") + span(C.dim, "       — find me online"),
    "  " + span(C.green, "resume") + span(C.dim, "      — view / download PDF"),
    "  " + span(C.green, "all") + span(C.dim, "         — print everything"),
    "  " + span(C.green, "clear") + span(C.dim, "       — clear the screen"),
  ];

  const resume = (): string[] => [
    "📄 " + link(`/${username}/resume`, "view resume") + span(C.dim, "   |   ") +
    "⬇ " + link(`/api/pdf?username=${username}`, "download PDF"),
  ];

  const commands: Record<string, () => string[]> = {
    help,
    whoami,
    about: whoami,
    projects: projectsOut,
    ls: projectsOut,
    experience: experienceOut,
    exp: experienceOut,
    work: experienceOut,
    skills: skillsOut,
    stack: skillsOut,
    education: educationOut,
    edu: educationOut,
    links: linksOut,
    socials: linksOut,
    contact: linksOut,
    resume,
    cv: resume,
    all: () => [
      span(C.amber, "── whoami ──────────"), ...whoami(), "",
      span(C.amber, "── projects ────────"), ...projectsOut(),
      span(C.amber, "── experience ──────"), ...experienceOut(),
      span(C.amber, "── skills ──────────"), ...skillsOut(), "",
      span(C.amber, "── education ───────"), ...educationOut(), "",
      span(C.amber, "── links ───────────"), ...linksOut(),
    ],
    sudo: () => [span(C.red, `${esc(profile.fullName.split(" ")[0].toLowerCase())} is not in the sudoers file. This incident will be reported. 😄`)],
    pwd: () => [`/home/${esc(username)}/portfolio`],
    date: () => [new Date().toString()],
    echo: () => [span(C.dim, "echo echo echo…")],
    exit: () => [span(C.dim, "nice try. there is no escape — only ") + span(C.green, "projects") + span(C.dim, ".")],
    vim: () => [span(C.dim, "you are now stuck in vim. just kidding — try ") + span(C.green, "help")],
    hello: () => [span(C.green, "hey! 👋 type ") + span(C.blue, "help") + span(C.green, " to look around")],
    hi: () => [span(C.green, "hey! 👋 type ") + span(C.blue, "help") + span(C.green, " to look around")],
  };

  return commands;
}

const CHIPS = ["whoami", "projects", "experience", "skills", "resume", "links", "help"];

export function Cli({ data, username: usernameProp }: TemplateProps) {
  const username =
    usernameProp ?? data.profile.fullName.toLowerCase().split(" ")[0];

  const commands = useMemo(() => buildCommands(data, username), [data, username]);
  const prompt = useMemo(
    () =>
      span(C.green, "visitor") + span(C.dim, "@") + span(C.blue, esc(username)) +
      span(C.dim, ":~$ "),
    [username]
  );

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boot: Line[] = [
      { html: span(C.dim, `portfolio-os v2.0 — ${esc(data.profile.fullName)}`) },
      { html: span(C.dim, "type ") + span(C.green, "help") + span(C.dim, " for commands, or click a chip below") },
      { html: "" },
      { html: prompt + span(C.text, "whoami") },
      ...commands.whoami().map((html) => ({ html })),
      { html: "" },
    ];
    setLines(boot);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const out: Line[] = [{ html: prompt + span(C.text, esc(raw)) }];

    if (cmd === "clear" || cmd === "cls") {
      setLines([]);
      return;
    }
    if (cmd === "") {
      setLines((l) => [...l, ...out]);
      return;
    }

    const fn = commands[cmd];
    if (fn) {
      fn().forEach((html) => out.push({ html }));
    } else {
      out.push({
        html:
          span(C.red, `command not found: ${esc(cmd)}`) +
          span(C.dim, " — try ") + span(C.green, "help"),
      });
    }
    out.push({ html: "" });
    setLines((l) => [...l, ...out]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const v = input;
      if (v.trim()) {
        setHistory((h) => [v, ...h].slice(0, 50));
      }
      setHistIdx(-1);
      setInput("");
      run(v);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (history[next] !== undefined) { setHistIdx(next); setInput(history[next]); }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      if (next < 0) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(next); setInput(history[next]); }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = Object.keys(commands).find((c) => c.startsWith(input.toLowerCase()) && input.length > 0);
      if (match) setInput(match);
    }
  }

  return (
    <main
      className="min-h-screen bg-[#040612] px-3 py-6 font-mono text-[13.5px] leading-relaxed sm:px-6 sm:py-12 relative overflow-hidden flex flex-col justify-center select-none"
      style={{ color: C.text }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Dynamic Animated Ambient Light Meshes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-sky-500/10 blur-[130px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[130px] animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="mx-auto w-full max-w-3xl relative z-10 space-y-4">
        
        {/* Immersive Glassmorphism Terminal Window Frame */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070d1e]/50 backdrop-blur-2xl shadow-[0_32px_64px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/[0.12]">
          
          {/* Top Title Bar with Interactive Status Signals */}
          <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0c142b]/70 px-4 py-3.5">
            <div className="flex items-center gap-2">
              <i className="block h-3 w-3 rounded-full bg-[#FF5F57] shadow-[0_0_8px_#FF5F57/50]" />
              <i className="block h-3 w-3 rounded-full bg-[#FFB454] shadow-[0_0_8px_#FFB454/50]" />
              <i className="block h-3 w-3 rounded-full bg-[#39D98A] shadow-[0_0_8px_#39D98A/50]" />
              <span className="ml-2 text-xs font-medium tracking-wide" style={{ color: C.dim }}>
                visitor@{username} — portfolio-os
              </span>
            </div>
            
            {/* High-Tech Equalizer Visualization Animation Block */}
            <div className="flex items-end gap-[3px] h-3 px-1" aria-hidden="true">
              <span className="w-[2px] bg-sky-400/60 rounded-full h-full animate-[pulse_0.8s_infinite_alternate]" />
              <span className="w-[2px] bg-sky-400/60 rounded-full h-[60%] animate-[pulse_1.1s_infinite_alternate]" />
              <span className="w-[2px] bg-sky-400/60 rounded-full h-[85%] animate-[pulse_0.9s_infinite_alternate]" />
            </div>
          </div>

          {/* Core CLI Dynamic Output Log Viewport */}
          <div className="max-h-[65vh] min-h-[440px] overflow-y-auto bg-transparent p-5 sm:p-7 custom-scrollbar select-text">
            {lines.map((l, i) => (
              <div key={i} className="whitespace-pre-wrap break-words mb-1"
                dangerouslySetInnerHTML={{ __html: l.html || "&nbsp;" }} />
            ))}

            {/* Live Terminal Active Action Line */}
            <div className="flex items-center mt-1">
              <span dangerouslySetInnerHTML={{ __html: prompt }} />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="terminal command input"
                className="ml-1 flex-1 border-none bg-transparent outline-none select-text"
                style={{ color: C.text, caretColor: C.blue }}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* High-Fidelity Tactical Chip Shortcuts */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CHIPS.map((c) => (
            <button 
              key={c} 
              onClick={(e) => { e.stopPropagation(); run(c); inputRef.current?.focus(); }}
              className="rounded-xl border border-white/[0.05] bg-[#0c142b]/60 px-4 py-2 text-xs font-medium tracking-wide shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-500/40 hover:bg-[#111c3a]/80 active:translate-y-0"
              style={{ color: C.blue }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Operational System Footer Data */}
        <p className="pt-2 text-center text-xs tracking-wider font-medium opacity-80" style={{ color: C.dim }}>
          ↑↓ history  ·  tab complete  ·  built with Portxz
        </p>
      </div>
    </main>
  );
}