import { clerkClient } from "@clerk/nextjs/server";

/* Publishes the generated README to the user's GitHub profile, using the
   GitHub account they linked through Clerk. Clerk stores and refreshes the
   OAuth token — we never persist it ourselves.

   Profile README locations (GitHub convention):
     user account  → <login>/<login>        README.md
     organization  → <org>/.github          profile/README.md            */

export const GITHUB_SCOPES = ["public_repo", "read:org"];

export class GithubError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** The linked GitHub OAuth token, or null when the user hasn't connected GitHub. */
export async function getGithubToken(clerkUserId: string): Promise<{ token: string; canWrite: boolean } | null> {
  const client = await clerkClient();
  const res = await client.users.getUserOauthAccessToken(clerkUserId, "github").catch(() => null);
  const t = res?.data?.[0];
  if (!t?.token) return null;
  // `scopes` is only reported by some providers; when absent, let GitHub decide.
  const canWrite = !t.scopes || t.scopes.some((s) => s === "public_repo" || s === "repo");
  return { token: t.token, canWrite };
}

async function gh(token: string, path: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });
}

async function fail(res: Response, fallback: string): Promise<never> {
  if (res.status === 401) throw new GithubError(401, "github_reconnect");
  if (res.status === 403) {
    const body = await res.json().catch(() => ({}));
    const msg = String((body as { message?: string }).message ?? "");
    if (/OAuth App access restrictions/i.test(msg)) throw new GithubError(403, "org_restricted");
    throw new GithubError(403, "github_forbidden");
  }
  throw new GithubError(502, fallback);
}

/** The GitHub login plus the organizations the user belongs to. */
export async function getGithubAccounts(token: string): Promise<{ login: string; orgs: string[] }> {
  const [u, o] = await Promise.all([gh(token, "/user"), gh(token, "/user/orgs?per_page=100")]);
  if (!u.ok) await fail(u, "github_fetch_failed");
  const login = ((await u.json()) as { login: string }).login;
  const orgs = o.ok ? ((await o.json()) as { login: string }[]).map((x) => x.login) : [];
  return { login, orgs };
}

export type PublishResult = {
  status: "created" | "updated" | "unchanged";
  url: string;
  profileUrl: string;
  privateRepo: boolean;
};

export async function publishReadme(token: string, owner: string, markdown: string): Promise<PublishResult> {
  const { login, orgs } = await getGithubAccounts(token);
  const isUser = owner.toLowerCase() === login.toLowerCase();
  if (!isUser && !orgs.some((o) => o.toLowerCase() === owner.toLowerCase()))
    throw new GithubError(400, "unknown_owner");

  const repoName = isUser ? login : ".github";
  const repoOwner = isUser ? login : owner;
  const filePath = isUser ? "README.md" : "profile/README.md";
  const repoPath = `/repos/${encodeURIComponent(repoOwner)}/${encodeURIComponent(repoName)}`;

  // 1. Make sure the special repo exists (create it, public, if not).
  let repoRes = await gh(token, repoPath);
  if (repoRes.status === 404) {
    const createPath = isUser ? "/user/repos" : `/orgs/${encodeURIComponent(owner)}/repos`;
    const created = await gh(token, createPath, {
      method: "POST",
      body: JSON.stringify({
        name: repoName,
        private: false,
        description: isUser ? "My GitHub profile README" : "Organization profile",
      }),
    });
    if (!created.ok) await fail(created, "repo_create_failed");
    repoRes = created;
  } else if (!repoRes.ok) {
    await fail(repoRes, "github_fetch_failed");
  }
  const repo = (await repoRes.json()) as { private: boolean; default_branch?: string; html_url: string };

  // 2. Read the current file (for its sha, and to skip no-op commits).
  const contentsPath = `${repoPath}/contents/${filePath}`;
  const existing = await gh(token, contentsPath);
  let sha: string | undefined;
  if (existing.ok) {
    const f = (await existing.json()) as { sha: string; content?: string };
    sha = f.sha;
    const current = f.content ? Buffer.from(f.content, "base64").toString("utf8") : null;
    if (current === markdown)
      return {
        status: "unchanged",
        url: `${repo.html_url}/blob/${repo.default_branch ?? "main"}/${filePath}`,
        profileUrl: `https://github.com/${repoOwner}`,
        privateRepo: repo.private,
      };
  } else if (existing.status !== 404) {
    await fail(existing, "github_fetch_failed");
  }

  // 3. Commit the new README.
  const put = await gh(token, contentsPath, {
    method: "PUT",
    body: JSON.stringify({
      message: sha ? "Update profile README" : "Add profile README",
      content: Buffer.from(markdown, "utf8").toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!put.ok) await fail(put, "github_write_failed");
  const written = (await put.json()) as { content: { html_url: string } };

  return {
    status: sha ? "updated" : "created",
    url: written.content.html_url,
    profileUrl: `https://github.com/${repoOwner}`,
    privateRepo: repo.private,
  };
}
