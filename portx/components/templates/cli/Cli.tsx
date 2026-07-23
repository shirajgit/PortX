"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioData, TemplateProps } from "../types";
import { useSoundEffects } from "../tem_comps/useSoundEffects";
import { MatrixRain } from "../tem_comps/MatrixRain";

type Line = { html: string };

const C = {
  text: "#F1F5F9",
  dim: "#64748B",
  blue: "#38BDF8",
  green: "#34D399",
  amber: "#FBBF24",
  red: "#F87171",
  purple: "#C084FC",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const span = (color: string, s: string) => `<span style="color:${color}">${s}</span>`;
const link = (url: string, label?: string) =>
  `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" style="color:${C.blue};text-decoration:underline;text-underline-offset:3px;font-weight:600;transition:all 0.2s;" class="hover:text-emerald-300 hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">${esc(label ?? url.replace(/^https?:\/\//, ""))}</a>`;

function buildCommands(data: PortfolioData, username: string) {
  const { profile, links, experiences, projects, skills, educations } = data;

  const whoami = (): string[] => {
    const out = [
      span(C.green, "┌─ " + esc(profile.fullName)) + (profile.headline ? span(C.dim, " ─ ") + esc(profile.headline) : ""),
    ];
    if (profile.location) out.push(span(C.dim, "├─ ") + "📍 " + esc(profile.location));
    if (profile.summary) out.push(span(C.dim, "├─ ") + esc(profile.summary));
    if (profile.openToWork) out.push(span(C.dim, "└─ ") + span(C.green, "● Status: AVAILABLE FOR WORK & FREELANCE"));
    return out;
  };

  const projectsOut = (): string[] => {
    if (projects.length === 0) return [span(C.dim, "no projects detected in filesystem")];
    const out: string[] = [];
    projects.forEach((p, i) => {
      out.push(
        span(C.amber, `[0${i + 1}]`) + " " + span(C.green, esc(p.name)) +
        (p.featured ? " " + span(C.purple, "★ FEATURED") : "")
      );
      if (p.tagline) out.push("     " + span(C.text, esc(p.tagline)));
      if (p.tech.length) out.push("     " + span(C.dim, "tech: " + esc(p.tech.join(" · "))));
      const l = [p.liveUrl && link(p.liveUrl, "live_demo ↗"), p.repoUrl && link(p.repoUrl, "source_code ↗")].filter(Boolean);
      if (l.length) out.push("     " + l.join(span(C.dim, "  |  ")));
      out.push("");
    });
    return out;
  };

  const experienceOut = (): string[] => {
    if (experiences.length === 0) return [span(C.dim, "no experience logs found")];
    const out: string[] = [];
    experiences.forEach((e) => {
      out.push(
        span(C.green, esc(e.title)) + span(C.dim, " @ ") + span(C.purple, esc(e.organization)) +
        span(C.dim, `  [${esc(e.startDate ?? "")} ── ${esc(e.endDate ?? "present")}]`)
      );
      e.bullets.forEach((b) => out.push("     " + span(C.blue, "›") + " " + esc(b)));
      out.push("");
    });
    return out;
  };

  const skillsOut = (): string[] => {
    if (skills.length === 0) return [span(C.dim, "no skill modules loaded")];
    return skills.map((s) => span(C.purple, "⚡ " + esc(s.category).padEnd(14)) + " " + esc(s.items.join(" · ")));
  };

  const educationOut = (): string[] => {
    if (educations.length === 0) return [span(C.dim, "no education credentials logged")];
    return educations.map((ed) => {
      const yr = ed.endYear ? ` (${ed.startYear ? ed.startYear + "–" : ""}${ed.endYear})` : "";
      return span(C.green, "🎓 " + esc(ed.institution)) +
        (ed.degree ? span(C.dim, " — ") + esc(ed.degree) : "") +
        span(C.dim, esc(yr) + (ed.score ? " · " + esc(ed.score) : ""));
    });
  };

  const linksOut = (): string[] => {
    const out = links.map((l) => span(C.dim, esc((l.label || l.kind).padEnd(12))) + link(l.url));
    if (profile.email) out.push(span(C.dim, "email".padEnd(12)) + link(`mailto:${profile.email}`, profile.email));
    return out.length ? out : [span(C.dim, "no external links bound")];
  };

  const help = (): string[] => [
    span(C.purple, "=== SYSTEM COMMAND MANUAL ==="),
    "  " + span(C.green, "whoami".padEnd(14)) + span(C.dim, "— display core profile telemetry"),
    "  " + span(C.green, "projects".padEnd(14)) + span(C.dim, "— list deployed modules & builds"),
    "  " + span(C.green, "experience".padEnd(14)) + span(C.dim, "— query professional track record"),
    "  " + span(C.green, "skills".padEnd(14)) + span(C.dim, "— inspect loaded tech capabilities"),
    "  " + span(C.green, "education".padEnd(14)) + span(C.dim, "— render academic credentials"),
    "  " + span(C.green, "links".padEnd(14)) + span(C.dim, "— active social & network endpoints"),
    "  " + span(C.green, "resume".padEnd(14)) + span(C.dim, "— fetch viewable / printable PDF CV"),
    "  " + span(C.green, "all".padEnd(14)) + span(C.dim, "— render full system dump"),
    "  " + span(C.green, "clear".padEnd(14)) + span(C.dim, "— flush active viewport buffer"),
  ];

  const resume = (): string[] => [
    "📄 " + link(`/${username}/resume`, "view_resume") + span(C.dim, "   |   ") +
    "⬇ " + link(`/api/pdf?username=${username}`, "download_pdf_cv"),
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
      span(C.amber, "── [01] WHOAMI ──────────────"), ...whoami(), "",
      span(C.amber, "── [02] PROJECTS ────────────"), ...projectsOut(),
      span(C.amber, "── [03] EXPERIENCE ──────────"), ...experienceOut(),
      span(C.amber, "── [04] SKILLS ──────────────"), ...skillsOut(), "",
      span(C.amber, "── [05] EDUCATION ───────────"), ...educationOut(), "",
      span(C.amber, "── [06] ENDPOINTS ───────────"), ...linksOut(),
    ],
    sudo: () => [span(C.red, `PERMISSION DENIED: user '${esc(username)}' is logged in read-only mode.`)],
    pwd: () => [`/root/users/${esc(username)}/portfolio-os`],
    date: () => [new Date().toUTCString()],
    echo: () => [span(C.dim, "echo... echo... echo...")],
    exit: () => [span(C.dim, "Termination aborted. Access strictly maintained.")],
    vim: () => [span(C.dim, "You've entered Vim mode... Press ESC + :q! to escape. Just kidding! Try ") + span(C.green, "help")],
    hello: () => [span(C.green, "Greetings, agent! 👋 Execute ") + span(C.blue, "help") + span(C.green, " to explore.")],
    hi: () => [span(C.green, "Greetings, agent! 👋 Execute ") + span(C.blue, "help") + span(C.green, " to explore.")],
  };

  return commands;
}

