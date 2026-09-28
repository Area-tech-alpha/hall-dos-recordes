import type { Metadata, Viewport } from "next";
import { outfit } from "@/lib/font";
import "../globals.css";

export const metadata: Metadata = {
  title: "Hall dos Recordes | Alpha",
  description: "Quem quebrou recorde no comercial da Alpha.",
};

export const viewport: Viewport = { themeColor: "#0e0b07" };

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
