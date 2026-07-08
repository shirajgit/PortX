"use client";
import { useEffect, useState } from "react";

/** Client hook: current plan status, shared by dashboard pages. */
export function usePlan() {
  const [loading, setLoading] = useState(true);
  const [pro, setPro] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      if (r.ok) {
        const p = await r.json();
        const active = p.plan === "pro" && p.planExpiresAt && new Date(p.planExpiresAt) > new Date();
        setPro(!!active);
        setExpiresAt(p.planExpiresAt ?? null);
      }
      setLoading(false);
    });
  }, []);

  return { loading, pro, expiresAt };
}

export const FREE_UI_LIMITS = {
  projects: 5,
  experiences: 5,
  educations: 5,
  links: 5,
  skillItems: 10,
} as const;
