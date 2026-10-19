import type { Metadata, Viewport } from "next";
import { env } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: `${env.brandName} — Undangan Pernikahan Digital`, template: `%s · ${env.brandName}` },
  description: "Undangan pernikahan digital dengan puluhan tema, RSVP, amplop digital, dan link personal untuk setiap tamu.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Young+Serif&display=swap"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
