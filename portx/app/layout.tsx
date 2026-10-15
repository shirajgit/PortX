import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

/* Brand fonts — exposed as CSS variables; .lp (landing + dashboard) opts in. */
const sans = Geist({ subsets: ["latin"], variable: "--font-lp-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-lp-mono" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-lp-serif" });

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
    "tailor resume to job description",
    "AI resume tailoring",
    "resume job match score",
    "resume keyword matcher",
    "ATS resume checker",
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
      "One profile → live portfolio + ATS resume you can tailor to any job + GitHub README, always in sync. Free to start.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "Portxz — one profile, always in sync" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "One profile → portfolio + ATS resume tailored to any job + GitHub README, always in sync. Free to start.",
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
      <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `try{if(localStorage.getItem('Portxz-theme')!=='dark')document.documentElement.classList.add('light')}catch(e){}`,
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
