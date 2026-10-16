type DraftProject = {
  name: string;
  tagline: string;
  tech: string[];
  repoUrl: string;
  liveUrl: string | null;
  source: "github";
  githubRepo: string;
  stars: number;
};

/** The fields we read from GitHub's "list repositories for a user" response. */
type GithubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  fork: boolean;
};

export async function fetchGithubProjects(ghUsername: string): Promise<DraftProject[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(ghUsername)}/repos?sort=pushed&per_page=30`,
    { headers, cache: "no-store" }
  );
  if (!res.ok) throw new Error("github_fetch_failed");
  const repos: GithubRepo[] = await res.json();

  return repos
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name,
      tagline: r.description ?? "",
      tech: r.language ? [r.language] : [],
      repoUrl: r.html_url,
      liveUrl: r.homepage || null,
      source: "github" as const,
      githubRepo: r.full_name,
      stars: r.stargazers_count,
    }))
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 12);
}
