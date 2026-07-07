"use client";
import { useEffect, useState } from "react";

export default function ResumePage() {
  const [username, setUsername] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then(async (r) => {
      const p = await r.json();
      setUsername(p.username ?? "");
      setPublished(p.isPublished ?? false);
    });
  }, []);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Resume PDF</h1>
      <p className="mt-1 text-sm text-[#8B98B8]">
        Generated from the same data as your portfolio — always in sync.
      </p>

      {!published ? (
        <p className="mt-6 rounded-lg border border-[#1E2C52] bg-[#111A36] p-4 text-sm text-[#FFB454]">
          Publish your portfolio first (Template & Publish) — the PDF renders your public page.
        </p>
      ) : (
        <div className="mt-6 flex gap-4">
          <a href={`/${username}/resume`} target="_blank"
            className="rounded-lg border border-[#1E2C52] px-5 py-2.5 text-sm font-semibold hover:border-[#4DA6FF]">
            Preview
          </a>
          <a href={`/api/pdf?username=${username}`}
            className="rounded-lg bg-[#4DA6FF] px-5 py-2.5 text-sm font-semibold text-[#04101F]">
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
