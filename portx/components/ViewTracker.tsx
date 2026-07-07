"use client";
import { useEffect } from "react";

export function ViewTracker({ username }: { username: string }) {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        kind: "view",
        ref: document.referrer ? new URL(document.referrer).hostname : undefined,
      }),
    }).catch(() => {});
  }, [username]);
  return null;
}
