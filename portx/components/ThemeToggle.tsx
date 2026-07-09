"use client";
import { useEffect, useState } from "react";

/** Dark/light toggle. Persists to localStorage; the no-flash script in
    the root layout applies the class before first paint. */
export function ThemeToggle() {
  const [light, setLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
    setMounted(true);
  }, []);

  function toggle() {
    const isLight = document.documentElement.classList.toggle("light");
    try { localStorage.setItem("portx-theme", isLight ? "light" : "dark"); } catch {}
    setLight(isLight);
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme" title="Toggle theme"
      className="rounded-lg border border-[#1E2C52] p-2 text-[#8B98B8] transition hover:border-[#4DA6FF] hover:text-[#4DA6FF]">
      {/* render both, swap via mounted state to avoid hydration mismatch */}
      {mounted && light ? (
        // moon (click = go dark)
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
          <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        // sun (click = go light)
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
