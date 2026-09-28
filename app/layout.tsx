import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Hall dos Recordes | Alpha",
  description: "Quem quebrou recorde no comercial da Alpha.",
};

export const viewport: Viewport = { themeColor: "#0e0b07" };

// Liga o layout de TV em navegador de smart TV, ou com ?tv na URL (?tv=0 desliga).
// Roda antes da pintura para não piscar o layout de computador.
const TV_SCRIPT = `(function () {
  var tv = new URLSearchParams(location.search).get("tv");
  var smartTv = /SmartTV|SMART-TV|Tizen|Web0S|webOS|NetCast|HbbTV|BRAVIA|Android TV|GoogleTV|AFT[A-Z]|CrKey|Roku|VIDAA/i.test(navigator.userAgent);
  if (tv === null ? smartTv : tv !== "0") document.documentElement.classList.add("tv");
})();`;

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
