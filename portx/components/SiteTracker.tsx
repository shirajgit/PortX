"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

let first = true;

/** Counts a visit to each page of the site. The referrer is only meaningful on the first page load. */
export function SiteTracker() {
  const pathname = usePathname();
  useEffect(() => {
    let ref: string | undefined;
    if (first && document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host !== location.hostname) ref = host;
    }
    first = false;
    fetch("/api/track/site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, ref }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
  return null;
}
