import type { PortfolioData } from "@/components/templates/types";
import { SITE_NAME } from "@/lib/site";

/* README.md generator — another renderer of PortfolioData.
   Same data as the portfolio, resume, and PDF, styled like a classic
   GitHub profile README: wave banner, typing intro, skill icons, stats. */

const ACCENT = "4F8BFF";
const VIOLET = "7C6BFF";
const TEXT = "8C95AB";
const GRADIENT = "0:3B9BFF,50:5B5BF6,100:A16BFF";

const SOCIAL: Record<string, { logo: string; color: string }> = {
  github: { logo: "github", color: "181717" },
  linkedin: { logo: "linkedin", color: "0A66C2" },
  x: { logo: "x", color: "000000" },
  twitter: { logo: "x", color: "000000" },
  website: { logo: "googlechrome", color: ACCENT },
  email: { logo: "gmail", color: "EA4335" },
  custom: { logo: "link", color: VIOLET },
};

const SECTION_EMOJI: Record<string, string> = {
  certifications: "🏅",
  awards: "🏆",
  volunteering: "🤝",
  languages: "🗣️",
  publications: "📚",
  custom: "✨",
};

/* skill name (normalised) → skillicons.dev id */
const SKILL_ICONS: Record<string, string> = {
  javascript: "js", js: "js", typescript: "ts", ts: "ts", react: "react", reactjs: "react", reactnative: "react",
  nextjs: "nextjs", next: "nextjs", nodejs: "nodejs", node: "nodejs", html: "html", html5: "html", css: "css",
  css3: "css", tailwind: "tailwind", tailwindcss: "tailwind", sass: "sass", scss: "sass", bootstrap: "bootstrap",
  python: "py", py: "py", java: "java", c: "c", "c++": "cpp", cpp: "cpp", "c#": "cs", csharp: "cs", go: "go",
  golang: "go", rust: "rust", php: "php", ruby: "ruby", kotlin: "kotlin", swift: "swift", dart: "dart",
  flutter: "flutter", vue: "vue", vuejs: "vue", angular: "angular", svelte: "svelte", express: "express",
  expressjs: "express", nestjs: "nestjs", django: "django", flask: "flask", fastapi: "fastapi", spring: "spring",
  springboot: "spring", laravel: "laravel", rails: "rails", rubyonrails: "rails", mongodb: "mongodb", mongo: "mongodb",
  mysql: "mysql", postgresql: "postgres", postgres: "postgres", redis: "redis", sqlite: "sqlite", prisma: "prisma",
  graphql: "graphql", firebase: "firebase", supabase: "supabase", aws: "aws", amazonwebservices: "aws",
  gcp: "gcp", googlecloud: "gcp", azure: "azure", docker: "docker", kubernetes: "kubernetes", k8s: "kubernetes",
  git: "git", github: "github", gitlab: "gitlab", linux: "linux", figma: "figma", photoshop: "ps",
  illustrator: "ai", adobexd: "xd", xd: "xd", vscode: "vscode", visualstudiocode: "vscode", vercel: "vercel",
  netlify: "netlify", redux: "redux", jquery: "jquery", threejs: "threejs", webpack: "webpack", vite: "vite",
  jest: "jest", npm: "npm", bun: "bun", deno: "deno", postman: "postman", nginx: "nginx", tensorflow: "tensorflow",
  pytorch: "pytorch", solidity: "solidity", markdown: "md", wordpress: "wordpress", unity: "unity",
  blender: "blender", androidstudio: "androidstudio", android: "androidstudio", electron: "electron", r: "r",
  scala: "scala", elixir: "elixir", haskell: "haskell", lua: "lua", perl: "perl", bash: "bash",
  powershell: "powershell", mui: "materialui", materialui: "materialui", styledcomponents: "styledcomponents",
  cloudflare: "cloudflare", heroku: "heroku", ubuntu: "ubuntu", arduino: "arduino", opencv: "opencv",
  sklearn: "sklearn", scikitlearn: "sklearn", matlab: "matlab", latex: "latex", obsidian: "obsidian",
  notion: "notion", discordjs: "discordjs", gatsby: "gatsby", nuxt: "nuxtjs", nuxtjs: "nuxtjs", remix: "remix",
  astro: "astro", jenkins: "jenkins", terraform: "terraform", ansible: "ansible", graphqlapi: "graphql",
};

