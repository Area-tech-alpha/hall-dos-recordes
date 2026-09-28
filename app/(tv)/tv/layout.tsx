import type { Metadata, Viewport } from "next";
import { outfit } from "@/lib/font";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Hall dos Recordes | TV",
  robots: { index: false },
};

export const viewport: Viewport = { themeColor: "#0e0b07" };

/** Layout raiz próprio da TV: a classe "tv" no <html> liga o quadro 16:9. */
export default function TvLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} tv`}>
      <body>{children}</body>
    </html>
  );
}