const CHIPS = ["whoami", "projects", "experience", "skills", "resume", "links", "help"];

export function Cli({ data, username: usernameProp }: TemplateProps) {
  const username =
    usernameProp ?? data.profile.fullName.toLowerCase().split(" ")[0];

  const { playTypeSound, playEnterSound } = useSoundEffects();
  const commands = useMemo(() => buildCommands(data, username), [data, username]);
  
  const prompt = useMemo(
    () =>
      span(C.green, "guest") + span(C.dim, "@") + span(C.blue, esc(username)) +
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
      { html: span(C.purple, "==================================================") },
      { html: span(C.green, `   PORTFOLIO-OS v3.0 (x86_64-pc-cyber-kernel)`) },
      { html: span(C.dim, `   Target: ${esc(data.profile.fullName)}`) },
      { html: span(C.purple, "==================================================") },
      { html: span(C.dim, "Type ") + span(C.green, "help") + span(C.dim, " for commands or select a shortcut chip below.") },
      { html: "" },
      { html: prompt + span(C.text, "whoami") },
      ...commands.whoami().map((html) => ({ html })),
      { html: "" },
    ];
    setLines(boot);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [lines]);

  function run(raw: string) {
    playEnterSound();
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

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    playTypeSound();
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
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#030712] px-3 py-6 font-mono text-[13.5px] leading-relaxed select-none sm:px-6 sm:py-12"
      style={{ color: C.text }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Matrix Canvas Ambient Overlay */}
      <MatrixRain />

      {/* Dynamic Glow Meshes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-sky-500/10 blur-[140px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[140px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl space-y-4">
        
        {/* Futuristic Glassmorphism Terminal Window */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070C1E]/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(56,189,248,0.15)] transition-all duration-300 hover:border-sky-500/30">
          
          {/* Top Title Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0D152D]/90 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="block h-3 w-3 rounded-full bg-[#FF5F57] shadow-[0_0_10px_#FF5F57]" />
              <span className="block h-3 w-3 rounded-full bg-[#FFB454] shadow-[0_0_10px_#FFB454]" />
              <span className="block h-3 w-3 rounded-full bg-[#39D98A] shadow-[0_0_10px_#39D98A]" />
              <span className="ml-2 text-xs font-semibold tracking-wider text-slate-400">
                TERMINAL // guest@{username}
              </span>
            </div>
            
            {/* Real-time Cyber Equalizer Animation Bar */}
            <div className="flex items-end gap-[3px] h-3 px-1" aria-hidden="true">
              <span className="w-[2px] bg-sky-400 rounded-full h-full animate-[bounce_1s_infinite]" />
              <span className="w-[2px] bg-purple-400 rounded-full h-[60%] animate-[bounce_1.2s_infinite]" />
              <span className="w-[2px] bg-emerald-400 rounded-full h-[85%] animate-[bounce_0.8s_infinite]" />
            </div>
          </div>

          {/* Interactive Output Console Engine */}
          <div className="max-h-[60vh] min-h-[460px] overflow-y-auto p-5 sm:p-7 custom-scrollbar select-text">
            {lines.map((l, i) => (
              <div
                key={i}
                className="whitespace-pre-wrap break-words mb-1 transition-all"
                dangerouslySetInnerHTML={{ __html: l.html || "&nbsp;" }}
              />
            ))}

            {/* Active Command Input Line */}
            <div className="flex items-center mt-2">
              <span dangerouslySetInnerHTML={{ __html: prompt }} />
              <input
                ref={inputRef}
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="terminal input"
                className="ml-1.5 flex-1 border-none bg-transparent outline-none select-text font-mono"
                style={{ color: C.text, caretColor: C.blue }}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Tactical Chip Shortcuts Bar */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CHIPS.map((c) => (
            <button 
              key={c} 
              onClick={(e) => { e.stopPropagation(); run(c); inputRef.current?.focus(); }}
              className="group relative overflow-hidden rounded-xl border border-sky-500/20 bg-[#0D152D]/70 px-4 py-2 text-xs font-semibold tracking-wider text-sky-400 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-500/10 hover:text-white hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] active:translate-y-0"
            >
              <span className="relative z-10">$ {c}</span>
            </button>
          ))}
        </div>

        {/* System Diagnostics Footer */}
        <p className="pt-2 text-center text-xs tracking-wider font-medium text-slate-500">
          [↑↓ history] · [tab autocomplete] · Built with Portxz
        </p>
      </div>
    </main>
  );
}