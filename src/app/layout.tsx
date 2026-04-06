import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Legit — Comprendre les lois belges en 30 secondes",
  description:
    "Legit traduit les textes législatifs belges en résumés visuels et engageants. Votez anonymement sur chaque mesure.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Legit",
  },
  openGraph: {
    title: "Legit — La démocratie en 30 secondes",
    description:
      "Comprenez les lois belges grâce à des résumés visuels. Donnez votre avis anonymement.",
    type: "website",
    locale: "fr_BE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f4f5f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-dvh flex flex-col font-sans safe-top safe-bottom">
        {children}
      </body>
    </html>
  );
}
