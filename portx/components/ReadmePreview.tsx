"use client";
/* README preview in a GitHub-like browser frame — rendered Markdown or
   the raw text, with copy and download on the toolbar. */
import { useMemo, useState } from "react";
import { Marked } from "marked";
import DOMPurify from "dompurify";
import { Check, Code2, Copy, Download, Eye, Lock } from "lucide-react";

/* Tiny JS/TS highlighter so code blocks look like they do on GitHub.
   Strings and comments are matched first, so `//` inside a URL string stays a string. */
const TOKEN = /(\/\/.*$)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\b(const|let|var|class|function|return|new|true|false|null|undefined)\b|(=>)|\b([A-Za-z_$][\w$]*)(?=\s*:)|\b([A-Za-z_$][\w$]*)(?=\s*\()|\b(\d+(?:\.\d+)?)\b/gm;
const CLASSES = ["tok-c", "tok-s", "tok-k", "tok-k", "tok-p", "tok-f", "tok-n"];
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function highlight(code: string) {
  let out = "";
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    out += esc(code.slice(last, m.index));
    const group = m.slice(1).findIndex((g) => g !== undefined);
    out += `<span class="${CLASSES[group]}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}

const md = new Marked({
  renderer: {
    code({ text, lang }) {
      const body = !lang || /^(js|javascript|ts|typescript|jsx|tsx|json)$/i.test(lang) ? highlight(text) : esc(text);
      return `<pre><code>${body}</code></pre>\n`;
    },
  },
});

export function ReadmePreview({ markdown, owner }: { markdown: string; owner: string | null }) {
  const [tab, setTab] = useState<"preview" | "markdown">("preview");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    if (typeof window === "undefined") return "";
    const raw = md.parse(markdown, { gfm: true, async: false }) as string;
    // Preview links open in a new tab so the dashboard stays put.
    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      if (node.tagName === "A") {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    });
    const clean = DOMPurify.sanitize(raw, { ADD_ATTR: ["align", "target"] });
    DOMPurify.removeHook("afterSanitizeAttributes");
    return clean;
  }, [markdown]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      // Clipboard API blocked (insecure origin / permissions) — fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = markdown;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const iconBtn =
    "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-lp-muted transition hover:bg-lp-surface-2 hover:text-lp-text";

  return (
    <section className="lp-card overflow-hidden rounded-2xl">
      {/* browser chrome */}
      <div className="flex flex-wrap items-center gap-3 border-b border-lp-border bg-lp-surface-2/50 px-4 py-2.5">
        <div className="hidden gap-1.5 sm:flex" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-lp-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-lp-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-lp-border-strong" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-lp-border bg-lp-surface px-3 py-1.5 text-[13px] text-lp-muted">
          <Lock className="h-3 w-3 shrink-0 text-lp-subtle" />
          <span className="truncate font-mono">github.com/{owner ?? "your-username"}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={copy} className={iconBtn} aria-label="Copy README text">
            {copied ? <Check className="h-4 w-4 text-lp-green" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
          <button onClick={download} className={iconBtn} aria-label="Download README.md">
            <Download className="h-4 w-4" /><span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* file header with view toggle */}
      <div className="flex items-center justify-between gap-3 border-b border-lp-border px-4 py-2.5 sm:px-6">
        <p className="flex items-center gap-2 font-mono text-[13px] text-lp-text">
          README<span className="text-lp-subtle">.md</span>
        </p>
        <div role="tablist" aria-label="README view" className="inline-flex rounded-lg border border-lp-border bg-lp-surface-2/60 p-0.5">
          {([
            ["preview", "Preview", Eye],
            ["markdown", "Markdown", Code2],
          ] as const).map(([id, label, Icon]) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium transition ${
                tab === id ? "bg-lp-surface text-lp-text shadow-sm" : "text-lp-muted hover:text-lp-text"
              }`}>
              <Icon className="h-3.5 w-3.5" />{label}
            </button>
          ))}
        </div>
      </div>

      {tab === "preview" ? (
        <div className="lp-scroll max-h-[720px] overflow-auto px-5 py-8 sm:px-10">
          <article className="gh-md mx-auto max-w-[860px]" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      ) : (
        <textarea readOnly value={markdown} rows={24} aria-label="README text"
          className="lp-scroll block w-full resize-y bg-transparent px-5 py-5 font-mono text-[13px] leading-relaxed text-lp-muted outline-none sm:px-6" />
      )}
    </section>
  );
}
