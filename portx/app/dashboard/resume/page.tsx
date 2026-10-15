"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown, ArrowUp, BadgeCheck, Check, Download, Eye, EyeOff, Hash, ListChecks, Loader2,
  Lock, RotateCcw, Search, Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Field, Notice, btn, friendlyError, inputCls } from "@/components/ui";
import { Resume } from "@/components/templates/resume/Resume";
import { RESUME_FONT_FAMILY } from "@/components/templates/resume/fonts";
import type { PortfolioData } from "@/components/templates/types";
import {
  ACCENTS, DEFAULT_RESUME_CONFIG, FONTS, FONT_LABELS, RESUME_TEMPLATES, SECTION_LABELS, itemKey, sectionOrder,
  type ResumeConfig, type ResumeStyle, type ResumeTemplate, type SectionKey,
} from "@/lib/resume";

const TIPS = [
  { icon: ListChecks, title: "Keep it simple", text: "Hiring software reads plain, single-column resumes best — every template here uses that format." },
  { icon: Hash, title: "Use numbers", text: "“Grew followers by 40%” is stronger than “Managed social media”. Add results to your highlights." },
  { icon: Search, title: "Match the job", text: "Use the same words the job post uses for skills and tools — that's what recruiters search for." },
];

type Loaded = { data: PortfolioData; username: string; published: boolean; pro: boolean };
type SaveState = "idle" | "saving" | "saved" | "error";

