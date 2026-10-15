"use client";
/* Connect GitHub (through Clerk) and commit the generated README straight
   to the user's — or one of their organizations' — profile repository. */
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight, Building2, Check, FileCode2, GitBranch, Loader2, RefreshCw, ShieldCheck, Unplug, UploadCloud, User,
} from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
import { Notice, btn } from "@/components/ui";

const SCOPES = ["public_repo", "read:org"];
const OWNER_KEY = "portxz:readme-owner";

type Status =
  | { connected: false }
  | { connected: true; canWrite: boolean; login: string; orgs: string[] };

type Result = { status: "created" | "updated" | "unchanged"; url: string; profileUrl: string; privateRepo: boolean };

const ERRORS: Record<string, string> = {
  github_reconnect: "GitHub signed us out. Reconnect GitHub and try again.",
  github_missing_scope: "We need permission to write to your repositories. Grant access and try again.",
  github_not_connected: "Connect your GitHub account first.",
  org_restricted:
    "This organization blocks third-party apps. An org owner must approve the app under the organization’s Settings → Third-party access, then try again.",
  github_forbidden: "GitHub refused the change. Make sure you’re an owner or admin of that account.",
  repo_create_failed: "We couldn’t create the profile repository. Check that you have permission to create repos there.",
  unknown_owner: "That account isn’t one you belong to on GitHub.",
};

const clerkMessage = (e: unknown) => {
  const err = (e as { errors?: { code?: string; longMessage?: string; message?: string }[] }).errors?.[0];
  return err ? { code: err.code, text: err.longMessage ?? err.message ?? "" } : null;
};

const avatar = (login: string) => `https://github.com/${encodeURIComponent(login)}.png?size=96`;
const targetOf = (owner: string, login: string) =>
  owner === login ? { repo: `${owner}/${owner}`, file: "README.md" } : { repo: `${owner}/.github`, file: "profile/README.md" };

const STEPS = ["Connect GitHub", "Choose account", "Publish"];

export type PublishTarget = { owner: string; personal: boolean } | null;

