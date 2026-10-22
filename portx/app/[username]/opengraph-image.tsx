import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPortfolioData } from "@/lib/data";
import { SITE_NAME, SITE_URL, clip } from "@/lib/site";

/* The card shown when a portfolio link is shared (LinkedIn, X, WhatsApp, Slack…):
   name, headline and top skills in the brand colours. */

export const revalidate = 3600;
export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await getPortfolioData(username.toLowerCase());
  const mark = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/brand/portxz-mark.png"))).toString("base64")}`;

  const profile = result?.data.profile;
  const name = profile?.fullName ?? SITE_NAME;
  const headline = profile?.headline ? clip(profile.headline, 90) : "Portfolio";
  const skills = result ? [...new Set(result.data.skills.flatMap((s) => s.items))].slice(0, 5) : [];
  const host = SITE_URL.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 80% 0%, #1D2B6B 0%, #0A0F1E 55%)",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "#8B98B8" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={mark} width={44} height={44} />
          {SITE_NAME}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: name.length > 22 ? 72 : 92, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{name}</div>
          <div style={{ marginTop: 20, fontSize: 38, color: "#A9B6D6", lineHeight: 1.3 }}>{headline}</div>
          {skills.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}>
              {skills.map((s) => (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    padding: "8px 20px",
                    borderRadius: 999,
                    border: "1px solid #2A3B6E",
                    background: "#111A36",
                    color: "#4DA6FF",
                    fontSize: 26,
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#6B7A99" }}>
          {host}/{username.toLowerCase()}
        </div>
      </div>
    ),
    size
  );
}
