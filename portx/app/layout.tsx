import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://Portxz.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Portxz — Developer Portfolio Builder with ATS Resume & GitHub README",
    template: "%s | Portxz",
  },
  description:
    "Free developer portfolio builder. One profile generates your live portfolio website, ATS-friendly resume PDF, and GitHub README — always in sync. 3 templates including an interactive CLI terminal. Built for developers who ship.",
  keywords: [
    "portfolio builder",
    "developer portfolio builder",
    "free portfolio website for developers",
    "ATS resume builder",
    "ATS friendly resume for developers",
    "GitHub profile README generator",
    "developer portfolio templates",
    "portfolio and resume in sync",
    "CLI terminal portfolio",
    "portfolio builder India",
  ],
  authors: [{ name: "Portxz" }],
  creator: "Portxz",
  publisher: "Portxz",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Portxz — Developer Portfolio Builder with ATS Resume & GitHub README",
    description:
      "One profile → live portfolio + ATS resume PDF + GitHub README, always in sync. Free to start.",
    siteName: "Portxz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portxz — Developer Portfolio Builder",
    description:
      "One profile → portfolio + ATS resume + GitHub README, always in sync. Free to start.",
    creator: "@portxz",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.ico", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/favicon.ico", sizes: "180x180" }],
  },
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Portxz",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Web",
                description:
                  "Developer portfolio builder that generates a live portfolio, ATS resume PDF, and GitHub README from one profile.",
                url: SITE_URL,
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "INR",
                },
              }),
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