import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Hall dos Recordes | Alpha",
  description: "Quem quebrou recorde no comercial da Alpha.",
};

export const viewport: Viewport = { themeColor: "#0e0b07" };

// ?tv na URL força o modo TV. Roda antes da pintura para não piscar o layout de notebook.
const TV_SCRIPT = `if (new URLSearchParams(location.search).has("tv")) document.documentElement.classList.add("tv");`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: a classe "tv" é adicionada pelo script antes da hidratação
    <html lang="pt-BR" className={outfit.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: TV_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
