import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Portfolio, Resume & README in sync`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0A0F1E",
    theme_color: "#0A0F1E",
    icons: [
      { src: "/brand/portxz-mark.png", sizes: "128x128", type: "image/png" },
      { src: "/brand/portxz-apple.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
