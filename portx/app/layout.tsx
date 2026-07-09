import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portxz — Your developer identity, one link",
    template: "%s | Portxz",
  },
  description:
    "One profile → live portfolio + ATS resume PDF, always in sync. Built for developers who ship.",
  keywords: [
    "developer portfolio",
    "ATS resume builder",
    "developer identity",
    "github readme sync",
    "portfolio website",
  ],
  authors: [{ name: "Portxz" }],
  creator: "Portxz",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portxz.in", // Replace with your actual domain
    title: "Portxz — Your developer identity, one link",
    description: "One profile → live portfolio + ATS resume PDF, always in sync.",
    siteName: "Portxz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portxz — Your developer identity, one link",
    description: "One profile → live portfolio + ATS resume PDF, always in sync.",
    creator: "@portxz", // Replace with your Twitter handle if you have one
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
          {/* Fallback theme initialization script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `try{if(localStorage.getItem('portx-theme')==='light')document.documentElement.classList.add('light')}catch(e){}`,
            }}
          />
        </head>
        <body className="antialiased min-h-screen bg-background text-foreground selection:bg-blue-500/30">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}