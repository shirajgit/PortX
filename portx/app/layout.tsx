import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "portX — your developer identity, one link",
  description:
    "One profile → live portfolio + ATS resume PDF, always in sync. Built for developers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <script
            dangerouslySetInnerHTML={{
              __html: `try{if(localStorage.getItem('portx-theme')==='light')document.documentElement.classList.add('light')}catch(e){}`,
            }}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
