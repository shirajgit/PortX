import { Arimo, Carlito, Gelasio, Tinos } from "next/font/google";
import type { ResumeFont } from "@/lib/resume";

/* Self-hosted at build time, so the PDF uses the same font locally and on Vercel
   (whose Chrome only ships Open Sans). Embedded TTF text stays fully selectable for ATS. */
const arimo = Arimo({ subsets: ["latin"], weight: ["400", "600", "700"], display: "block" });
const carlito = Carlito({ subsets: ["latin"], weight: ["400", "700"], display: "block" });
const tinos = Tinos({ subsets: ["latin"], weight: ["400", "700"], display: "block" });
const gelasio = Gelasio({ subsets: ["latin"], weight: ["400", "600", "700"], display: "block" });

export const RESUME_FONT_FAMILY: Record<ResumeFont, string> = {
  arimo: `${arimo.style.fontFamily}, Arial, Helvetica, sans-serif`,
  carlito: `${carlito.style.fontFamily}, Calibri, Arial, sans-serif`,
  tinos: `${tinos.style.fontFamily}, "Times New Roman", Times, serif`,
  gelasio: `${gelasio.style.fontFamily}, Georgia, serif`,
};
