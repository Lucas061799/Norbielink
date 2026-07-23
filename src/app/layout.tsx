import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Norbielink",
  description: "Norbielink Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full`}>
      <head>
        {/* Material Symbols Outlined — used for the razz-gradient `agriculture`
            icon in the Farm & Agriculture Equipment card inside the Inland
            Marine modal. Subset `icon_names=agriculture` keeps the payload
            tiny (single glyph, not the full 3000+ icon set). */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=agriculture" />
      </head>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
