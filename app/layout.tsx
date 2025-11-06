import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Gopher font for English text
const gopher = localFont({
  src: [
    {
      path: "../public/fonts/Gopher-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Gopher-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Gopher-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gopher",
  display: "swap",
});

// Graphik Arabic font for Arabic text
const graphikArabic = localFont({
  src: [
    {
      path: "../public/fonts/GraphikArabic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GraphikArabic-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/GraphikArabic-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-graphik-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "National Art Expressions",
  description: "National Art Expressions - NAE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gopher.variable} ${graphikArabic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
