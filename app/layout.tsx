import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Fraunces({
  variable: "--font-display",
  weight: ["600", "700"],
  subsets: ["latin"],
});

const bodyFont = Instrument_Sans({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-code",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Audit AI | Accès public au chat correctif",
  description:
    "Audit AI permet d'accéder au chat correctif public et signale que la conversation Audité reste réservée dans la plateforme principale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