const norm = (s: string) => s.toLowerCase().replace(/\.js$/, "js").replace(/[\s.\-_]/g, "");
const iconFor = (s: string) => SKILL_ICONS[norm(s)] ?? SKILL_ICONS[s.toLowerCase().trim()] ?? null;

/** Escape text placed inside raw HTML blocks. */
const h = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

/** shields.io static-badge text: "-" → "--", "_" → "__", space → "_". */
const badgeText = (s: string) =>
  encodeURIComponent(s.replace(/-/g, "--").replace(/_/g, "__").replace(/ /g, "_"));

const badge = (label: string, color: string, logo?: string, style = "for-the-badge") =>
  `https://img.shields.io/badge/${badgeText(label)}-${color}?style=${style}${logo ? `&logo=${encodeURIComponent(logo)}&logoColor=white` : ""}`;

/** GitHub username from the profile's links, e.g. https://github.com/octocat → "octocat". */
export function githubUserFromLinks(links: PortfolioData["links"]): string | null {
  for (const l of links) {
    const m = l.url.match(/github\.com\/([A-Za-z0-9-]{1,39})(?:[/?#]|$)/i);
    if (m && !["orgs", "sponsors", "settings"].includes(m[1].toLowerCase())) return m[1];
  }
  return null;
}

/* The "About Me" code card: an object literal with aligned keys and emoji
   comments, ending in a friendly sayHi(). Only fields with data appear. */
function introSnippet(
  data: PortfolioData,
  firstName: string,
  portfolioUrl: string,
  latest: PortfolioData["experiences"][number] | undefined,
  building: PortfolioData["projects"][number] | undefined
): string[] {
  const { profile, skills } = data;
  const str = (s: string) => JSON.stringify(s);
  const stack = skills.flatMap((s) => s.items).slice(0, 5);
  const fields: [key: string, value: string, comment?: string][] = [
    ["name", str(profile.fullName)],
    ...(profile.headline ? [["role", str(profile.headline), "💼"] as [string, string, string]] : []),
    ...(latest ? [["currently", str(`${latest.title} @ ${latest.organization}`), "🏢"] as [string, string, string]] : []),
    ...(building ? [["building", str(building.name), "🚀"] as [string, string, string]] : []),
    ...(profile.location ? [["basedIn", str(profile.location), "📍"] as [string, string, string]] : []),
    ...(stack.length ? [["stack", `[${stack.map(str).join(", ")}]`, "🛠️"] as [string, string, string]] : []),
    ...(profile.email ? [["reachMe", str(profile.email), "📫"] as [string, string, string]] : []),
    ["portfolio", str(portfolioUrl.replace(/^https?:\/\//, "")), "🌐"],
    ["openToWork", String(profile.openToWork), profile.openToWork ? "⚡ let's build something" : undefined],
  ];

  const keyW = Math.max(...fields.map(([k]) => k.length)) + 1; // + ":"
  const valW = Math.min(36, Math.max(...fields.map(([, v]) => v.length + 1))); // + ","
  const varName = (firstName.toLowerCase().replace(/[^a-z0-9]/g, "") || "me").replace(/^(\d)/, "_$1");

  return [
    `// 👋 a quick intro`,
    `const ${varName} = {`,
    ...fields.map(([k, v, c]) => {
      const line = `  ${`${k}:`.padEnd(keyW)} ${v},`;
      return c ? `${line.padEnd(2 + keyW + 1 + valW)}  // ${c}` : line;
    }),
    ``,
    `  sayHi: () => console.log("Thanks for dropping by! 🙌"),`,
    `};`,
  ];
}

export function generateReadme(
  data: PortfolioData,
  appUrl: string,
  username: string,
  opts: { github?: string | null } = {}
): string {
  const { profile, links, experiences, projects, skills, educations, sections } = data;
  const portfolioUrl = `${appUrl}/${username}`;
  const gh = opts.github === undefined ? githubUserFromLinks(links) : opts.github;
  const firstName = profile.fullName.split(/\s+/)[0] || profile.fullName;
  const allSkills = skills.flatMap((s) => s.items);
  const out: string[] = [];
  const push = (...l: string[]) => out.push(...l);

  // ── banner + typing intro ──────────────────────────────────────────
  const banner =
    `https://capsule-render.vercel.app/api?type=waving&color=${GRADIENT}&height=220&section=header` +
    `&text=${encodeURIComponent(profile.fullName)}&fontSize=56&fontColor=ffffff&fontAlignY=36&animation=fadeIn` +
    (profile.headline ? `&desc=${encodeURIComponent(profile.headline)}&descSize=20&descAlignY=58` : "");
  push(`<p align="center">`, `  <img src="${banner}" alt="${h(profile.fullName)}" width="100%" />`, `</p>`, ``);

  const typing = [
    `Hi there, I'm ${firstName} 👋`,
    profile.headline,
    allSkills.length ? `I work with ${allSkills.slice(0, 3).join(", ")}` : "",
    profile.location ? `Based in ${profile.location}` : "",
    profile.openToWork ? "Open to new opportunities ✨" : "",
  ].filter(Boolean).map((l) => encodeURIComponent(l.replace(/;/g, ",")));
  push(
    `<p align="center">`,
    `  <a href="${portfolioUrl}"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=${ACCENT}&center=true&vCenter=true&width=560&lines=${typing.join(";")}" alt="Typing intro" /></a>`,
    `</p>`,
    ``
  );

  // ── badges ─────────────────────────────────────────────────────────
  const badges: string[] = [];
  badges.push(`  <a href="${portfolioUrl}"><img src="${badge("Portfolio", ACCENT, "googlechrome")}" alt="Portfolio" /></a>`);
  for (const l of links) {
    if (!l.url) continue;
    const s = SOCIAL[l.kind] ?? SOCIAL.custom;
    const label = l.label || l.kind;
    badges.push(`  <a href="${h(l.url)}"><img src="${badge(label, s.color, s.logo)}" alt="${h(label)}" /></a>`);
  }
  if (profile.email)
    badges.push(`  <a href="mailto:${h(profile.email)}"><img src="${badge("Email", SOCIAL.email.color, SOCIAL.email.logo)}" alt="Email" /></a>`);
  push(`<p align="center">`, ...badges, `</p>`, ``);
  if (gh)
    push(
      `<p align="center">`,
      `  <img src="https://komarev.com/ghpvc/?username=${encodeURIComponent(gh)}&style=flat-square&color=${ACCENT}&label=Profile+views" alt="Profile views" />`,
      `</p>`,
      ``
    );

  // ── about ──────────────────────────────────────────────────────────
  const latest = experiences[0];
  const building = projects.find((p) => p.featured) ?? projects[0];
  push(`## 👋 About Me`, ``);
  if (profile.summary) push(profile.summary.trim(), ``);

  push("```ts", ...introSnippet(data, firstName, portfolioUrl, latest, building), "```", ``);
  if (profile.openToWork)
    push(`> ⚡ **Open to work & freelance projects.** [Let’s talk](${profile.email ? `mailto:${profile.email}` : portfolioUrl}).`, ``);

  // ── tech stack ─────────────────────────────────────────────────────
  const filledSkills = skills.filter((s) => s.items.length > 0);
  if (filledSkills.length > 0) {
    push(`## 🛠️ Tech Stack`, ``);
    for (const s of filledSkills) {
      const icons = [...new Set(s.items.map(iconFor).filter((x): x is string => !!x))];
      const rest = s.items.filter((i) => !iconFor(i));
      push(`<p align="center">`, `  <b>${h(s.category)}</b><br/><br/>`);
      if (icons.length) push(`  <img src="https://skillicons.dev/icons?i=${icons.join(",")}&perline=10&theme=dark" alt="${h(s.category)}" /><br/>`);
      for (const r of rest)
        push(`  <img src="${badge(r, "1F2335", norm(r), "for-the-badge")}" alt="${h(r)}" />`);
      push(`</p>`, ``);
    }
  }

  // ── projects ───────────────────────────────────────────────────────
  const featured = projects.filter((p) => p.featured);
  const shown = featured.length > 0 ? featured.slice(0, 6) : projects.slice(0, 4);
  if (shown.length > 0) {
    push(`## 🚀 Featured Projects`, ``, `<table>`);
    for (let i = 0; i < shown.length; i += 2) {
      push(`  <tr>`);
      for (const p of shown.slice(i, i + 2)) {
        const url = p.liveUrl ?? p.repoUrl;
        const name = url ? `<a href="${h(url)}">${h(p.name)}</a>` : h(p.name);
        push(`    <td width="50%" valign="top">`, `      <h3>${name}</h3>`);
        if (p.tagline) push(`      <p>${h(p.tagline)}</p>`);
        if (p.tech.length) push(`      <p>${p.tech.slice(0, 6).map((t) => `<code>${h(t)}</code>`).join(" ")}</p>`);
        const pl = [
          p.liveUrl ? `<a href="${h(p.liveUrl)}"><img src="${badge("Live", ACCENT, "vercel", "flat-square")}" alt="Live" /></a>` : "",
          p.repoUrl ? `<a href="${h(p.repoUrl)}"><img src="${badge("Code", "181717", "github", "flat-square")}" alt="Code" /></a>` : "",
        ].filter(Boolean);
        if (pl.length) push(`      <p>${pl.join(" ")}</p>`);
        push(`    </td>`);
      }
      if (i + 1 >= shown.length && shown.length > 1) push(`    <td width="50%"></td>`);
      push(`  </tr>`);
    }
    push(`</table>`, ``);
  }

  // ── experience ─────────────────────────────────────────────────────
  if (experiences.length > 0) {
    push(`## 💼 Experience`, ``, `| Role | Organization | When |`, `| :--- | :--- | :--- |`);
    for (const e of experiences) {
      const when = e.startDate ? `${e.startDate} – ${e.endDate ?? "Present"}` : e.endDate ?? "";
      push(`| **${cell(e.title)}** | ${cell(e.organization)} | \`${cell(when)}\` |`);
    }
    push(``);
  }

  // ── education ──────────────────────────────────────────────────────
  if (educations.length > 0) {
    push(`## 🎓 Education`, ``);
    for (const ed of educations) {
      const yr = ed.endYear ? ` \`${ed.startYear ? `${ed.startYear} – ` : ""}${ed.endYear}\`` : "";
      push(`- **${ed.institution}**${ed.degree ? ` · ${ed.degree}` : ""}${yr}${ed.score ? ` · ${ed.score}` : ""}`);
    }
    push(``);
  }

  // ── custom sections (Certifications, Awards…) ──────────────────────
  for (const sec of sections) {
    push(`## ${SECTION_EMOJI[sec.kind] ?? "✨"} ${sec.title}`, ``);
    for (const it of sec.items) {
      const title = it.url ? `[${it.title}](${it.url})` : it.title;
      const meta = [it.subtitle, it.date ? `\`${it.date}\`` : ""].filter(Boolean).join(" · ");
      push(`- **${title}**${meta ? ` — ${meta}` : ""}`);
      if (it.description) push(`  <br/><sub>${h(it.description.replace(/\r?\n/g, " "))}</sub>`);
    }
    push(``);
  }

  // ── GitHub stats ───────────────────────────────────────────────────
  if (gh) {
    const u = encodeURIComponent(gh);
    const card = `hide_border=true&bg_color=00000000&title_color=${ACCENT}&icon_color=${VIOLET}&text_color=${TEXT}`;
    push(
      `## 📊 GitHub Stats`,
      ``,
      `<p align="center">`,
      `  <img src="https://github-readme-stats.vercel.app/api?username=${u}&show_icons=true&include_all_commits=true&count_private=true&rank_icon=github&${card}" height="165" alt="GitHub stats" />`,
      `  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${u}&layout=compact&langs_count=8&${card}" height="165" alt="Top languages" />`,
      `</p>`,
      `<p align="center">`,
      `  <img src="https://streak-stats.demolab.com?user=${u}&hide_border=true&background=00000000&ring=${ACCENT}&fire=${VIOLET}&currStreakLabel=${ACCENT}&sideLabels=${TEXT}&currStreakNum=${TEXT}&sideNums=${TEXT}&dates=${TEXT}&stroke=${TEXT}" alt="GitHub streak" />`,
      `</p>`,
      `<p align="center">`,
      `  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${u}&bg_color=00000000&color=${TEXT}&title_color=${ACCENT}&line=${ACCENT}&point=${VIOLET}&area=true&area_color=${ACCENT}&hide_border=true" width="100%" alt="Contribution graph" />`,
      `</p>`,
      ``
    );
  }

  // ── footer ─────────────────────────────────────────────────────────
  push(
    `<p align="center">`,
    `  <a href="${portfolioUrl}"><b>🌐 Full portfolio & resume → ${h(portfolioUrl.replace(/^https?:\/\//, ""))}</b></a>`,
    `  <br/><br/>`,
    `  <sub>Generated with <a href="${appUrl}">${SITE_NAME}</a>, one profile, always in sync.</sub>`,
    `</p>`,
    ``,
    `<img src="https://capsule-render.vercel.app/api?type=waving&color=${GRADIENT}&height=120&section=footer" width="100%" alt="" />`,
    ``
  );

  return out.join("\n");
}