export function GithubPublish({ onTargetChange }: { onTargetChange?: (target: PublishTarget) => void }) {
  const { user, isLoaded } = useUser();
  const account = user?.externalAccounts.find((a) => a.provider === "github");
  const scopes = account?.approvedScopes?.split(/[\s,]+/) ?? [];
  const hasScopes = SCOPES.every((s) => scopes.includes(s) || (s === "public_repo" && scopes.includes("repo")));

  const [status, setStatus] = useState<Status | null>(null);
  const [owner, setOwnerState] = useState("");
  const [busy, setBusy] = useState<null | "connect" | "publish" | "disconnect">(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const setOwner = (o: string, login = status?.connected ? status.login : "") => {
    setOwnerState(o);
    setResult(null);
    onTargetChange?.(o ? { owner: o, personal: o === login } : null);
  };

  useEffect(() => {
    if (!isLoaded || !account) return;
    fetch("/api/readme/github", { cache: "no-store" })
      .then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(body.error ?? "server_error");
        setStatus(body);
        if (body.connected) {
          let saved: string | null = null;
          try { saved = localStorage.getItem(OWNER_KEY); } catch {}
          setOwner(saved && [body.login, ...body.orgs].includes(saved) ? saved : body.login, body.login);
        }
      })
      .catch((e: Error) => {
        setError(ERRORS[e.message] ?? "We couldn’t reach GitHub. Refresh the page to try again.");
        setStatus({ connected: false });
      });
  }, [isLoaded, account?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function connect() {
    if (!user) return;
    setBusy("connect");
    setError(null);
    try {
      const redirectUrl = window.location.href;
      const ea = account
        ? await account.reauthorize({ redirectUrl, additionalScopes: SCOPES })
        : await user.createExternalAccount({ strategy: "oauth_github", redirectUrl, additionalScopes: SCOPES });
      const to = ea.verification?.externalVerificationRedirectURL;
      if (to) window.location.href = to.href;
      else { await user.reload(); setBusy(null); }
    } catch (e) {
      console.error("GitHub connect failed", e);
      const m = clerkMessage(e);
      const notEnabled = m?.code === "form_param_value_invalid" || /oauth_github/i.test(m?.text ?? "");
      setError(
        notEnabled
          ? "GitHub isn’t enabled for sign-in yet. Turn on GitHub in the Clerk dashboard (SSO connections), then try again."
          : `We couldn’t start the GitHub connection${m ? `: ${m.text}` : "."}`
      );
      setBusy(null);
    }
  }

  async function disconnect() {
    if (!account || !user) return;
    setBusy("disconnect");
    setError(null);
    setResult(null);
    try {
      await account.destroy();
      await user.reload();
      setStatus(null);
      onTargetChange?.(null);
    } catch (e) {
      console.error("GitHub disconnect failed", e);
      const m = clerkMessage(e);
      setError(
        `We couldn’t disconnect GitHub${m ? `: ${m.text}` : "."} If you sign in with GitHub, add an email or another sign-in method first.`
      );
    } finally {
      setBusy(null);
    }
  }

  async function publish() {
    setBusy("publish");
    setError(null);
    setResult(null);
    try { localStorage.setItem(OWNER_KEY, owner); } catch {}
    try {
      const r = await fetch("/api/readme/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.error ?? "server_error");
      setResult(body);
    } catch (e) {
      setError(ERRORS[(e as Error).message] ?? "Publishing failed. Please try again in a moment.");
    } finally {
      setBusy(null);
    }
  }

  const loading = !isLoaded || (!!account && status === null);
  const ready = !!account && !!status?.connected;
  const needsGrant = ready && (!hasScopes || !status.canWrite);
  const login = status?.connected ? status.login : null;
  const step = result ? 3 : ready && !needsGrant ? (owner ? 2 : 1) : 0;
  const panel = loading ? "loading" : !ready ? "connect" : needsGrant ? "grant" : result ? "done" : "publish";

  return (
    <section className="lp-gradient-border relative overflow-hidden rounded-2xl">
      <div className="lp-grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[var(--lp-glow)] blur-3xl" aria-hidden />

      <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        {/* ── story ── */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-lp-text text-lp-bg shadow-lg">
              <GithubIcon className="h-5 w-5" />
            </span>
            <StatusChip loading={loading} login={ready && !needsGrant ? login : null} />
          </div>

          <h2 className="mt-5 text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.7rem]">
            Your profile, <span className="lp-gradient-text">live on GitHub</span>
          </h2>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-lp-muted">
            Publish your README straight to your GitHub profile in one click. No copy and paste, no
            repository setup. Publish again whenever your details change.
          </p>

          <ol className="mt-7 space-y-0">
            {STEPS.map((label, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <li key={label} className="relative flex items-center gap-3 pb-5 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span className={`absolute left-[13px] top-7 h-[calc(100%-1.5rem)] w-px ${done ? "bg-lp-accent" : "bg-lp-border-strong"}`} aria-hidden />
                  )}
                  <span className={`relative grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition ${
                    done ? "bg-lp-accent text-lp-on-accent"
                    : current ? "bg-lp-accent-soft text-lp-accent ring-2 ring-lp-accent/40"
                    : "bg-lp-surface-2 text-lp-subtle"
                  }`}>
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className={`text-sm ${done || current ? "font-medium text-lp-text" : "text-lp-subtle"}`}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ── action panel ── */}
        <div className="flex flex-col rounded-2xl border border-lp-border bg-lp-surface/85 p-5 shadow-sm backdrop-blur sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={panel} className="flex flex-1 flex-col"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}>

              {panel === "loading" && (
                <div className="space-y-3" aria-busy="true" aria-label="Checking your GitHub connection">
                  <div className="h-4 w-32 animate-pulse rounded bg-lp-surface-2" />
                  <div className="h-16 animate-pulse rounded-xl bg-lp-surface-2" />
                  <div className="h-16 animate-pulse rounded-xl bg-lp-surface-2" />
                  <div className="h-11 animate-pulse rounded-xl bg-lp-surface-2" />
                </div>
              )}

              {panel === "connect" && (
                <>
                  <p className="text-sm font-semibold text-lp-text">Connect your GitHub account</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-lp-muted">One-time setup. Takes about 10 seconds.</p>
                  <ul className="my-5 space-y-3">
                    {[
                      [FileCode2, "Only writes your profile README", "Nothing else in your repositories is touched."],
                      [GitBranch, "Creates the profile repo for you", "If it doesn’t exist yet, we set it up as GitHub expects."],
                      [ShieldCheck, "Disconnect anytime", "Your sign-in is handled securely by Clerk."],
                    ].map(([Icon, title, text]) => {
                      const I = Icon as typeof FileCode2;
                      return (
                        <li key={title as string} className="flex gap-3">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lp-accent-soft text-lp-accent"><I className="h-4 w-4" /></span>
                          <span>
                            <span className="block text-[13px] font-medium text-lp-text">{title as string}</span>
                            <span className="block text-[13px] leading-relaxed text-lp-muted">{text as string}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <button onClick={connect} disabled={!!busy}
                    className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-lp-text text-[15px] font-semibold text-lp-bg shadow-lg transition hover:opacity-90 disabled:opacity-60">
                    {busy === "connect" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GithubIcon className="h-4 w-4" />}
                    {account ? "Reconnect GitHub" : "Connect GitHub"}
                  </button>
                </>
              )}

              {panel === "grant" && (
                <>
                  <AccountRow login={login!} label="Connected" />
                  <p className="mt-5 text-sm font-semibold text-lp-text">One more permission</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-lp-muted">
                    Allow repository access so we can write your README, and see your organizations so you can publish to them too.
                  </p>
                  <button onClick={connect} disabled={!!busy} className={btn("primary", "lg", "mt-6 w-full")}>
                    {busy === "connect" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    Grant access on GitHub
                  </button>
                </>
              )}

              {(panel === "publish" || panel === "done") && status?.connected && (
                <>
                  <p className="text-sm font-semibold text-lp-text">Publish to</p>
                  <div role="radiogroup" aria-label="GitHub account" className="lp-scroll mt-3 max-h-60 space-y-2 overflow-auto pr-1">
                    {[status.login, ...status.orgs].map((o) => {
                      const selected = owner === o;
                      const isOrg = o !== status.login;
                      return (
                        <button key={o} role="radio" aria-checked={selected} onClick={() => setOwner(o)} disabled={!!busy}
                          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                            selected ? "border-lp-accent bg-lp-accent-soft ring-1 ring-lp-accent/40" : "border-lp-border hover:border-lp-border-strong hover:bg-lp-surface-2/60"
                          }`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={avatar(o)} alt="" width={36} height={36}
                            className={`h-9 w-9 shrink-0 bg-lp-surface-2 object-cover ${isOrg ? "rounded-lg" : "rounded-full"}`} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-lp-text">@{o}</span>
                            <span className="flex items-center gap-1 text-xs text-lp-muted">
                              {isOrg ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                              {isOrg ? "Organization profile" : "Your personal profile"}
                            </span>
                          </span>
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition ${
                            selected ? "border-lp-accent bg-lp-accent text-lp-on-accent" : "border-lp-border-strong"
                          }`}>
                            {selected && <Check className="h-3 w-3" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {owner && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-lp-surface-2/70 px-3 py-2 font-mono text-xs text-lp-muted">
                      <FileCode2 className="h-3.5 w-3.5 shrink-0 text-lp-subtle" />
                      <span className="truncate">{targetOf(owner, status.login).repo}<span className="text-lp-subtle"> / </span>{targetOf(owner, status.login).file}</span>
                    </div>
                  )}

                  {panel === "done" && result ? (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                      className="mt-5 rounded-xl border border-lp-green/30 bg-lp-green/10 p-4">
                      <div className="flex items-start gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lp-green text-white"><Check className="h-4 w-4" /></span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-lp-text">
                            {result.status === "unchanged" ? "Already up to date" : result.status === "created" ? "Published to GitHub" : "README updated"}
                          </p>
                          <p className="mt-0.5 text-[13px] leading-relaxed text-lp-muted">
                            {result.status === "unchanged" ? "Your GitHub README already matches your profile." : "It’s live on your GitHub profile now."}
                            {result.privateRepo && " The repository is private, so make it public for the README to show on your profile."}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <a href={result.profileUrl} target="_blank" rel="noreferrer" className={btn("success", "sm")}>
                          View profile <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                        <a href={result.url} target="_blank" rel="noreferrer" className={btn("secondary", "sm")}>
                          Open file <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                        <button onClick={publish} disabled={!!busy} className={btn("ghost", "sm")}>
                          {busy === "publish" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />} Publish again
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button onClick={publish} disabled={!!busy || !owner} className={btn("primary", "lg", "mt-5 w-full")}>
                      {busy === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                      {busy === "publish" ? "Publishing…" : "Publish README"}
                    </button>
                  )}

                  <button onClick={connect} disabled={!!busy}
                    className="mt-3 inline-flex items-center justify-center gap-1.5 self-center text-xs text-lp-muted transition hover:text-lp-text">
                    <RefreshCw className="h-3 w-3" /> Organization missing? Re-check access
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {error && <Notice tone="error" className="mt-4">{error}</Notice>}

          {account && !loading && (
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-lp-border pt-4">
              <span className="flex min-w-0 items-center gap-2 text-[13px] text-lp-muted">
                <GithubIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Linked as <strong className="font-medium text-lp-text">@{login ?? account.username ?? account.accountIdentifier()}</strong></span>
              </span>
              <button onClick={disconnect} disabled={!!busy}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-medium text-lp-muted transition hover:bg-lp-danger/10 hover:text-lp-danger disabled:opacity-50">
                {busy === "disconnect" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unplug className="h-3.5 w-3.5" />} Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatusChip({ loading, login }: { loading: boolean; login: string | null }) {
  if (loading) return <span className="h-6 w-28 animate-pulse rounded-full bg-lp-surface-2" />;
  return login ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-lp-green/30 bg-lp-green/10 px-2.5 py-1 text-xs font-medium text-lp-green">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lp-green opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lp-green" />
      </span>
      Connected
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-lp-border-strong bg-lp-surface-2/80 px-2.5 py-1 text-xs font-medium text-lp-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-lp-subtle" /> Not connected
    </span>
  );
}

function AccountRow({ login, label }: { login: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-lp-border bg-lp-surface-2/50 px-3 py-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatar(login)} alt="" width={36} height={36} className="h-9 w-9 rounded-full bg-lp-surface-2" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-lp-text">@{login}</span>
        <span className="block text-xs text-lp-green">{label}</span>
      </span>
    </div>
  );
}
