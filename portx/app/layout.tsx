import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

const TITLE = "Portxz — Portfolio, ATS Resume & GitHub README in Sync";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: TITLE,
    template: "%s | Portxz",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "portfolio builder",
    "developer portfolio builder",
    "free portfolio website",
    "portfolio website for developers",
    "ATS resume builder",
    "ATS friendly resume",
    "GitHub profile README generator",
    "portfolio templates",
    "portfolio and resume in sync",
    "CLI terminal portfolio",
    "portfolio builder India",
    "Portxz",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  // No site-wide canonical here: each page sets its own, so a portfolio is
  // never treated as a copy of the home page.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description:
      "One profile → live portfolio + ATS resume PDF + GitHub README, always in sync. Free to start.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Portxz — one profile, always in sync" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "One profile → portfolio + ATS resume + GitHub README, always in sync. Free to start.",
    creator: "@portxz",
    images: ["/brand/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/brand/portxz-mark.png", type: "image/png", sizes: "128x128" },
    ],
    apple: [{ url: "/brand/portxz-apple.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0F1E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `try{if(localStorage.getItem('Portxz-theme')==='light')document.documentElement.classList.add('light')}catch(e){}`,
            }}
          />
        </head>
        <body className="antialiased min-h-screen  bg-background text-foreground selection:bg-blue-500/30">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
