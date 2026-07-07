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

export async function fetchGithubProjects(ghUsername: string): Promise<DraftProject[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(ghUsername)}/repos?sort=pushed&per_page=30`,
    { headers, cache: "no-store" }
  );
  if (!res.ok) throw new Error("github_fetch_failed");
  const repos: any[] = await res.json();

  return repos
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name as string,
      tagline: (r.description as string) ?? "",
      tech: [r.language].filter(Boolean) as string[],
      repoUrl: r.html_url as string,
      liveUrl: (r.homepage as string) || null,
      source: "github" as const,
      githubRepo: r.full_name as string,
      stars: r.stargazers_count as number,
    }))
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 12);
}
