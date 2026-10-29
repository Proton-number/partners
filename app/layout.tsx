import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://partners.constrally.com"),

  title: "Partners - Constrally",
  description: "Constrally - modern construction solutions and services",

  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },

  openGraph: {
    title: "Constrally",
    description: "Constrally - modern construction solutions and services",
    url: "https://partners.constrally.com",
    siteName: "Constrally",
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 600,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Constrally",
    description: "Constrally - modern construction solutions and services",
    images: ["/logo.jpeg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