export default function ResumePage() {
  const [info, setInfo] = useState<Loaded | null>(null);
  const [config, setConfig] = useState<ResumeConfig>(DEFAULT_RESUME_CONFIG);
  const [problem, setProblem] = useState<string | null>(null);
  const [save, setSave] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/resume").then(async (r) => {
      if (!r.ok) { setProblem((await friendlyError(r)).message); return; }
      const d = await r.json();
      setInfo({ data: d.data, username: d.username, published: d.published, pro: d.pro });
      setConfig(d.config);
    }).catch(() => setProblem("We couldn't load your resume. Please check your connection and refresh."));
  }, []);

  /* Every change updates the preview at once and saves shortly after (debounced). */
  function update(patch: Partial<ResumeConfig>) {
    const next = { ...config, ...patch };
    setConfig(next);
    setSave("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const r = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      }).catch(() => null);
      if (r?.ok) { setSave("saved"); setProblem(null); }
      else { setSave("error"); setProblem(r ? (await friendlyError(r)).message : "We couldn't save your changes. Please check your connection."); }
    }, 700);
  }

  const canDownload = !!info?.published && save !== "saving";
  // Free plan previews exactly what it downloads: plain Classic, no added sections.
  const view = !info ? null
    : info.pro ? { data: info.data, config, template: config.template }
    : { data: { ...info.data, sections: [] }, config: DEFAULT_RESUME_CONFIG, template: "classic" };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Share"
        title="Resume"
        description="Pick a template and fine-tune what your resume shows. It's still made from your details, so it stays up to date."
        actions={info?.published ? (
          <div className="flex flex-wrap items-center gap-2">
            <SaveBadge state={save} />
            <a href={`/${info.username}/resume`} target="_blank" rel="noreferrer" className={btn("secondary")}>
              <Eye className="h-4 w-4" /> Preview
            </a>
            <a href={canDownload ? `/api/pdf?username=${info.username}` : undefined} aria-disabled={!canDownload}
              className={btn("primary", "md", canDownload ? "" : "pointer-events-none opacity-50")}>
              <Download className="h-4 w-4" /> Download PDF
            </a>
          </div>
        ) : undefined}
      />

      {problem && <Notice tone="error">{problem}</Notice>}

      {!info ? (
        !problem && <div className="h-72 animate-pulse rounded-2xl border border-lp-border bg-lp-surface" />
      ) : (
        <>
          {!info.pro && <FreeBanner />}

          {!info.published && (
            <Notice tone="warning" action={<Link href="/dashboard/template" className={btn("primary", "sm")}>Publish</Link>}>
              Publish your page to download your resume{info.pro ? " — you can set it up here in the meantime" : ""}.
            </Notice>
          )}

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="min-w-0 space-y-6">
              <Card title="Template" description="All six are single-column and read cleanly by hiring software (ATS).">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {RESUME_TEMPLATES.map((t) => (
                    <TemplateCard key={t.id} t={t} style={t.id === "custom" ? config.custom : t.style}
                      active={view!.template === t.id} locked={!info.pro && t.id !== "classic"}
                      onPick={() => update({ template: t.id })} />
                  ))}
                </div>
                {info.pro && config.template === "custom" && (
                  <CustomStyle style={config.custom} onChange={(s) => update({ custom: { ...config.custom, ...s } })} />
                )}
              </Card>

              {info.pro && <>
              <Card title="Headline & summary" description="Only for your resume — your portfolio keeps its own. Leave empty to use your portfolio's.">
                <div className="space-y-4">
                  <Field label="Headline" optional>
                    <input className={inputCls} maxLength={120} value={config.headline}
                      placeholder={info.data.profile.headline || "e.g. Frontend Developer · React, TypeScript"}
                      onChange={(e) => update({ headline: e.target.value })} />
                  </Field>
                  <Field label="Summary" optional hint={`${config.summary.length}/1200`}>
                    <textarea className={`${inputCls} resize-y`} rows={4} maxLength={1200} value={config.summary}
                      placeholder={info.data.profile.summary || "2–3 sentences about who you are and what you're best at."}
                      onChange={(e) => update({ summary: e.target.value })} />
                  </Field>
                </div>
              </Card>

              <SectionsEditor data={info.data} config={config} update={update} />
              </>}
            </div>

            {/* live preview */}
            <div className="min-w-0 xl:sticky xl:top-6">
              <p className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-lp-muted">
                <BadgeCheck className="h-4 w-4 text-lp-green" /> Live preview · A4
              </p>
              <ScaledSheet>
                <Resume data={view!.data} config={view!.config} />
              </ScaledSheet>
            </div>
          </div>
        </>
      )}

      <div>
        <h2 className="text-[15px] font-semibold">Tips for a resume that gets noticed</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {TIPS.map((t) => (
            <div key={t.title} className="lp-card rounded-2xl p-5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-lp-accent-soft text-lp-accent">
                <t.icon className="h-4 w-4" />
              </span>
              <p className="mt-3 font-medium">{t.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-lp-muted">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SaveBadge({ state }: { state: SaveState }) {
  if (state === "idle") return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-1 text-[13px] text-lp-muted">
      {state === "saving" ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
        : state === "saved" ? <><Check className="h-3.5 w-3.5 text-lp-green" /> Saved</>
        : <span className="text-lp-danger">Not saved</span>}
    </span>
  );
}

/* A mini page drawn in the template's own font and color. */
function TemplateCard({ t, style, active, locked, onPick }: {
  t: ResumeTemplate; style: ResumeStyle; active: boolean; locked?: boolean; onPick: () => void;
}) {
  const ink = style.colorHeadings ? style.accent : "#111";
  const cls = `group relative rounded-2xl border p-2.5 text-left transition ${
    active ? "border-lp-accent bg-lp-accent-soft ring-4 ring-lp-accent-soft" : "border-lp-border bg-lp-surface hover:border-lp-border-strong"}`;
  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white p-3 ring-1 ring-black/5"
        style={{ fontFamily: RESUME_FONT_FAMILY[style.font] }}>
        <p className="truncate text-[13px] font-bold leading-tight" style={{ color: ink, textAlign: style.align }}>Your Name</p>
        <div className="mt-1 h-[3px] rounded" style={{ background: "#d4d7de", width: "60%", marginInline: style.align === "center" ? "auto" : undefined }} />
        {[0, 1].map((s) => (
          <div key={s} className={style.spacing === "compact" ? "mt-1.5" : style.spacing === "relaxed" ? "mt-3" : "mt-2"}>
            <p className="border-b text-[8px] font-bold leading-tight" style={{ color: ink, borderColor: style.accent }}>
              {s === 0 ? (t.id === "technical" ? "Skills" : "Summary") : "Experience"}
            </p>
            <div className="mt-1 space-y-[3px]">
              {[90, 76].map((w) => <div key={w} className="h-[3px] rounded bg-[#e3e6ec]" style={{ width: `${w}%` }} />)}
            </div>
          </div>
        ))}
        {active && (
          <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-lp-accent text-white">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
      </div>
      <p className="mt-2 flex items-center gap-1.5 px-0.5 text-sm font-semibold">
        {t.name}
        {locked && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-lp-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-lp-accent">
            <Lock className="h-2.5 w-2.5" /> Pro
          </span>
        )}
      </p>
      <p className="px-0.5 text-[12px] leading-snug text-lp-muted">{t.blurb}</p>
    </>
  );
  // Locked templates lead to the plans page instead of switching.
  return locked
    ? <Link href="/dashboard/billing" className={`${cls} opacity-70 hover:opacity-100`}>{body}</Link>
    : <button type="button" onClick={onPick} aria-pressed={active} className={cls}>{body}</button>;
}

function CustomStyle({ style, onChange }: { style: ResumeStyle; onChange: (s: Partial<ResumeStyle>) => void }) {
  return (
    <div className="mt-5 space-y-4 rounded-2xl border border-lp-border bg-lp-surface-2/40 p-4">
      <Field label="Font">
        <select className={inputCls} value={style.font} onChange={(e) => onChange({ font: e.target.value as ResumeStyle["font"] })}>
          {FONTS.map((f) => <option key={f} value={f}>{FONT_LABELS[f]}</option>)}
        </select>
      </Field>
      <Field label="Color" group>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENTS.map((c) => (
            <button key={c} type="button" onClick={() => onChange({ accent: c })} aria-label={`Color ${c}`}
              className={`h-8 w-8 rounded-full ring-offset-2 ring-offset-lp-bg transition ${style.accent === c ? "ring-2 ring-lp-accent" : "hover:scale-110"}`}
              style={{ background: c }} />
          ))}
          <label className="ml-2 flex items-center gap-2 text-sm text-lp-muted">
            <input type="checkbox" checked={style.colorHeadings} onChange={(e) => onChange({ colorHeadings: e.target.checked })} />
            Color the headings
          </label>
        </div>
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Segmented label="Text size" value={style.size} options={[["small", "Small"], ["normal", "Normal"], ["large", "Large"]]}
          onChange={(v) => onChange({ size: v })} />
        <Segmented label="Spacing" value={style.spacing} options={[["compact", "Tight"], ["normal", "Normal"], ["relaxed", "Airy"]]}
          onChange={(v) => onChange({ spacing: v })} />
        <Segmented label="Name" value={style.align} options={[["left", "Left"], ["center", "Center"]]}
          onChange={(v) => onChange({ align: v })} />
      </div>
    </div>
  );
}

function Segmented<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: [T, string][]; onChange: (v: T) => void;
}) {
  return (
    <Field label={label} group>
      <div className="flex rounded-xl border border-lp-border bg-lp-surface p-1">
        {options.map(([v, text]) => (
          <button key={v} type="button" onClick={() => onChange(v)} aria-pressed={value === v}
            className={`flex-1 rounded-lg px-2 py-1.5 text-[13px] font-medium transition ${value === v ? "bg-lp-accent text-white" : "text-lp-muted hover:text-lp-text"}`}>
            {text}
          </button>
        ))}
      </div>
    </Field>
  );
}

