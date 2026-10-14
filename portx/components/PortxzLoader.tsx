/* ── Portxz branded loader ───────────────────────────────────────────
   The house loading state. Reuses the brand gradient bar (#4DA6FF →
   #39D98A) as an indeterminate sweep under the pulsing Portxz wordmark.
   - fullscreen: centers in a min-h-screen navy backdrop (route loads)
   - inline (default): drops into a section where content will appear   */

import { Logo } from "@/components/Logo";

export function PortxzLoader({
  label = "Loading",
  fullscreen = false,
}: {
  label?: string;
  fullscreen?: boolean;
}) {
  const body = (
    <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
      {/* logo */}
      <Logo size="lg" className="animate-portxz-pulse text-lp-text" />

      {/* indeterminate gradient sweep bar */}
      <div className="relative h-1 w-40 overflow-hidden rounded-full bg-lp-border-strong">
        <div className="animate-portxz-sweep absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-lp-accent to-lp-green" />
      </div>

      {/* label + animated dots */}
      <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-lp-muted">
        {label}
        <span className="flex gap-1">
          <span className="animate-portxz-dot h-1 w-1 rounded-full bg-lp-accent" style={{ animationDelay: "0ms" }} />
          <span className="animate-portxz-dot h-1 w-1 rounded-full bg-lp-accent" style={{ animationDelay: "160ms" }} />
          <span className="animate-portxz-dot h-1 w-1 rounded-full bg-lp-green" style={{ animationDelay: "320ms" }} />
        </span>
      </p>
      <span className="sr-only">{label}…</span>
    </div>
  );

  if (fullscreen) {
    return (
      <main className="grid min-h-screen place-items-center bg-lp-bg px-4">
        {body}
      </main>
    );
  }

  return <div className="grid w-full place-items-center py-16">{body}</div>;
}
