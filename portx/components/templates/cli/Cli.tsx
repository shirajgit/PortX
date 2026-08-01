"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioData, TemplateProps } from "../types";
import { useSoundEffects } from "../tem_comps/useSoundEffects";
import { MatrixRain } from "../tem_comps/MatrixRain";

/* ── Portxz · CLI flagship template ───────────────────────────────────────
   An interactive "developer OS" terminal. Boots with a typed sequence, then
   accepts typed or clicked commands. All motion is reduced-motion safe and
   fully SSR-stable — no Date/Math.random during render (clock + boot live
   inside effects). Output is rendered as pre-escaped HTML strings so the
   syntax-highlight accents and external links stay declarative.
   ------------------------------------------------------------------------ */

type Line = { id: number; html: string; delay: number };

const C = {
  text: "#E2E8F0",
  dim: "#64748B",
  faint: "#475569",
  blue: "#38BDF8",
  cyan: "#22D3EE",
  green: "#34D399",
  amber: "#FBBF24",
  red: "#F87171",
  purple: "#C084FC",
  pink: "#F472B6",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const span = (color: string, s: string) =>
  `<span style="color:${color}">${s}</span>`;

const link = (url: string, label?: string) =>
  `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" style="color:${C.cyan};text-decoration:underline;text-underline-offset:3px;font-weight:600" class="pxz-cli-a">${esc(
    label ?? url.replace(/^https?:\/\//, "")
  )}</a>`;

const pad = (s: string, n: number) => (s.length >= n ? s : s + " ".repeat(n - s.length));

type Cmd = { run: () => string[]; desc: string };

function buildCommands(data: PortfolioData, username: string) {
  const { profile, links, experiences, projects, skills, educations } = data;

  const whoami = (): string[] => {
    const out: string[] = [
      span(C.green, "╭─ ") + span(C.text, esc(profile.fullName)) +
        (profile.headline ? span(C.dim, "  —  ") + span(C.blue, esc(profile.headline)) : ""),
    ];
    if (profile.location) out.push(span(C.green, "│  ") + span(C.dim, "location  ") + esc(profile.location));
    if (profile.email)
      out.push(span(C.green, "│  ") + span(C.dim, "email     ") + link(`mailto:${profile.email}`, profile.email));
    if (profile.summary) {
      out.push(span(C.green, "│"));
      out.push(span(C.green, "│  ") + span(C.text, esc(profile.summary)));
    }
    out.push(
      span(C.green, "╰─ ") +
        (profile.openToWork
          ? span(C.green, "● available for work & freelance")
          : span(C.dim, "○ not actively looking"))
    );
    return out;
  };

  const projectsOut = (): string[] => {
    const out: string[] = [];
    projects.forEach((p, i) => {
      const idx = String(i + 1).padStart(2, "0");
      out.push(
        span(C.amber, `[${idx}] `) +
          span(C.green, esc(p.name)) +
          (p.featured ? span(C.purple, "  ★ featured") : "") +
          (p.tagline ? span(C.dim, "  — ") + span(C.text, esc(p.tagline)) : "")
      );
      if (p.description) out.push("     " + span(C.dim, esc(p.description)));
      p.bullets.forEach((b) => out.push("     " + span(C.blue, "› ") + span(C.text, esc(b))));
      if (p.tech.length)
        out.push(
          "     " + p.tech.map((t) => span(C.cyan, "#" + esc(t))).join(span(C.dim, " "))
        );
      const l = [
        p.liveUrl && link(p.liveUrl, "live ↗"),
        p.repoUrl && link(p.repoUrl, "source ↗"),
      ].filter(Boolean) as string[];
      if (l.length) out.push("     " + l.join(span(C.faint, "   ")));
      out.push("");
    });
    return out;
  };

  const experienceOut = (): string[] => {
    const out: string[] = [];
    experiences.forEach((e, i) => {
      const range = `${e.startDate ?? ""} ${span(C.faint, "→")} ${e.endDate ?? "present"}`;
      out.push(
        span(C.green, esc(e.title)) +
          span(C.dim, " @ ") +
          span(C.purple, esc(e.organization)) +
          (e.location ? span(C.faint, "  · " + esc(e.location)) : "")
      );
      out.push(span(C.amber, esc((e.startDate ?? "").trim() ? "" : "")) + span(C.dim, range));
      e.bullets.forEach((b) => out.push("   " + span(C.blue, "▸ ") + span(C.text, esc(b))));
      if (i < experiences.length - 1) out.push("");
    });
    return out;
  };

  const skillsOut = (): string[] =>
    skills.map(
      (s) =>
        span(C.purple, "⚡ " + pad(esc(s.category), 16)) +
        span(C.text, s.items.join(span(C.faint, " · ")))
    );

  const educationOut = (): string[] =>
    educations.map((ed) => {
      const yr =
        ed.startYear || ed.endYear
          ? span(C.dim, `  (${ed.startYear ?? ""}${ed.startYear && ed.endYear ? "–" : ""}${ed.endYear ?? ""})`)
          : "";
      return (
        span(C.green, "🎓 " + esc(ed.institution)) +
        (ed.degree ? span(C.dim, " — ") + span(C.text, esc(ed.degree)) : "") +
        yr +
        (ed.score ? span(C.amber, "  · " + esc(ed.score)) : "")
      );
    });

  const contactOut = (): string[] => {
    const out = links.map(
      (l) => span(C.dim, pad(esc(l.label || l.kind), 14)) + link(l.url)
    );
    if (profile.email)
      out.push(span(C.dim, pad("email", 14)) + link(`mailto:${profile.email}`, profile.email));
    return out.length ? out : [span(C.dim, "no contact endpoints bound")];
  };

  const resume = (): string[] => [
    span(C.text, "📄 ") +
      link(`/${username}/resume`, "view resume") +
      span(C.faint, "     ") +
      span(C.text, "⬇ ") +
      link(`/api/pdf?username=${username}`, "download PDF"),
  ];

  const has = {
    projects: projects.length > 0,
    experience: experiences.length > 0,
    skills: skills.length > 0,
    education: educations.length > 0,
    contact: links.length > 0 || Boolean(profile.email),
  };

  const commands: Record<string, Cmd> = {
    about: { run: whoami, desc: "core profile & status" },
    help: { run: () => [], desc: "list available commands" },
  };
  if (has.projects) commands.projects = { run: projectsOut, desc: "deployed builds & repos" };
  if (has.experience) commands.experience = { run: experienceOut, desc: "professional track record" };
  if (has.skills) commands.skills = { run: skillsOut, desc: "loaded tech capabilities" };
  if (has.education) commands.education = { run: educationOut, desc: "academic credentials" };
  if (has.contact) commands.contact = { run: contactOut, desc: "social & network endpoints" };
  commands.resume = { run: resume, desc: "view / download CV" };

  // help output depends on the assembled command set
  commands.help.run = () => {
    const order = ["about", "projects", "experience", "skills", "education", "contact", "resume", "clear"];
    const rows = order
      .filter((k) => k === "clear" || commands[k])
      .map((k) => {
        const desc = k === "clear" ? "flush the viewport buffer" : commands[k].desc;
        return "  " + span(C.green, pad(k, 14)) + span(C.dim, "— " + desc);
      });
    return [span(C.purple, "available commands"), ...rows, "", span(C.faint, "tip: press Tab to autocomplete · ↑ ↓ to recall history")];
  };

  // aliases
  const alias = (name: string, target: string) => {
    if (commands[target]) commands[name] = commands[target];
  };
  alias("whoami", "about");
  alias("ls", "projects");
  alias("exp", "experience");
  alias("work", "experience");
  alias("stack", "skills");
  alias("edu", "education");
  alias("links", "contact");
  alias("socials", "contact");
  alias("cv", "resume");

  commands.all = {
    desc: "render full system dump",
    run: () => {
      const sec = (n: number, label: string, body: string[]) =>
        body.length
          ? [span(C.amber, `── [${String(n).padStart(2, "0")}] ${label} ` + "─".repeat(Math.max(0, 22 - label.length))), ...body, ""]
          : [];
      let n = 0;
      return [
        ...sec(++n, "ABOUT", whoami()),
        ...(has.projects ? sec(++n, "PROJECTS", projectsOut()) : []),
        ...(has.experience ? sec(++n, "EXPERIENCE", experienceOut()) : []),
        ...(has.skills ? sec(++n, "SKILLS", skillsOut()) : []),
        ...(has.education ? sec(++n, "EDUCATION", educationOut()) : []),
        ...(has.contact ? sec(++n, "CONTACT", contactOut()) : []),
      ];
    },
  };

  // easter eggs / unix flavour
  commands.pwd = { run: () => [`/home/${esc(username)}/portfolio`], desc: "" };
  commands.sudo = { run: () => [span(C.red, `Permission denied: '${esc(username)}' is a read-only guest session.`)], desc: "" };
  commands.echo = { run: () => [span(C.dim, "echo … echo … echo …")], desc: "" };
  commands.exit = { run: () => [span(C.dim, "logout aborted — you can't leave a good portfolio.")], desc: "" };
  commands.vim = { run: () => [span(C.dim, "Trapped in Vim? Press ESC :q! — or just run ") + span(C.green, "help")], desc: "" };
  commands.hello = { run: () => [span(C.green, "Hey there 👋  run ") + span(C.blue, "help") + span(C.green, " to explore.")], desc: "" };
  alias("hi", "hello");

  return { commands, has };
}

export function Cli({ data, username: usernameProp }: TemplateProps) {
  const username =
    usernameProp ?? (data.profile.fullName.toLowerCase().split(" ")[0] || "guest");

  const { playTypeSound, playEnterSound } = useSoundEffects();
  const { commands, has } = useMemo(() => buildCommands(data, username), [data, username]);

  const prompt = useMemo(
    () =>
      span(C.green, "guest") +
      span(C.faint, "@") +
      span(C.blue, esc(username)) +
      span(C.faint, ":") +
      span(C.purple, "~") +
      span(C.faint, "$ "),
    [username]
  );

  const promptLine = (cmd: string) => prompt + span(C.text, esc(cmd));

  const idRef = useRef(0);
  const mkLines = (htmls: string[], stagger = true): Line[] =>
    htmls.map((html, i) => ({
      id: idRef.current++,
      html,
      delay: stagger ? Math.min(i * 0.028, 0.5) : 0,
    }));

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [booted, setBooted] = useState(false);
  const [bootCmd, setBootCmd] = useState<string | null>(null);
  const [clock, setClock] = useState("--:--:--");

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── boot sequence (client-only, cancel-safe) ── */
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)));
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const header: string[] = [
      span(C.dim, "Portxz OS ") + span(C.green, "v4.0") + span(C.dim, " — booting developer environment…"),
      span(C.faint, "[ ") + span(C.green, "ok") + span(C.faint, " ] ") + span(C.dim, "mounting /profile"),
      span(C.faint, "[ ") + span(C.green, "ok") + span(C.faint, " ] ") + span(C.dim, "loading modules: projects, experience, skills"),
      span(C.faint, "[ ") + span(C.green, "ok") + span(C.faint, " ] ") + span(C.dim, "secure session established · guest@" + esc(username)),
      "",
      span(C.dim, "Welcome to ") + span(C.text, esc(data.profile.fullName)) + span(C.dim, "'s portfolio. Type ") + span(C.green, "help") + span(C.dim, " or click a command below."),
      "",
    ];

    async function boot() {
      if (reduce) {
        setLines(mkLines([...header, promptLine("about"), ...commands.about.run(), ""], false));
        setBooted(true);
        return;
      }
      for (const h of header) {
        if (cancelled) return;
        setLines((l) => [...l, ...mkLines([h], false)]);
        await wait(140);
      }
      // typed prompt: "about"
      const target = "about";
      setBootCmd("");
      await wait(360);
      for (let i = 1; i <= target.length; i++) {
        if (cancelled) return;
        setBootCmd(target.slice(0, i));
        await wait(95);
      }
      await wait(340);
      if (cancelled) return;
      setBootCmd(null);
      setLines((l) => [...l, ...mkLines([promptLine(target)], false), ...mkLines(commands.about.run()), ...mkLines([""], false)]);
      setBooted(true);
      inputRef.current?.focus();
    }
    void boot();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── live clock (client-only) ── */
  useEffect(() => {
    const p2 = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const d = new Date();
      setClock(`${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── keep viewport pinned to the latest output ── */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    else bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines, bootCmd]);

  function run(raw: string) {
    playEnterSound();
    const cmd = raw.trim().toLowerCase();

    if (cmd === "clear" || cmd === "cls") {
      idRef.current = 0;
      setLines([]);
      return;
    }
    if (cmd === "") {
      setLines((l) => [...l, ...mkLines([promptLine("")], false)]);
      return;
    }

    const entry = commands[cmd];
    const body = entry
      ? entry.run()
      : [
          span(C.red, `command not found: ${esc(cmd)}`) +
            span(C.dim, " — try ") +
            span(C.green, "help"),
        ];
    setLines((l) => [
      ...l,
      ...mkLines([promptLine(raw)], false),
      ...mkLines(body),
      ...mkLines([""], false),
    ]);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    playTypeSound();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const v = input;
      if (v.trim()) setHistory((h) => [v, ...h].slice(0, 50));
      setHistIdx(-1);
      setInput("");
      run(v);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (history[next] !== undefined) {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      if (next < 0) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!input) return;
      const match = Object.keys(commands).find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  }

  const chips = [
    "about",
    has.projects && "projects",
    has.experience && "experience",
    has.skills && "skills",
    has.education && "education",
    has.contact && "contact",
    "resume",
    "help",
  ].filter(Boolean) as string[];

  return (
    <main
      className="pxz-cli relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#030712] px-3 py-6 font-mono text-[13.5px] leading-relaxed sm:px-6 sm:py-12"
      style={{ color: C.text }}
      onClick={() => inputRef.current?.focus()}
    >
      <MatrixRain />

      {/* ambient glow meshes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="pxz-cli-mesh absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="pxz-cli-mesh2 absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl space-y-4">
        {/* terminal window */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070C1E]/80 shadow-[0_0_60px_rgba(56,189,248,0.15)] backdrop-blur-2xl transition-colors duration-300 hover:border-sky-500/30">
          {/* top glow line */}
          <div aria-hidden className="pxz-cli-topglow h-px w-full bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />

          {/* title bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0D152D]/90 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="block h-3 w-3 rounded-full bg-[#FF5F57] shadow-[0_0_10px_#FF5F57]" />
              <span className="block h-3 w-3 rounded-full bg-[#FFB454] shadow-[0_0_10px_#FFB454]" />
              <span className="block h-3 w-3 rounded-full bg-[#39D98A] shadow-[0_0_10px_#39D98A]" />
              <span className="ml-3 text-xs font-semibold tracking-wider text-slate-400">
                guest@{username}: ~/portfolio
              </span>
            </div>
            <div className="flex items-end gap-[3px] h-3 px-1" aria-hidden="true">
              <span className="pxz-eq w-[2px] rounded-full bg-sky-400" style={{ height: "100%", animationDelay: "0s" }} />
              <span className="pxz-eq w-[2px] rounded-full bg-purple-400" style={{ height: "60%", animationDelay: ".2s" }} />
              <span className="pxz-eq w-[2px] rounded-full bg-emerald-400" style={{ height: "85%", animationDelay: ".05s" }} />
              <span className="pxz-eq w-[2px] rounded-full bg-cyan-400" style={{ height: "45%", animationDelay: ".3s" }} />
            </div>
          </div>

          {/* console */}
          <div
            ref={scrollRef}
            className="pxz-cli-console custom-scrollbar relative max-h-[62vh] min-h-[460px] select-text overflow-y-auto p-5 sm:p-7"
          >
            {/* CRT layers — behind content, pointer-events none */}
            <div aria-hidden className="pxz-cli-scanlines pointer-events-none absolute inset-0 z-0" />
            <div aria-hidden className="pxz-cli-vignette pointer-events-none absolute inset-0 z-0" />

            <div className="relative z-10" role="log" aria-live="polite" aria-label="terminal output">
              {lines.map((l) => (
                <div
                  key={l.id}
                  className="pxz-cli-line mb-1 whitespace-pre-wrap break-words"
                  style={{ animationDelay: `${l.delay}s` }}
                  dangerouslySetInnerHTML={{ __html: l.html || "&nbsp;" }}
                />
              ))}

              {/* boot typing line (before interactive prompt is ready) */}
              {!booted && bootCmd !== null && (
                <div className="whitespace-pre-wrap break-words">
                  <span dangerouslySetInnerHTML={{ __html: prompt }} />
                  <span style={{ color: C.text }}>{bootCmd}</span>
                  <span className="pxz-caret" aria-hidden>
                    ▋
                  </span>
                </div>
              )}

              {/* interactive input line */}
              {booted && (
                <div className="mt-1 flex items-center">
                  <span dangerouslySetInnerHTML={{ __html: prompt }} />
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="terminal command input"
                    className="ml-1 flex-1 select-text border-none bg-transparent font-mono outline-none"
                    style={{ color: C.text, caretColor: C.cyan }}
                  />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* status bar */}
          <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#0D152D]/90 px-4 py-2 text-[11px] tracking-wider text-slate-500">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="pxz-pulse block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                online
              </span>
              <span aria-hidden className="text-slate-700">
                |
              </span>
              <span className="hidden sm:inline">utf-8</span>
              <span aria-hidden className="hidden text-slate-700 sm:inline">
                |
              </span>
              <span className="hidden sm:inline">{Object.keys(commands).length} cmds</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">guest@{username}</span>
              <span aria-hidden className="text-slate-700">
                |
              </span>
              <span className="tabular-nums text-sky-400" suppressHydrationWarning>
                {clock}
              </span>
            </div>
          </div>
        </div>

        {/* command chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`run ${c} command`}
              onClick={(e) => {
                e.stopPropagation();
                run(c);
                inputRef.current?.focus();
              }}
              className="group relative overflow-hidden rounded-xl border border-sky-500/20 bg-[#0D152D]/70 px-4 py-2 text-xs font-semibold tracking-wider text-sky-400 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-500/10 hover:text-white hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 active:translate-y-0"
            >
              <span className="relative z-10">$ {c}</span>
            </button>
          ))}
        </div>

        <p className="pt-1 text-center text-[11px] font-medium tracking-wider text-slate-500">
          [ type a command ] · [ ↑ ↓ history ] · [ tab autocomplete ] · built with Portxz
        </p>
      </div>

      <style>{`
        .pxz-cli-a:hover { color: ${C.green} !important; text-shadow: 0 0 8px rgba(52,211,153,.6); }
        @keyframes pxz-cli-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .pxz-cli-line { animation: pxz-cli-in .34s cubic-bezier(.22,1,.36,1) both; }
        @keyframes pxz-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
        .pxz-caret { color: ${C.cyan}; animation: pxz-blink 1s steps(1) infinite; }
        @keyframes pxz-pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
        .pxz-pulse { animation: pxz-pulse 2s ease-in-out infinite; }
        @keyframes pxz-eqbounce { 0%,100% { transform: scaleY(.5); } 50% { transform: scaleY(1); } }
        .pxz-eq { transform-origin: bottom; animation: pxz-eqbounce .9s ease-in-out infinite; }
        @keyframes pxz-mesh { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
        .pxz-cli-mesh { animation: pxz-mesh 8s ease-in-out infinite; }
        .pxz-cli-mesh2 { animation: pxz-mesh 10s ease-in-out infinite; }
        @keyframes pxz-topglow { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
        .pxz-cli-topglow { animation: pxz-topglow 4s ease-in-out infinite; }
        .pxz-cli-vignette { box-shadow: inset 0 0 120px 24px rgba(3,7,18,.9); }
        .pxz-cli-scanlines {
          background-image: repeating-linear-gradient(to bottom, rgba(148,197,255,.04) 0, rgba(148,197,255,.04) 1px, transparent 1px, transparent 3px);
          opacity: .5; mix-blend-mode: overlay;
          animation: pxz-scan 8s linear infinite;
        }
        @keyframes pxz-scan { from { background-position: 0 0; } to { background-position: 0 60px; } }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(56,189,248,.25); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,.45); }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        @media (prefers-reduced-motion: reduce) {
          .pxz-cli-line, .pxz-caret, .pxz-pulse, .pxz-eq, .pxz-cli-mesh, .pxz-cli-mesh2,
          .pxz-cli-topglow, .pxz-cli-scanlines { animation: none !important; }
          .pxz-cli-line { opacity: 1 !important; transform: none !important; }
          .pxz-caret { opacity: 1; }
        }
      `}</style>
    </main>
  );
}