/* Order and show/hide sections, and hide single entries — for the resume only. */
function SectionsEditor({ data, config, update }: {
  data: PortfolioData; config: ResumeConfig; update: (p: Partial<ResumeConfig>) => void;
}) {
  const order = sectionOrder(config);
  const hiddenSections = new Set(config.hiddenSections);
  const hiddenItems = new Set(config.hiddenItems);

  const items: Record<SectionKey, { key: string; label: string }[]> = {
    summary: [],
    skills: [],
    experience: data.experiences.map((e) => ({ key: itemKey.experience(e), label: [e.title, e.organization].filter(Boolean).join(" — ") })),
    projects: data.projects.map((p) => ({ key: itemKey.project(p), label: p.name })),
    education: data.educations.map((e) => ({ key: itemKey.education(e), label: [e.degree, e.institution].filter(Boolean).join(" — ") })),
    custom: data.sections.map((s) => ({ key: itemKey.custom(s), label: s.title })),
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    update({ order: next });
  };
  const toggleSection = (k: SectionKey) =>
    update({ hiddenSections: hiddenSections.has(k) ? config.hiddenSections.filter((x) => x !== k) : [...config.hiddenSections, k] });
  const toggleItem = (k: string) =>
    update({ hiddenItems: hiddenItems.has(k) ? config.hiddenItems.filter((x) => x !== k) : [...config.hiddenItems, k] });

  return (
    <Card title="Sections" description="Reorder sections and choose what to show. Hidden items stay on your portfolio."
      action={config.order && (
        <button type="button" onClick={() => update({ order: null })} className={btn("ghost", "sm")}>
          <RotateCcw className="h-3.5 w-3.5" /> Template order
        </button>
      )}>
      <ul className="space-y-2">
        {order.map((k, i) => {
          const off = hiddenSections.has(k);
          return (
            <li key={k} className="rounded-xl border border-lp-border bg-lp-surface">
              <div className="flex items-center gap-2 px-3 py-2.5">
                <div className="flex flex-col">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${SECTION_LABELS[k]} up`}
                    className="grid h-5 w-6 place-items-center rounded text-lp-subtle hover:text-lp-text disabled:opacity-30">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label={`Move ${SECTION_LABELS[k]} down`}
                    className="grid h-5 w-6 place-items-center rounded text-lp-subtle hover:text-lp-text disabled:opacity-30">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className={`flex-1 text-[15px] font-medium ${off ? "text-lp-subtle line-through" : ""}`}>{SECTION_LABELS[k]}</span>
                <button type="button" onClick={() => toggleSection(k)} className={btn("ghost", "sm")} aria-pressed={!off}>
                  {off ? <><EyeOff className="h-4 w-4" /> Hidden</> : <><Eye className="h-4 w-4" /> Shown</>}
                </button>
              </div>
              {!off && items[k].length > 0 && (
                <ul className="space-y-1 border-t border-lp-border px-4 py-2.5">
                  {items[k].map((it) => (
                    <li key={it.key}>
                      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                        <input type="checkbox" checked={!hiddenItems.has(it.key)} onChange={() => toggleItem(it.key)} />
                        <span className={`truncate ${hiddenItems.has(it.key) ? "text-lp-subtle line-through" : "text-lp-muted"}`}>{it.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* Renders the real A4 resume at full size, scaled down to the column width. */
function ScaledSheet({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 0.5, height: 560 });
  const SHEET_PX = 794; // 210mm at 96dpi

  useLayoutEffect(() => {
    const measure = () => {
      if (!outer.current || !inner.current) return;
      const scale = Math.min(1, outer.current.clientWidth / SHEET_PX);
      setBox({ scale, height: inner.current.offsetHeight * scale });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (outer.current) ro.observe(outer.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="overflow-hidden rounded-xl border border-lp-border bg-lp-surface-2/60" style={{ height: box.height }}>
      <div ref={inner} style={{ width: SHEET_PX, transform: `scale(${box.scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

function FreeBanner() {
  return (
    <div className="lp-gradient-border flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lp-accent-soft text-lp-accent">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold">Your Classic resume is free to download</p>
          <p className="mt-0.5 text-sm text-lp-muted">
            Pro adds 5 more templates (including your own custom style), a resume-only headline and summary,
            section order, hiding entries, and your added sections like Certifications.
          </p>
        </div>
      </div>
      <Link href="/dashboard/billing" className={btn("primary", "md")}><Sparkles className="h-4 w-4" /> See Pro</Link>
    </div>
  );
}
