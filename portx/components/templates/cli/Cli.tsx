"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioData, TemplateProps } from "../types";

/* ── CLI Terminal template ──────────────────────────────────────────────
   Visitors explore the profile by typing commands (or clicking chips).
   Commands: help whoami projects experience skills education links
             resume contact all clear   (+ a few easter eggs)          */

type Line = { html: string };

const C = {
  text: "#C9D6EE",
  dim: "#6B7A99",
  blue: "#4DA6FF",
  green: "#39D98A",
  amber: "#FFB454",
  red: "#FF6B6B",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const span = (color: string, s: string) => `<span style="color:${color}">${s}</span>`;
const link = (url: string, label?: string) =>
  `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" style="color:${C.blue};text-decoration:underline">${esc(label ?? url.replace(/^https?:\/\//, ""))}</a>`;

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
      if (l.length) out.push("    " + l.join(span(C.dim, "  |  ")));
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
    // easter eggs
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

  // boot sequence + auto-run whoami so crawlers & lurkers see content
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      className="min-h-screen bg-[#070C1A] px-3 py-6 font-mono text-[13.5px] leading-relaxed sm:px-6 sm:py-10"
      style={{ color: C.text }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mx-auto max-w-3xl">
        {/* window frame */}
        <div className="overflow-hidden rounded-xl border border-[#1E2C52] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 border-b border-[#1E2C52] bg-[#0F1730] px-4 py-3">
            <i className="block h-3 w-3 rounded-full bg-[#FF5F57]" />
            <i className="block h-3 w-3 rounded-full bg-[#FFB454]" />
            <i className="block h-3 w-3 rounded-full bg-[#39D98A]" />
            <span className="ml-2 text-xs" style={{ color: C.dim }}>
              visitor@{username} — portfolio
            </span>
          </div>

          <div className="max-h-[70vh] min-h-[420px] overflow-y-auto bg-[#070C1A] p-4 sm:p-6">
            {lines.map((l, i) => (
              <div key={i} className="whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: l.html || "&nbsp;" }} />
            ))}

            {/* prompt */}
            <div className="flex items-center">
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
                className="ml-1 flex-1 border-none bg-transparent outline-none"
                style={{ color: C.text, caretColor: C.blue }}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        {/* clickable chips for non-typers / mobile */}
        <div className="mt-4 flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <button key={c} onClick={(e) => { e.stopPropagation(); run(c); inputRef.current?.focus(); }}
              className="rounded-md border border-[#1E2C52] bg-[#0F1730] px-3 py-1.5 text-xs hover:border-[#4DA6FF]"
              style={{ color: C.blue }}>
              {c}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: C.dim }}>
          ↑↓ history · tab complete · built with portX
        </p>
      </div>
    </main>
  );
}
