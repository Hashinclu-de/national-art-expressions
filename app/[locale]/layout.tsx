import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/request";
import "../globals.css";

// Gopher font for English text
const gopher = localFont({
  src: [
    {
      path: "../../public/fonts/Gopher-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gopher-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gopher-Bold.woff2",
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
      path: "../../public/fonts/GraphikArabic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GraphikArabic-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GraphikArabic-Bold.woff2",
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  // Determine text direction based on locale
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${gopher.variable} ${graphikArabic.variable} antialiased bg-white`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
